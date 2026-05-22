import React, { useEffect, useState } from 'react'
import './BorrowedBooks.css'
import Navbar from '../../../Component/Navbar/Navbar'
import Footer from '../../../Component/Footer/Footer'
import API from '../../../Api/api'
import { useNavigate } from 'react-router-dom'

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

    const handleReturn = async (borrow) => {
        try {
            const user = localStorage.getItem('username')
            await API.post('/return_book/', {
                Title: borrow.Title,
                UserId: borrow.UserId || user,
                Quantity: borrow.Quantity || 1
            })

            setBorrows(prev =>
                prev.map(book =>
                    book.Title === borrow.Title && book.UserId === borrow.UserId
                        ? { ...book, Status: 'Returned' }
                        : book
                )
            )

        } catch (err) {
            console.error(err.response?.data || err)
        }
    }

    return (
        <>
            <Navbar />

            <div className="borrowed-container">
                <h1>My Borrowed Books</h1>

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
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrows.map(b => (
                                <tr key={`${b.Title}-${b.UserId}-${b.Due_Date}`}> 
                                    <td>{b.Title}</td>
                                    <td>{b.Quantity}</td>
                                    <td>{b.Borrow_Date ? new Date(b.Borrow_Date).toLocaleDateString() : '-'}</td>
                                    <td>{b.Due_Date ? new Date(b.Due_Date).toLocaleDateString() : '-'}</td>
                                    <td>{b.Status}</td>
                                    <td>{calculateFine(b.Due_Date, b.Returned) > 0 ? `₹${calculateFine(b.Due_Date, b.Returned)}` : 'No Fine'}</td>
                                    <td>
                                        <button
                                            className={`edit-btn ${b.Status === 'Returned' ? 'disabled-btn' : ''}`}
                                            onClick={() => handleReturn(b)}
                                            disabled={b.Status === 'Returned'}
                                        >
                                            {b.Status === 'Returned' ? 'Returned' : 'Return'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>

            <Footer />
        </>
    )
}

