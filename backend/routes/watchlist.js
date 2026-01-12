import express from 'express';
import Watchlist from '../models/Watchlist.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's watchlist
router.get('/', authenticate, async (req, res) => {
    try {
        const watchlist = await Watchlist.find({ user: req.user._id }).sort({ addedAt: -1 });
        res.json(watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message });
    }
});

// Add to watchlist
router.post('/', authenticate, async (req, res) => {
    try {
        const { symbol, name, type } = req.body;

        // Check if already in watchlist
        const existing = await Watchlist.findOne({ user: req.user._id, symbol });
        if (existing) {
            return res.status(400).json({ message: 'Already in watchlist' });
        }

        const item = new Watchlist({
            user: req.user._id,
            symbol,
            name,
            type
        });

        await item.save();
        res.status(201).json({ message: 'Added to watchlist', item });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add to watchlist', error: error.message });
    }
});

// Remove from watchlist
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const item = await Watchlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!item) {
            return res.status(404).json({ message: 'Item not found in watchlist' });
        }

        res.json({ message: 'Removed from watchlist' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove from watchlist', error: error.message });
    }
});

export default router;
