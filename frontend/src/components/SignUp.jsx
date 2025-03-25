import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirm_password) {
            setError('Passwords didn\'t matched...');
            return
        }

        try {
            await signup(username, email, password, confirm_password, role);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed. Please try again.');
        }

    }

    return (
        <Container className='mt-5 w-25'>
            <Card>
                <Card.Body>
                    <h5 className='mb-3 text-center'>Create an Account</h5>
                    <Form onSubmit={handleSubmit}>
                        {error && <p className="error-message">{error}</p>}
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Enter username" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" value={confirm_password} onChange={(e) => { setConfirmPassword(e.target.value) }} placeholder="Confirm Password" />
                        </Form.Group>

                        <Form.Label>User Role</Form.Label>
                        <Form.Select className='mb-3' aria-label="Default select example" onChange={(e) => { setRole(e.target.value) }}>
                            <option disabled selected>Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                        </Form.Select>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        <br /><br />
                        <small>
                            Already have an account? <a href='/'>Login</a>
                        </small>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}
