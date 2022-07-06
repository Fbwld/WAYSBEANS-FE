import { useContext, useState, useEffect } from 'react';
import { Container, 
    Nav, 
    Navbar, 
    Form, 
    Row, 
    Card, 
    Col, 
    NavDropdown, 
    Dropdown,
    Image,
    Button} from "react-bootstrap";
import logo from "../assets/img/logo.svg"
import { Link } from "react-router-dom";
import keranjang from "../assets/img/keranjang.svg"
import imgprofile from "../assets/img/imgprofile.png"
import iconcomplain from "../assets/img/chat.svg"
import iconlogout from "../assets/img/logout.png"
import user from "../assets/img/user.svg"
import { UserContext } from '../context/userContext';
import { useParams, useNavigate } from 'react-router';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import profileimg from "../assets/img/profile.png"
import convertRupiah from "rupiah-format";
import Plus from "../assets/img/plus.svg";
import Minus  from "../assets/img/minus.svg";
import Delete from "../assets/img/delete.svg";
import DeleteData from "../components/Modal/DeleteData";


export default function MyCart() {
const title = "My Cart";
document.title = "WaysBeans | " + title;
let navigate = useNavigate();


const [state] = useContext(UserContext)
const [minusButton, setMinusButton] = useState(false);
const [plusButton, setPlusButton] = useState(false);
const [countValue, setCountValue] = useState(0);
const [carts, setCarts] = useState([]);
const [total,setTotal] = useState({
    qty: '',
    subtotal:'',
})

const handleIncrement = async (id,qty) =>{
    const data = {
        qty:qty +1
    }
    await API.patch('/cart/'+id,data)
    getCarts()
}


const handleDecrement = async (id,qty) => {
    if(qty>1){
        const data = {
            qty:qty - 1
        }
        await API.patch('/cart/'+id,data)
        getCarts()
    }
}

  // get cart
const getCarts = async (e) => {
    try {

      // API get cart
      const response = await API.get(`/carts`);

      // response
      setCarts(response.data.data);

      const totalqty = response.data.data.reduce(
        (sum, elem) => sum + elem.qty,
        0
      );

  const totalprice = response.data.data.reduce(
        (sum, elem) => sum + elem.qty * elem.product.price,
        0
      );

      setTotal({
        qty: totalqty,
        subtotal: totalprice,
      });

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

    let { id } = useParams();

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



    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "Client key here ...";
    
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
        }, []);
    
        const handleBuy = useMutation(async (e) => {
            try {
            const data = {
                idProduct:e.product.id,
                idSeller: state.user?.user?.id,
                price: e.total,
            };
    
            const body = JSON.stringify(data);
    
            const config = {
                method: "POST",
                headers: {
                Authorization: "Basic " + localStorage.token,
                "Content-type": "application/json",
                },
                body,
            };
    
            const response = await API.post("/transaction", config);
            console.log(response.data)
    
            const token = response.data?.payment?.token;

            window.snap.pay(token, {
                onSuccess: function (result) {
                console.log(result);
                navigate("/profile");
                },
                onPending: function (result) {
                console.log(result);
                navigate("/profile");
                },
                onError: function (result) {
                console.log(result);
                },
                onClose: function () {
                alert("you closed the popup without finishing the payment");
                },
            });
    
            } catch (error) {
            console.log(error);
            }
        });

        

        const [idDelete, setIdDelete] = useState(null);
        const [confirmDelete, setConfirmDelete] = useState(null);
        
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        
        const handleDelete = (id) => {
            setIdDelete(id);
            handleShow();
        };
        
        const deleteById = useMutation(async (id) => {
            try {
            await API.delete(`/cart/${id}`);
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
            refetch();
            }
        }, [confirmDelete]);

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
    <Container>
        {carts?.length>=1?(

        <Row className="mt-4">
            <Col className="col-md-8">
                <h1 className="titleHeaderCart mb-4">
                    My Cart
                </h1>
                <p className="paragrafHeaderCart">
                    Review Your Order
                </p>
                <hr style={{
                    background : "#613D2B"
                }}/>
                {carts.map((item)=>( 
                    <Row style={{marginBottom:"10px"}}>
                        <Col className="col-sm-2">
                            <Image
                                src={item.product.image}
                                style={{
                                    width: "80px",
                                    height: "80px",
                                }}
                            />
                        </Col>
                        <Col className="col-sm-7">
                                <p>{item.product.name}</p>
                                <div>
                                    <Image
                                    onMouseLeave={()=>setMinusButton(false)}
                                    onMouseEnter={()=>setMinusButton(true)} 
                                    onClick={()=>{
                                        handleDecrement(item.product.id,item.qty)
                                    }}
                                    src={Minus} 
                                    alt="minus"
                                    style={{
                                        cursor : "pointer",
                                        width : "16px",
                                        marginRight : "10px",
                                        opacity : minusButton ?  "0.6" : ""
                                    }}/>
                                    <span className="valueCart"> {item.qty} </span>
                                    <Image 
                                    onMouseLeave={()=>setPlusButton(false)}
                                    onMouseEnter={()=>setPlusButton(true)}
                                    onClick={()=>{
                                        handleIncrement(item.product.id,item.qty)
                                    }}
                                    src={Plus} 
                                    style={{
                                        cursor : "pointer",
                                        width : "16px",
                                        marginLeft : "10px",
                                        opacity : plusButton ?  "0.6" : ""
                                    }}
                                    alt="plus"/>
                                </div>
                        </Col>
                        <Col>   
                            <p className="cartPrice mt-2 text-end">{convertRupiah.convert(item.product.price)}</p>
                            <div style={{
                                display : "flex",
                                justifyContent : "flex-end"
                                }}>
                                <Button
                                style={{
                                    background:"white",
                                    border:"none"
                                }}
                                onClick={() => {
                                handleDelete(item.product.id);
                            }}
                                >
                                    <Image 
                                    src={Delete}
                                    style={{
                                        width : "16.67px",
                                        height : "20px"
                                    }}
                                />   
                                </Button>
                            </div>  
                        </Col>
                    </Row>
                ))}
                <hr style={{
                    background : "#613D2B"
                }}/>
            </Col>
            <Col>
            <div style={{
                width : "320px"
            }}>
                <hr style={{
                    background : "#000000",
                    borderTop : "2px solid black",
                    marginTop : "174px"
                }}/>
                <div className="d-flex justify-content-between">
                    <p className="cartPrice">Subtotal</p>
                    <p className="cartPrice">{convertRupiah.convert(total.subtotal)}</p>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="cartPrice">Qty</p>
                    <p className="cartPrice">{total.qty}</p>
                </div>
                <hr style={{
                    background : "#000000",
                    borderTop : "2px solid black",
                }}/>
                <div className="d-flex justify-content-between">
                    <p className="cartPriceTwo">Total</p>
                    <p className="cartPriceTwo">{convertRupiah.convert(total.subtotal)}</p>
                </div>
                <div className="d-flex justify-content-end mt-4">
                    <Button 
                    onClick={() => handleBuy.mutate({
                            product: carts[0]?.product,
                            total: total.subtotal
                        })}
                    style={{
                        width: "260px",
                        height:" 40px",
                        background: "#613D2B",
                        borderRadius: "5px",
                        border:"none"
                    }}id="buttonCartPay">
                        Pay
                    </Button>
                </div>
            </div>    
            </Col>
        </Row>
        ):(
            <h1>no data</h1>
        )}
        </Container>
        <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
    />
    </div>
    </>
    );
}
