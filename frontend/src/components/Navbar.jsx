/**
 * Navbar.jsx – Top navigation bar with logo and page links.
 */
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/',          label: 'Home'         },
  { to: '/visualize', label: 'Visualize'    },
  { to: '/analytics', label: 'Analytics'    },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between
                 px-6 py-3 border-b border-brain-border glass-panel"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600
                        flex items-center justify-center text-sm shadow-lg
                        shadow-sky-500/30 group-hover:shadow-sky-500/50 transition-shadow">
          🧠
        </div>
        <span className="font-bold text-white text-base tracking-tight hidden sm:block">
          Brain<span className="text-sky-400">Viz</span>
        </span>
      </NavLink>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Badge */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Simulated Data
      </div>
    </motion.nav>
  );
}

