import React, { useState, useEffect } from "react";
import Layout from '../components/Layout/Layout'
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { AiOutlineReload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import "../styles/homePageStyle.css"
import Loader from "./Loader";
import { AiFillHeart } from 'react-icons/ai';
import { useAuth } from "../context/auth";


function HomePage() {
    const [auth, setAuth] = useAuth()
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false);
    const [loadFilter, setLoadFilter] = useState(true)
    const [spinner, setSpinner] = useState(false)
    const [likedProduct, setLikedProducts] = useState([])
    const redHeartStyle = { color: 'red' }
    const whiteHeartStyle = { color: '#cd8484' }

    const navigate = useNavigate()
    const [cart, setCart] = useCart()

    //get All Products
    const getAllProducts = async () => {
        try {
            setLoadFilter(true)
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`)
            setLoading(false);
            setProducts(data.products)
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, [])

    //Get All category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category)
                setName("")
            }
        } catch (error) {
            console.log(error)
            toast.error("Someting Went Wrong")
        }
    }

    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();
    }, [checked.length, radio.length]);


    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio]);


    //Category Filter
    const handleFilter = (value, id) => {
        let all = [...checked];
        if (value) {
            all.push(id)
        } else {
            all = all.filter((c) => c !== id)
        }
        setChecked(all)
    }

    const handleWishList = async (pid) => {
        const user = auth.user.id

        if (likedProduct?.includes(pid)) {
            const { data } = await axios.put(`/api/v1/product/delete-wish-list/${user}`, { product: pid });
            toast.success("Produce Remove To Wise List Successfully !!!")

        } else {
            const { data } = await axios.post(`/api/v1/product/wish-list`, { user, product: pid });
            toast.success("Produce Add To Wise List Successfully !!!")
        }

        makeLiked()
    }


    //Filter Products
    const filterProduct = async () => {
        try {
            setSpinner(true)
            const { data } = await axios.post("/api/v1/product/product-filter", { checked, radio });
            setLoadFilter(false)
            setProducts(data?.products)
            setSpinner(false)
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong in Filter The Products")
        }

    }


    //Total Count
    const getTotal = async (req, res) => {
        try {
            const { data } = await axios.get("/api/v1/product/product-count");
            setTotal(data?.total)
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in Count The Products")
        }
    }

    useEffect(() => {
        makeLiked()
        console.log("like-->", likedProduct);
    }, [auth.user, likedProduct.length])

    const makeLiked = async () => {
        try {
            const id = auth.user.id
            const { data } = await axios.get(`/api/v1/product/makewish-list/${id}`);
            setLikedProducts(data?.product);
        } catch (error) {
            setSpinner(false)
            console.log(error);
        }
    }

    //product-list load-more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore()
    }, [page])

    return (
        <Layout title={"All Products - Best offers "}>
            {/* banner image */}
            <img
                src="/images/banner2.png"
                className="banner-img"
                alt="bannerimage"
                width={"100%"}

            />
            {/* banner image */}
            <div className="container-fluid row mt-3 home-page">
                <div className="col-md-3 filters">
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((c, index) => (
                            <div key={c._id}>
                                <Checkbox

                                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                                    style={{ marginLeft: index === 0 ? '0px' : '0', marginLeft: "12px", marginBottom: "3px", fontWeight: "bold" }}
                                >
                                    {c.name}
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                    {/* price filter */}
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div style={{ fontWeight: "bold", color: "green" }}>
                                    <Radio value={p.array} style={{ marginBottom: "3px" }} key={p._id}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column">
                        <button
                            className="btn btn-danger"
                            onClick={() => window.location.reload()}
                        >
                            RESET FILTERS
                        </button>
                    </div>
                </div>
                <div className="col-md-9 ">
                    <h1 className="text-center">All Products</h1>
                    {spinner &&
                        <Loader />
                    }{spinner === false &&
                        <>
                            <div className="d-flex flex-wrap">
                                {products?.map((p) => (
                                    <div className="card m-2" key={p._id} style={{ height: "470px" }}>
                                        <img
                                            src={`/api/v1/product/product-photo/${p._id}`}
                                            className="card-img-top"
                                            alt={p.name}
                                        />
                                        <div style={{ position: 'absolute', top: '8px', right: '0px' }}>
                                            <div className="stage">
                                                <div className="heart">
                                                    <AiFillHeart size={40} onClick={() => handleWishList(p._id)} style={likedProduct?.includes(p._id) ? redHeartStyle : whiteHeartStyle} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-name-price">
                                                <h5 className="card-title">{p.name}</h5>
                                                <h5 className="card-title card-price">
                                                    {p.price.toLocaleString("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    })}
                                                </h5>
                                            </div>
                                            <p className="card-text ">
                                                {p.description.substring(0, 60)}...
                                            </p>
                                            <div className="card-name-price" id="morebtn" style={{ position: "absolute", bottom: "9px", height: "35px", width: "250px" }}>
                                                <button
                                                    className="btn btn-info ms-1"
                                                    onClick={() => navigate(`/product/${p.slug}`)}
                                                >
                                                    More Details
                                                </button>
                                                <button
                                                    className="btn btn-dark ms-1"
                                                    id="addbtn"
                                                    onClick={() => {
                                                        setCart([...cart, p]);
                                                        localStorage.setItem(
                                                            "cart",
                                                            JSON.stringify([...cart, p])
                                                        );
                                                        toast.success("Item Added to cart");
                                                    }}
                                                >
                                                    ADD TO CART
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                            <div className="m-2 p-3">
                                {products && products.length < total && (
                                    <button
                                        className="btn loadmore"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(page + 1);
                                        }}
                                    >
                                        {loadFilter &&
                                            <>
                                                {loading ? (
                                                    "Loading ..."
                                                ) : (
                                                    <>
                                                        {" "}
                                                        Loadmore <AiOutlineReload />
                                                    </>
                                                )}
                                            </>
                                        }
                                    </button>
                                )}
                            </div>

                        </>
                    }
                </div>
            </div>
        </Layout>
    )
}

export default HomePage