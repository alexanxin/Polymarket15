# Polymarket High-Frequency Trading Bot

A sophisticated Next.js-based trading bot for Polymarket's prediction markets, specializing in 15-minute timeframe crypto price prediction markets.

## 🚀 Features

### Core Functionality
- **Real-time Market Data**: Fetches live market data from Polymarket's API
- **15M Timeframe Trading**: Specialized for 15-minute prediction markets
- **Multi-Crypto Support**: BTC, ETH, SOL, and XRP markets
- **High-Frequency Trading**: Automated arbitrage scanning every 200ms when enabled

### User Interface
- **Dark Theme**: Modern, responsive design optimized for trading
- **Live Price Updates**: Real-time market data refresh every 5 seconds
- **Price Change Indicators**: Green/red flashing effects when prices change
- **Manual Execution Control**: Start/Stop button for bot execution
- **Toast Notifications**: Real-time feedback for all operations

### Trading Features
- **Arbitrage Detection**: Identifies profitable spreads < 1.00
- **Demo Mode**: Safe testing environment with simulated trades
- **Position Tracking**: Real-time PnL and trade history
- **Risk Management**: Configurable trade sizes and limits

### Technical Features
- **API Throttling**: Smart rate limiting (10s for slugs, 5s for market data)
- **Error Handling**: Comprehensive error recovery and logging
- **Performance Optimized**: Efficient data fetching and rendering
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast
- **API**: Polymarket Gamma API
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/polymarket-trading-bot.git
cd polymarket-trading-bot/app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to `http://localhost:3000`

## 🎯 How to Use

### Initial Setup
1. **Page Load**: Application automatically fetches 15M market slugs for all supported cryptos
2. **Market Selection**: Click on BTC, ETH, SOL, or XRP tabs to load specific market data
3. **Data Refresh**: Markets update automatically every 5 seconds with live prices

### Trading Operations
1. **Select Market**: Click "Select" button on any market row
2. **Start Execution**: Click "Start Mock Execution" to begin automated trading
3. **Monitor Performance**: Watch real-time PnL, trade count, and execution logs
4. **Stop Execution**: Click "Stop Mock Execution" to halt all trading activity

### Key Controls
- **Crypto Tabs**: Switch between different cryptocurrencies (BTC/ETH/SOL/XRP)
- **Start/Stop Button**: Located next to "Execution Log" header
- **Select Buttons**: Choose which market to trade on
- **Demo Mode**: Toggle in code for safe testing vs live trading

## 📊 Market Data

### Data Sources
- **Primary API**: `https://gamma-api.polymarket.com`
- **Market Types**: 15-minute prediction markets
- **Price Data**: Real `bestBid`/`bestAsk` from Polymarket order book
- **Update Frequency**: Every 5 seconds for selected crypto

### Supported Markets
- Bitcoin Up/Down (15M timeframe)
- Ethereum Up/Down (15M timeframe)
- Solana Up/Down (15M timeframe)
- XRP Up/Down (15M timeframe)

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Add any API keys or configuration here
```

### Trading Parameters
Modify these in `page.tsx`:
```typescript
const DEMO_MODE = true;        // Set to false for live trading
const STARTING_BALANCE = 1000.00;  // Starting capital
const TRADE_SIZE = 100.00;         // Size per trade
```

## 📈 Trading Strategy

### Arbitrage Detection
The bot identifies arbitrage opportunities where:
- `priceYes + priceNo < 1.00`
- Calculates potential profit: `(TRADE_SIZE / totalCost) * (1.00 - totalCost)`

### Execution Logic
- **Scan Frequency**: Every 200ms when bot is running
- **Entry Conditions**: Spread < 0.99 (configurable)
- **Position Sizing**: Fixed trade size
- **Risk Management**: No position limits (demo mode)

## 🎨 UI Features

### Visual Indicators
- **⟳ Refresh Icon**: Shows when market data is updating
- **🟢 Green Flash**: Price increases
- **🔴 Red Flash**: Price decreases
- **💰 Balance Display**: Real-time account balance
- **📊 Performance Metrics**: Trade count, PnL, ROI

### Responsive Design
- **Mobile Friendly**: Works on all screen sizes
- **Dark Theme**: Optimized for extended use
- **Clean Layout**: Focused on essential trading information

## 🔍 API Endpoints

### `/api/markets`
- `GET /api/markets?getSlugs=true` - Fetch all 15M market slugs
- `GET /api/markets?slug={slug}` - Fetch specific market data
- `GET /api/markets?tag=15M` - Fetch all 15M markets

### Rate Limiting
- **Slug Requests**: 10-second cooldown per crypto
- **Market Data**: 5-second auto-refresh
- **User Actions**: Immediate response to tab clicks

## 🐛 Error Handling

### Network Errors
- Automatic retry logic
- User-friendly error messages via toast notifications
- Graceful degradation when API is unavailable

### Data Validation
- TypeScript type checking
- API response validation
- Fallback to demo prices when real data unavailable

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and research purposes. Please ensure compliance with Polymarket's terms of service and applicable regulations.

## ⚠️ Disclaimer

This is a demonstration trading bot for educational purposes. It operates in DEMO mode by default. Use at your own risk. The authors are not responsible for any financial losses incurred through the use of this software.

## 🆘 Support

For issues or questions:
1. Check the execution logs for error details
2. Verify API connectivity
3. Ensure proper configuration
4. Check browser console for debugging information

## 📊 Performance

### Typical Usage
- **Memory**: ~50-100MB
- **CPU**: Minimal when idle, spikes during data fetching
- **Network**: ~10-20 requests per minute when active
- **Storage**: Local state only, no persistent storage required

### Optimization Features
- Debounced API calls
- Efficient React re-rendering
- Minimal bundle size
- Lazy loading where applicable
