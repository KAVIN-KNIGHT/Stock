import os
import math
import numpy as np
import pandas as pd
import yfinance as yf
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any

from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import (
    mean_squared_error,
    mean_absolute_error,
    mean_absolute_percentage_error,
    r2_score
)

app = FastAPI(
    title="Money Mentor API",
    description="AI-Powered Stock Prediction & Technical Analysis Backend",
    version="2.0.0"
)

# Enable CORS for Vite frontend (localhost:5173 / localhost:3000 / all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def safe_float(val: Any, default: float = 0.0) -> float:
    """Helper to convert scalar float values safely, handling NaN/Inf for JSON compliance."""
    if val is None:
        return default
    if hasattr(val, "item"):
        try:
            val = val.item()
        except Exception:
            pass
    try:
        if pd.isna(val) or math.isnan(val) or math.isinf(val):
            return default
        return float(val)
    except Exception:
        return default


def train_model(ticker: str):
    """Train an LSTM neural network model on 5 years of historical stock data."""
    ticker = ticker.upper()
    data = yf.download(ticker, period="5y", auto_adjust=True)

    if isinstance(data.columns, pd.MultiIndex):
        data.columns = data.columns.get_level_values(0)

    if data.empty or "Close" not in data.columns:
        raise HTTPException(status_code=400, detail=f"No stock data found for symbol '{ticker}'")

    close_prices = data["Close"].values.reshape(-1, 1)

    if len(close_prices) < 100:
        raise HTTPException(status_code=400, detail=f"Insufficient price history for symbol '{ticker}'")

    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(close_prices)

    X, y = [], []
    for i in range(60, len(scaled_data)):
        X.append(scaled_data[i - 60:i])
        y.append(scaled_data[i])

    X = np.array(X)
    y = np.array(y)

    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(60, 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(50, return_sequences=False))
    model.add(Dropout(0.2))
    model.add(Dense(1))

    model.compile(optimizer="adam", loss="mean_squared_error")
    model.fit(X, y, epochs=10, batch_size=32, verbose=0)

    os.makedirs("models", exist_ok=True)
    model.save(f"models/{ticker}_model.h5")

    return model, scaler, data


@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Money Mentor Stock Prediction API",
        "version": "2.0.0"
    }


@app.get("/api/analyze")
def analyze_stock(ticker: str = Query(..., description="Stock Ticker Symbol, e.g. AAPL, TSLA, NVDA")):
    ticker = ticker.strip().upper()
    if not ticker:
        raise HTTPException(status_code=400, detail="Stock ticker symbol cannot be empty.")

    try:
        data = yf.download(ticker, period="5y", auto_adjust=True)

        if data.empty or "Close" not in data.columns or len(data) < 65:
            raise HTTPException(status_code=400, detail=f"Invalid or insufficient data found for symbol '{ticker}'.")

        # Flatten MultiIndex columns if present (yfinance 0.2.x MultiIndex fix)
        if isinstance(data.columns, pd.MultiIndex):
            data.columns = data.columns.get_level_values(0)

        stock = yf.Ticker(ticker)

        close_series = data["Close"]
        close_prices = close_series.values.reshape(-1, 1)

        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(close_prices)

        # Load or Train Model
        model_path = f"models/{ticker}_model.h5"
        if os.path.exists(model_path):
            try:
                model = load_model(model_path)
            except Exception:
                model, _, _ = train_model(ticker)
        else:
            model, _, _ = train_model(ticker)

        # Historical evaluation sequence
        X, y_actual = [], []
        dates = []

        for i in range(60, len(scaled_data)):
            X.append(scaled_data[i - 60:i])
            y_actual.append(scaled_data[i])
            dates.append(data.index[i].strftime("%Y-%m-%d"))

        X = np.array(X)
        y_actual = np.array(y_actual)

        predictions = model.predict(X, verbose=0)
        predictions = scaler.inverse_transform(predictions)
        actual = scaler.inverse_transform(y_actual)

        # Next Day Prediction
        last_60 = close_prices[-60:]
        last_60_scaled = scaler.transform(last_60)
        X_future = np.array([last_60_scaled])
        next_price_scaled = model.predict(X_future, verbose=0)
        next_price = safe_float(scaler.inverse_transform(next_price_scaled)[0][0])

        # Metrics calculation
        actual_flat = actual.flatten()
        pred_flat = predictions.flatten()

        rmse = safe_float(np.sqrt(mean_squared_error(actual_flat, pred_flat)))
        mae = safe_float(mean_absolute_error(actual_flat, pred_flat))
        mape = safe_float(mean_absolute_percentage_error(actual_flat, pred_flat) * 100)
        r2 = safe_float(r2_score(actual_flat, pred_flat))

        lower_range = safe_float(next_price - rmse)
        upper_range = safe_float(next_price + rmse)

        # Technical Indicators: SMA50 and SMA200
        data_df = data.copy()
        data_df["SMA50"] = close_series.rolling(50).mean()
        data_df["SMA200"] = close_series.rolling(200).mean()

        last_close = safe_float(close_series.iloc[-1])
        last_sma50 = safe_float(data_df["SMA50"].iloc[-1])
        last_sma200 = safe_float(data_df["SMA200"].iloc[-1])

        signal = "BUY" if last_sma50 > last_sma200 else "SELL"

        # Format Historical & Indicator Chart Data (last 250 trading days)
        chart_data = []
        subset_df = data_df.tail(250)
        for idx, row in subset_df.iterrows():
            date_str = idx.strftime("%Y-%m-%d")
            c_val = safe_float(row["Close"])
            s50_raw = row["SMA50"]
            s200_raw = row["SMA200"]

            s50_val = safe_float(s50_raw) if not pd.isna(s50_raw) else None
            s200_val = safe_float(s200_raw) if not pd.isna(s200_raw) else None

            chart_data.append({
                "date": date_str,
                "close": round(c_val, 2),
                "sma50": round(s50_val, 2) if s50_val is not None else None,
                "sma200": round(s200_val, 2) if s200_val is not None else None,
            })

        # Format Actual vs Predicted (Last 100 points)
        actual_vs_predicted_data = []
        sub_dates = dates[-100:]
        sub_actual = actual_flat[-100:]
        sub_pred = pred_flat[-100:]

        for d_str, act, prd in zip(sub_dates, sub_actual, sub_pred):
            actual_vs_predicted_data.append({
                "date": d_str,
                "actual": round(safe_float(act), 2),
                "predicted": round(safe_float(prd), 2)
            })

        # Fetch Ticker News safely
        news_items = []
        try:
            raw_news = stock.news
            if raw_news:
                for item in raw_news[:6]:
                    title = item.get("title") or (item.get("content", {}).get("title") if isinstance(item.get("content"), dict) else None)
                    publisher = item.get("publisher") or (item.get("content", {}).get("provider", {}).get("displayName") if isinstance(item.get("content"), dict) else None) or "Financial News"
                    link = item.get("link") or (item.get("content", {}).get("canonicalUrl", {}).get("url") if isinstance(item.get("content"), dict) else None) or "#"
                    pub_time = item.get("providerPublishTime") or (item.get("content", {}).get("pubDate") if isinstance(item.get("content"), dict) else None)

                    if title:
                        news_items.append({
                            "title": title,
                            "publisher": publisher,
                            "link": link,
                            "pubTime": pub_time
                        })
        except Exception:
            news_items = []

        # Info summary
        try:
            info = stock.info
            company_name = info.get("shortName") or info.get("longName") or ticker
            currency = info.get("currency") or "USD"
        except Exception:
            company_name = ticker
            currency = "USD"

        return {
            "ticker": ticker,
            "company_name": company_name,
            "currency": currency,
            "current_price": round(last_close, 2),
            "metrics": {
                "next_price": round(next_price, 2),
                "lower": round(lower_range, 2),
                "upper": round(upper_range, 2),
                "rmse": round(rmse, 2),
                "mae": round(mae, 2),
                "mape": round(mape, 2),
                "r2": round(r2, 4)
            },
            "signal": signal,
            "sma": {
                "sma50": round(last_sma50, 2),
                "sma200": round(last_sma200, 2)
            },
            "historical": chart_data,
            "actual_vs_predicted": actual_vs_predicted_data,
            "news": news_items
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing ticker '{ticker}': {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)