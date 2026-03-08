import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function AdminDashboard() {
    const [username, setUsername] = useState('');
    const [stats, setStats] = useState({ customers: 0, images: 0, pendingBids: 0, transactions: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, customersRes, imagesRes, bidsRes, transRes] = await Promise.allSettled([
                    api.get('/admin/dashboard', { withCredentials: true }),
                    api.get('/admin/customers/list', { withCredentials: true }),
                    api.get('/admin/images', { withCredentials: true }),
                    api.get('/admin/bids', { withCredentials: true }),
                    api.get('/admin/transactions', { withCredentials: true }),
                ]);

                if (dashRes.status === 'fulfilled') setUsername(dashRes.value.data.user.username);

                setStats({
                    customers: customersRes.status === 'fulfilled' ? customersRes.value.data.length : 0,
                    images: imagesRes.status === 'fulfilled' ? imagesRes.value.data.length : 0,
                    pendingBids: bidsRes.status === 'fulfilled'
                        ? bidsRes.value.data.filter(b => b.status === 'pending').length
                        : 0,
                    transactions: transRes.status === 'fulfilled' ? transRes.value.data.length : 0,
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Customers', value: stats.customers, icon: '👥', iconClass: 'stat-icon-indigo' },
        { label: 'Total Images', value: stats.images, icon: '🖼️', iconClass: 'stat-icon-emerald' },
        { label: 'Pending Bids', value: stats.pendingBids, icon: '⏳', iconClass: 'stat-icon-amber' },
        { label: 'Transactions', value: stats.transactions, icon: '💳', iconClass: 'stat-icon-rose' },
    ];

    return (
        <div className="page-wrapper">
            <Container>
                <div className="welcome-banner">
                    <h2>Welcome back, {username || '…'} 👋</h2>
                    <p>Here's an overview of your bidding platform.</p>
                </div>

                <Row className="g-4">
                    {statCards.map((card) => (
                        <Col key={card.label} xs={12} sm={6} lg={3}>
                            <div className="stat-card">
                                <div className={`stat-icon ${card.iconClass}`}>{card.icon}</div>
                                <div className="stat-value">{loading ? '—' : card.value}</div>
                                <div className="stat-label">{card.label}</div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}
