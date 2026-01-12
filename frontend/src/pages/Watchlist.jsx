import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ symbol: '', name: '', type: 'stock' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const response = await api.get('/watchlist');
            setWatchlist(response.data);
        } catch (error) {
            console.error('Failed to fetch watchlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/watchlist', formData);
            setShowModal(false);
            setFormData({ symbol: '', name: '', type: 'stock' });
            fetchWatchlist();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add to watchlist');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/watchlist/${id}`);
            fetchWatchlist();
        } catch (error) {
            console.error('Failed to remove from watchlist:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="flex-between mb-2 fade-in">
                    <div>
                        <h1>Watchlist</h1>
                        <p className="text-muted">Monitor stocks and cryptocurrencies you're interested in</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + Add to Watchlist
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading watchlist...</div>
                ) : watchlist.length > 0 ? (
                    <div className="grid grid-3 fade-in">
                        {watchlist.map((item) => (
                            <div key={item._id} className="card">
                                <div className="flex-between mb-1">
                                    <div>
                                        <h3>{item.symbol}</h3>
                                        <p className="text-muted">{item.name}</p>
                                    </div>
                                    <span className={`badge badge-${item.type === 'crypto' ? 'warning' : 'primary'}`}>
                                        {item.type}
                                    </span>
                                </div>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center fade-in">
                        <h3>No items in watchlist</h3>
                        <p className="text-muted">Add stocks or cryptocurrencies to monitor</p>
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Add to Watchlist</h2>
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
                                <div className="flex gap-1">
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
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
        }
      `}</style>
        </>
    );
};

export default Watchlist;
