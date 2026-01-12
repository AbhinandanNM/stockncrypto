import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get top cryptocurrencies
router.get('/top', async (req, res) => {
    try {
        const limit = req.query.limit || 20;

        // Fetch from CoinGecko API
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: limit,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            }
        });

        const cryptos = response.data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.image,
            currentPrice: coin.current_price,
            marketCap: coin.market_cap,
            marketCapRank: coin.market_cap_rank,
            priceChange24h: coin.price_change_percentage_24h,
            high24h: coin.high_24h,
            low24h: coin.low_24h,
            totalVolume: coin.total_volume
        }));

        res.json(cryptos);
    } catch (error) {
        console.error('CoinGecko API error:', error.message);
        res.status(500).json({ message: 'Failed to fetch crypto data', error: error.message });
    }
});

// Get specific crypto by symbol
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;

        // Search for coin by symbol
        const searchResponse = await axios.get('https://api.coingecko.com/api/v3/search', {
            params: { query: symbol }
        });

        if (!searchResponse.data.coins || searchResponse.data.coins.length === 0) {
            return res.status(404).json({ message: 'Cryptocurrency not found' });
        }

        const coinId = searchResponse.data.coins[0].id;

        // Get detailed data
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
            params: {
                localization: false,
                tickers: false,
                community_data: false,
                developer_data: false
            }
        });

        const coin = response.data;

        res.json({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.image?.large,
            currentPrice: coin.market_data?.current_price?.usd,
            marketCap: coin.market_data?.market_cap?.usd,
            priceChange24h: coin.market_data?.price_change_percentage_24h,
            high24h: coin.market_data?.high_24h?.usd,
            low24h: coin.market_data?.low_24h?.usd,
            totalVolume: coin.market_data?.total_volume?.usd
        });
    } catch (error) {
        console.error('CoinGecko API error:', error.message);
        res.status(500).json({ message: 'Failed to fetch crypto data', error: error.message });
    }
});

export default router;
