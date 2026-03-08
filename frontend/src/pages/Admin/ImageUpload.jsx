import React, { useState, useEffect } from "react";
import api from '../../services/api';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ImageUpload() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        starting_price: "",
        assigned_to: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            const response = await api.get('/admin/customers/list', { withCredentials: true });
            if (response.status === 200) setCustomers(response.data);
        };
        fetchCustomers();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUploadStatus(null);

        if (!selectedFile) {
            setUploadStatus({ type: 'error', message: 'Please select an image file.' });
            return;
        }

        const data = new FormData();
        data.append("image", selectedFile);
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));

        try {
            await api.post("/admin/upload/image", data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            setUploadStatus({ type: 'success', message: 'Image uploaded successfully.' });
            setFormData({ title: "", description: "", starting_price: "", assigned_to: "" });
            setSelectedFile(null);
            setPreview(null);
            event.target.reset();
        } catch (error) {
            setUploadStatus({ type: 'error', message: error.response?.data?.message || 'Upload failed.' });
        }
    };

    return (
        <div className="page-wrapper">
            <Container>
                <div className="section-header" style={{ marginBottom: '28px' }}>
                    <h4>Upload Image for Bidding</h4>
                </div>

                <Row className="g-4 justify-content-center">
                    <Col xs={12} lg={7}>
                        <div className="form-card">
                            {uploadStatus && (
                                <Alert
                                    variant={uploadStatus.type === 'success' ? 'success' : 'danger'}
                                    dismissible
                                    onClose={() => setUploadStatus(null)}
                                >
                                    {uploadStatus.message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter image title"
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
                                        onChange={handleInputChange}
                                        placeholder="Describe the image"
                                        required
                                    />
                                </Form.Group>

                                <Row className="g-3 mb-3">
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>Starting Price ($)</Form.Label>
                                            <Form.Control
                                                name="starting_price"
                                                type="number"
                                                value={formData.starting_price}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 50.00"
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col sm={6}>
                                        <Form.Group>
                                            <Form.Label>Assign to Customer</Form.Label>
                                            <Form.Select name="assigned_to" value={formData.assigned_to} onChange={handleInputChange} required>
                                                <option value="" disabled>Select customer</option>
                                                {customers.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.username} ({c.email})
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Image File</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Form.Group>

                                {preview && (
                                    <div className="mb-4">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxHeight: '220px',
                                                objectFit: 'cover',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--border)'
                                            }}
                                        />
                                    </div>
                                )}

                                <Button variant="primary" type="submit" className="w-100">
                                    Upload Image
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
