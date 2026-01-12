import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Portfolio = () => {
    const [holdings, setHoldings] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        symbol: '',
        name: '',
        type: 'stock',
        quantity: '',
        purchasePrice: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const response = await axios.get('/api/portfolio');
            setHoldings(response.data);
        } catch (error) {
            console.error('Failed to fetch portfolio:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('/api/portfolio', {
                ...formData,
                quantity: parseFloat(formData.quantity),
                purchasePrice: parseFloat(formData.purchasePrice)
            });

            setShowModal(false);
            setFormData({ symbol: '', name: '', type: 'stock', quantity: '', purchasePrice: '' });
            fetchPortfolio();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add holding');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to remove this holding?')) return;

        try {
            await axios.delete(`/api/portfolio/${id}`);
            fetchPortfolio();
        } catch (error) {
            console.error('Failed to delete holding:', error);
        }
    };

    const calculateTotal = () => {
        return holdings.reduce((sum, h) => sum + (h.quantity * h.purchasePrice), 0);
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="flex-between mb-2 fade-in">
                    <div>
                        <h1>Portfolio</h1>
                        <p className="text-muted">Manage your stock and crypto holdings</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Add Holding
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading portfolio...</div>
                ) : holdings.length > 0 ? (
                    <>
                        <div className="card mb-2 fade-in">
                            <h3>Total Portfolio Value: ${calculateTotal().toFixed(2)}</h3>
                        </div>

                        <div className="card fade-in">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Quantity</th>
                                        <th>Purchase Price</th>
                                        <th>Total Value</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holdings.map((holding) => (
                                        <tr key={holding._id}>
                                            <td><strong>{holding.symbol}</strong></td>
                                            <td>{holding.name}</td>
                                            <td><span className={`badge badge-${holding.type === 'crypto' ? 'warning' : 'primary'}`}>{holding.type}</span></td>
                                            <td>{holding.quantity}</td>
                                            <td>${holding.purchasePrice.toFixed(2)}</td>
                                            <td><strong>${(holding.quantity * holding.purchasePrice).toFixed(2)}</strong></td>
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(holding._id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div className="card text-center fade-in">
                        <h3>No holdings yet</h3>
                        <p className="text-muted">Start building your portfolio by adding your first holding</p>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Add New Holding</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Symbol</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.symbol}
                                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                        placeholder="AAPL, BTC, etc."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Apple Inc., Bitcoin, etc."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-select"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="stock">Stock</option>
                                        <option value="crypto">Crypto</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        step="0.00000001"
                                        className="form-input"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        placeholder="10"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Purchase Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.purchasePrice}
                                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                        placeholder="150.00"
                                        required
                                    />
                                </div>
                                <div className="flex gap-1">
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Holding</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
      `}</style>
        </>
    );
};

export default Portfolio;
