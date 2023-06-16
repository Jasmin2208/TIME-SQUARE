import React, { useState, useEffect } from "react";
import Layout from '../../components/Layout/Layout'
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import { Select } from "antd";
import { useAuth } from '../../context/auth';
import AdminMenu from '../../components/Layout/AdminMenu';
const { Option } = Select;


const AdminOrders = () => {

    const [status, setStatus] = useState([
        "Not Process",
        "Processing",
        "Shipped",
        "deliverd",
        "cancel",
    ]);
    const [changeStatus, setCHangeStatus] = useState("");
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();
    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/v1/auth/all-orders");
            setOrders(data.formattedOrders);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, { status: value });
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout title={"All Orders Data"}>
            <div className="container-fluid m-3 p-3 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <div className="container">
                        <h3>All Orders</h3>
                        {orders?.map((o, i) => {
                            return (
                                <div className="border shadow mb-5">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Buyer</th>
                                                <th scope="col"> date</th>
                                                <th scope="col">Payment</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Total Amount</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{i + 1}</td>
                                                <td>
                                                    <Select
                                                        bordered={false}
                                                        onChange={(value) => handleChange(o._id, value)}
                                                        defaultValue={o?.status}
                                                    >
                                                        {status.map((s, i) => (
                                                            <Option key={i} value={s}>
                                                                {s}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>{o?.buyer?.name}</td>
                                                <td>{moment(o?.createAt).fromNow()}</td>
                                                <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                <td>{o?.products?.length}</td>
                                                <td style={{ color: "green", fontWeight:"bold"}}>$ {o?.payment.transaction.amount}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="container">
                                        {o?.products?.map((p, i) => (
                                            <div className="row mb-2 p-3 card flex-row" key={p._id}>
                                                <div className="col-md-3">
                                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ width: "300px", height: "200px" }} />
                                                </div>
                                                <div className="col-md-8">
                                                    <p>{p.name}</p>
                                                    <p>{p.description.substring(0, 30)}...</p>
                                                    <p>Quantity :{p.quantity}</p>
                                                    <p style={{ color: "green", fontWeight: "bold" }}>{p.price.toLocaleString("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    })}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default AdminOrders