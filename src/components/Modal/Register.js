import {useState} from "react";
import { Card, Form, Button, Modal, Alert } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom";
import {useMutation} from 'react-query'
import { UserContext } from '../../context/userContext'
import { API } from '../../config/api';


export default function Register({ show, handleClose}) {
    let navigate = useNavigate();

    // const [state, dispatch] = useContext(UserContext);

    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    });

    const { name, email, password } = form;

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

        const response = await API.post('/register', body, config);
        navigate("/");
    //   Handling response here
        console.log(response)
        if (response.status == "200") {
        const alert = (
            <Alert variant="success" className="py-1">
            Success
            </Alert>
        );
        setMessage(alert);
        setForm({
            name: "",
            email: "",
            password: "",
        });
        } else {
        const alert = (
            <Alert variant="danger" className="py-1">
            Failed
            </Alert>
        );
        setMessage(alert);
        }
        
    } catch (error) {
        const alert = (
        <Alert variant="danger" className="py-1">
            Failed
        </Alert>
        );
        setMessage(alert);
        console.log(error);
    }
    });

    // const [showLogin, setshowLogin] = useState(false);
    
    // const handleshowLogin = () => setshowLogin(true);
    
    // const handleLogin = () => {
    //     handleshowLogin();
    // };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="text-dark">
                <div className="register">
                    <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <h3 className="login-name">Register</h3>
                        {message && message}
                        <Form.Group className="mb-3" controlId="formGroupName">
                            <Form.Control 
                            value={name} 
                            name="name" 
                            onChange={handleChange}
                            type="text" 
                            placeholder="Name"  
                            style={{background: "rgba(97, 61, 43, 0.25)"}}
                            />
                        </Form.Group>
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
                        <button className="btn-login-home" type="submit">Register</button>
                        <p className="klik-home">Don't have an account ? Klik 
                            <span> <b>Here</b></span>
                        </p>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}
