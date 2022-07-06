import React, { useState, useEffect, useContext } from 'react';
import { Container, 
    Nav, 
    Navbar, 
    Form, 
    Row, 
    Col, 
    Dropdown, Button} from "react-bootstrap";
import logo from "../assets/img/logo.svg"
import { Link } from "react-router-dom";
import keranjang from "../assets/img/keranjang.svg"
import { UserContext } from '../context/userContext';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import convertRupiah from "rupiah-format";
import iconcomplain from "../assets/img/chat.svg"
import iconlogout from "../assets/img/logout.png"
import user from "../assets/img/user.svg"
import polygon from "../assets/img/Polygon.svg"



export default function DetailProduct() {
const title = "Detail Product";
document.title = "WaysBeans | " + title;

let { id } = useParams();
        
let navigate = useNavigate();

const [state, dispatch] = useContext(UserContext);
const [carts, setCarts] = useState([]);

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
console.log(product?.id)
const [form, setForm] = useState({
    idUser: '',
    idProduct: '',
}); 

const handleAdd = useMutation(async (e) => {
    try {
        console.log(product.id)
    e.preventDefault();
    const config = {
        method:'POST',
        headers: {
        'Content-type': 'application/json',
        },
    };
    console.log(form)
    const formData = new FormData();
    formData.set('idUser', state.user?.user?.id);
    formData.set('idProduct', product.id);

    const response = await API.post('/cart', {idUser:state.user?.user?.id,idProduct:product.id},config);
    getCarts()
    console.log(response)

    } catch (error) {
    console.log(error);
    }
});

const getCarts = async (e) => {
    try {

      // API get cart
      const response = await API.get('/cart/'+id);

      // response
      setCarts(response.data.data);

    } catch (error) {
      console.log(error);
    }
};
useEffect(()=>{
    getCarts()
},[])

    const {data:profile}=useQuery("profileChance",async()=>{
    const response = await API.get('/profile/'+ state?.user?.user?.id)
    console.log(response)
    return response.data.data.user.data
    })

return (
    <div>
    <Navbar className="navbar-home">
        <Container fluid>
        <Link to="/home-customer" className="text-decoration-none"><img className="img-logo" src={logo}/></Link>
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
                    navigate("/cart");
                }}
                className="btn-keranjang"
                >
                {carts?.length < 1 ? (
                    <img className="img-home-admin1" src={keranjang} alt="cart icon" />
                ) : (
                    <>
                    <div className="cartStock">{carts?.length}</div>
                    <img src={keranjang} alt="cart icon" />
                    </>
                )}
                </Button>
                <Dropdown>
                    <Dropdown.Toggle 
                        style={{
                            marginLeft:"36px",
                            marginRight:"100px",
                        }}
                        variant="">
                        <img src={profile?.image} alt="profile" style={{
                            width:"60px",
                            height:"60px"
                        }} 
                        className='rounded-circle'/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu  style={{width:"200px"}}>
                        <Dropdown.Item className="dropdown-text">
                                <img src={polygon} className="icon-poli" alt="profile icon" />
                                <img src={user} className="icon-complain" alt="profile icon" />
                                <Link to="/profile" className="text-decoration-none text-black">Profile</Link>
                        </Dropdown.Item>
                        <hr />
                        <Dropdown.Item className="dropdown-text">
                            <img src={iconcomplain} className="icon-complain" alt="complain icon" />
                            Complain
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
            <form className='d-flex' onSubmit={(e) => handleAdd.mutate(e, product?.id)}>

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
                <button className='btn-detail-product' type="submit">Add Cart</button>
                </div>
            </Col>
        </form>
        </Row>
    </Container>
    </div>
);
}
