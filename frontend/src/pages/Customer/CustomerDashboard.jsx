import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await api.get('/customer/assigned/images', { withCredentials: true });
                if (response.status === 200) setImages(response.data);
            } catch (err) {
                setError('Failed to load images.');
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="page-wrapper">
            <Container>
                <div className="section-header">
                    <h4>Assigned Images</h4>
                    {!loading && (
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            {images.length} item{images.length !== 1 ? 's' : ''} available
                        </span>
                    )}
                </div>

                {error && <p style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</p>}

                {loading && <p className="text-muted">Loading images...</p>}

                {!loading && images.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 24px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        color: 'var(--text-muted)',
                        fontSize: '14px'
                    }}>
                        No images have been assigned to you yet.
                    </div>
                )}

                {!loading && images.length > 0 && (
                    <Row className="g-4">
                        {images.map((image) => (
                            <Col key={image.id} xs={12} sm={6} md={4} lg={3}>
                                <div className="image-card">
                                    <img
                                        src={`http://localhost:5000/${image.image_path}`}
                                        alt={image.title}
                                    />
                                    <div className="card-body-custom">
                                        <div className="card-title">{image.title}</div>
                                        <div className="card-desc">{image.description}</div>
                                        <div className="price-tag">Starting bid: ${image.starting_price}</div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="w-100"
                                            onClick={() => navigate('/customer/image/' + image.id)}
                                        >
                                            Bid Now
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}
