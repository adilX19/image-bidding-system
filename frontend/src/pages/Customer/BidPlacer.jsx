import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams, useNavigate } from "react-router-dom";
import BiddingModal from "../../components/BiddingModal";

export default function BidPlacer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await api.get(`/customer/assigned/images/${id}`, { withCredentials: true });
                setImage(response.data);
            } catch (error) {
                console.error("Failed to fetch image details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [id]);

    if (loading) return (
        <div className="page-wrapper">
            <Container><p className="text-muted">Loading image details...</p></Container>
        </div>
    );

    if (!image) return (
        <div className="page-wrapper">
            <Container><p style={{ color: 'var(--danger)' }}>Image not found.</p></Container>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Container>
                <BiddingModal image_id={image.id} show={modalShow} onHide={() => setModalShow(false)} />

                <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mb-4"
                    onClick={() => navigate('/customer')}
                >
                    ← Back to Images
                </Button>

                <Row className="g-5 align-items-start">
                    <Col md={6}>
                        <img
                            src={`http://localhost:5000/${image.image_path}`}
                            alt={image.title}
                            style={{
                                width: '100%',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                display: 'block'
                            }}
                        />
                    </Col>

                    <Col md={6}>
                        <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '10px', fontSize: '24px' }}>
                            {image.title}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, fontSize: '14px', marginBottom: '28px' }}>
                            {image.description}
                        </p>

                        <div style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '18px 22px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>
                                Starting Bid
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent-light)', lineHeight: 1 }}>
                                ${image.starting_price}
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            className="w-100"
                            style={{ padding: '13px', fontSize: '15px', fontWeight: 600 }}
                            onClick={() => setModalShow(true)}
                        >
                            Place Your Bid
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
