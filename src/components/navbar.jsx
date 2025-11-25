// import { Link, useNavigate } from "react-router-dom";
// import { HashLink } from "react-router-hash-link";
// import { __setCred } from "./auth/auth";
// import { baseurl } from "../data/url";

// export default function Navbar({ auth, setAuth }) {
//   const navigate = useNavigate();

//   const loggingout = async () => {
//     try {
//       if (!auth || !auth.passkey) {
//         __setCred(null);
//         setAuth(null);
//         navigate("/");
//       }

//       await fetch(`${baseurl}/logout?passkey=${auth.passkey}`, {
//         method: "POST",
//       });
//     } finally {
//       __setCred(null);
//       setAuth(null);
//       navigate("/");
//     }
//   };

//   // Reusable Animated Link Component
//   const NavItem = ({ to, children, hash, ...props }) => {
//     const Component = hash ? HashLink : Link;

//     return (
//       <Component
//         smooth={hash ? true : undefined}
//         to={to}
//         className="relative text-gray-600 font-medium transition-all duration-300 group"
//         {...props}
//       >
//         <span className="group-hover:text-indigo-600 group-hover:scale-[1.03] transition-all duration-300">
//           {children}
//         </span>

//         <span
//           className="
//             absolute left-0 -bottom-1 w-0 h-[2px]
//             bg-indigo-600 transition-all duration-300
//             group-hover:w-full
//           "
//         />
//       </Component>
//     );
//   };

//   return (
//     <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
//       <div className="max-w-7.5xl mx-auto px-6 py-4 flex justify-between items-center">

//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <div className="w-12 h-12  flex items-center justify-center">
//             <img src="/src/assets/download.jpg" alt="Intellexa" className="rounded-full" /> 
//           </div>

//           <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Intellexa Core Fam
//           </h1>
//         </div>

//         {/* Nav Links */}
//         <div className="flex space-x-8">

//           <NavItem to="/#overview" hash>Overview</NavItem>
//           <NavItem to="/#domains" hash>Domains</NavItem>
//           <NavItem to="/#events" hash>Potential Events</NavItem>
//           <NavItem to="/contributions/teams/#contribution" hash>Team Contributions</NavItem>
//           <NavItem to="/query">Raise a Query</NavItem>

//           {!auth && (
//             <>
//               <NavItem to="/signin">Sign in</NavItem>
//               <NavItem to="/signup">Sign up</NavItem>
//             </>
//           )}

//           {auth && auth.team === "Media" && (
//             <NavItem to="/mediateam">Dashboard</NavItem>
//           )}

//           {auth && auth.team === "Design" && (
//             <NavItem to="/designteam">Dashboard</NavItem>
//           )}

//           {auth && auth.team === "Intellexa" && auth.role === "Technical Lead" && (
//             <NavItem to="/techlead">Dashboard</NavItem>
//           )}

//           {auth &&
//             ((auth.team === "Intellexa" || auth.team === "Event") && auth.role !== "Technical Lead") && (
//               <NavItem to="/admin">Dashboard</NavItem>
//             )}

//           {auth && (
//             <>
//               <NavItem to="/techteams">Contribute Event</NavItem>

//               {/* Logout */}
//               <div
//                 onClick={loggingout}
//                 className="relative text-gray-600 font-medium transition-all duration-300 group cursor-pointer"
//               >
//                 <span className="group-hover:text-indigo-600 transition-all duration-300 flex items-center space-x-2">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={1.8}
//                     stroke="currentColor"
//                     className="w-5 h-5"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
//                     />
//                   </svg>
//                   <span>Logout</span>
//                 </span>

//                 <span
//                   className="
//                     absolute left-0 -bottom-1 w-0 h-[2px]
//                     bg-indigo-600 transition-all duration-300
//                     group-hover:w-full
//                   "
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useState } from "react";
import { __setCred } from "./auth/auth";
import { baseurl } from "../data/url";

export default function Navbar({ auth, setAuth }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const loggingout = async () => {
    try {
      if (!auth || !auth.passkey) {
        __setCred(null);
        setAuth(null);
        navigate("/");
      }
      await fetch(`${baseurl}/logout?passkey=${auth.passkey}`, {
        method: "POST",
      });
    } finally {
      __setCred(null);
      setAuth(null);
      navigate("/");
    }
  };

  const NavItem = ({ to, children, hash, ...props }) => {
    const Component = hash ? HashLink : Link;
    return (
      <Component
        smooth={hash ? true : undefined}
        to={to}
        className="relative text-gray-600 font-medium transition-all duration-300 group whitespace-nowrap"
        {...props}
      >
        <span className="group-hover:text-indigo-600 group-hover:scale-[1.03] transition-all duration-300">
          {children}
        </span>

        <span
          className="
            absolute left-0 -bottom-1 w-0 h-[2px]
            bg-indigo-600 transition-all duration-300
            group-hover:w-full
          "
        />
      </Component>
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7.5xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Intellexa Core Fam
          </h1>
        </div>

        {/* Desktop Navigation (>=1120px) */}
        <div className="hidden lg:flex space-x-8">

          <NavItem to="/#overview" hash>Overview</NavItem>
          <NavItem to="/#domains" hash>Domains</NavItem>
          <NavItem to="/#events" hash>Potential Events</NavItem>
          <NavItem to="/contributions/teams/#contribution" hash>Team Contributions</NavItem>
          <NavItem to="/query">Raise a Query</NavItem>

          {!auth && (
            <>
              <NavItem to="/signin">Sign in</NavItem>
              <NavItem to="/signup">Sign up</NavItem>
            </>
          )}

          {auth && auth.team === "Media" && (
            <NavItem to="/mediateam">Dashboard</NavItem>
          )}

          {auth && auth.team === "Design" && (
            <NavItem to="/designteam">Dashboard</NavItem>
          )}

          {auth && auth.team === "Intellexa" && auth.role === "Technical Lead" && (
            <NavItem to="/techlead">Dashboard</NavItem>
          )}

          {auth &&
            ((auth.team === "Intellexa" || auth.team === "Event") && auth.role !== "Technical Lead") && (
              <NavItem to="/admin">Dashboard</NavItem>
            )}

          {auth && (
            <>
              <NavItem to="/techteams">Contribute Event</NavItem>

              {/* Logout */}
              <div
                onClick={loggingout}
                className="relative text-gray-600 font-medium transition-all duration-300 group cursor-pointer"
              >
                <span className="group-hover:text-indigo-600 transition-all duration-300 flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                  <span>Logout</span>
                </span>
              </div>
            </>
          )}
        </div>

        {/* Mobile Dropdown (<1120px) */}
        <div className="lg:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
          >
            Menu
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border p-4 flex flex-col space-y-3 z-50">

              <NavItem to="/#overview" hash onClick={() => setMenuOpen(false)}>Overview</NavItem>
              <NavItem to="/#domains" hash onClick={() => setMenuOpen(false)}>Domains</NavItem>
              <NavItem to="/#events" hash onClick={() => setMenuOpen(false)}>Potential Events</NavItem>
              <NavItem to="/contributions/teams/#contribution" hash onClick={() => setMenuOpen(false)}>
                Team Contributions
              </NavItem>
              <NavItem to="/query" onClick={() => setMenuOpen(false)}>Raise a Query</NavItem>

              {!auth && (
                <>
                  <NavItem to="/signin" onClick={() => setMenuOpen(false)}>Sign in</NavItem>
                  <NavItem to="/signup" onClick={() => setMenuOpen(false)}>Sign up</NavItem>
                </>
              )}

              {auth && auth.team === "Media" && (
                <NavItem to="/mediateam" onClick={() => setMenuOpen(false)}>Dashboard</NavItem>
              )}

              {auth && auth.team === "Design" && (
                <NavItem to="/designteam" onClick={() => setMenuOpen(false)}>Dashboard</NavItem>
              )}

              {auth && auth.team === "Intellexa" && auth.role === "Technical Lead" && (
                <NavItem to="/techlead" onClick={() => setMenuOpen(false)}>Dashboard</NavItem>
              )}

              {auth &&
                ((auth.team === "Intellexa" || auth.team === "Event") && auth.role !== "Technical Lead") && (
                  <NavItem to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</NavItem>
                )}

              {auth && (
                <>
                  <NavItem to="/techteams" onClick={() => setMenuOpen(false)}>Contribute Event</NavItem>

                  <button
                    onClick={loggingout}
                    className="text-left text-red-600 hover:text-red-700 transition flex items-center space-x-2"
                  >
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
