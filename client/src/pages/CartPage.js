import Layout from '../components/Layout/Layout'
import React, { useState, useEffect } from "react";
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";
import "../styles/cartStyle.css"
import { Button, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { AiFillDelete } from 'react-icons/ai';


function CartPage() {
    const [cart, setCart] = useCart();
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);
    const ButtonGroup = Button.Group;

    const increase = (productId) => {
        const updatedCart = cart.map((item) => {
            if (item._id === productId) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };


    const decline = (productId) => {
        const updatedCart = cart.map((item) => {
            if (item._id === productId) {
                const updatedQuantity = item.quantity - 1;
                if (updatedQuantity < 0) {
                    return item;
                }
                return {
                    ...item,
                    quantity: updatedQuantity
                };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    //total price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total += item.price * item.quantity;
            });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };

    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/braintree/token");
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getToken();
    }, [auth?.token]);

    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post("/api/v1/product/braintree/payment", { nonce, cart });
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            setTimeout(() => {
                toast.success("Payment Completed Successfully ");
            }, 1000)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleRemove = ()=>{
        localStorage.clear();
        setCart([])
        toast.success("Cart clear successfully!!")
    }

    return (
        <Layout>
            <div className=" cart-page">
                <div className="row bg-light p-2 mb-1 cartHeader">
                    <div className="col user">
                        <h1 className="text-center">
                            {!auth?.user
                                ? "Hello Guest"
                                : `Hello  ${auth?.token && auth?.user?.name}`}
                            <p className="text-center">
                                {cart?.length
                                    ? `You Have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout !"
                                    }`
                                    : " Your Cart Is Empty"}
                            </p>
                        </h1>
                    </div>
                    <div className="col clearCart">
                        <AiFillDelete style={{ width: "50px", height: "50px", display: "flex", justifyContent: "right" }} onClick={()=>handleRemove()} />
                    </div>
                </div>
                <div className="container ">
                    <div className="row ">
                        <div className="col-md-7  p-0 m-0">
                            {cart?.map((p) => (
                                <div className="row card flex-row" key={p._id}>
                                    <div className="col-md-4">
                                        <img
                                            src={`/api/v1/product/product-photo/${p._id}`}
                                            className="card-img-top"
                                            alt={p.name}
                                            width="100%"
                                            height={"165px"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <p style={{ fontWeight: "bold" }}>{p.name}</p>
                                        <p>{p.description.substring(0, 30)}...</p>
                                        <h5 className="card-title card-price">
                                            {p.price.toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            })}
                                        </h5>
                                        <Space size="small">
                                            <ButtonGroup>
                                                <Button onClick={() => decline(p._id)} icon={<MinusOutlined />} />
                                                <Button onClick={() => increase(p._id)} icon={<PlusOutlined />} />
                                                <Button >{p.quantity + count}</Button>
                                            </ButtonGroup>
                                        </Space>
                                    </div>
                                    <div className="col-md-4 cart-remove-btn">
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => removeCartItem(p._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-md-5 cart-summary ">
                            <h2>Cart Summary</h2>
                            <p>Total | Checkout | Payment</p>
                            <hr />
                            <h4>Total : {totalPrice()} </h4>
                            {auth?.user?.address ? (
                                <>
                                    <div className="mb-3">
                                        <h4>Current Address</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Address
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-3">
                                    {auth?.token ? (
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Address
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() =>
                                                navigate("/login", {
                                                    state: "/cart",
                                                })
                                            }
                                        >
                                            Plase Login to checkout
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="mt-2">
                                {!clientToken || !auth?.token || !cart?.length ? (
                                    ""
                                ) : (
                                    <>
                                        <DropIn
                                            options={{
                                                authorization: clientToken,
                                                paypal: {
                                                    flow: "vault",
                                                },
                                            }}
                                            onInstance={(instance) => setInstance(instance)}
                                        />

                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePayment}
                                            disabled={loading || !instance || !auth?.user?.address}
                                        >
                                            {loading ? "Processing ...." : "Make Payment"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage