import React, { useState, useEffect, useContext } from 'react';
import { Container, 
    Nav, 
    Navbar, 
    Form, 
    Row, 
    Col, 
    Button,
    Dropdown,
    } from "react-bootstrap";
import logo from "../assets/img/logo.svg"
import keranjang from "../assets/img/keranjang.svg"
import profile from "../assets/img/profile.png"
import Thumbnail from "../assets/img/Thumbnail.svg"
import iconcoffee from "../assets/img/kopiicon.svg"
import iconcomplain from "../assets/img/chat.svg"
import iconlogout from "../assets/img/logout.png"
import { API } from '../config/api';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import {Popup} from "reactjs-popup";
import Success from "../components/Modal/Success";
import polygon from "../assets/img/Polygon.svg"

export default function AddProduct() {
const title = "Add Product";
document.title = "WaysBeans | " + title;

const [state, dispatch] = useContext(UserContext);

    let navigate = useNavigate();

    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        name: '',
        stock: '',
        price: '',
        desc: '',
        image: '',
    }); 
    console.log(form.image)
    const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]:
            e.target.type === 'file' ? e.target.files : e.target.value,
        });

        if (e.target.type === 'file') {
        let url = URL.createObjectURL(e.target.files[0]);
        setPreview(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
        e.preventDefault();

        const config = {
            headers: {
            'Content-type': 'multipart/form-data',
            },
        };
        const formData = new FormData();
        formData.set('name', form.name);
        formData.set('stock', form.stock);
        formData.set('price', form.price);
        formData.set('desc', form.desc);
        formData.set('image', form.image[0], form.image[0]?.name);
        formData.set('idUser', state.user?.user?.id);

        const response = await API.post('/product', formData, config);
        console.log(response.data?.data?.user);

        navigate('/product-admin');
        } catch (error) {
        console.log(error);
        }
    });

    const [showSuccess, setshowSuccess] = useState(false);

    const handleshowSuccess= () => setshowSuccess(true);

    const handleSuccess = () => {
        handleshowSuccess();
    };

    const handleClose = () => {
        setshowSuccess(false);
    };

return (
    <>
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
    <Container className="py-5" style={{height:"88vh"}}>
        <Row>
            <Col className='d-flex'>
            <Col style={{marginRight:"92px"}}>
                <Col xs="12">
                    <div className="text-header-profile">Add Product</div>
                </Col>
                <Col xs="7">
                    <form form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <Form.Group className="input-editC text-white" controlId="formGroupName">
                        <Form.Control 
                        type="text"  
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                        style={{
                            background:" rgba(210, 210, 210, 0.25)",
                            color: "#613D2B",
                            width: "472px",
                            height: "50px",
                            borderRadius: "5px",
                            background: "rgba(97, 61, 43, 0.25)",
                            border: "2px solid #613D2B",
                        }} 
                        />
                        <Form.Control 
                        type="text"  
                        placeholder="Stock"
                        name="stock"
                        onChange={handleChange}
                        style={{
                            background:"rgba(97, 61, 43, 0.25)",
                            marginTop:"20px",
                            border: "2px solid #613D2B",
                            width: "472px",
                            height: "50px",
                            color: "#613D2B"
                        }} 
                        />
                        <Form.Control 
                        type="number"  
                        placeholder="Price"
                        name="price"
                        onChange={handleChange}
                        style={{
                            background:"rgba(97, 61, 43, 0.25)",
                            marginTop:"20px",
                            border: "2px solid #613D2B",
                            width: "472px",
                            height: "50px",
                            color: "#613D2B"}} 
                        />
                        <Form.Control 
                        className="text-area-product" 
                        as="textarea" 
                        placeholder="Description Product"
                        name="desc"
                        onChange={handleChange}
                        style={{
                            background:"rgba(97, 61, 43, 0.25)",
                            marginTop:"20px",
                            border: "2px solid #613D2B",
                            width: "472px",
                            height: "122px",
                            color: "#613D2B",}} 
                        />
                        <input
                            type="file"
                            id="upload"
                            name="image"
                            placeholder="Photo Product"
                            className='input-upload'
                            onChange={handleChange}
                            style ={{
                                width: "190px",
                                height: "50px",
                                marginTop:"20px",
                                background: "rgba(97, 61, 43, 0.25)",
                                border: "2px solid #613D2B",
                                borderRadius: "5px",
                                marginBottom:"20px"
                            }}
                        />
                        <label for="upload" className="label-file-add-product text-black">
                            <img src={Thumbnail}/>
                        </label>
                        <div className="d-grid gap-2 mt-4">
                            <Button onClick={() => {
                            handleSuccess();
                            }} 
                            type="submit" className="btn-addproduct" style={{background: "#613D2B", border:"none", marginTop:"10px"}}>
                            Add Product
                            </Button>
                        </div>
                    </Form.Group>
                    </form>
                    </Col>
                </Col>
                <Col>
                {preview && (
                <div>
                    <img
                    src={preview}
                    style={{
                    width: '436px',
                    Height: '555px',
                    objectFit: 'cover',
                    marginLeft:"10px"
                    }}
                    alt={preview}
                    />
                </div>
                )}
                </Col>
            </Col>
            </Row>
        </Container>
        <Success
        show={showSuccess}
        handleClose={handleClose}
    />
    </div>
    </>
    );
}
