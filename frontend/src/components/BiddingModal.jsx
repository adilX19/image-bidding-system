import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function BiddingModal(props) {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid bid amount.');
            return;
        }

        try {
            const response = await api.post(
                '/customer/place/bid',
                { image_id: props.image_id, amount },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );

            if (response.status === 201) navigate('/customer/bids');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place bid. Please try again.');
        }
    };

    return (
        <Modal {...props} size="md" centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Place a Bid</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ padding: '24px' }}>
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>
                    )}

                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '18px', lineHeight: 1.6 }}>
                        Your bid must exceed the starting price and any existing bids on this image.
                    </p>

                    <Form.Group>
                        <Form.Label>Bid Amount ($)</Form.Label>
                        <Form.Control
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 150.00"
                            min="0"
                            step="0.01"
                            required
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button type="button" variant="outline-secondary" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Submit Bid
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
