import {useContext, useState} from "react";
import { Card, Form, Button, Modal, Alert } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom";
import {useMutation} from 'react-query'
import { UserContext } from '../../context/userContext'
import { API } from '../../config/api';
import Register from "./Register";
import Home from "../../pages/Home";

export default function Login({ show, handleClose}) {
    let navigate = useNavigate();

    const [state, dispatch] = useContext(UserContext);
    
    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
    email: '',
    password: '',
    });

    const { email, password } = form;

    const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
    };

    const handleSubmit = useMutation(async (e) => {
    try {
        e.preventDefault();

        const config = {
        headers: {
            'Content-type': 'application/json',
        },
        };
        const body = JSON.stringify(form);

        const response = await API.post('/login', body, config);

        console.log(response.data?.data?.data?.status === 'admin')
        console.log(response.data?.data?.user)
        localStorage.setItem("token", response.data?.data?.user?.token)
        if (response.data?.data?.user?.status === 'admin') {
            navigate('/home-admin');
        } else {
            navigate('/home-customer');
        }
        if (response?.data?.status === "success") {
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: response.data.data,
        });

        const alert = (
            <Alert variant="success" className="py-1">
            Login success
            </Alert>
        );
        setMessage(alert);
        }
    } catch (error) {
        const alert = (
        <Alert variant="danger" className="py-1">
            Login failed
        </Alert>
        );
        setMessage(alert);
        console.log(error);
    }
    });

    const [showRegister, setshowRegister] = useState(false);
    const [showLogin, setshowLogin] = useState(false);

    
    const handleshowLogin = () => {
        setshowLogin(true);
        setshowRegister(false);
    };
    const handleshowRegister = () => {
        setshowLogin(false);
        setshowRegister(true);
    };
    

    return (
        <Modal className="oke" show={show} onHide={handleClose} centered>
            <Modal.Body>
                <div className="login">
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <h3 className="login-name">Login</h3>
                        {message && message}
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Control 
                            value={email}
                            name="email"
                            onChange={handleChange}  
                            type="email" 
                            placeholder="Email" 
                            style={{background: "rgba(97, 61, 43, 0.25)"}} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Control 
                            value={password} 
                            name="password" 
                            onChange={handleChange} 
                            type="password" 
                            placeholder="Password"  
                            style={{background: "rgba(97, 61, 43, 0.25)"}} 
                            />
                        </Form.Group>
                        <button className="btn-login-home" type="submit">Login</button>
                        <p className="klik-home">
                            Don't have an account ? Click{" "}
                            <span style={{cursor:"pointer"}}
                                onClick={handleshowRegister}
                            ><b>Here</b></span>
                        </p>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
        
        
    )
}
