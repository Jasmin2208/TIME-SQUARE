import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from "axios";
import { toast } from "react-hot-toast";
import "../styles/categoryProductStyle.css";
import Loader from "./Loader";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from 'react-icons/ai';
import { useCart } from "../context/cart";


const WishListPage = () => {
  const [products, setProducts] = useState([]);
  const [auth, setAuth] = useAuth();
  const [spinner, setSpinner] = useState(false);
  const [cart, setCart] = useCart()
  const navigate = useNavigate();

  const getProduct = async () => {
    if (auth.user) {
      const user = auth.user.id;
      const { data } = await axios.get(`/api/v1/product/get-wish-list/${user}`);
      setProducts(data.products)
    }
  };

  useEffect(() => {
    getProduct();
  }, [auth.user]); // Add auth.user as a dependency to re-fetch products when user changes

  const handleRemove = async (id) => {
    setSpinner(true)
    if (auth.user) {
      const user = auth.user.id;
      const { data } = await axios.put(`/api/v1/product/delete-wish-list/${user}`, { product: id });
      getProduct()
      setSpinner(false)
    }
  }

  const handleAllRemove = async () => {
    setSpinner(true)
    if (auth.user) {
      const user = auth.user.id;
      const { data } = await axios.put(`/api/v1/product/delete-wish-list/${user}`);
      getProduct()
      setSpinner(false)
    }
  }

  const handleAddToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      const updatedCart = cart.map((item) => {
        if (item._id === product._id) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }
        return item;
      });

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success("Quantity updated in cart");
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      localStorage.setItem("cart", JSON.stringify([...cart, { ...product, quantity: 1 }]));
      toast.success("Item added to cart");
    }
  };


  return (
    <Layout>
      <div className="mt-3 category" style={{ marginLeft: "10rem" }}>
        {spinner && <Loader />}
        {!spinner && (
          <>
            <div className='row' style={{ marginLeft: "35rem" }}>
              <div className='col'>
                <h4 className="text-center">Wish List Product</h4>
                <h6 className="text-center">{products?.length} result found </h6>
              </div>
              <div className='col' style={{ marginLeft: "25rem" }}>
                <AiFillDelete style={{ width: "50px", height: "50px" }} onClick={() => handleAllRemove()} />
              </div>
            </div>
            <div className="col-md-12 container offset-1">
              <div className="d-flex flex-wrap">
                {products?.map((p) => (
                  <div className="card m-3" key={p._id} style={{ height: "530px" }}>
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
                      <p className="card-text">
                        {p.description && p.description.length > 60 ? `${p.description.substring(0, 60)}...` : p.description}
                      </p>
                      <div className="card-name-price" style={{ position: "absolute", bottom: "55px", height: "35px", width: "250px" }}>
                        <button
                          className="btn btn-info ms-1"
                          // style={{   : "absolute", bottom: "9px", width: "250px" }}
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                        <button
                          className="btn btn-danger ms-1"
                          onClick={() => handleRemove(p._id)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="card-name-price" style={{ position: "absolute", bottom: "9px", height: "35px", width: "250px" }}>
                        <button
                          className="btn btn-dark ms-1"
                          id="addbtn"
                          onClick={() => handleAddToCart(p)}
                        >
                          ADD TO CART
                        </button>
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
          </>
        )}
      </div>
    </Layout>
  )
}

export default WishListPage;