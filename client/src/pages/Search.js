import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import "../styles/homePageStyle.css"
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";


const Search = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate()
    const [cart, setCart] = useCart()

    return (
        <Layout title={"Search results"}>
            <div className="container home-page">
                <div>
                    <h1 className="text-center">Search Resuts</h1>
                    <h6 className="text-center">{values?.results.length < 1 ? "No Products Found" : `Found ${values?.results.length}`} </h6>
                    <div className="d-flex flex-wrap mt-4">
                        {values?.results.map((p) => (
                            <div className="card m-2" key={p._id} style={{ height: "470px" }}>
                                <img
                                    src={`/api/v1/product/product-photo/${p._id}`}
                                    className="card-img-top"
                                    alt={p.name}
                                />
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
                </div>
            </div>
        </Layout>
    );
};

export default Search;