import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { config } from '../config';

const faqs = [
  { question: 'How do I invite the bot to my server?',      answer: 'Click the Invite Bot button at the top of the page. You will be redirected to Discord where you can select your server and authorize the bot.' },
  { question: 'What permissions does the bot need?',         answer: 'For full functionality we recommend Administrator permission. You can also grant granular permissions based on the modules you enable.' },
  { question: 'How do I configure the bot for my server?',  answer: 'After inviting the bot, run /setup in your server and continue in the dashboard for feature-level configuration.' },
  { question: 'Is the bot free to use?',                    answer: 'Yes. Core features are free. Premium plans unlock advanced analytics, priority support, and more automation options.' },
  { question: 'Can I customize commands and modules?',       answer: 'Absolutely. You can toggle modules, define behavior per channel, and customize command settings through setup and dashboard tools.' },
  { question: 'How reliable is the bot?',                   answer: 'The infrastructure is designed for high availability. Check the status section for incidents and maintenance windows.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const supportHref = config.supportServerUrl || (config.contactEmail ? `mailto:${config.contactEmail}` : '#support');
  const supportExternal = Boolean(config.supportServerUrl);
  const docsHref = config.docsUrl || '#docs';
  const docsExternal = Boolean(config.docsUrl);

  return (
    <section id="faq" className="py-32 bg-[#010208] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">
            Neural <span className="text-brand-gradient">Feedback</span>
          </h2>
          <p className="text-xl text-slate-400 font-bold uppercase tracking-widest">
            Resolving paradoxes from the event horizon.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="hud-border rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 group"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-8 text-left"
              >
                <span className="font-black text-white uppercase tracking-tight text-lg pr-6 group-hover:text-amber-500 transition-colors">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-amber-500 transition-transform duration-500 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-8 pb-8 text-slate-400 font-bold leading-relaxed uppercase text-sm tracking-wide border-t border-white/5 pt-6 bg-white/[0.01]">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-500 font-black uppercase text-xs tracking-[0.2em] mb-8">
            Still experiencing instability? Read our{' '}
            <a href={docsHref} target={docsExternal ? '_blank' : undefined} rel={docsExternal ? 'noopener noreferrer' : undefined}
              className="text-amber-500 hover:text-amber-400 underline decoration-amber-500/30 underline-offset-4">
              Core Protocols
            </a>
          </p>
          <a href={supportHref} target={supportExternal ? '_blank' : undefined} rel={supportExternal ? 'noopener noreferrer' : undefined}
            className="inline-flex px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-500 hover:scale-105 bg-amber-500 text-black hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]">
            Command Center
          </a>
        </div>
      </div>
    </section>
  );
}
