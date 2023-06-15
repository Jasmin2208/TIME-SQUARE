import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from "axios";
import { toast } from "react-hot-toast";
import "../styles/categoryProductStyle.css";
import Loader from "./Loader";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { AiFillDelete } from 'react-icons/ai';


const WishListPage = () => {
  const [products, setProducts] = useState([]);
  const [auth, setAuth] = useAuth();
  const [spinner, setSpinner] = useState(false);
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


  return (
    <Layout>
      <div className="mt-3 category">
        {spinner && <Loader />}
        {!spinner && (
          <>
            <div className='row'>
              <div className='col-md-10'>
                <h4 className="text-center">Wish List Product</h4>
                <h6 className="text-center">{products?.length} result found </h6>
              </div>
              <div className='col-md-2'>
                <AiFillDelete style={{ width: "50px", height: "50px" }} onClick={() => handleAllRemove()} />
              </div>
            </div>
            <div className="col-md-12  offset-1">
              <div className="d-flex flex-wrap">
                {products?.map((p) => (
                  <div className="card m-3" key={p._id} style={{ height: "470px" }}>
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
                      <div className="card-name-price" style={{ position: "absolute", bottom: "9px", height: "35px", width: "250px" }}>
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