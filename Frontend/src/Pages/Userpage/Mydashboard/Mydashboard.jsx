import React, { useEffect, useState } from 'react'
import './Mydashboard.css'
import Sidebar from '../../../Component/Sidebar/Sidebar'
import { useNavigate } from 'react-router-dom'
import API from '../../../Api/api'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'

export default function Mydashboard() {
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    userId: ''
  })
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    activeBorrowed: 0,
    totalReturned: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('username')
    const role = localStorage.getItem('role')
    if (!userId || role !== 'user') {
      navigate('/login')
      return
    }

    const fetchDashboard = async () => {
      try {
        const usersResponse = await API.get('/users/')
        const user = Array.isArray(usersResponse.data)
          ? usersResponse.data.find((item) => item.UserId === userId)
          : null

        if (user) {
          setUserDetails({
            name: user.Name || '',
            email: user.Email || '',
            userId: user.UserId || userId
          })
        } else {
          setUserDetails({
            name: '',
            email: '',
            userId
          })
        }

        let borrowList = []
        try {
          const borrowResponse = await API.get(`/borrow_getbyID/${encodeURIComponent(userId)}`)
          borrowList = Array.isArray(borrowResponse.data) ? borrowResponse.data : []
        } catch (borrowError) {
          if (!borrowError.response || borrowError.response.status !== 404) {
            throw borrowError
          }
          borrowList = []
        }

        let returnList = []
        try {
          const returnedResponse = await API.get(`/return_getbyID/${encodeURIComponent(userId)}`)
          returnList = Array.isArray(returnedResponse.data) ? returnedResponse.data : []
        } catch (returnError) {
          if (!returnError.response || returnError.response.status !== 404) {
            throw returnError
          }
          returnList = []
        }

        const activeBorrowed = borrowList.reduce(
          (sum, item) => sum + ((item.Status === 'Active' ? Number(item.Quantity) : 0) || 0),
          0
        )

        const totalReturned = returnList.reduce(
          (sum, item) => sum + (Number(item.Quantity) || 0),
          0
        )

        const totalBorrowed = activeBorrowed + totalReturned

        setStats({
          totalBorrowed,
          activeBorrowed,
          totalReturned
        })
      } catch (err) {
        console.error('Dashboard load error:', err)
        setError('Unable to load dashboard data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [navigate])

  return (
    <> 
    <Navbar />
    <div className="mydashboard">
      <Sidebar />
      <main className="dashboard-content">
        <section className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Welcome back, {userDetails.name || userDetails.userId}.</p>
          </div>
        </section>

        {error && <p className="dashboard-error">{error}</p>}

        <section className="dashboard-details">
          <div className="user-card">
            <h2>User Details</h2>
            <div className="detail-row">
              <span>Name</span>
              <strong>{userDetails.name || 'N/A'}</strong>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <strong>{userDetails.email || 'N/A'}</strong>
            </div>
            <div className="detail-row">
              <span>User ID</span>
              <strong>{userDetails.userId || 'N/A'}</strong>
            </div>
          </div>

          <div className="stats-card">
            <h2>Borrowing Summary</h2>
            {loading ? (
              <p>Loading statistics...</p>
            ) : (
              <div className="stats-grid">
                <div className="stat-item">
                  <span>Total Borrowed</span>
                  <strong>{stats.totalBorrowed}</strong>
                </div>
                <div className="stat-item">
                  <span>Active Borrowed</span>
                  <strong>{stats.activeBorrowed}</strong>
                </div>
                <div className="stat-item">
                  <span>Total Returned</span>
                  <strong>{stats.totalReturned}</strong>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
    <Footer />
     </>
  )
}

