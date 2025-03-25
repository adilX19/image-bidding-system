import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import Container from 'react-bootstrap/esm/Container';

export default function AdminDashboard() {

    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            
            try {
                const response = await api.get('/admin/dashboard', { withCredentials: true });
                if (response.status == 200) {
                    setMessage(response.data.user.username)
                }
            } catch (err) {
                setError(err.response ? err.response.data : 'Error fetching data');
            }
        }
        fetchData();
    }, [])


    return (
        <>
            <Container style={{ marginTop: '100px' }}>
                <div>
                    <h1>Welcome to the Admin Dashboard</h1>
                    <p>Greetings, {message}.</p>
                </div>
            </Container>
        </>
    );
};
