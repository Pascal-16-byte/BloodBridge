import {
  Activity,
  BellRing,
  BriefcaseMedical,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  TimerReset,
  UserRoundPlus,
  Users,
  Zap,
} from 'lucide-react';

export const aboutMission = [
  {
    title: 'Our Mission',
    description:
      'BloodBridge helps patients, families, donors, and hospitals connect faster through a calm, trustworthy emergency support experience.',
    icon: HeartHandshake,
  },
  {
    title: 'Our Vision',
    description:
      'We envision a connected care network where no urgent blood request is slowed down by confusion, distance, or outdated communication.',
    icon: BriefcaseMedical,
  },
];

export const aboutSteps = [
  {
    step: '01',
    title: 'Register',
    description: 'Create a donor or requester profile with essential health and location details.',
    icon: UserRoundPlus,
  },
  {
    step: '02',
    title: 'Find Donors',
    description: 'Search matching blood groups by state, district, and city in a clean and responsive flow.',
    icon: Users,
  },
  {
    step: '03',
    title: 'Contact',
    description: 'Reach available donors through direct contact methods and request actions.',
    icon: BellRing,
  },
  {
    step: '04',
    title: 'Save Lives',
    description: 'Faster coordination means better outcomes for emergency patients and care teams.',
    icon: HeartHandshake,
  },
];

export const aboutStats = [
  { label: 'Registered Donors', value: 18420, suffix: '+', icon: Users },
  { label: 'Lives Saved', value: 9675, suffix: '+', icon: HeartHandshake },
  { label: 'Blood Requests', value: 3240, suffix: '+', icon: Activity },
  { label: 'Hospitals Connected', value: 138, suffix: '+', icon: BriefcaseMedical },
];

export const aboutFeatures = [
  {
    title: 'Fast',
    description: 'Built for urgent use cases with simplified flows and fewer decision delays.',
    icon: Zap,
  },
  {
    title: 'Reliable',
    description: 'Structured donor information helps teams act with more confidence during emergencies.',
    icon: Stethoscope,
  },
  {
    title: 'Secure',
    description: 'Thoughtful form patterns and clear communication help sensitive healthcare data feel safe.',
    icon: ShieldCheck,
  },
  {
    title: 'Community Driven',
    description: 'The platform is designed around donors, families, hospitals, and volunteers working together.',
    icon: HeartHandshake,
  },
];

export const teamMembers = [
  {
    name: 'Dr. Ananya Rao',
    role: 'Founder',
    description: 'Emergency physician shaping a calmer digital response for blood coordination.',
  },
  {
    name: 'Karan Mehta',
    role: 'Developer',
    description: 'Frontend engineer focused on trustworthy healthcare UX and resilient interfaces.',
  },
  {
    name: 'Priya Shah',
    role: 'Volunteer Coordinator',
    description: 'Community lead aligning donor readiness, outreach, and local partner support.',
  },
];

export const locationOptions = {
  states: ['Gujarat', 'Maharashtra', 'Delhi', 'Karnataka'],
  districts: ['Ahmedabad', 'Mumbai Suburban', 'South Delhi', 'Bengaluru Urban'],
  cities: ['Ahmedabad', 'Mumbai', 'New Delhi', 'Bengaluru'],
};

export const donorDirectory = [
  {
    id: 1,
    name: 'Aarav Sharma',
    bloodGroup: 'O+',
    age: 28,
    state: 'Delhi',
    district: 'South Delhi',
    city: 'New Delhi',
    location: 'Saket, New Delhi',
    availability: 'Available Now',
    phone: '+91 98765 11021',
    email: 'aarav.sharma@bloodbridge.org',
  },
  {
    id: 2,
    name: 'Neha Patel',
    bloodGroup: 'A+',
    age: 25,
    state: 'Gujarat',
    district: 'Ahmedabad',
    city: 'Ahmedabad',
    location: 'Navrangpura, Ahmedabad',
    availability: 'Available Now',
    phone: '+91 98765 11022',
    email: 'neha.patel@bloodbridge.org',
  },
  {
    id: 3,
    name: 'Rohan Iyer',
    bloodGroup: 'B-',
    age: 31,
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    location: 'Indiranagar, Bengaluru',
    availability: 'Available Now',
    phone: '+91 98765 11023',
    email: 'rohan.iyer@bloodbridge.org',
  },
  {
    id: 4,
    name: 'Sana Khan',
    bloodGroup: 'AB+',
    age: 29,
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Mumbai',
    location: 'Andheri, Mumbai',
    availability: 'Available Now',
    phone: '+91 98765 11024',
    email: 'sana.khan@bloodbridge.org',
  },
  {
    id: 5,
    name: 'Harsh Verma',
    bloodGroup: 'O-',
    age: 34,
    state: 'Delhi',
    district: 'South Delhi',
    city: 'New Delhi',
    location: 'Lajpat Nagar, New Delhi',
    availability: 'Available Now',
    phone: '+91 98765 11025',
    email: 'harsh.verma@bloodbridge.org',
  },
  {
    id: 6,
    name: 'Ishita Desai',
    bloodGroup: 'B+',
    age: 27,
    state: 'Gujarat',
    district: 'Ahmedabad',
    city: 'Ahmedabad',
    location: 'Bopal, Ahmedabad',
    availability: 'Available Now',
    phone: '+91 98765 11026',
    email: 'ishita.desai@bloodbridge.org',
  },
  {
    id: 7,
    name: 'Vikram Nair',
    bloodGroup: 'A-',
    age: 33,
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    location: 'Whitefield, Bengaluru',
    availability: 'Available Now',
    phone: '+91 98765 11027',
    email: 'vikram.nair@bloodbridge.org',
  },
  {
    id: 8,
    name: 'Mira Joshi',
    bloodGroup: 'AB-',
    age: 30,
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Mumbai',
    location: 'Powai, Mumbai',
    availability: 'Available Now',
    phone: '+91 98765 11028',
    email: 'mira.joshi@bloodbridge.org',
  },
];

export const donorBenefits = [
  {
    title: 'Free Mini Health Check',
    description: 'Donation visits can help donors stay more aware of their routine health indicators.',
    icon: Stethoscope,
  },
  {
    title: 'Real Community Impact',
    description: 'Each donation supports families, hospitals, and emergency teams when timing matters most.',
    icon: HeartHandshake,
  },
  {
    title: 'Regular Donation Reminders',
    description: 'A structured donor experience makes it easier to return safely and consistently.',
    icon: TimerReset,
  },
];

export const eligibilityChecklist = [
  'Age 18-65',
  'Weight above 50kg',
  'Healthy',
  'No recent illness',
];

export const faqItems = [
  {
    question: 'Who can donate?',
    answer:
      'Most healthy adults between 18 and 65 who meet the weight and health requirements can usually donate after standard screening.',
  },
  {
    question: 'How often can I donate?',
    answer:
      'Whole blood donors are commonly advised to wait about 3 months between donations, though local medical guidance should always come first.',
  },
  {
    question: 'Is blood donation safe?',
    answer:
      'Yes. When handled by trained professionals with sterile equipment and proper screening, blood donation is considered very safe.',
  },
  {
    question: 'How long does it take?',
    answer:
      'The full visit often takes 30 to 45 minutes, while the actual blood collection itself is much shorter.',
  },
  {
    question: 'What should I eat after donation?',
    answer:
      'Hydration, iron-rich foods, and a balanced meal are generally recommended after donation to support recovery.',
  },
];

export const contactDetails = [
  { label: 'Email', value: 'care@bloodbridge.org' },
  { label: 'Phone', value: '+91 1800 210 900' },
  { label: 'Address', value: 'HealthHub Campus, Ahmedabad, India' },
  { label: 'Working Hours', value: 'Monday to Saturday, 8:00 AM - 8:00 PM' },
];

export const socialLinks = [
  { label: 'Instagram', href: '/' },
  { label: 'LinkedIn', href: '/' },
  { label: 'Facebook', href: '/' },
  { label: 'Twitter', href: '/' },
];
