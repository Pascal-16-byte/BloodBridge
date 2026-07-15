import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import { Link, NavLink } from 'react-router-dom';
import UserMenu from '../navbar/UserMenu';
import { navLinks, ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';

const navItemClass = ({ isActive }) =>
  `relative inline-flex items-center py-1 text-[16px] font-semibold tracking-[0.2px] transition-all duration-300 ease-out after:absolute after:left-1/2 after:bottom-0 after:h-[3px] after:w-full after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-transform after:duration-300 after:content-[''] ${
    isActive
      ? 'text-primary after:scale-x-100'
      : 'text-[#111827] after:scale-x-0 hover:text-primary hover:after:scale-x-100'
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
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/60 transition-all duration-500 ${
        isScrolled
          ? 'bg-[rgba(255,255,255,0.95)] shadow-[0_10px_34px_rgba(0,0,0,0.1)] backdrop-blur-[18px]'
          : 'bg-[rgba(255,255,255,0.88)] shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-[18px]'
      }`}
    >
      <nav className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-6 lg:px-8 ${isScrolled ? 'py-3.5' : 'py-4'}`}>
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
                className="rounded-full border border-rose-200 bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#111827] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition duration-250 hover:border-rose-300 hover:bg-white hover:text-primary"
              >
                Login
              </NavLink>
              <NavLink
                to={ROUTES.register}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition duration-250 hover:-translate-y-0.5 hover:bg-secondary"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 lg:hidden ${
            isScrolled
              ? 'border-white/70 bg-white/90 text-primary shadow-[0_6px_20px_rgba(0,0,0,0.08)] backdrop-blur-[18px]'
              : 'border-white/45 bg-white/70 text-primary shadow-[0_6px_20px_rgba(0,0,0,0.06)] backdrop-blur-[18px]'
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
            className="border-t border-white/70 bg-[rgba(255,255,255,0.95)] px-5 pb-6 pt-4 shadow-[0_10px_34px_rgba(0,0,0,0.1)] backdrop-blur-[18px] lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-[16px] font-semibold tracking-[0.2px] transition duration-250 ${
                      isActive ? 'bg-rose-50 text-primary' : 'text-[#111827] hover:bg-rose-50/80 hover:text-primary'
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
                    className="rounded-full border border-rose-200 bg-white/80 px-4 py-3 text-center font-semibold text-[#111827] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition duration-250 hover:bg-white hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to={ROUTES.register}
                    className="rounded-full bg-primary px-4 py-3 text-center font-semibold text-white shadow-glow transition duration-250 hover:bg-secondary"
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
