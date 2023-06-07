import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
    return (
        <Layout title={"About us - JK Collection"}>
            <div className="row contactus ">
                <div className="col-md-6 ">
                    <img
                        src="/images/about.jpeg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="about col-md-4">
                    <p className="text-justify mt-2" style={{ textAlign: "justify", fontSize:"19px"}}>
                        At <strong>JK COLLECTION</strong> , we believe that shopping should be an enjoyable and convenient experience for everyone. We strive to provide you with a seamless online platform where you can discover a wide range of high-quality products and enjoy exceptional customer service.
                    </p>
                    <p className="text-justify mt-2" style={{ textAlign: "justify", fontSize:"19px" }}>
                        Our vision is to become your go-to destination for all your shopping needs. We aim to create an online marketplace that offers an extensive selection of products, from everyday essentials to unique and specialized items. We want to be the platform that connects you with reliable sellers and helps you find exactly what you're looking for.
                    </p>
                    <p className="text-justify mt-2" style={{ textAlign: "justify",fontSize:"19px" }}>
                        We understand the importance of quality and authenticity when it comes to online shopping. That's why we work diligently to partner with trusted sellers and brands who share our commitment to delivering genuine and superior products. We carefully curate our collection to ensure that each item meets our strict quality standards, providing you with a satisfying shopping experience every time.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default About;
