import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../Api/api";
import Navbar from "../../../Component/Navbar/Navbar";
import Footer from "../../../Component/Footer/Footer";
import Sidebar from "../../../Component/Sidebar/Sidebar";
import "./Bookdetails.css";

export default function BookDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchBook();
        }
    }, [id]);

    const fetchBook = async () => {
        try {
            const res = await API.get(`/view_books/${id}`);
            setBook(res.data);
        } catch (err) {
            console.log(err);
            setBook(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (!book) {
        return <h2 className="book-not-found">Book Not Found</h2>;
    }

    return (
        <>
            <Navbar />
            <Sidebar />

            <div className="book-details-page">
                <div className="book-details-card">

                    <img className="book-image"
                        src={book.Image}
                        alt={book.Title}
                        width="200"
                    />

                    <h2>{book.Title}</h2>

                    <p><b>Author:</b> {book.Author}</p>

                    {/* IMPORTANT */}
                    <p><b>Description:</b> {book.Description || "No description available"}</p>

                    <button className="back-btn" onClick={() => navigate("/books")}>
                        Back
                    </button>

                </div>
            </div>

            <Footer />
        </>
    );
}