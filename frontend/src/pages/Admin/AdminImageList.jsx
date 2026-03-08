import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

export default function AdminImageList() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();

    const fetchImages = async () => {
        try {
            const response = await api.get("/admin/images", { withCredentials: true });
            setImages(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch images.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchImages(); }, []);

    const handleDelete = async (image_id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        try {
            await api.delete(`/admin/images/${image_id}`, { withCredentials: true });
            setSuccessMsg("Image deleted successfully.");
            fetchImages();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete image.");
        }
    };

    return (
        <div className="page-wrapper">
            <Container>
                <div className="section-header">
                    <h4>Image Management</h4>
                    <Button variant="primary" size="sm" onClick={() => navigate("/admin/upload/image")}>
                        + Upload Image
                    </Button>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-3">{error}</Alert>}
                {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")} className="mb-3">{successMsg}</Alert>}

                {loading ? (
                    <p className="text-muted">Loading images...</p>
                ) : images.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text-muted)', fontSize: '14px' }}>
                        No images uploaded yet.
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <Table className="data-table" responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Preview</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Starting Price ($)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {images.map((image) => (
                                    <tr key={image.id}>
                                        <td style={{ color: 'var(--text-muted)' }}>{image.id}</td>
                                        <td>
                                            <img
                                                src={`http://localhost:5000/${image.image_path}`}
                                                alt={image.title}
                                                style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                                            />
                                        </td>
                                        <td style={{ fontWeight: 500 }}>{image.title}</td>
                                        <td style={{ color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {image.description}
                                        </td>
                                        <td style={{ fontWeight: 600, color: 'var(--accent-light)' }}>${image.starting_price}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button size="sm" variant="outline-dark" onClick={() => navigate(`/admin/images/${image.id}/edit`)}>
                                                    Edit
                                                </Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(image.id)}>
                                                    Delete
                                                </Button>
                                            </div>
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
