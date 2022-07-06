import React, { useState, useEffect, useContext } from 'react';
import { Container, 
    Nav, 
    Navbar, 
    Form, 
    Row, 
    Col, 
    Button,
Dropdown} from "react-bootstrap";
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
import { useQuery, useMutation } from 'react-query';
import user from "../assets/img/user.svg"
import profileimg from "../assets/img/profile.png"
import polygon from "../assets/img/Polygon.svg"


export default function EditProfile(){
        const title = 'Profile';
        document.title = 'WaysBeans | ' + title;

        let navigate = useNavigate();
        const { id } = useParams();
    
        const [state, dispatch] = useContext(UserContext);
        const [preview, setPreview] = useState(null); 
        const [profile, setProfile] = useState({}); 
    
        const [form, setForm] = useState({
        image: '',
        phone: '',
        gender: '',
        address: '',
        });
    
        // Create function get product data by id from database here ...
        let { data: profiles, refetch } = useQuery('profileCache', async () => {
        const response = await API.get('/profile/' + id);
        console.log(response)
        return response.data?.data?.user?.data;
        
        });

        useEffect(() => {
        if (profiles) {
            setPreview(profiles.image);
            setForm({
            ...form,
            phone: profiles.phone,
            gender: profiles.gender,
            address: profiles.address,
            });
            setProfile(profiles);
        }
        }, [profiles]);
        
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
        
                // Configuration
                const config = {
                method:"PATCH",
                headers:{
                    Authorization:"Basic " + localStorage.token,
                    'Content-type':'multipart/form-data'
                },
                };
                
                const formData = new FormData();
                if (typeof form.image[0]==='object') {
                formData.set('image', form?.image[0], form?.image[0]?.name);
                }else{
                    formData.set("image",form.image)
                }
                formData.set('phone', form.phone);
                formData.set('gender', form.gender);
                formData.set('address', form.address);
                formData.set('idUser', state.user.id);
                
                // Insert product data
                const response = await API.patch(
                '/profile/' + profile.id,
                formData,
                config
                );
                
                navigate('/profile');
            } catch (error) {
                console.log(error);
            }
            });
                console.log(form)
        

    return(
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
                <Link to="/" className='text-decoration-none'>
                    <img className="img-home-admin1" 
                    src={keranjang}
                    />
                </Link>
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
        <Container className="py-5" style={{height:"88vh"}}>
            <Row>
                <Col className='d-flex'>
                <Col style={{marginRight:"92px"}}>
                    <Col xs="12">
                        <div className="text-header-profile">Edit Profile</div>
                    </Col>
                    <Col xs="7">
                        <form form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Group className="input-editC text-white" controlId="formGroupName">
                            <Form.Control 
                            type="text"  
                            placeholder="Phone"
                            value={form?.phone}
                            name="phone"
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
                            placeholder="Gender"
                            value={form?.gender}
                            name="gender"
                            onChange={handleChange}
                            style={{
                                background:" rgba(210, 210, 210, 0.25)",
                                color: "#613D2B",
                                width: "472px",
                                height: "50px",
                                marginTop:"20px",
                                borderRadius: "5px",
                                background: "rgba(97, 61, 43, 0.25)",
                                border: "2px solid #613D2B",
                            }} 
                            />
                            <Form.Control 
                            className="text-area-product" 
                            as="textarea" 
                            placeholder="Address"
                            value={form?.address}
                            name="address"
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
                                className='input-upload'
                                type="file"
                                id="upload"
                                name="image"
                                placeholder="Photo Profile"
                                onChange={handleChange}
                                style ={{
                                    width: "190px",
                                    height: "50px",
                                    left: "309px",
                                    marginTop:"20px",
                                    background: "rgba(97, 61, 43, 0.25)",
                                    border: "2px solid #613D2B",
                                    borderRadius: "5px",
                                    marginBottom:"20px",

                                }}
                            />
                            <label for="upload" className="label-file-add-product text-black">
                                <img src={Thumbnail}/>
                            </label>
                            <div className="d-grid gap-2 mt-4">
                                <Button type="submit" className="btn-addproduct" style={{background: "#613D2B", border:"none"}}>
                                Edit Profile
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
        </div>
        </>
    )
}
