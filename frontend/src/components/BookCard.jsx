import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <Link className="book-card" to={`/books/${book.id}`}>
      {book.cover_url ? <img className="book-card__cover" src={book.cover_url} alt={`Cover of ${book.title} by ${book.author}`} onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="book-card__spine" aria-label="No cover available">📚</div>}
      <div>
        <p className="eyebrow">{book.genre || "Book"}</p>
        <h3>{book.title}</h3>
        <p className="byline">by {book.author}</p>
        <p className="description">{book.description}</p>
        {book.tags?.length > 0 && <div className="tags">{book.tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}</div>}
      </div>
    </Link>
  );
}
