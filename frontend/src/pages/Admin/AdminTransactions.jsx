import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
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
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch transactions.");
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <Container style={{ marginTop: "100px" }}><p>Loading transactions...</p></Container>;

    return (
        <Container style={{ marginTop: "100px" }}>
            <h4 className="mb-3">Transactions</h4>

            {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

            {transactions.length === 0 ? (
                <p className="text-muted">No transactions found.</p>
            ) : (
                <Table responsive hover>
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
                                <td>{tx.id}</td>
                                <td>{tx.image_title || `Image #${tx.image_id}`}</td>
                                <td>{tx.bidder}</td>
                                <td>{tx.amount}</td>
                                <td>
                                    <Badge bg="success">{tx.status}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
