import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { Link, NavLink } from 'react-router-dom';
import UserMenu from '../navbar/UserMenu';
import { navLinks, ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

const navItemClass = ({ isActive }) =>
  `transition-colors duration-300 ${
    isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'
  }`;

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'border-b border-rose-100/80 bg-white/90 shadow-soft backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.home} className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-lg font-semibold text-white shadow-glow">
            B
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-text">BloodBridge</p>
            <p className="text-xs text-slate-500">Connecting care in moments that matter</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navItemClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {currentUser ? (
            <UserMenu />
          ) : (
            <>
              <NavLink
                to={ROUTES.login}
                className="rounded-full border border-rose-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-rose-300 hover:bg-rose-50"
              >
                Login
              </NavLink>
              <NavLink
                to={ROUTES.register}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-secondary"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden ${
            isScrolled ? 'border-rose-200 bg-white text-primary' : 'border-white/30 bg-white/10 text-white backdrop-blur'
          }`}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <HiOutlineX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-rose-100 bg-white/95 px-5 pb-6 pt-4 shadow-soft backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 transition ${
                      isActive ? 'bg-rose-50 text-primary' : 'text-slate-700 hover:bg-rose-50/80'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {currentUser ? (
                <div className="mt-2 flex justify-end">
                  <UserMenu onAction={() => setIsMenuOpen(false)} />
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <NavLink
                    to={ROUTES.login}
                    className="rounded-full border border-rose-200 px-4 py-3 text-center font-medium text-slate-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to={ROUTES.register}
                    className="rounded-full bg-primary px-4 py-3 text-center font-medium text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
