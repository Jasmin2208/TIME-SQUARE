import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
    return (
        <Layout title={"Privacy Policy"}>
            <div className="row contactus ">
                <div className="col-md-6 ">
                    <img
                        src="/images/contactus.jpeg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-4" style={{ textAlign: "justify", fontSize: "18px" }}>
                    <p>1. Clear rules for website usage, including disclaimers, intellectual property rights, liability limits, and user obligations.</p>
                    <p>2. Guidelines for collecting, storing, and using personal information, with compliance to data protection laws. Includes details on cookies, analytics, and data security.</p>
                    <p>3. Policy on refunds, returns, exchanges, and cancellations. States eligibility, time limits, and fees or conditions.</p>
                    <p>4. Describes shipping process, delivery times, methods, costs, tracking, and responsibility for lost or damaged packages.</p>
                    <p>5. Accepted payment methods, secure gateways, encryption, and fraud prevention measures.</p>
                    <p>6. Accurate and detailed product or service descriptions, including specifications, materials, limitations, and any warranties.</p>
                    <p>7. Guidelines on copyright, trademarks, and user-generated content.</p>
                </div>
            </div>
        </Layout>   
    );
};

export default Policy;