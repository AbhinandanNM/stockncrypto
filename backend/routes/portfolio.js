import express from 'express';
import Portfolio from '../models/Portfolio.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all portfolio holdings
router.get('/', authenticate, async (req, res) => {
    try {
        const holdings = await Portfolio.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(holdings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch portfolio', error: error.message });
    }
});

// Add holding
router.post('/', authenticate, async (req, res) => {
    try {
        const { symbol, name, type, quantity, purchasePrice } = req.body;

        // Check if holding already exists
        const existing = await Portfolio.findOne({ user: req.user._id, symbol, type });

        if (existing) {
            // Update existing holding (average price)
            const totalQuantity = existing.quantity + quantity;
            const totalCost = (existing.quantity * existing.purchasePrice) + (quantity * purchasePrice);
            existing.quantity = totalQuantity;
            existing.purchasePrice = totalCost / totalQuantity;
            await existing.save();

            return res.json({ message: 'Holding updated', holding: existing });
        }

        // Create new holding
        const holding = new Portfolio({
            user: req.user._id,
            symbol,
            name,
            type,
            quantity,
            purchasePrice
        });

        await holding.save();
        res.status(201).json({ message: 'Holding added', holding });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add holding', error: error.message });
    }
});

// Update holding
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { quantity, purchasePrice } = req.body;

        const holding = await Portfolio.findOne({ _id: req.params.id, user: req.user._id });

        if (!holding) {
            return res.status(404).json({ message: 'Holding not found' });
        }

        if (quantity !== undefined) holding.quantity = quantity;
        if (purchasePrice !== undefined) holding.purchasePrice = purchasePrice;

        await holding.save();
        res.json({ message: 'Holding updated', holding });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update holding', error: error.message });
    }
});

// Delete holding
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const holding = await Portfolio.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!holding) {
            return res.status(404).json({ message: 'Holding not found' });
        }

        res.json({ message: 'Holding removed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove holding', error: error.message });
    }
});

export default router;
