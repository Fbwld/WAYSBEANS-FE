import { useContext, useEffect } from 'react';
import { UserContext } from './context/userContext';
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";

import Home from "./pages/Home";
import HomeAdmin from "./pages/HomeAdmin";
import Profile from "./pages/Profile";
import AddProduct from "./pages/AddProduct";
import DetailProduct from "./pages/DetailProduct";
import HomeCustomer from "./pages/HomeCustomer";
import ProductAdmin from "./pages/ProductAdmin"
import EditProduct from './pages/EditProduct';
import EditProfile from './pages/EditProfile';
import DetailProductAdmin from './pages/DetailProductAdmin';
import MyCart from './pages/Cart';
import Complain from './pages/Complain';
import ComplainAdmin from './pages/ComplainAdmin';

import { API, setAuthToken } from './config/api';

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    // Redirect Auth
    if (state.isLogin === false) {
      navigate('/');
    } else {
      if (state.user.status === 'admin') {
        navigate('/home-admin');
      } else if (state.user.status === 'customer') {
        navigate('/home-customer');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await API.get('/check-auth',config);

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      // Get user data
      let payload = response.data?.data?.user;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);

  return (
    <>
      <div className="App">
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/home-admin" element={<HomeAdmin/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/add-product" element={<AddProduct/>}/>
            <Route path="/detail-product/:id" element={<DetailProduct/>}/>
            <Route path="/home-customer" element={<HomeCustomer/>}/>
            <Route path="/product-admin" element={<ProductAdmin/>}/>
            <Route path="/edit-product/:id" element={<EditProduct/>}/>
            <Route path="/edit-profile/:id" element={<EditProfile/>}/>
            <Route path="/detail-product-admin/:id" element={<DetailProductAdmin/>}/>
            <Route path="/cart" element={<MyCart/>}/>
            <Route path="/complain" element={<Complain/>}/>
            <Route path="/complain-admin" element={<ComplainAdmin/>}/>
        </Routes>
      </div>
    </>

  );
}

export default App;
