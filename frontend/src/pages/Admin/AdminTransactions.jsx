import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get("/admin/transactions", { withCredentials: true });
                setTransactions(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch transactions.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div className="page-wrapper">
            <Container>
                <div className="section-header">
                    <h4>Transactions</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {transactions.length} completed
                    </span>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-3">{error}</Alert>}

                {loading ? (
                    <p className="text-muted">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: '14px' }}>
                        No transactions yet. Approve a bid to create one.
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <Table className="data-table" responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Bidder</th>
                                    <th>Amount ($)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>{tx.id}</td>
                                        <td style={{ fontWeight: 500 }}>{tx.image_title || `Image #${tx.image_id}`}</td>
                                        <td>{tx.bidder}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--accent-light)' }}>${tx.amount}</td>
                                        <td>
                                            <span className="status-badge completed">{tx.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>
        </div>
    );
}
