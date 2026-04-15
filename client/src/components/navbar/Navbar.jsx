import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import NotificationPanel from "../ui/NotificationPanel";
import { FiLogOut, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide navbar on auth paths
  const authPaths = ['/', '/login', '/admin-login', '/register', '/verify', '/forgot-password', '/reset-password'];
  if (authPaths.includes(location.pathname)) return null;

  const isPolice = user?.role === 'police';

  return (
    <header className="fixed w-full z-50 px-6 py-4">
      <div className={`max-w-7xl mx-auto rounded-[32px] px-8 py-4 flex items-center justify-between transition-luxury border
        ${isPolice 
          ? 'bg-navy/80 border-white/10 backdrop-blur-3xl' 
          : 'bg-white/80 border-gray-100 backdrop-blur-3xl shadow-luxury'}
      `}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-navy font-black shadow-gold-glow group-hover:rotate-12 transition-luxury">
            IN
          </div>
          <div className={`font-display font-black tracking-tight text-lg ${isPolice ? 'text-white' : 'text-navy'}`}>
             Policing <span className="text-gold">Portal</span>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to={isPolice ? '/police' : '/citizen/home'} label="Dashboard" active={location.pathname.includes('/home') || location.pathname === '/police'} light={isPolice} />
          <NavLink to="/updates" label="Safety Feed" active={location.pathname === '/updates'} light={isPolice} />
          <NavLink to="/status" label="Tracking" active={location.pathname === '/status'} light={isPolice} />
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl border ${isPolice ? 'bg-white/5 border-white/10 text-gold' : 'bg-slate-50 border-gray-100 text-navy'}`}>
                 <NotificationPanel />
              </div>
              
              <Link 
                to="/profile" 
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl transition-luxury font-bold text-sm
                  ${isPolice ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-navy hover:bg-slate-50'}
                `}
              >
                <FiUser /> {user.name?.split(' ')[0]}
              </Link>

              <button
                onClick={logout}
                className="bg-gold text-navy w-10 h-10 md:w-auto md:px-6 md:py-2 rounded-xl font-black text-xs md:text-sm shadow-lg hover:shadow-gold-glow transition-luxury flex items-center justify-center gap-2 active:scale-95"
              >
                <FiLogOut className="md:hidden text-lg" />
                <span className="hidden md:inline">LOGOUT</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-navy text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition shadow-lg shadow-navy/20"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

const NavLink = ({ to, label, active, light }) => (
  <Link 
    to={to} 
    className={`font-black text-xs uppercase tracking-widest transition-luxury relative py-2
      ${active 
        ? (light ? 'text-gold' : 'text-navy') 
        : (light ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-navy')}
    `}
  >
    {label}
    {active && (
      <motion.div 
        layoutId="activeNav"
        className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${light ? 'bg-gold' : 'bg-navy'}`} 
      />
    )}
  </Link>
);
