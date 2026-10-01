import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import BookCard from "../components/BookCard";

export default function BrowsePage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { api.getBooks().then(setBooks).catch((err) => setError(err.message)); }, []);
  const genres = [...new Set(books.map((book) => book.genre).filter(Boolean))].sort();
  const results = useMemo(() => books.filter((book) => {
    const text = `${book.title} ${book.author}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (!genre || book.genre === genre);
  }), [books, query, genre]);

  return <section className="section browse"><p className="eyebrow">The library</p><h1>Find your next great read.</h1>
    <div className="filters"><label>Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or author" /></label><label>Genre<select value={genre} onChange={(event) => setGenre(event.target.value)}><option value="">All genres</option>{genres.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    {error && <p className="notice notice--error">{error}</p>}
    {!error && books.length === 0 && <p className="notice">Loading the library…</p>}
    {books.length > 0 && <p className="result-count">{results.length} {results.length === 1 ? "book" : "books"} found</p>}
    <div className="book-grid">{results.map((book) => <BookCard key={book.id} book={book} />)}</div>
    {books.length > 0 && results.length === 0 && <div className="empty-state"><h2>No matches yet</h2><p>Try another title, author, or genre.</p></div>}
  </section>;
}
