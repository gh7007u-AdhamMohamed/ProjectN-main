import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import BASE_URL from '../config' 

const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${BASE_URL}/api/users/register`, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
      navigate('/receipts')
    } catch (err) {
      console.log(err)
      alert('Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-md p-8 space-y-6 bg-base-100 rounded-xl border border-base-300'>
        <h2 className='text-3xl font-extrabold text-primary font-mono tracking-tight text-center'>
          Register
        </h2>

        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label className='text-2xl font-extrabold text-primary font-mono tracking-tight'>Email</label>
            <input
              type='email'
              placeholder='Enter email'
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className='w-full p-2 border rounded-md'
              required
            />
          </div>

          <div>
            <label className='text-2xl font-extrabold text-primary font-mono tracking-tight'>Password</label>
            <input
              type='password'
              placeholder='Enter password'
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className='w-full p-2 border rounded-md'
              required
            />
          </div>

          <div>
            <label className='text-2xl font-extrabold text-primary font-mono tracking-tight'>Confirm Password</label>
            <input
              type='password'
              placeholder='Repeat password'
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              className='w-full p-2 border rounded-md'
              required
            />
          </div>

          <div>
            <label className='text-2xl font-extrabold text-primary font-mono tracking-tight'>Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className='w-full p-2 border rounded-md'
            >
              <option value='admin'>Admin</option>
              <option value='superUser'>Super User</option>
              <option value='viewer'>Viewer</option>
            </select>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='btn btn-primary w-full py-2 text-lg font-bold'
          >
            {loading ? <span className='loading loading-spinner loading-sm' /> : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage