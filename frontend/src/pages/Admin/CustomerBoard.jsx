import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
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
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch customers");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

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

    if (loading) return <Container style={{ marginTop: "100px" }}><p>Loading customers...</p></Container>;

    return (
        <Container style={{ marginTop: "100px" }}>
            <h4 className="mb-3">List of Available Customers</h4>

            {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}

            {customers.length === 0 ? (
                <p className="text-muted">No customers found.</p>
            ) : (
                <Table responsive="lg" className="mt-3">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.username}</td>
                                <td>{customer.email}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDelete(customer.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
