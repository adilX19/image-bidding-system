import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminImageEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        starting_price: "",
        assigned_to: "",
    });
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [imageRes, customersRes] = await Promise.all([
                    api.get(`/admin/images/${id}`, { withCredentials: true }),
                    api.get("/admin/customers/list", { withCredentials: true }),
                ]);

                const image = imageRes.data;
                setFormData({
                    title: image.title,
                    description: image.description,
                    starting_price: image.starting_price,
                    assigned_to: image.assigned_to,
                });
                setCustomers(customersRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load image data.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");

        try {
            await api.put(`/admin/images/${id}`, formData, { withCredentials: true });
            setSuccessMsg("Image updated successfully.");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update image.");
        }
    };

    if (loading) return <Container style={{ marginTop: "100px" }}><p>Loading...</p></Container>;

    return (
        <Container className="mt-5 w-50">
            <Card>
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0">Edit Image</h4>
                        <Button variant="outline-secondary" size="sm" onClick={() => navigate("/admin/images")}>
                            Back to Images
                        </Button>
                    </div>

                    {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
                    {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name="description"
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Starting Price ($)</Form.Label>
                            <Form.Control
                                name="starting_price"
                                type="number"
                                value={formData.starting_price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Assign to Customer</Form.Label>
                            <Form.Select name="assigned_to" value={formData.assigned_to} onChange={handleChange} required>
                                <option value="">Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.username} ({customer.email})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button variant="dark" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
