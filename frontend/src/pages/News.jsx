import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const News = () => {
    const [news, setNews] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, [filter]);

    const fetchNews = async () => {
        try {
            const params = filter !== 'all' ? `?category=${filter}` : '';
            const response = await axios.get(`/api/news${params}`);
            setNews(response.data);
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHrs = Math.floor(diffMs / 3600000);

        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return `${Math.floor(diffHrs / 24)}d ago`;
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '2rem 0' }}>
                <div className="mb-2 fade-in">
                    <h1>Market News</h1>
                    <p className="text-muted">Stay updated with the latest financial news and market trends</p>
                </div>

                <div className="card mb-2 fade-in">
                    <div className="flex gap-1">
                        <button
                            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('all')}
                        >
                            All News
                        </button>
                        <button
                            className={`btn ${filter === 'stocks' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('stocks')}
                        >
                            Stocks
                        </button>
                        <button
                            className={`btn ${filter === 'crypto' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('crypto')}
                        >
                            Crypto
                        </button>
                        <button
                            className={`btn ${filter === 'economy' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('economy')}
                        >
                            Economy
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Loading news...</div>
                ) : (
                    <div className="grid grid-2 fade-in">
                        {news.map((article) => (
                            <div key={article.id} className="card">
                                <div className="flex-between mb-1">
                                    <span className={`badge badge-${article.category === 'crypto' ? 'warning' :
                                            article.category === 'stocks' ? 'primary' :
                                                'success'
                                        }`}>
                                        {article.category}
                                    </span>
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                        {getTimeAgo(article.publishedAt)}
                                    </span>
                                </div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{article.title}</h3>
                                <p className="text-muted" style={{ marginBottom: '1rem' }}>
                                    {article.description}
                                </p>
                                <div className="flex-between" style={{ alignItems: 'center' }}>
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                                        {article.source}
                                    </span>
                                    <a href={article.url} className="btn btn-secondary btn-sm" target="_blank" rel="noopener noreferrer">
                                        Read More →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default News;
