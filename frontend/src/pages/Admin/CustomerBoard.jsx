import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";


export default function CustomerBoard() {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCustomers = async () => {

            try {
                const response = await api.get('/admin/customers/list', { withCredentials: true });
                setCustomers(response.data)
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch customers");
                setLoading(false);
            }
        }
        fetchCustomers()
    }, [])


    if (loading) return <p>Loading customers...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Container className="mt-5">
            <h4 className="mb-3">List of Available Customers</h4>
            <Table responsive="lg" className="mt-3">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.username}</td>
                            <td>{customer.email}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}
