import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { Link } from "react-router-dom";

function Stars({ value }) { return <span className="stars" aria-label={`${value} out of 5 stars`}>{"★".repeat(value)}{"☆".repeat(5 - value)}</span>; }

export default function BookDetailPage({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [tbr, setTbr] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const loadReviews = useCallback(() => api.getReviews(id).then(setReviews), [id]);

  useEffect(() => { api.getBook(id).then(setBook).catch((err) => setError(err.message)); loadReviews().catch((err) => setError(err.message)); }, [id, loadReviews]);
  useEffect(() => { if (user) api.getTbr().then(setTbr).catch(() => setTbr([])); else setTbr([]); }, [user]);
  const average = useMemo(() => reviews.length ? (reviews.reduce((sum, review) => sum + review.star_rating, 0) / reviews.length).toFixed(1) : null, [reviews]);
  const isSaved = tbr.some((entry) => entry.book_id === Number(id) || entry.book?.id === Number(id));

  async function toggleTbr() {
    if (!user) return setMessage("Log in to use your TBR.");
    setBusy(true); setMessage("");
    try { isSaved ? await api.removeFromTbr(id) : await api.addToTbr(id); setTbr(await api.getTbr()); }
    catch (err) { setMessage(err.message); } finally { setBusy(false); }
  }
  async function submitReview(event) {
    event.preventDefault();
    if (!user) return setMessage("Log in to post a review.");
    setBusy(true); setMessage("");
    try { await api.addReview(id, { review_text: reviewText, star_rating: rating }); setReviewText(""); await loadReviews(); setMessage("Your review was added."); }
    catch (err) { setMessage(err.message); } finally { setBusy(false); }
  }
  if (error) return <section className="section"><p className="notice notice--error">{error}</p></section>;
  if (!book) return <section className="section"><p className="notice">Loading this book…</p></section>;
  return <section className="section detail"><div className="detail-hero">{book.cover_url ? <img className="detail-cover" src={book.cover_url} alt={`Cover of ${book.title} by ${book.author}`} onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="detail-cover" aria-label="No cover available">📚</div>}<div><p className="eyebrow">{book.genre || "Book"}</p><h1>{book.title}</h1><p className="byline">by {book.author}</p>{book.tags?.length > 0 && <div className="tags">{book.tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}</div>}<p className="detail-description">{book.description}</p><div className="detail-actions"><button className="button" disabled={busy} onClick={toggleTbr}>{isSaved ? "Remove from TBR" : "Add to TBR"}</button>{average && <span className="average"><Stars value={Math.round(average)} /> {average} ({reviews.length})</span>}</div></div></div>
    {message && <p className="notice">{message}</p>}
    <div className="reviews-layout"><section><div className="section-heading"><div><p className="eyebrow">Reader notes</p><h2>Reviews</h2></div>{reviews.length > 0 && <span>{reviews.length} total</span>}</div>{reviews.length === 0 ? <div className="empty-state"><h3>No reviews yet</h3><p>Be the first to share what stayed with you.</p></div> : <div className="review-list">{reviews.map((review) => <article className="review" key={review.id}><Stars value={review.star_rating} /><p>{review.review_text}</p><small>{review.user?.name || "Reader"}</small></article>)}</div>}</section>
      <form className="review-form" onSubmit={submitReview}><p className="eyebrow">Your perspective</p><h2>Leave a review</h2>{!user && <p className="form-hint"><Link to="/login">Log in</Link> to share what stayed with you.</p>}<label>Rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))}>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select></label><label>Review<textarea required value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="What did you think?" rows="6" /></label><button className="button" disabled={busy || !user}>Post review</button></form></div>
  </section>;
}
