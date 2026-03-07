import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
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
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch bids.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

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

    if (loading) return <Container style={{ marginTop: "100px" }}><p>Loading bids...</p></Container>;

    return (
        <Container style={{ marginTop: "100px" }}>
            <h4 className="mb-3">My Bids</h4>

            {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}

            {bids.length === 0 ? (
                <p className="text-muted">You have not placed any bids yet.</p>
            ) : (
                <Table responsive hover>
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
                                <td>{bid.id}</td>
                                <td>{bid.image_title}</td>
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
                                            variant="danger"
                                            onClick={() => handleCancel(bid.id)}
                                        >
                                            Cancel
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
