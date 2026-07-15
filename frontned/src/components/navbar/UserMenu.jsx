import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { FiGrid, FiLogOut, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../hooks/useAuth';
import { showSuccessToast } from '../../utils/toast';

const menuItems = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: FiGrid },
  { label: 'Profile', to: ROUTES.profile, icon: FiUser },
];

function UserMenu({ onAction }) {
  const menuId = useId();
  const containerRef = useRef(null);
  const firstItemRef = useRef(null);
  const itemRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      firstItemRef.current?.focus();
    }
  }, [isOpen]);

  if (!currentUser) {
    return null;
  }

  const closeMenu = () => {
    setIsOpen(false);
    onAction?.();
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    showSuccessToast('Logged out successfully.');
  };

  const handleMenuKeyDown = (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const focusableItems = itemRefs.current.filter(Boolean);
    const currentIndex = focusableItems.indexOf(document.activeElement);
    const lastIndex = focusableItems.length - 1;

    if (event.key === 'Home') {
      focusableItems[0]?.focus();
      return;
    }

    if (event.key === 'End') {
      focusableItems[lastIndex]?.focus();
      return;
    }

    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + focusableItems.length) % focusableItems.length;
    focusableItems[nextIndex]?.focus();
  };

  const userInitial = currentUser.fullName?.charAt(0) || 'B';

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className="inline-flex max-w-[210px] items-center gap-2 rounded-full border border-white/70 bg-[rgba(255,255,255,0.88)] px-2.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition duration-300 hover:border-rose-200 hover:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15"
      >
        {currentUser.avatar ? (
          <img src={currentUser.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-primary">
            {userInitial}
          </span>
        )}
        <span className="min-w-0 truncate text-sm font-semibold text-[#111827]">{currentUser.fullName}</span>
        {currentUser.role ? (
          <span className="hidden rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary sm:inline">
            {currentUser.role}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id={menuId}
            role="menu"
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute right-0 z-50 mt-3 w-48 overflow-hidden rounded-2xl border border-white/70 bg-[rgba(255,255,255,0.95)] p-2 shadow-[0_10px_34px_rgba(0,0,0,0.1)] backdrop-blur-[18px]"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                    if (index === 0) {
                      firstItemRef.current = element;
                    }
                  }}
                  to={item.to}
                  role="menuitem"
                  tabIndex={0}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#111827] transition duration-250 hover:bg-rose-50 hover:text-primary focus:bg-rose-50 focus:text-primary focus:outline-none"
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              role="menuitem"
              ref={(element) => {
                itemRefs.current[menuItems.length] = element;
              }}
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#111827] transition duration-250 hover:bg-rose-50 hover:text-primary focus:bg-rose-50 focus:text-primary focus:outline-none"
            >
              <FiLogOut size={17} />
              Logout
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default UserMenu;
