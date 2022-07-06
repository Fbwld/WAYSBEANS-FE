import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Navbar,Nav, Form, NavDropdown, Dropdown} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useQuery, useMutation } from 'react-query';
import coffee from "../assets/img/coffee.png"
import DeleteData from "../components/Modal/DeleteData";
import { API } from '../config/api';
import { Link } from 'react-router-dom';
import convertRupiah from "rupiah-format";
import keranjang from "../assets/img/keranjang.svg"
import profile from "../assets/img/profile.png"
import iconcoffee from "../assets/img/kopiicon.svg"
import iconcomplain from "../assets/img/chat.svg"
import iconlogout from "../assets/img/logout.png"
import logo from "../assets/img/logo.svg"
import polygon from "../assets/img/Polygon.svg"

export default function ProductAdmin() {
const title = 'Product admin';
document.title = 'WaysBeans | ' + title;

let navigate = useNavigate();

const [idDelete, setIdDelete] = useState(null);
const [confirmDelete, setConfirmDelete] = useState(null);

const [show, setShow] = useState(false);
const handleClose = () => setShow(false);
const handleShow = () => setShow(true);

let { data: products, refetch } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data.user.data;
});
const addProduct = () => {
    navigate('/add-product');
};

const handleUpdate = (id) => {
    navigate('/edit-product/' + id);
};

const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
};

const deleteById = useMutation(async (id) => {
    try {
    await API.delete(`/product/${id}`);
    refetch();
    } catch (error) {
    console.log(error);
    }
});

useEffect(() => {
    if (confirmDelete) {
    handleClose();
    deleteById.mutate(idDelete);
    setConfirmDelete(null);
    }
}, [confirmDelete]);


return (
    <>
    <Navbar className="navbar-home">
        <Container fluid>
        <Link to="/home-admin" className="text-decoration-none"><img className="img-logo" src={logo}/></Link>
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
    <Container className="py-5" style={{height:"87vh"}}>
        <Row>
        <Col xs="6">
            <div className="text-header-category mb-4 text-white">List Product</div>
        </Col>
        <Col xs="6" className="text-end">
            <Button
                onClick={addProduct}
                className="btn-add"
                style={{ width: '100px' ,
                background:"#DBB699",
                border:"none",
                color:'black'
                }}
                >
                <b>Add</b>
            </Button>
        </Col>
        <Col xs="12">
            {products?.length !== 0 ? (
            <Table striped hover size="lg" style={{background:"#DBB699"}}>
                <thead>
                <tr className="text-center">
                    <th width="1%" className="text-center">
                    No
                    </th>
                    <th>Photo</th>
                    <th>Product Name</th>
                    <th>Product Desc</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {products?.map((item, index) => (
                    <tr key={index}>
                    <td width="3%" className="align-middle text-center">{index + 1}</td>
                    <td width="8%" className="align-middle">
                        <img
                        src={"http://localhost:5000/uploads/" + item.image}
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                        }}
                        />
                    </td>
                    <td width="10%"className="align-middle">
                        {item?.name}
                    </td>
                    <td width="40%"className="align-middle" style={{textAlign:"justify"}}>
                        {item?.desc}
                    </td>
                    <td width="10%" className="align-middle">
                    {convertRupiah.convert(item?.price)}
                    </td>
                    <td width="5%" className="align-middle">{item?.stock}</td>
                    <td width="24%"className="align-middle">
                        <Button
                        onClick={() => {
                            handleUpdate(item?.id);
                        }}
                        className="btn-sm btn-success me-2"
                        style={{ width: '135px' }}
                        >
                        Edit
                        </Button>
                        <Button
                        onClick={() => {
                            handleDelete(item?.id);
                        }}
                        className="btn-sm btn-danger"
                        style={{ width: '135px' }}
                        >
                        Delete
                        </Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            ) : (
            <div className="text-center pt-5">
                <img
                src={coffee}
                className="img-fluid"
                style={{ width: '40%' }}
                alt="empty"
                />
                <div className="mt-3">No data product</div>
            </div>
            )}
        </Col>
        </Row>
    </Container>
    <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
    />
    </>
)
}
