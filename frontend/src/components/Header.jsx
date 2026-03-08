import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    const { user } = useContext(AuthContext);

    return (
        <Navbar collapseOnSelect expand="lg" fixed="top" className="app-navbar">
            <Container>
                <Navbar.Brand href="#">
                    IMG Bidder
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">

                    {user?.role === 'admin' && (
                        <Nav className="me-auto">
                            <Nav.Link href="/admin">Dashboard</Nav.Link>
                            <Nav.Link href="/admin/images">Images</Nav.Link>
                            <Nav.Link href="/admin/upload/image">Upload</Nav.Link>
                            <Nav.Link href="/admin/customers">Customers</Nav.Link>
                            <Nav.Link href="/admin/bids">Bid Management</Nav.Link>
                            <Nav.Link href="/admin/transactions">Transactions</Nav.Link>
                        </Nav>
                    )}

                    {user?.role === 'customer' && (
                        <Nav className="me-auto">
                            <Nav.Link href="/customer">Assigned Images</Nav.Link>
                            <Nav.Link href="/customer/bids">My Bids</Nav.Link>
                            <Nav.Link href="/customer/transactions">Transactions</Nav.Link>
                        </Nav>
                    )}

                    <Nav>
                        <Nav.Link href="/logout" className="logout-link">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
