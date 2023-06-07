import React, { useState, useEffect } from "react";
import Layout from '../components/Layout/Layout'
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/categoryProductStyle.css"


function CategoryProduct() {

    const params = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    console.log("products-->", products)

    useEffect(() => {
        if (params?.slug) getProductByCategory();
    }, [params?.slug]);

    const getProductByCategory = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);

            setProducts(data?.product);
            setCategory(data?.category);
        } catch (error) {
            console.log(error.message)
            toast.error("Something went wrong in Get Category Wise Product")
        }
    }

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
            <Layout>
                <div className="container mt-3 category">
                    <h4 className="text-center">Category - {category?.name}</h4>
                    <h6 className="text-center">{products?.length} result found </h6>
                    <div className="row">
                        <div className="col-md-9 offset-1">
                            <div className="d-flex flex-wrap">
                                {products?.map((p) => (
                                    <div className="card m-2" key={p._id} style={{height:"470px"}}>
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
                                            <div className="card-name-price">
                                                <button
                                                    className="btn btn-info ms-1"
                                                    style={{position:"absolute", bottom:"9px", width:"250px"}}
                                                    onClick={() => navigate(`/product/${p.slug}`)}
                                                >
                                                    More Details
                                                </button>
                                                {/* <button
                    className="btn btn-dark ms-1"
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
                  </button> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div> */}
                        </div>
                    </div>
                </div>
            </Layout>
            )
}

            export default CategoryProduct