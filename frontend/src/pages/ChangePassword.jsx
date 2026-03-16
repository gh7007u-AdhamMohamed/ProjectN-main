import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../config'

const ChangePassword = () => {

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
  })

  const navigate = useNavigate()

const handleSubmit = async (e) => {
  e.preventDefault()

  const token = sessionStorage.getItem('token')

  try {
    await axios.post(
      `${BASE_URL}/api/users/change-password`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    navigate('/receipts')

  } catch (err) {
    console.log(err)
    alert(err.response?.data?.message || "Request failed")
  }
}
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 space-y-6 bg-base-100 rounded-xl border border-base-300'>
        <h2 className='text-3xl font-extrabold text-primary font-mono tracking-tight text-center'>
          Change User Password
        </h2>

        <form className='space-y-6' onSubmit={handleSubmit}>

          <div>
            <label className='text-2xl font-extrabold text-primary font-mono'>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full p-2 border rounded-md'
              required
            />
          </div>

          <div>
            <label className='text-2xl font-extrabold text-primary font-mono'>
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              className='w-full p-2 border rounded-md'
              required
            />
          </div>

          <button
            type="submit"
            className='btn btn-primary w-full py-2 text-lg font-bold'
          >
            Change Password
          </button>

        </form>
      </div>
    </div>
  )
}

export default ChangePassword