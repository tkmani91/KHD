import { Link, useLocation } from "react-router-dom";
import { Menu, X, Flame, Moon, BookOpen, Image, Music, FileText, Phone, Tv, LogIn, Users } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "হোম", icon: null },
    { path: "/durga-puja", label: "দুর্গাপূজা", icon: Flame },
    { path: "/shyama-puja", label: "শ্যামাপূজা", icon: Moon },
    { path: "/saraswati-puja", label: "সরস্বতী পূজা", icon: BookOpen },
    { path: "/deities", label: "দেব-দেবী", icon: Users },
    { path: "/gallery", label: "গ্যালারি", icon: Image },
    { path: "/music", label: "গান", icon: Music },
    { path: "/pdfs", label: "PDF", icon: FileText },
    { path: "/live-tv", label: "লাইভ টিভি", icon: Tv },
    { path: "/contact", label: "যোগাযোগ", icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Flame className="h-6 w-6 text-yellow-300" />
            </div>
            <span className="hidden text-lg font-bold text-white sm:block">
              কলম হিন্দু ধর্মসভা
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium bg-white/20 text-white hover:bg-white/30 transition-all ml-2"
            >
              <LogIn className="h-4 w-4" />
              লগইন
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-white/20 pb-4 lg:hidden">
            <div className="mt-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-white/20 text-white"
              >
                <LogIn className="h-4 w-4" />
                লগইন
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
