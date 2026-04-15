import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "police") navigate("/police/dashboard");
      else navigate("/citizen/home");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      return setError("Please enter both identifier (email/phone) and password");
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", {
        identifier,
        password
      });
      
      const { user, token } = res.data;
      
      // Use central login function instead of manual localStorage
      login(user, token);
      
      // Standard flow: redirect to home or dash
      if (user.role === "police") {
        navigate("/police/dashboard");
      } else {
        navigate("/citizen/home");
      }
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Citizen Login</h2>
        <p className="text-center text-gray-400 text-sm mb-8">Access your digital policing portal</p>
        
        {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mb-4 text-sm font-semibold text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-gray-600 text-sm font-semibold ml-1">Email or Phone Number</label>
            <input 
              type="text" 
              className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition" 
              placeholder="Enter your email or 10-digit phone" 
              value={identifier} 
              onChange={e=>setIdentifier(e.target.value)} 
              disabled={loading} 
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-semibold ml-1">Password</label>
            <input 
              type="password" 
              className="w-full mt-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-blue-500 transition" 
              placeholder="••••••••" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              disabled={loading} 
            />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition transform hover:scale-[1.02] shadow-lg shadow-blue-200"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between items-center mt-8 text-sm px-1">
          <Link to="/forgot-password" title="Forgot Password" className="text-blue-600 font-semibold hover:underline">Forgot Password?</Link>
          <Link to="/register" title="Create Account" className="text-blue-600 font-semibold hover:underline">Create Account</Link>
        </div>
        
        <div className="mt-10 text-center border-t pt-6 bg-slate-50 -mx-8 -mb-8 rounded-b-3xl">
          <Link to="/admin-login" className="text-gray-500 hover:text-blue-600 font-bold text-sm transition">
            Law Enforcement Officer Access →
          </Link>
        </div>
      </div>
    </div>
  );
}
