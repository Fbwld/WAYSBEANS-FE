import React, { useState, useEffect, useContext } from 'react';
import { Container, 
    Nav, 
    Navbar, 
    Form, 
    Row, 
    Card, 
    Col, 
    NavDropdown, 
    Dropdown, Image} from "react-bootstrap";
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
import iconcoffee from "../assets/img/kopiicon.svg"
import iconcomplain from "../assets/img/chat.svg"
import iconlogout from "../assets/img/logout.png"
import { UserContext } from '../context/userContext';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import convertRupiah from "rupiah-format";
import polygon from "../assets/img/Polygon.svg"
import Jumbroton from "../assets/img/Jumbotron.png"

export default function HomeAdmin() {
const title = "Home Admin";
document.title = "WaysBeans | " + title;

const [state, dispatch] = useContext(UserContext);

let navigate = useNavigate();

const { id } = useParams();

    let { data: products } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data.user.data;
    });

    const [form, setForm] = useState({
        idUser: '',
        idProduct: '',
    }); 

    const handleAdd = useMutation(async (e, idProduct) => {
        try {
        e.preventDefault();
        console.log(e)
        const config = {
            method:"POST",
            headers: {
            'Content-type': 'application/json',
            },
        };
        console.log(products)
        const formData = new FormData();
        formData.set('idUser', state.user?.user?.id);
        formData.set('idProduct', idProduct);
    
        // const response = await API.post('/whislist', {
        //     idProduct: parseInt(e.target.value),
        //     idUser:state.user?.user?.id,
        // }, config);
        // console.log(response.data?.data?.user);
    
        // navigate('/product');
        } catch (error) {
        console.log(error);
        }
    });
return (
    <>
    <div>
    <Navbar className="navbar-home">
        <Container fluid>
            <img className="img-logo" src={logo}/>
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
    <Container>
        <Row className="mb-5">
            <Col className="col-12 mt-5">
                <Image 
                className='img-landing '
                    src={Jumbroton}
                />
            </Col>
        </Row>
        <Row>
            {products?.length !== 0 ? (
                    <>
                        {products?.map((item, index) => {
                            return(
                                <Col className="col-md-2 pb-4" style={{marginRight:"50px"}}>
                                    <Card className="card-home" style={{ background: "#F6E6DA"}}>
                                    <Card.Img variant="top" src={"http://localhost:5000/uploads/"+item.image}
                                    style={{
                                    objectFit: "cover",
                                    height : "312px",
                                    cursor : "pointer",
                                    }}/>
                                    <Card.Body>
                                        <Link to={"/detail-product-admin/"+ item?.id} className='text-decoration-none'><Card.Title className="title-home">{item?.name}</Card.Title></Link>
                                        <Card.Text className="text-home">{convertRupiah.convert(item?.price)}</Card.Text>
                                        <Card.Text className="text-home-stock">Stock : {item?.stock}</Card.Text>
                                    </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                    </>
                ) : (
                    <Col>
                    <div className="text-center pt-5">
                        <img
                        src={coffee}
                        className="img-fluid"
                        style={{ width: '20%' }}
                        alt="empty"
                        />
                        <div className="mt-3">No data product</div>
                    </div>
                    </Col>
                )}
                </Row>
    </Container>
    </div>
    </>
    );
}
