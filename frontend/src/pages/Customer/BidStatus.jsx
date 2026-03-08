import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default function BidStatus() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchBids = async () => {
        try {
            const response = await api.get("/customer/bids", { withCredentials: true });
            setBids(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bids.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBids(); }, []);

    const handleCancel = async (bid_id) => {
        if (!window.confirm("Are you sure you want to cancel this bid?")) return;
        try {
            await api.delete(`/customer/bids/${bid_id}`, { withCredentials: true });
            setSuccessMsg("Bid cancelled successfully.");
            fetchBids();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel bid.");
        }
    };

    return (
        <div className="page-wrapper">
            <Container>
                <div className="section-header">
                    <h4>My Bids</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {bids.filter(b => b.status === 'pending').length} pending
                    </span>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-3">{error}</Alert>}
                {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")} className="mb-3">{successMsg}</Alert>}

                {loading ? (
                    <p className="text-muted">Loading bids...</p>
                ) : bids.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: '14px' }}>
                        You haven't placed any bids yet. <a href="/customer">Browse images</a> to get started.
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <Table className="data-table" responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Bid Amount ($)</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bids.map((bid) => (
                                    <tr key={bid.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>{bid.id}</td>
                                        <td style={{ fontWeight: 500 }}>{bid.image_title}</td>
                                        <td style={{ fontWeight: 600, color: 'var(--accent-light)' }}>${bid.bid_amount}</td>
                                        <td>
                                            <span className={`status-badge ${bid.status}`}>{bid.status}</span>
                                        </td>
                                        <td>
                                            {bid.status === 'pending' && (
                                                <Button size="sm" variant="danger" onClick={() => handleCancel(bid.id)}>
                                                    Cancel
                                                </Button>
                                            )}
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
