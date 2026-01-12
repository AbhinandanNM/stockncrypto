import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const Crypto = () => {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCryptos();
    }, []);

    const fetchCryptos = async () => {
        try {
            const response = await api.get('/crypto/top?limit=20');
            setCryptos(response.data);
        } catch (error) {
            console.error('Failed to fetch crypto data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="mb-2 fade-in">
                    <h1>Cryptocurrency Dashboard</h1>
                    <p className="text-muted">Live cryptocurrency prices and market data</p>
                </div>

                {loading ? (
                    <div className="loading">Loading cryptocurrency data...</div>
                ) : (
                    <div className="card fade-in">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Coin</th>
                                    <th>Price</th>
                                    <th>24h Change</th>
                                    <th>Market Cap</th>
                                    <th>Volume (24h)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cryptos.map((crypto) => (
                                    <tr key={crypto.id}>
                                        <td>{crypto.marketCapRank}</td>
                                        <td>
                                            <div className="flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
                                                <img src={crypto.image} alt={crypto.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                                <div>
                                                    <strong>{crypto.name}</strong>
                                                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>{crypto.symbol}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><strong>${crypto.currentPrice?.toLocaleString()}</strong></td>
                                        <td>
                                            <span className={crypto.priceChange24h >= 0 ? 'text-success' : 'text-danger'}>
                                                {crypto.priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.priceChange24h).toFixed(2)}%
                                            </span>
                                        </td>
                                        <td>${(crypto.marketCap / 1e9).toFixed(2)}B</td>
                                        <td>${(crypto.totalVolume / 1e6).toFixed(2)}M</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
};

export default Crypto;
