import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { footerLinks } from '../../constants/routes';
import { emergencyNumbers } from '../../utils/siteData';

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#2d0c0c] text-white">
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_0.9fr_0.8fr] lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-accent font-display text-lg font-semibold text-primary">
              B
            </div>
            <div>
              <p className="font-display text-xl font-semibold">BloodBridge</p>
              <p className="text-sm text-rose-100/70">Warm support for urgent moments</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-rose-50/80">
            A modern blood donation and emergency request experience built to make generosity feel immediate,
            trusted, and deeply human.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-semibold">Quick Links</h3>
          <div className="space-y-3 text-sm text-rose-50/80">
            {footerLinks.map((item) => (
              <Link key={item.to} to={item.to} className="block transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-semibold">Contact</h3>
          <div className="space-y-3 text-sm text-rose-50/80">
            <p>care@bloodbridge.org</p>
            <p>+91 1800 210 900</p>
            <p>Ahmedabad, Mumbai, Delhi, Bengaluru</p>
          </div>
          <div className="mt-6 flex gap-3">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, index) => (
              <a
                key={index}
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/15"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-semibold">Emergency Numbers</h3>
          <div className="space-y-3 text-sm text-rose-50/80">
            {emergencyNumbers.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 flex items-center gap-2 font-medium text-white">
                  <FaPhoneAlt size={12} />
                  {item.label}
                </p>
                <p>{item.number}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-rose-50/65">
        Copyright (c) {new Date().getFullYear()} BloodBridge. Every drop saves a life.
      </div>
    </footer>
  );
}

export default Footer;
