import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function BiddingModal(props) {

    const [show, setShow] = useState(true);
    const [amount, setAmount] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = { image_id: props.image_id, amount: amount }

        console.log("Data:", data)

        if (amount == 0) {
            setError('Amount cannot be zero.');
            return
        }

        try {
            const response = await api.post('/customer/place/bid', data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (response.status == 200) {
                navigate(`/customer/image/${props.image_id}`);
            }

        } catch (err) {
            console.log(err.message)
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Modal heading
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {error && <Alert onClose={() => setShow(false)} dismissible key='danger' variant='danger'>{error}</Alert>}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type='number' value={amount} onChange={(e) => { setAmount(e.target.value) }} placeholder="Enter Bidding Amount..." />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' variant='dark'>Submit</Button>
                    <Button type='button' onClick={props.onHide} variant='danger'>Close</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}