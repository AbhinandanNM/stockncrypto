import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['stock', 'crypto'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    purchasePrice: {
        type: Number,
        required: true,
        min: 0
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate holdings
portfolioSchema.index({ user: 1, symbol: 1, type: 1 }, { unique: true });

export default mongoose.model('Portfolio', portfolioSchema);
