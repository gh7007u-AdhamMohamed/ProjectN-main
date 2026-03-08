import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LoginPage = () => {
   const navigate = useNavigate()
   const [formData, setFormData] = useState({
    email: '',   // starts empty
    password: '',   // starts empty
  })
   const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)

      navigate('/receipts')


    } catch (err) {
      console.log(err)
      alert('Login failed. Check your email and password.')
    }
  }
  return (
    <div>
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 space-y-6 bg-base-100 rounded-xl border border-base-300'>
        <h2 className='text-3xl font-extrabold text-primary font-mono tracking-tight text-center'>Login</h2>
        <form className='space-y-6' onSubmit={handleSubmit}>
      <div>
        <label className='text-2xl font-extrabold text-primary font-mono tracking-tight text-center'>Email</label>
        <input
          type="email"
          name="username"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className='w-full p-2 border rounded-md'
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className='text-2xl font-extrabold text-primary font-mono tracking-tight text-center'>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className='w-full p-2 border rounded-md'
          required
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className='btn btn-primary w-full py-2 text-lg font-bold'
      >
        Login
      </button> 
          
        </form>
      </div>
    </div>
    </div>
  )
}
