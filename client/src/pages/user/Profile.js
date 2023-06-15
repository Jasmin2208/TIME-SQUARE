import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Profile() {
    const [auth, setAuth] = useAuth()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        const { email, name, phone, address, password } = auth?.user
        setName(name)
        setEmail(email)
        setPhone(phone)
        setAddress(address)
        setPassword(password)
    }, [auth?.user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put('/api/v1/auth/profile', { name, email, password, phone, address })
            if (data?.success) {
                setAuth({ ...auth, user: data?.updateUser })
                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data.updateUser
                localStorage.setItem("auth", JSON.stringify(ls))
                toast.success(data?.message)
            } else {
                toast.error(data?.message)
            }
        } catch (error) {
            console.log("error", error)
            toast.error("Something went wrong")
        }
    }

    return (
        <Layout title={"Dashboard - User Profile"}>
            <div className="container-fluid m-3 p-3 dashboard">
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-6">
                        <div className="form-containers">
                            <form onSubmit={handleSubmit} className='register'>
                                <h1 className="title">USER PROFILE</h1>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="name" aria-describedby="emailHelp" name='name' placeholder='Enter Your Name' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email} />
                                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div className="mb-3">
                                    <input type="password" className="form-control" id="password" name='password' placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} value={password} />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="phone" aria-describedby="emailHelp" name='phone' placeholder='Enter Your Phone' onChange={(e) => setPhone(e.target.value)} value={phone} />
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="address" aria-describedby="emailHelp" placeholder='Enter Your Address' name='address' onChange={(e) => setAddress(e.target.value)} value={address} />
                                </div>
                                <button type="submit" className="btn btn-primary">Update Profile</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile