import React, { useState } from 'react'
import Layout from '../../components/Layout/Layout'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/authStyle.css'

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [question, setQuestion] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/register', { name, email, password, phone, address, question })
            if (res.data && res.data.success) {
                navigate("/login")
                setTimeout(() => {
                    toast.success(res.data.message)
                }, 100);
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    return (
        <Layout title="Sign Up">
            <div className="form-container">
                <form onSubmit={handleSubmit} className='register'>
                <h1 className="title">SIGN UP</h1>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="name" aria-describedby="emailHelp" name='name' placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email} required />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" id="password" name='password' placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} value={password} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="phone" aria-describedby="emailHelp" name='phone' placeholder='Enter Your Phone' onChange={(e) => setPhone(e.target.value)} value={phone} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="address" aria-describedby="emailHelp" placeholder='Enter Your Address' name='address' onChange={(e) => setAddress(e.target.value)} value={address} required />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="question" aria-describedby="emailHelp" placeholder='Enter Your Favorite Sport' name='question' onChange={(e) => setQuestion(e.target.value)} value={question} required />
                    </div>
                    <button type="submit" className="btn btn-primary">SIGN UP</button>
                </form>
            </div>
        </Layout>
    )
}

export default Register