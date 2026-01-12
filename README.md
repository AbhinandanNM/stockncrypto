# Stock & Crypto Trading Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing stock and cryptocurrency portfolios with real-time market data.

## Features

1. **Portfolio Management** - Track your stock and crypto holdings with real-time values
2. **Cryptocurrency Dashboard** - View top cryptocurrencies with live prices from CoinGecko API
3. **Stock Watchlist** - Monitor stocks and cryptocurrencies you're interested in
4. **Market News Feed** - Stay updated with latest financial news and market trends
5. **Trading History** - Record buy/sell transactions with profit/loss tracking

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **APIs**: CoinGecko API for cryptocurrency data

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Simple Application"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/stock-crypto-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas**: Replace `MONGODB_URI` with your Atlas connection string.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB (if using local installation)

```bash
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in with your credentials at `/login`
3. **Dashboard**: View your portfolio overview and statistics
4. **Portfolio**: Add, edit, and remove your stock/crypto holdings
5. **Crypto**: Browse top cryptocurrencies with live market data
6. **Watchlist**: Add stocks/crypto to monitor
7. **Transactions**: Record your buy/sell trades
8. **News**: Read latest financial news and market updates

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Portfolio
- `GET /api/portfolio` - Get all holdings
- `POST /api/portfolio` - Add new holding
- `PUT /api/portfolio/:id` - Update holding
- `DELETE /api/portfolio/:id` - Delete holding

### Cryptocurrency
- `GET /api/crypto/top` - Get top cryptocurrencies
- `GET /api/crypto/:symbol` - Get specific crypto data

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:id` - Remove from watchlist

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Record new transaction
- `GET /api/transactions/stats` - Get profit/loss statistics
- `DELETE /api/transactions/:id` - Delete transaction

### News
- `GET /api/news` - Get market news (with optional category filter)

## Project Structure

```
Simple Application/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Auth context
│   │   ├── App.jsx      # Main app component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Features in Detail

### Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users

### Portfolio Management
- Add stocks and cryptocurrencies to your portfolio
- Track quantity and purchase price
- Automatic calculation of total portfolio value
- Update or remove holdings

### Live Cryptocurrency Data
- Real-time prices from CoinGecko API
- Market cap and 24h price changes
- Top 20 cryptocurrencies by market cap

### Transaction Tracking
- Record buy and sell transactions
- Calculate profit/loss automatically
- View complete trading history

## License

MIT

## Author

Created with ❤️ using MERN stack
