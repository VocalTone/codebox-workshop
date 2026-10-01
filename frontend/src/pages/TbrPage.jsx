import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function TbrPage({ user }) {
  const [entries, setEntries] = useState([]); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  const load = useCallback(() => { if (!user) { setLoading(false); return Promise.resolve(); } setLoading(true); return api.getTbr().then(setEntries).catch((err) => setError(err.message)).finally(() => setLoading(false)); }, [user]);
  useEffect(() => { load(); }, [load]);
  async function remove(bookId) { try { await api.removeFromTbr(bookId); await load(); } catch (err) { setError(err.message); } }
  if (!user) return <section className="section"><div className="empty-state"><p className="eyebrow">Your reading shelf</p><h1>Log in to see your TBR.</h1><p>Save the books you want to return to.</p><Link className="button" to="/login">Log in</Link></div></section>;
  return <section className="section"><p className="eyebrow">Your reading shelf</p><h1>To be read.</h1>{error && <p className="notice notice--error">{error}</p>}{loading ? <p className="notice">Loading your shelf…</p> : entries.length === 0 ? <div className="empty-state"><h2>Your shelf is open</h2><p>Find a book you want to remember for later.</p><Link className="button" to="/browse">Browse books</Link></div> : <div className="tbr-list">{entries.map((entry) => { const book = entry.books || entry.book; return <article className="tbr-item" key={entry.book_id || book.id}><div className="mini-cover">{book.title.slice(0, 1)}</div><div><h2>{book.title}</h2><p className="byline">by {book.author}</p><p>{book.description}</p></div><div><Link to={`/books/${book.id}`}>View book</Link><button className="text-button" onClick={() => remove(entry.book_id || book.id)}>Remove</button></div></article>; })}</div>}</section>;
}
