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
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch images.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

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

    if (loading) return <Container style={{ marginTop: "100px" }}><p>Loading images...</p></Container>;

    return (
        <Container style={{ marginTop: "100px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Image Management</h4>
                <Button variant="dark" size="sm" onClick={() => navigate("/admin/upload/image")}>
                    + Upload New Image
                </Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
            {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg("")}>{successMsg}</Alert>}

            {images.length === 0 ? (
                <p className="text-muted">No images uploaded yet.</p>
            ) : (
                <Table responsive hover>
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
                                <td>{image.id}</td>
                                <td>
                                    <img
                                        src={`http://localhost:5000/${image.image_path}`}
                                        alt={image.title}
                                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                                    />
                                </td>
                                <td>{image.title}</td>
                                <td>{image.description}</td>
                                <td>{image.starting_price}</td>
                                <td className="d-flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline-dark"
                                        onClick={() => navigate(`/admin/images/${image.id}/edit`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDelete(image.id)}
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
