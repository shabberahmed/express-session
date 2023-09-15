import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import tough from 'tough-cookie';
// const axiosCookieJarSupport = require('axios-cookiejar-support').default;

// axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
const Login = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const LoginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:9090/users', data, {
                jar: cookieJar, // Use the cookie jar
                withCredentials: true, // Send credentials (cookies) with the request
            });
            console.log(res.data);
            if (res.data === "Login successful") {
                console.log('hello');
                navigate('/products');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <input type="text" name="username" onChange={handleChange} value={data.username} />
            <input type="password" name="password" onChange={handleChange} value={data.password} />
            <button onClick={LoginUser}>Submit</button>
        </div>
    );
};

export default Login;
