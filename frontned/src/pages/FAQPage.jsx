import { useMemo, useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import SearchBar from '../components/common/SearchBar';
import SectionTitle from '../components/common/SectionTitle';
import FAQAccordion from '../components/faq/FAQAccordion';
import PageTransition from '../components/PageTransition';
import { faqItems } from '../utils/previewData';

function FAQIllustration() {
  return (
    <div className="rounded-[36px] border border-white/75 bg-white/85 p-8 shadow-soft">
      <div className="rounded-[30px] bg-gradient-to-br from-primary to-secondary p-6 text-white">
        <p className="text-sm uppercase tracking-[0.24em] text-rose-50/80">Help Center</p>
        <p className="mt-5 font-display text-3xl font-semibold">Answers for donors and recipients</p>
      </div>
      <div className="mt-5 rounded-[28px] bg-rose-50 p-5 text-sm leading-7 text-slate-600">
        Search the most common questions to preview a lightweight support center experience.
      </div>
    </div>
  );
}

function FAQ() {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredItems = useMemo(
    () =>
      faqItems.filter((item) => {
        const haystack = `${item.question} ${item.answer}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
      }),
    [query],
  );

  return (
    <PageTransition className="bg-surface">
      <PageHeader
        badge="FAQ"
        title="Quick answers for blood donation questions."
        description="This page pairs searchable help content with a clean accordion UI so users can find reassurance without friction."
        illustration={<FAQIllustration />}
      />

      <section className="mx-auto max-w-5xl px-5 pb-16 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Search"
          title="Find the answer you need"
          description="Use the search bar to narrow the FAQ list instantly."
          align="center"
        />
        <div className="mx-auto mt-8 max-w-2xl">
          <SearchBar value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search FAQs..." />
        </div>

        <div className="mt-10">
          {filteredItems.length === 0 ? (
            <EmptyState
              title="No matching questions"
              description="Try a different keyword like donation, safe, healthy, or frequency."
            />
          ) : (
            <FAQAccordion items={filteredItems} openIndex={openIndex} onToggle={setOpenIndex} />
          )}
        </div>
      </section>
    </PageTransition>
  );
}

export default FAQ;
