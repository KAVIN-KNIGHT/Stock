# 📈  AI Stock Prediction Dashboard


---

## ✨ Features

- **🌓 Dark & Light Mode Toggle**: Seamlessly switch between dark and light themes with automatic system preference detection and state persistence.
- **🤖 LSTM Price Forecasting**: Predicts next-day stock prices and calculates dynamic confidence intervals (Lower / Upper bounds) using 5-year historical market data.
- **📊 Technical Signal Generator**: Evaluates 50-day and 200-day Simple Moving Average (SMA) crossovers to issue real-time **BUY** (Golden Cross) or **SELL** (Death Cross) signals.
- **📈 Interactive Recharts**:
  - **Price & Moving Averages Chart**: Historical Close price with 50-day and 200-day SMA trendlines.
  - **Neural Network Validation Chart**: Historical Actual Close vs LSTM Model Predicted Close overlay.
- **⚡ Comprehensive Model Metrics**: Evaluates predictions with RMSE, MAE, MAPE %, and R² Score.
- **📰 Live Financial News**: Fetches real-time news headlines, publisher details, and direct links for searched stock symbols.
- **⚡ High-Performance REST API**: Decoupled architecture with FastAPI backend and automatic CORS handling.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Glassmorphism UI tokens
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) with Uvicorn ASGI server
- **Machine Learning**: TensorFlow / Keras (Sequential LSTM), Scikit-Learn (MinMaxScaler, metrics)
- **Data & Finance API**: Yahoo Finance (`yfinance`), Pandas, NumPy

---

## 📁 Project Structure

```
Stock/
├── app.py                   # FastAPI REST backend server
├── requirements.txt         # Python backend dependencies
├── models/                  # Saved trained LSTM models (.h5)
├── README.md                # Project documentation
└── frontend/                # Vite + React web application
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Header, ticker search, presets, theme toggle
    │   │   ├── MetricCards.jsx     # Prediction, range, signals & performance metrics
    │   │   ├── StockCharts.jsx     # Interactive Recharts (SMAs & Validation)
    │   │   ├── NewsFeed.jsx        # Market news articles
    │   │   └── LoadingSkeleton.jsx # Glassmorphism loading animation
    │   ├── context/
    │   │   └── ThemeContext.jsx    # Dark / Light theme provider
    │   ├── App.jsx                 # Main application dashboard
    │   ├── main.jsx                # React root entry point
    │   └── index.css               # Design system & CSS variables
    ├── package.json
    └── vite.config.js              # Vite configuration & API proxy
```

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.9+ installed
- **Node.js**: v18+ and `npm` installed

---

### 1. Backend Setup (FastAPI)

1. Open a terminal in the root project directory (`Stock`):
   ```bash
   pip install -r requirements.txt
   ```

2. Start the FastAPI backend server:
   ```bash
   python app.py
   # OR using uvicorn directly:
   uvicorn app:app --reload --port 8000
   ```

3. Verify the backend API is running at:
   - Health check: `http://localhost:8000/api/health`
   - Interactive Swagger API docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup (Vite + React)

1. Open a second terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

---

## 📡 API Reference

### `GET /api/health`
Returns backend service status.

**Response**:
```json
{
  "status": "online",
  "service": "Money Mentor Stock Prediction API",
  "version": "2.0.0"
}
```

### `GET /api/analyze?ticker={SYMBOL}`
Analyzes historical data, trains or loads the LSTM model, calculates indicators, metrics, predictions, and news.

**Example Request**:
`GET /api/analyze?ticker=AAPL`

**Response Structure**:
```json
{
  "ticker": "AAPL",
  "company_name": "Apple Inc.",
  "currency": "USD",
  "current_price": 220.50,
  "metrics": {
    "next_price": 224.30,
    "lower": 218.10,
    "upper": 230.50,
    "rmse": 6.20,
    "mae": 4.80,
    "mape": 2.15,
    "r2": 0.9854
  },
  "signal": "BUY",
  "sma": {
    "sma50": 215.40,
    "sma200": 195.20
  },
  "historical": [...],
  "actual_vs_predicted": [...],
  "news": [...]
}
```

---

## 📄 License
MIT License
