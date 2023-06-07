import React from 'react'
import Header from './Header';
import Footer from './Footer';
import { Helmet } from "react-helmet";
import { Toaster } from 'react-hot-toast';

function Layout({ children, description, keywords, author, title }) {
    return (
        <div>
            <Helmet>
                <meta charset="UTF-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            <Header />
            <main style={{ minHeight: "80.7vh" }}>
                <Toaster />
                {children}
            </main>
            <Footer />
        </div>
    );
};

Layout.defaultProps = {
    title: "TIME-SQARE",
    description: "MERN-STACk PROJECT",
    keywords: "mern, react, node, mongoDB",
    author: "Jasmin Korat"
}
export default Layout