import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default function CustomerBoard() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/admin/customers/list', { withCredentials: true });
            setCustomers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch customers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCustomers(); }, []);

    const handleDelete = async (customer_id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        try {
            await api.delete(`/admin/customers/${customer_id}`, { withCredentials: true });
            setSuccessMsg("Customer deleted successfully.");
            fetchCustomers();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete customer.");
        }
    };

    return (
        <div className="page-wrapper">
            <Container>
                <div className="section-header">
                    <h4>Customers</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        {customers.length} registered
                    </span>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-3">{error}</Alert>}
                {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")} className="mb-3">{successMsg}</Alert>}

                {loading ? (
                    <p className="text-muted">Loading customers...</p>
                ) : customers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: '14px' }}>
                        No customers registered yet.
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <Table className="data-table" responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>{customer.id}</td>
                                        <td style={{ fontWeight: 500 }}>{customer.username}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{customer.email}</td>
                                        <td>
                                            <Button size="sm" variant="danger" onClick={() => handleDelete(customer.id)}>
                                                Delete
                                            </Button>
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
