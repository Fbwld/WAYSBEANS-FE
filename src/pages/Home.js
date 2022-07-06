import React, { useState, useEffect, useContext } from 'react';
import { Container, Nav, Navbar, Form, Row, Card, Col, Button, Image} from "react-bootstrap";
import logo from "../assets/img/logo.svg"
import coffee from "../assets/img/coffee.png"
import Login from "../components/Modal/Login";
import Register from "../components/Modal/Register";
import { UserContext } from '../context/userContext';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import convertRupiah from "rupiah-format";
import polygon from "../assets/img/Polygon.svg"
import Jumbroton from "../assets/img/Jumbotron.png"


export default function Home() {
const title = "Home";
document.title = "WaysBeans | " + title;

const [showRegister, setshowRegister] = useState(false);
const [showLogin, setshowLogin] = useState(false);

const handleshowLogin = () => setshowLogin(true);
const handleshowRegister= () => setshowRegister(true);

const handleLogin = () => {
    handleshowLogin();
};
const handleRegister = () => {
    handleshowRegister();
};
const handleClose = () => {
    setshowLogin(false);
    setshowRegister(false);
};

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
            <Button
                onClick={() => {
                    handleLogin();
                }}
                className="btn-login"
                style={{
                    border: "2px solid #613D2B",
                    color: "#613D2B",
                    backgroundColor:"#F5F5F5"
                }}
                >
                Login
            </Button>
            <Button
                onClick={() => {
                    handleRegister();
                }}
                className="btn-register"
                style={{
                    border: "none",
                    color: "#FFFFFF",
                    backgroundColor:"#613D2B",
                }}
            >
                Register
            </Button>
            </Form>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    <Login
        show={showLogin}
        handleClose={handleClose}
    />
    <Register
        show={showRegister}
        handleClose={handleClose}
    />
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
                                        <Card.Title 
                                        onClick={() => {
                                            handleLogin();
                                        }} 
                                        className="title-home">{item?.name}</Card.Title>
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
