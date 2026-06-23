import React, { useEffect, useState } from 'react'
import './BorrowedBooks.css'
import Navbar from '../../../Component/Navbar/Navbar'
import Sidebar from '../../../Component/Sidebar/Sidebar'
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import { useNavigate, Link } from 'react-router-dom'

export default function BorrowedBooks() {

    const navigate = useNavigate()
    const [borrows, setBorrows] = useState([])

    useEffect(() => {
        const user = localStorage.getItem('username')
        const role = localStorage.getItem('role')

        if (!user || role !== 'user') {
            navigate('/login')
            return
        }

        const fetchBorrows = async () => {
            try {
                const response = await API.get(`/borrow_getbyID/${encodeURIComponent(user)}`)
                console.log(response.data)
                setBorrows(response.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchBorrows()
    }, [navigate])

    const calculateFine = (dueDate, returned) => {
        if (returned || !dueDate) return 0
        const today = new Date()
        const due = new Date(dueDate)
        const diff = today - due
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        return days > 0 ? days * 10 : 0
    }
    

    return (
        <>
            <Navbar />
            <Sidebar />
            <div className="borrowed-container">
                <div className="borrowed-card">
                <h2>My Borrowed Books</h2>
            

                {borrows.length === 0 ? (
                    <p>No borrowed books found.</p>
                ) : (
                    <table className="borrowed-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Quantity</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Fine</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map(b => (
                                <tr key={`${b.Title}-${b.UserId}-${b.Due_Date}-${b.Borrow_Date}-${b.Return_Date}`}> 
                                    <td>{b.Title}</td>
                                    <td>{b.Status === "Returned" ? 1 : b.Quantity}</td>
                                    <td>
    {b.Borrow_Date
        ? new Date(b.Borrow_Date).toLocaleDateString('en-GB')
        : '-'}
</td>
                                    <td>{b.Due_Date ? new Date(b.Due_Date).toLocaleDateString() : '-'}</td>
                                    <td>{b.Status}</td>
                                    <td>
    {calculateFine(
        b.Due_Date,
        b.Return_Date,
        b.Status
    ) > 0
        ? `₹${calculateFine(
              b.Due_Date,
              b.Return_Date,
              b.Status
          )}`
        : 'No Fine'}
</td>

 <button
  className="return-button"
  onClick={() =>
    navigate('/return-books', {
      state: {
        title: b.Title
      }
    })
  }
>
  Return Book
</button>

                            
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
            </div>

            <Footer />
        </>
    )
}

