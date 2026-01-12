import express from 'express';
import Transaction from '../models/Transaction.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all transactions
router.get('/', authenticate, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ transactionDate: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
});

// Add transaction
router.post('/', authenticate, async (req, res) => {
    try {
        const { symbol, name, type, action, quantity, price, notes } = req.body;

        const total = quantity * price;

        const transaction = new Transaction({
            user: req.user._id,
            symbol,
            name,
            type,
            action,
            quantity,
            price,
            total,
            notes
        });

        await transaction.save();
        res.status(201).json({ message: 'Transaction recorded', transaction });
    } catch (error) {
        res.status(500).json({ message: 'Failed to record transaction', error: error.message });
    }
});

// Get transaction statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });

        const totalBuys = transactions
            .filter(t => t.action === 'buy')
            .reduce((sum, t) => sum + t.total, 0);

        const totalSells = transactions
            .filter(t => t.action === 'sell')
            .reduce((sum, t) => sum + t.total, 0);

        const profitLoss = totalSells - totalBuys;

        res.json({
            totalTransactions: transactions.length,
            totalBuys,
            totalSells,
            profitLoss,
            profitLossPercentage: totalBuys > 0 ? ((profitLoss / totalBuys) * 100).toFixed(2) : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to calculate stats', error: error.message });
    }
});

// Delete transaction
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete transaction', error: error.message });
    }
});

export default router;
