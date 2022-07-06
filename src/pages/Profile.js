import { useContext, useState, useEffect } from 'react';
import { Container, 
    Nav, 
    Navbar, 
    Form, 
    Row, 
    Button, 
    Col, 
    Image, 
    Dropdown} from "react-bootstrap";
import logo from "../assets/img/logo.svg"
import { Link } from "react-router-dom";
import keranjang from "../assets/img/keranjang.svg"
import iconcomplain from "../assets/img/chat.svg"
import iconlogout from "../assets/img/logout.png"
import user from "../assets/img/user.svg"
import { UserContext } from '../context/userContext';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import editimg from "../assets/img/edit.png"
import polygon from "../assets/img/Polygon.svg"
import dateFormat from 'dateformat';
import barcode from "../assets/img/barcode.png"
import { useParams, useNavigate } from 'react-router';
import blank from "../assets/img/blank.png"

export default function Profile() {
const title = "Profile";
document.title = "WaysBeans | " + title;

const [state] = useContext(UserContext);

let navigate = useNavigate();

const {data:profile}=useQuery("profileChance",async()=>{
    const response = await API.get('/profile/'+ state?.user?.user?.id)
    console.log(response)
    return response.data.data.user.data
})

let { data: transactions, refetch: transactionsRefetch } = useQuery(
    "transactionsCache",
    async () => {
        const config = {
        method: "GET",
        headers: {
            Authorization: "Basic " + localStorage.token,
        },
    };
        const response = await API.get("/transactions", config);
        console.log(response)
        return response.data?.data?.user?.data;
    }
    );
    const {data:carts}=useQuery("cartChance",async()=>{
        const response = await API.get('/carts')
        console.log(response.data.data)
        return response.data.data
    })
return (
    <>
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
                    <Dropdown.Menu style={{width:"200px"}}>
                        <Dropdown.Item className="dropdown-text">
                                <img src={polygon} className="icon-poli" alt="profile icon" />
                                <img src={user} className="icon-complain" alt="profile icon" />
                                <Link to="/profile" className="text-decoration-none text-black">Profile</Link>
                        </Dropdown.Item>
                        <hr />
                        <Dropdown.Item className="dropdown-text">
                            <img src={iconcomplain} className="icon-complain" alt="complain icon" />
                            <Link to="/complain" className="text-decoration-none text-black">Complain</Link>
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
    <Container className="my-5">
        <Row>
            <Col md="6">
                <div className="text-header-profile mb-4">My Profile</div>
                <Row>
                <Col md="6">
                    <img
                    src={profile?.image}
                    className="img-fluid rounded"
                    alt="avatar"
                    />
                </Col>
                <Col md="6">
                <Link to={"/edit-profile/"+profile?.idUser}>
                    <img
                        src={editimg}
                        className="img-edit-profile"
                        style={{
                            width:"50px",
                            height:"50px",
                            float:"right"
                        }}
                        alt="avatar"
                    />
                </Link>
                <div className="profile-header">Full Name</div>
                <div className="profile-content">{state?.user?.user?.name}</div>

                <div className="profile-header">Email</div>
                <div className="profile-content">{state?.user?.user?.email}</div>

                <div className="profile-header">Phone</div>
                <div className="profile-content">
                    {profile?.phone ? profile?.phone : '-'}
                </div>
                <div className="profile-header">Gender</div>
                <div className="profile-content">
                    {profile?.gender ? profile?.gender : '-'}
                </div>

                <div className="profile-header">Address</div>
                <div className="profile-content">
                    {profile?.address ? profile?.address : '-'}
                </div>
            </Col>
        </Row>
        </Col>
                <Col md="6">
                    <div className="text-header-transaksi" >My Transaction</div>
                    {transactions?.length !== 0 ? (
                        <>
                        {transactions?.map((item, index) => (
                            <div
                            key={index}
                            style={{ 
                                background: "#F6E6DA", 
                                marginLeft:"70px",
                                width: "524px",
                                height: "145px",
                            
                            }}
                            className="p-2 mb-1"
                        >
                            <Container fluid className="px-1">
                            <Row>
                                <Col xs="3">
                                <img
                                    src={"http://localhost:5000/uploads/"+item?.products?.image}
                                    alt="img"
                                    className="img-fluid-trans"
                                    style={{
                                    objectFit: 'cover',
                                    }}
                                />
                                </Col>
                                <Col xs="6">
                                <div className="trans-name"> {item?.products?.name}</div>
                                <div className="date-trans mt-2">
                                    {dateFormat(item?.createdAt, 'dddd, d mmmm yyyy')}
                                </div>
                                <div className="trans-price mt-3">Price : {item?.price}</div>
                                <div className="trans-price mt-2">Qty : {item?.products?.stock}</div>
                                <div className="trans-sub mt-2">Sub Total : {item?.price}</div>
                                </Col>
                                <Col xs="3">
                                <div className="logo-profile-img">
                                    <img
                                    style={{
                                        width: "73px",
                                        height: "22px",
                                        marginRight:"33px"}}
                                    src={logo}/>
                                </div>
                                <Image src={barcode} 
                                style={{
                                    marginTop:"20px",
                                    marginLeft:"15px"
                                }}/>
                                <Col xs="3">
                                <div
                                    className={`status-transaction-${item.status} rounded`}
                                >
                                    {item?.status}
                                </div>
                                </Col>
                                </Col>
                            </Row>
                            </Container>
                        </div>
                        ))}
                    </>
                    ) : (
                    <div className="no-data-transaction">No transaction</div>
                    )}
                </Col>
                </Row>
            </Container>
    </div>
    </>
    );
}
