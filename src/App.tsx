import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./pages/Home";
import { DurgaPuja } from "./pages/DurgaPuja";
import { ShyamaPuja } from "./pages/ShyamaPuja";
import { SaraswatiPuja } from "./pages/SaraswatiPuja";
import { Gallery } from "./pages/Gallery";
import Music from "./pages/Music";
import { PDFs } from "./pages/PDFs";
import { Contact } from "./pages/Contact";
import LiveTV from "./pages/LiveTV";
import Deities from "./pages/Deities";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <main className="pb-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/durga-puja" element={<DurgaPuja />} />
                    <Route path="/shyama-puja" element={<ShyamaPuja />} />
                    <Route path="/saraswati-puja" element={<SaraswatiPuja />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/pdfs" element={<PDFs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/live-tv" element={<LiveTV />} />
                    <Route path="/deities" element={<Deities />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

