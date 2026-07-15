export const ROUTES = {
  home: '/',
  about: '/about',
  becomeDonor: '/become-donor',
  donor: '/donor',
  findDonors: '/find-donors',
  requestBlood: '/request-blood',
  emergencyRequest: '/emergency-request',
  requests: '/requests',
  activeRequests: '/active-requests',
  contact: '/contact',
  faq: '/faq',
  dashboard: '/dashboard',
  profile: '/profile',
  editProfile: '/profile/edit',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
};

export const navLinks = [
  { label: 'Home', to: ROUTES.home },
  { label: 'About', to: ROUTES.about },
  { label: 'Donate', to: ROUTES.becomeDonor },
  { label: 'Find Donors', to: ROUTES.findDonors },
  { label: 'Request Blood', to: ROUTES.requestBlood },
  { label: 'Contact', to: ROUTES.contact },
  { label: 'FAQ', to: ROUTES.faq },
];

export const footerLinks = [
  { label: 'Home', to: ROUTES.home },
  { label: 'About', to: ROUTES.about },
  { label: 'Become a Donor', to: ROUTES.becomeDonor },
  { label: 'Find Donors', to: ROUTES.findDonors },
  { label: 'Request Blood', to: ROUTES.requestBlood },
  { label: 'Contact', to: ROUTES.contact },
  { label: 'FAQ', to: ROUTES.faq },
];
