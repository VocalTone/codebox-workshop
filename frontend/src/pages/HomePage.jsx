import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import BookCard from "../components/BookCard";

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBooks().then((data) => setBooks(data.slice(0, 4))).catch((err) => setError(err.message));
  }, []);

  return <>
    <section className="hero">
      <div>
        <p className="eyebrow">A calmer place for your reading life</p>
        <h1>Every good book deserves a little shelf space.</h1>
        <p className="hero-copy">Browse a handpicked library, save the books calling your name, and leave thoughtful notes when you finish.</p>
        <div className="hero-actions"><Link className="button" to="/browse">Browse books</Link><Link className="button button--quiet" to="/tbr">See my TBR</Link></div>
      </div>
      <div className="hero-art" aria-hidden="true"><span>✦</span><strong>Read<br />slowly.</strong><i>⌁</i></div>
    </section>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">Start somewhere lovely</p><h2>On the shelf now</h2></div><Link to="/browse">View all books →</Link></div>
      {error && <p className="notice notice--error">{error}</p>}
      {!error && books.length === 0 && <p className="notice">Loading the library…</p>}
      <div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} />)}</div>
    </section>
  </>;
}
