import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import axios from 'axios'
import "../../../src/index.css"

function Products() {
    const [products, setProducts] = useState([])

    const getAllProducts = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/get-product")
            setProducts(data.products)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])
    return (
        <Layout title={"Dashboard - All Products"}>
            <div className="container-fluid m-3 p-3 dashboard">
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h3> All Product List </h3>
                        <div className='d-flex flex-wrap'>
                            {products?.map(p => (
                                <Link to={`/dashboard/admin/product/${p.slug}`} key={p._id} className='product-link'>
                                    <div className="card m-2" style={{ width: "18rem", height: "27rem"}}>
                                        <div>
                                            <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} style={{ height: "300px" }} />
                                            <div className="card-body">
                                                <div className="card-name-price">
                                                    <h5 className="card-title">{p.name}</h5>
                                                    <h5 className="card-title card-price" style={{ color: "green" }}>
                                                        {p.price.toLocaleString("en-US", {
                                                            style: "currency",
                                                            currency: "USD",
                                                        })}
                                                    </h5>
                                                </div>
                                                <p className="card-text">{p.description.substring(0, 60)}...</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Products