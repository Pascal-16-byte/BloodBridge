import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, BellRing, BriefcaseMedical, CalendarClock, HeartPulse, MapPinned, ShieldCheck, TimerReset, UsersRound } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AnimatedCard from '../components/common/AnimatedCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import PageHeader from '../components/common/PageHeader';
import SectionTitle from '../components/common/SectionTitle';
import StatCard from '../components/common/StatCard';
import PageTransition from '../components/PageTransition';
import { useAuth } from '../hooks/useAuth';
import { getDashboardSummary } from '../services/dashboardService';

const chartColors = ['#B71C1C', '#E53935', '#EF9A9A', '#F8BBD0', '#FF8A80', '#D32F2F', '#FFCDD2', '#F06292'];

function formatBloodGroup(value) {
  const labels = {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-',
  };

  return labels[value] || value || 'Not set';
}

function formatDate(value) {
  if (!value) {
    return 'Not recorded';
  }

  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function daysUntilEligible(lastDonationDate) {
  if (!lastDonationDate) {
    return 0;
  }

  const eligibleDate = new Date(lastDonationDate);
  eligibleDate.setDate(eligibleDate.getDate() + 90);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eligibleDate.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((eligibleDate - today) / (1000 * 60 * 60 * 24)));
}

function buildDashboardStats(summary) {
  const requestTotal = Number(summary.activeRequestsCount || 0) + Number(summary.pendingRequestsCount || 0);
  const waitDays = daysUntilEligible(summary.lastDonationDate);

  return [
    { label: 'Active Requests', value: Number(summary.activeRequestsCount || 0), helper: 'Live request count', icon: BriefcaseMedical },
    { label: 'Pending Requests', value: Number(summary.pendingRequestsCount || 0), helper: 'Awaiting action', icon: BellRing },
    { label: 'Donation History', value: Number(summary.totalDonations || 0), helper: 'Total recorded donations', icon: Activity },
    { label: 'Profile Completion', value: Number(summary.profileCompletion || 0), suffix: '%', helper: 'Donor profile readiness', icon: ShieldCheck },
    {
      label: 'Donation Eligibility',
      value: summary.donationEligibility ? 'Eligible' : `${waitDays} days`,
      helper: summary.donationEligibility ? 'Ready to donate' : 'Remaining wait period',
      icon: TimerReset,
    },
    { label: 'Total Requests', value: requestTotal, helper: 'Active plus pending', icon: UsersRound },
  ];
}

function buildTimeline(summary) {
  return [
    {
      title: 'Dashboard synced',
      description: `${summary.userName || 'Your'} dashboard was loaded from the backend.`,
      time: 'Now',
    },
    {
      title: 'Donation eligibility checked',
      description: summary.donationEligibility
        ? 'Your last donation date allows you to donate when needed.'
        : `Your next eligible window opens in ${daysUntilEligible(summary.lastDonationDate)} days.`,
      time: formatDate(summary.lastDonationDate),
    },
    {
      title: 'Profile completion calculated',
      description: `Your donor profile is ${summary.profileCompletion || 0}% complete.`,
      time: 'Live status',
    },
  ];
}

function buildNotifications(summary) {
  return [
    {
      title: summary.emergencyAvailability ? 'Emergency availability enabled' : 'Emergency availability disabled',
      description: summary.emergencyAvailability
        ? 'Your profile can be considered for urgent donor coordination.'
        : 'You are currently marked unavailable for urgent donor coordination.',
      tone: summary.emergencyAvailability ? 'success' : 'info',
    },
    {
      title: summary.donationEligibility ? 'Donation eligible' : 'Donation wait period active',
      description: summary.donationEligibility
        ? 'Your donor status is ready based on the last donation date.'
        : `You have ${daysUntilEligible(summary.lastDonationDate)} days remaining before standard eligibility.`,
      tone: summary.donationEligibility ? 'success' : 'info',
    },
    {
      title: `${summary.pendingRequestsCount || 0} pending requests`,
      description: 'Request tracking is connected to the dashboard and will update when the requests module exists.',
      tone: Number(summary.pendingRequestsCount || 0) > 0 ? 'urgent' : 'info',
    },
  ];
}

function buildBloodGroupDistribution(summary) {
  return [{ name: formatBloodGroup(summary.bloodGroup), value: 1 }];
}

function buildRequestChart(summary) {
  return [
    {
      month: 'Current',
      donations: Number(summary.totalDonations || 0),
      requests: Number(summary.activeRequestsCount || 0) + Number(summary.pendingRequestsCount || 0),
    },
  ];
}

function DashboardIllustration({ currentUser, summary }) {
  return (
    <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
      <div className="flex items-center gap-4 rounded-[28px] bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 font-display text-2xl font-semibold">
          {formatBloodGroup(summary?.bloodGroup)}
        </div>
        <div>
          <p className="text-sm text-rose-50/80">Active Protected Session</p>
          <p className="mt-1 font-display text-2xl font-semibold">{summary?.userName || currentUser?.fullName || 'Care Coordinator'}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] bg-rose-50 p-5">
          <ShieldCheck className="text-primary" size={22} />
          <p className="mt-4 text-sm text-slate-500">Profile completion</p>
          <p className="font-display text-2xl font-semibold text-text">{summary?.profileCompletion || 0}%</p>
        </div>
        <div className="rounded-[24px] bg-rose-50 p-5">
          <HeartPulse className="text-primary" size={22} />
          <p className="mt-4 text-sm text-slate-500">Emergency availability</p>
          <p className="font-display text-xl font-semibold text-text">{summary?.emergencyAvailability ? 'Enabled' : 'Disabled'}</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { currentUser, loading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const data = await getDashboardSummary();
        if (active) {
          setSummary(data);
          setError('');
        }
      } catch (apiError) {
        if (active) {
          setError(apiError.message);
        }
      } finally {
        if (active) {
          setDashboardLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const viewerName = useMemo(() => (summary?.userName || currentUser?.fullName || 'Care Team').split(' ')[0], [currentUser, summary]);
  const dashboardStats = useMemo(() => (summary ? buildDashboardStats(summary) : []), [summary]);
  const dashboardTimeline = useMemo(() => (summary ? buildTimeline(summary) : []), [summary]);
  const notifications = useMemo(() => (summary ? buildNotifications(summary) : []), [summary]);
  const bloodGroupDistribution = useMemo(() => (summary ? buildBloodGroupDistribution(summary) : []), [summary]);
  const monthlyDonations = useMemo(() => (summary ? buildRequestChart(summary) : []), [summary]);

  if (loading || dashboardLoading) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
          <LoadingSkeleton className="h-72" />
          <div className="mt-8 grid gap-6 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-36" />
            ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <LoadingSkeleton className="h-96" />
            <LoadingSkeleton className="h-96" />
          </div>
        </section>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition className="bg-surface pt-28">
        <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-6 lg:px-8">
          <AnimatedCard hover={false} className="p-8 text-center">
            <AlertCircle className="mx-auto text-primary" size={36} />
            <h1 className="mt-5 font-display text-3xl font-semibold text-text">Unable to load dashboard</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">{error}</p>
          </AnimatedCard>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="Dashboard"
        title={`A clear command center for ${viewerName}.`}
        description="Your donor readiness, request counts, profile status, and availability are loaded from the backend."
        illustration={<DashboardIllustration currentUser={currentUser} summary={summary} />}
      />

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {dashboardStats.map((item, index) => (
            <StatCard key={item.label} icon={item.icon} label={item.label} value={item.value} suffix={item.suffix} helper={item.helper} delay={index * 0.06} />
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <AnimatedCard hover={false} className="p-7">
            <SectionTitle
              badge="Activity"
              title="Recent Activity Timeline"
              description="A quick chronology helps coordinators understand what changed most recently."
            />
            <div className="mt-8 space-y-5">
              {dashboardTimeline.map((item, index) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-primary">
                      <Activity size={18} />
                    </div>
                    {index < dashboardTimeline.length - 1 ? <div className="mt-3 h-full w-px bg-rose-200" /> : null}
                  </div>
                  <div className="pb-5">
                    <p className="font-display text-xl font-semibold text-text">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-primary/70">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <SectionTitle
              badge="Notifications"
              title="Recent Notifications Panel"
              description="Priority messaging can stay visible without overwhelming the core dashboard."
            />
            <div className="mt-8 space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.title}
                  className={`rounded-[24px] px-5 py-4 ${
                    item.tone === 'urgent'
                      ? 'bg-rose-100'
                      : item.tone === 'success'
                        ? 'bg-emerald-50'
                        : 'bg-sky-50'
                  }`}
                >
                  <p className="font-medium text-text">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </AnimatedCard>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <AnimatedCard hover={false} className="p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-text">Blood Group Distribution</h3>
                <p className="mt-2 text-sm text-slate-600">Blood group status from your donor record.</p>
              </div>
              <UsersRound className="text-primary" size={22} />
            </div>
            <div className="mt-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bloodGroupDistribution} dataKey="value" nameKey="name" outerRadius={110} innerRadius={62} paddingAngle={3}>
                    {bloodGroupDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>

          <AnimatedCard hover={false} className="p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-text">Monthly Donations</h3>
                <p className="mt-2 text-sm text-slate-600">Donation and request totals from the dashboard service.</p>
              </div>
              <CalendarClock className="text-primary" size={22} />
            </div>
            <div className="mt-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3d6d6" />
                  <XAxis dataKey="month" stroke="#8b5e5e" />
                  <YAxis stroke="#8b5e5e" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="donations" fill="#B71C1C" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="requests" fill="#EF9A9A" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <AnimatedCard className="p-6">
            <MapPinned className="text-primary" size={22} />
            <h3 className="mt-4 font-display text-xl font-semibold text-text">Nearby donor clusters</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">Current blood group: {formatBloodGroup(summary.bloodGroup)}.</p>
          </AnimatedCard>
          <AnimatedCard className="p-6">
            <BellRing className="text-primary" size={22} />
            <h3 className="mt-4 font-display text-xl font-semibold text-text">Emergency alerts</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{summary.emergencyAvailability ? 'Emergency availability is enabled.' : 'Emergency availability is disabled.'}</p>
          </AnimatedCard>
          <AnimatedCard className="p-6">
            <CalendarClock className="text-primary" size={22} />
            <h3 className="mt-4 font-display text-xl font-semibold text-text">Upcoming donation date</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{summary.donationEligibility ? 'You are currently eligible to donate.' : `${daysUntilEligible(summary.lastDonationDate)} days remain before eligibility.`}</p>
          </AnimatedCard>
        </div>
      </section>
    </PageTransition>
  );
}

export default Dashboard;
