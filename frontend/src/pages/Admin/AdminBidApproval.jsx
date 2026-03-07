import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

export default function AdminBidApproval() {
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchBids = async () => {
        try {
            const response = await api.get("/admin/bids", { withCredentials: true });
            setBids(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bids.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

    const handleApprove = async (bid_id) => {
        try {
            await api.put(`/admin/bids/${bid_id}/approve`, {}, { withCredentials: true });
            setSuccessMsg(`Bid #${bid_id} approved successfully.`);
            fetchBids();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to approve bid.");
        }
    };

    if (loading) return <Container style={{ marginTop: "100px" }}><p>Loading bids...</p></Container>;

    return (
        <Container style={{ marginTop: "100px" }}>
            <h4 className="mb-3">Bid Management</h4>

            {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}

            {bids.length === 0 ? (
                <p className="text-muted">No bids found.</p>
            ) : (
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Bidder</th>
                            <th>Amount ($)</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids.map((bid) => (
                            <tr key={bid.id}>
                                <td>{bid.id}</td>
                                <td>{bid.image_title}</td>
                                <td>{bid.bidder}</td>
                                <td>{bid.bid_amount}</td>
                                <td>
                                    <Badge bg={bid.status === "approved" ? "success" : "warning"}>
                                        {bid.status}
                                    </Badge>
                                </td>
                                <td>
                                    {bid.status === "pending" && (
                                        <Button
                                            size="sm"
                                            variant="success"
                                            onClick={() => handleApprove(bid.id)}
                                        >
                                            Approve
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
