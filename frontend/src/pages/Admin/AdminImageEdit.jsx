import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
    const [currentImage, setCurrentImage] = useState(null);
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
                setCurrentImage(image);
                setFormData({
                    title: image.title,
                    description: image.description,
                    starting_price: image.starting_price,
                    assigned_to: image.assigned_to,
                });
                setCustomers(customersRes.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load image data.");
            } finally {
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

    if (loading) return (
        <div className="page-wrapper">
            <Container><p className="text-muted">Loading...</p></Container>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Container>
                <div className="section-header" style={{ marginBottom: '28px' }}>
                    <h4>Edit Image</h4>
                    <Button variant="outline-secondary" size="sm" onClick={() => navigate("/admin/images")}>
                        ← Back to Images
                    </Button>
                </div>

                <Row className="g-4 justify-content-center">
                    {currentImage && (
                        <Col xs={12} lg={4}>
                            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                <img
                                    src={`http://localhost:5000/${currentImage.image_path}`}
                                    alt={currentImage.title}
                                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{ padding: '14px 16px' }}>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Image</div>
                                </div>
                            </div>
                        </Col>
                    )}

                    <Col xs={12} lg={currentImage ? 7 : 8}>
                        <div className="form-card">
                            {error && <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4">{error}</Alert>}
                            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")} className="mb-4">{successMsg}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control name="title" type="text" value={formData.title} onChange={handleChange} required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control name="description" as="textarea" rows={3} value={formData.description} onChange={handleChange} required />
                                </Form.Group>

                                <Row className="g-3 mb-4">
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>Starting Price ($)</Form.Label>
                                            <Form.Control name="starting_price" type="number" value={formData.starting_price} onChange={handleChange} min="0" step="0.01" required />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>Assign to Customer</Form.Label>
                                            <Form.Select name="assigned_to" value={formData.assigned_to} onChange={handleChange} required>
                                                <option value="">Select customer</option>
                                                {customers.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.username} ({c.email})</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="primary" type="submit" className="w-100">
                                    Save Changes
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
