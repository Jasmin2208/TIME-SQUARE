import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FcShop } from 'react-icons/fc';
import { useAuth } from '../../context/auth';
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useSearch } from '../../context/search';
import { useNavigate } from "react-router-dom";
import useCategory from '../../hooks/useCategory';
import { useCart } from '../../context/cart';
import { Badge, Avatar, Space } from 'antd';
import { AiFillHeart } from 'react-icons/ai';

function Header() {

    const [auth, setAuth] = useAuth()
    const [cart, setCart] = useCart()
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const categories = useCategory();
    const [show, setShow] = useState(true);

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ""
        })

        localStorage.removeItem("auth")
        setTimeout(() => {
            toast.success("Logout Successfully !!")
        }, 1000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.get(`/api/v1/product/search/${values.keyword}`);
            console.log('data-->', data);
            setValues({ ...values, results: data });
            navigate("/search");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark ">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src='/images/logo1.png' style={{ height: "45px" }} /> TIME SQARE </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" to={"/categories"} data-bs-toggle="dropdown"> Categories </Link>
                                <ul className="dropdown-menu">
                                    <li> <Link className="dropdown-item" to={"/categories"}> All Categories </Link> </li>
                                    {categories?.map((c) => (
                                        <li key={c._id}>  <Link className="dropdown-item" to={`/category/${c.slug}`}> {c.name} </Link> </li>
                                    ))}
                                </ul>
                            </li>
                            {
                                !auth.user ? (
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/register">Sign Up</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/login">Login</NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item dropdown">
                                            <NavLink className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" style={{ border: "none" }}> {auth?.user?.name} </NavLink>
                                            <ul className="dropdown-menu">
                                                <li> <NavLink to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`} className="dropdown-item" >Dashboard </NavLink></li>
                                                <li><NavLink onClick={handleLogout} to="/login" className="dropdown-item" > Logout </NavLink> </li>
                                            </ul>
                                        </li>
                                    </>
                                )
                            }

                            <li className="nav-item">
                                <Space>
                                    <NavLink className="nav-link" to="/cart">Cart <Badge count={cart?.length} /></NavLink>
                                </Space>
                            </li>
                            <li className="nav-item">
                                <Space>
                                    <NavLink className="nav-link" to="/wishList"><AiFillHeart size={30} style={{color:"red"}} /></NavLink>
                                </Space>
                            </li>
                        </ul>
                        <form className="d-flex" role="search" onSubmit={handleSubmit}>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={values.keyword} onChange={(e) => setValues({ ...values, keyword: e.target.value })} />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>

        </>
    )
}

export default Header