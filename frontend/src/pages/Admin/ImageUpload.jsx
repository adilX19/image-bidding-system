import React, { useState, useEffect } from "react";
import api from '../../services/api';
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

export default function ImageUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_price: "",
    assigned_to: ""
  });


  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [customers, setCustomers] = useState([]);


  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await api.get('/admin/customers/list', { withCredentials: true });

      if (response.status == 200) {
        setCustomers(response.data)
      }
    }
    fetchCustomers();
  }, [])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus("Please select a file before uploading.");
      return;
    }

    const data = new FormData();
    data.append("image", selectedFile);
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const response = await api.post("/admin/upload/image", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setUploadStatus(`Upload successful: ${response.data.message}`);
      setFormData({
        title: "",
        description: "",
        starting_price: "",
        assigned_to: ""
      });
      event.target.reset();
      
    } catch (error) {
      setUploadStatus(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Container className='mt-4 w-50'>
      <Card>
        <Card.Body>
          <h4 className="mt-4 mb-4">Upload an Image for Bidding</h4>
          <Form onSubmit={handleSubmit}>
            {uploadStatus && <p>{uploadStatus}</p>}
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="Title of the image..." required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" type="text" value={formData.description} onChange={handleInputChange} placeholder="Describe the image." required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="starting-price">
              <Form.Label>Starting Price</Form.Label>
              <Form.Control name="starting_price" type="number" value={formData.starting_price} onChange={handleInputChange} placeholder="bidding price ($20.5, $75 etc)" required />
            </Form.Group>

            <Form.Select aria-label="Default select example" name="assigned_to" onChange={handleInputChange}>
              <option disabled selected>Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.username} ({customer.email})
                </option>
              ))}
            </Form.Select>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Default file input example</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};