import express from 'express';

const router = express.Router();

// Mock financial news data
const mockNews = [
    {
        id: 1,
        title: 'Bitcoin Reaches New All-Time High',
        description: 'Bitcoin surpasses $100,000 mark as institutional adoption continues to grow.',
        source: 'Crypto News',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        url: '#',
        category: 'crypto'
    },
    {
        id: 2,
        title: 'Tech Stocks Rally on Strong Earnings',
        description: 'Major tech companies report better-than-expected quarterly earnings, driving market gains.',
        source: 'Market Watch',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        url: '#',
        category: 'stocks'
    },
    {
        id: 3,
        title: 'Federal Reserve Maintains Interest Rates',
        description: 'Fed keeps rates steady as inflation shows signs of cooling.',
        source: 'Financial Times',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        url: '#',
        category: 'economy'
    },
    {
        id: 4,
        title: 'Ethereum 2.0 Upgrade Shows Promising Results',
        description: 'Network efficiency improves significantly following latest protocol update.',
        source: 'Blockchain Today',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        url: '#',
        category: 'crypto'
    },
    {
        id: 5,
        title: 'Electric Vehicle Stocks Surge on New Policy',
        description: 'Government incentives boost EV manufacturer stock prices.',
        source: 'Auto Finance',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        url: '#',
        category: 'stocks'
    },
    {
        id: 6,
        title: 'Gold Prices Stabilize Amid Market Uncertainty',
        description: 'Precious metals maintain value as investors seek safe havens.',
        source: 'Commodity Report',
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        url: '#',
        category: 'commodities'
    }
];

// Get market news
router.get('/', async (req, res) => {
    try {
        const { category, limit = 10 } = req.query;

        let news = mockNews;

        if (category) {
            news = news.filter(item => item.category === category);
        }

        news = news.slice(0, parseInt(limit));

        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch news', error: error.message });
    }
});

export default router;
