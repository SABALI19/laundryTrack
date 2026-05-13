import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import WashaLogo from "../assets/logo/washa-logo-transparent.png";
import Button from "./Button.jsx";

const LandingPageHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const Links = [
    {
      title: "Features",
      path: "/",
    },
    {
      title: "Pricing",
      path: "/pricing",
    },
    {
      title: "Support",
      path: "/support",
    },
    // {
    //   title: "Contact",
    //   path: "/contact",
    // },
  ];
  return (
    <div className="relative z-9999 w-full">
      <header className="flex w-full items-center justify-between gap-4 px-4 py-3 shadow-sm sm:px-6 lg:px-12">
        <NavLink to="/" className="shrink-0">
          <img
            src={WashaLogo}
            alt="Washa Logo"
            className="h-12 w-12 object-contain"
          />
        </NavLink>

        <nav className="hidden items-center justify-between gap-4 font-light md:flex">
          <ul className="flex items-center gap-8">
            {Links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-[#2c4a7d] hover:text-[#2c4a7d]"
                        : "text-gray-700 hover:text-blue-500"
                    } `
                  }
                >
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="regular"
                size="xl"
                fontWeight="thin"
                className="border-[#2c4a7d] hover:border-[#2c4a7d] focus:ring-[#2c4a7d]"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>
        </nav>

        <button
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#2c4a7d] shadow-sm transition-colors hover:border-[#2c4a7d] md:hidden"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-sm md:hidden">
          <div className="space-y-2">
            {Links.map((link) => (
              <NavLink
                key={link.title}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-primary-soft)] text-[#2c4a7d]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#2c4a7d]"
                  }`
                }
              >
                {link.title}
              </NavLink>
            ))}
          </div>

          <div className="mt-4">
            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="flex w-full items-center justify-center">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPageHeader;
