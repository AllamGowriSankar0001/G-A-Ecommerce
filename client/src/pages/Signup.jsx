import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        try {
            const res = await fetch(`${backendUrl}/users/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Signup successful");
                navigate("/login");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        console.log(name, email, password);
    }, [name, email, password]);

    return (
        <div style={{width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",padding:"100px 0px"
        }}>
            <form className="form" onSubmit={handleSubmit}>
                <div className="flex-column">
                    <label>Name</label> 
                </div>
                <div className="inputForm">
                    <input type="text" className="input" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex-column">
                    <label>Email</label>
                </div>
                <div className="inputForm">
                    <input type="email" className="input" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="flex-column">
                    <label>Password</label>
                </div>
                <div className="inputForm password-field">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="input"
                        placeholder="Enter your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                    </button>
                </div>
                <button type="submit" className="button-submit">
                    Sign Up
                </button>
                <div className="flex-row">
                    <span className="span">Already have an account? </span>
                    <Link to="/login">
                        <button type="button" className="button-submit">
                            Sign In
                        </button>
                    </Link>
                </div>
            </form>
    </div>
  );
};
export default Signup;