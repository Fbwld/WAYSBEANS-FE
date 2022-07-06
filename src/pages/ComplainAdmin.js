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
import Triangle from "../assets/img/triangle-icon.png";
import user from "../assets/img/user.svg"
import { UserContext } from '../context/userContext';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import {io} from 'socket.io-client'
import Contact from '../components/complain/Contact'
import Chat from '../components/complain/Chat'
import polygon from "../assets/img/Polygon.svg"


// initial variable outside socket
let socket
export default function ComplainAdmin() {
    const title = "Complain admin"
    document.title = 'WaysBeans | ' + title

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    // create messages state
    const [messages, setMessages] = useState([])


    const [state] = useContext(UserContext)

    useEffect(() =>{
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem('token')
            },
            query: {
                id: state.user.id
            }
        })

        socket.on("new message", () => {
            console.log("contact", contact)
            socket.emit("load messages", contact?.id)
        })

        loadContacts()
        loadMessages()

        return () => {
            socket.disconnect()
        }
    }, [messages])

    const loadContacts = () => {
        socket.emit("load customer contacts")
        socket.on("customer contacts", (data) => {
            let dataContacts = data.filter(item => (item.status !== "admin") && (item.recipientMessage.length > 0 || item.senderMessage.length > 0))
            
            dataContacts = dataContacts.map((item) => ({
                ...item,
                message: item.senderMessage.length > 0 ? item.senderMessage[item.senderMessage.length -1].message : "Click here to start message"
            }))
            setContacts(dataContacts)
        })
    }

    const onClickContact = (data) => {
        setContact(data)
        socket.emit("load messages", data.id)
    }

    const loadMessages = (value) => {
        socket.on("messages", (data) => {
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message,
                }))
                setMessages(dataMessages)
            }
            loadContacts()
            const chatMessagesElm = document.getElementById("chat-messages");
            chatMessagesElm.scrollTop = chatMessagesElm?.scrollHeight;
        })
    }

    const onSendMessage = (e) => {
        // listen only enter key event press
        if(e.key === 'Enter') {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }

            //emit event send message
            socket.emit("send message", data)
            e.target.value = ""
        }
    }
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
                            overflow:"hidden",
                            borderRadius:"360px"
                        }}
                        variant="">
                        <img src={profile} alt="profile" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{width:"200px"}}>
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
            <Container fluid style={{height: '65vh'}}>
                <Row>
                    <Col md={3} style={{height: '65vh',marginTop:"83px"}} className="">
                        <Contact dataContact={contacts}  clickContact={onClickContact} contact={contact} />
                    </Col>
                    
                    <Col md={9} style={{
                    background:"#DFDFDF",
                    width:"803px",
                    height:"460px",
                    borderRadius:"10px",
                    marginTop:"92px",
                    padding:"5px",
                    marginLeft:"150px"}} className="px-0">
                        <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
