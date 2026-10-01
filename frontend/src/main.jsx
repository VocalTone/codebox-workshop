import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import BookDetailPage from "./pages/BookDetailPage";
import TbrPage from "./pages/TbrPage";
import AuthPage from "./pages/AuthPage";
import "./styles.css";

function App() {
  const { user, signOut } = useAuth();
  return <Routes><Route element={<Layout user={user} onSignOut={signOut} />}><Route path="/" element={<HomePage />} /><Route path="/browse" element={<BrowsePage />} /><Route path="/books/:id" element={<BookDetailPage user={user} />} /><Route path="/tbr" element={<TbrPage user={user} />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/signup" element={<AuthPage mode="signup" />} /></Route></Routes>;
}

createRoot(document.getElementById("root")).render(<BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>);
