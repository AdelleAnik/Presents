import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from "@clerk/clerk-react";
import PublicProfilePage from "./Pages/PublicProfilePage";
// import DashboardPage from "./Pages/DashboardPage";

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <header style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <SignedOut>
          <Link to="/sign-in">Sign in</Link>
          <Link to="/sign-up">Sign up</Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <Link to="/dashboard">Dashboard</Link>
        </SignedIn>
      </header>

      <main style={{ marginTop: 24 }}>
        <h1>Presents</h1>
        <p>Welcome!</p>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Private Dashboard</h2>
      <p>Only visible when signed in.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
        <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
        <Route path="/u/:username" element={<PublicProfilePage />} />
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
