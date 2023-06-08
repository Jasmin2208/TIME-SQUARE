import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
    return (
        <Layout title={"About us - JK Collection"}>
            <div className="row contactus ">
                <div className="col-md-6 ">
                    {/* <img
                        src="/images/about.jpeg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    /> */}
                    <div id="carouselExampleCaptions" className="carousel slide" data-bs-interval="1000">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" />
                            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2" />
                            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3" />
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="/images/1.webp" className="d-block w-100" alt="..." style={{ width: "700px", height: "600px" }} />
                            </div>
                            <div className="carousel-item">
                                <img src="/images/2.webp" className="d-block w-100" alt="..." style={{ width: "700px", height: "600px" }} />
                            </div>
                            <div className="carousel-item">
                                <img src="/images/3.webp" className="d-block w-100" alt="..." style={{ width: "700px", height: "600px" }} />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true" />
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true" />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>

                </div>
                <div className="about col-md-4">
                <h1 className="bg-dark p-2 text-white text-center">ABOUT US</h1>
                    <h1 className="text-center about-title mt-3 mb-0">Welcome to <strong>TIME-SQARE </strong></h1>
                    <h3 className="text-center about-title-line mt-0">Your Ultimate Watch Destination!</h3>
                    <p className="text-justify about mt-4" style={{ textAlign: "justify", fontSize: "19px" }}>
                        At <strong>TIME-SQARE</strong>, we believe that time is the most precious commodity, and that is why we are dedicated to providing you with an exceptional watch shopping experience. Our mission is to help you find the perfect timepiece that reflects your style, enhances your everyday life, and becomes a treasured companion on your journey through time.
                    </p>
                    <p className="text-justify about mt-2" style={{ textAlign: "justify", fontSize: "19px" }}>
                        We curate a diverse collection of watches, ranging from classic and elegant designs to modern and cutting-edge timepieces. We collaborate with renowned watchmakers from around the world to offer you a wide range of options, ensuring that you can find the watch that suits your preferences.</p>
                    <p className="text-center about-line">TIME SQARE - Where Time Finds Its Perfect Square.</p>
                </div>
            </div>
        </Layout>
    );
};

export default About;
