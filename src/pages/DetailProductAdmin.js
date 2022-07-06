import React, { useState, useEffect, useContext } from 'react';
import { Container, 
    Nav, 
    Navbar, 
    Form, 
    Row, 
    Card, 
    Col, 
    NavDropdown, 
    Dropdown} from "react-bootstrap";
import logo from "../assets/img/logo.svg"
import logob from "../assets/img/black.svg"
import vector from "../assets/img/Vector.svg"
import kopi from "../assets/img/kopi.png"
import { Link } from "react-router-dom";
import productData from "../fakeData/product";
import coffee from "../assets/img/coffee.png"
import c1 from "../assets/img/c1.png"
import keranjang from "../assets/img/keranjang.svg"
import profile from "../assets/img/profile.png"
import imgprofile from "../assets/img/imgprofile.png"
import { UserContext } from '../context/userContext';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import convertRupiah from "rupiah-format";
import iconcomplain from "../assets/img/chat.svg"
import iconlogout from "../assets/img/logout.png"
import iconcoffee from "../assets/img/kopiicon.svg"
import polygon from "../assets/img/Polygon.svg"

export default function DetailProductAdmin() {
const title = "Detail Product";
document.title = "WaysBeans | " + title;

let { id } = useParams();
        
let navigate = useNavigate();

const [state, dispatch] = useContext(UserContext);

let { data: product, refetch } = useQuery("Cache", async () => {
    const config = {
    method: "GET",
    headers: {
        Authorization: "Basic " + localStorage.token,
    },
    };
    const response = await API.get("/product/" + id, config);
    return response.data?.data?.user?.data;

});

return (
    <div>
    <Navbar className="navbar-home">
            <Container fluid>
            <Link to="/home-admin"><img className="img-logo" src={logo}/></Link>
                <Navbar.Collapse id="navbarScroll">
                <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                >
                </Nav>
                <Form className="d-flex">
                    <Dropdown>
                        <Dropdown.Toggle 
                            style={{
                                marginLeft:"36px",
                                marginRight:"100px",
                            }}
                            variant="">
                            <img src={profile} alt="profile" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{width:"200px"}}>
                            {/* <img src={Triangle} className="triangleIcon" alt="triangle" /> */}
                            <Dropdown.Item className="dropdown-text">
                                    <img src={polygon} className="icon-poli" alt="profile icon" />
                                    <img src={iconcoffee} className="icon-complain" alt="profile icon" />
                                    <Link to="/product-admin" className="text-decoration-none text-black">Add Product</Link>
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item className="dropdown-text">
                                <img src={iconcomplain} className="icon-complain" alt="complain icon" />
                                <Link to="/complain-admin" className="text-decoration-none text-black">Complain</Link>
                            </Dropdown.Item>
                            <hr />
                            <Dropdown.Item className="dropdown-text">
                                <img src={iconlogout} className="icon-complain" alt="logout icon" />
                                <Link to="/" className="text-decoration-none text-black">Logout</Link>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Form>
                </Navbar.Collapse>
            </Container>
    </Navbar>
    <Container className="py-4">
        <Row>
        <Col md="3">
            <img src={"http://localhost:5000/uploads/"+product?.image} className="img-fluid-detail" />
        </Col>
        <Col md="5" className="text-detail">
            <div className="text-header-product-detail">{product?.name}</div>
            <div className="text-content-product-detail">Stock : {product?.stock}</div>
            <p className="text-content-product-detail-desc mt-4">
            {product?.desc}
            </p>
            <div className="text-price-product-detail text-end">{convertRupiah.convert(product?.price)}</div>
            <div className="d-grid gap-2">
            </div>
        </Col>
        </Row>
    </Container>
    </div>
);
}
