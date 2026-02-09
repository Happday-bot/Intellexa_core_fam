import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useState, useEffect } from "react";
import { __setCred } from "./auth/auth";
import { baseurl } from "../data/url";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loggingout = async () => {
    try {
      if (!auth || !auth.passkey) {
        __setCred(null);
        setAuth(null);
        navigate("/Intellexa_core_fam/");
        return;
      }
      await fetch(`${baseurl}/logout?passkey=${auth.passkey}`, {
        method: "POST",
      });
    } finally {
      __setCred(null);
      setAuth(null);
      navigate("/Intellexa_core_fam/");
    }
  };

  const NavItem = ({ to, children, hash, ...props }) => {
    const Component = hash ? HashLink : Link;
    return (
      <Component
        smooth={hash ? "true" : undefined}
        to={to}
        className="relative px-1 py-2 text-slate-600 font-semibold transition-all duration-300 group hover:text-indigo-600"
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <motion.span
          className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-500 rounded-full"
          transition={{ duration: 0.3 }}
          whileHover={{ width: "100%" }}
        />
      </Component>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"
        }`}
    >
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}>
        <div className={`glass-effect rounded-2xl shadow-premium border border-white/40 px-6 py-3 flex justify-between items-center transition-all duration-500`}>

          {/* Logo Section */}
          <Link to="/Intellexa_core_fam/" className="flex items-center space-x-3 group outline-none">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </motion.div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-gradient font-display">
              Intellexa
            </h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavItem to="/Intellexa_core_fam/#overview" hash>Overview</NavItem>
            <NavItem to="/Intellexa_core_fam/#domains" hash>Domains</NavItem>
            <NavItem to="/Intellexa_core_fam/#events" hash>Events</NavItem>
            <NavItem to="/Intellexa_core_fam/contributions/teams/#contribution" hash>Contributions</NavItem>
            <NavItem to="/Intellexa_core_fam/query">Queries</NavItem>

            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            {!auth ? (
              <div className="flex items-center space-x-4">
                <Link to="/Intellexa_core_fam/signin" className="text-slate-600 font-bold hover:text-indigo-600 transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/Intellexa_core_fam/signup"
                  className="px-5 py-2.5 rounded-xl premium-gradient text-white font-bold shadow-lg shadow-indigo-200 hover:scale-105 transition-all text-sm"
                >
                  Join Now
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {auth.team === "Media" && <NavItem to="/Intellexa_core_fam/mediateam">Dashboard</NavItem>}
                {auth.team === "Design" && <NavItem to="/Intellexa_core_fam/designteam">Dashboard</NavItem>}
                {auth.team === "Intellexa" && auth.role === "Technical Lead" && <NavItem to="/Intellexa_core_fam/techlead">Admin</NavItem>}
                {auth && ((auth.team === "Intellexa" || auth.team === "Event") && auth.role !== "Technical Lead") && <NavItem to="/Intellexa_core_fam/admin">Admin</NavItem>}

                <NavItem to="/Intellexa_core_fam/techteams">Contribute</NavItem>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={loggingout}
                  className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-white/50 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 w-full px-4 lg:hidden z-40"
          >
            <div className="glass-effect rounded-2xl shadow-xl border border-white/40 p-6 flex flex-col space-y-4">
              <NavItem to="/Intellexa_core_fam/#overview" hash onClick={() => setMenuOpen(false)}>Overview</NavItem>
              <NavItem to="/Intellexa_core_fam/#domains" hash onClick={() => setMenuOpen(false)}>Domains</NavItem>
              <NavItem to="/Intellexa_core_fam/#events" hash onClick={() => setMenuOpen(false)}>Potential Events</NavItem>
              <NavItem to="/Intellexa_core_fam/contributions/teams/#contribution" hash onClick={() => setMenuOpen(false)}>Contributions</NavItem>
              <NavItem to="/Intellexa_core_fam/query" onClick={() => setMenuOpen(false)}>Raise a Query</NavItem>

              {!auth ? (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <Link to="/Intellexa_core_fam/signin" onClick={() => setMenuOpen(false)} className="text-center py-2.5 text-slate-600 font-bold hover:text-indigo-600">
                    Sign in
                  </Link>
                  <Link to="/Intellexa_core_fam/signup" onClick={() => setMenuOpen(false)} className="text-center py-2.5 rounded-xl premium-gradient text-white font-bold shadow-lg">
                    Join Now
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={loggingout}
                    className="flex items-center space-x-2 text-rose-600 font-bold p-2 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
