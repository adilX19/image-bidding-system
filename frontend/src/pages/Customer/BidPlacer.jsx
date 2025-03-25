import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BiddingModal from "../../components/BiddingModal";

export default function BidPlacer() {
    const { id } = useParams(); // Get the image ID from the URL
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {

        const fetchImage = async () => {
            try {
                const response = await api.get(`customer/assigned/images/${id}`, { withCredentials: true });
                setImage(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch image details:", error);
            }
        }

        fetchImage();

    }, [id])


    if (loading == true) {
        return <>Loading Image...</>
    }

    return (
        <>
            <Container style={{ marginTop: '100px' }}>

                <BiddingModal image_id={image.id} show={modalShow} onHide={() => setModalShow(false)} />

                <Row>
                    <Col>
                        <img src={'http://localhost:5000/' + image.image_path} style={{ width: '450px' }} />
                    </Col>
                    <Col>
                        <h4>{image.title}</h4>
                        <p className="text-secondary">{image.description}</p>

                        <span style={{ fontWeight: '500' }} className='text-dark bold'>Starting bid: $.{image.starting_price}
                        </span> <br />
                        
                        <Button onClick={() => setModalShow(true)} className="mt-3" style={{ borderRadius: '5px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px' }} variant="dark" value={image.id}>Place Your Bid</Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
