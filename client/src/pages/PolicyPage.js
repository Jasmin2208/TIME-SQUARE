import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
    return (
        <Layout title={"Privacy Policy"}>
            <div className="row contactus ">
                <div className="col-md-6 ">
                    <img
                        src="/images/policy1.jpg"
                        alt="contactus"
                        style={{ width: "900px", height:"600px" }}
                    />
                </div>
                <div className="col-md-4 policy" style={{ textAlign: "justify", fontSize: "18px" }}>
                    <h1 className="bg-dark p-2 text-white text-center">PRIVACY AND POLICY</h1>
                    <p> Clear rules for website usage, including disclaimers, intellectual property rights, liability limits, and user obligations.</p>
                    <p> Policy on refunds, returns, exchanges, and cancellations. States eligibility, time limits, and fees or conditions.</p>
                    <p> Describes shipping process, delivery times, methods, costs, tracking, and responsibility for lost or damaged packages.</p>
                    <p> Accepted payment methods, secure gateways, encryption, and fraud prevention measures.</p>
                    <p> Guidelines on copyright, trademarks, and user-generated content.</p>
                </div>
            </div>
        </Layout>
    );
};

export default Policy;