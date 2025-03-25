import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Header from '../../components/Header';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import BidPlacer from './BidPlacer';
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {

    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);

    const navigateToDetailsPage = (id) => {
        navigate('/customer/image/' + id);
    };

    useEffect(() => {
        const fetchImages = async () => {

            try {
                const response = await api.get('/customer/assigned/images', { withCredentials: true });
                if (response.status == 200) {
                    setImages(response.data)
                }
            } catch (err) {
                setError(err.response ? err.response.data : 'Error fetching data');
            }
        }
        fetchImages();
    }, [])


    return (
        <>
            <Container style={{ marginTop: '100px' }}>
                <h3>Featured Items</h3>
                <Row className="mt-5">
                    {images.map((image) => (
                        <Col key={image.id} className='mb-4'>
                            <Card style={{ width: '18rem', position: 'relative', padding: '10px', borderRadius: '35px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }} className='h-100 pb-4'>
                                <Card.Img variant="top" style={{ objectFit: 'cover', width: '100%;', height: '160px', borderRadius: '30px' }} src={'http://localhost:5000/' + image.image_path} />
                                <Card.Body>
                                    <Card.Title>{image.title}</Card.Title>
                                    <Card.Text className='mb-4 text-secondary'>
                                        {image.description}
                                    </Card.Text>
                                    <span style={{ position: 'absolute', top: 'auto', bottom: '50px', fontWeight: '500' }} className='text-dark bold'>Starting bid: $.{image.starting_price}
                                    </span> <br />
                                    <Button onClick={(e) => {navigateToDetailsPage(e.target.value)}} style={{ position: 'absolute', top: 'auto', bottom: '10px', borderRadius: '5px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }} size='sm' variant="dark" value={image.id}>Bid Now</Button>

                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};
