import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: 'How do I upgrade my server to premium?',
      answer: 'Simply select a plan above, sign in with Discord, choose your server, and complete the checkout. Premium features will be activated within minutes.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! For monthly and yearly subscriptions, you can cancel anytime. Your premium features will remain active until the end of your billing period.',
    },
    {
      question: "What's the difference between Lifetime and subscriptions?",
      answer: 'Lifetime is a one-time payment with no recurring charges. You get premium features forever. Subscriptions (monthly/yearly) require recurring payments but can be cancelled anytime.',
    },
    {
      question: 'Can I upgrade multiple servers?',
      answer: 'Yes! Each server requires its own premium subscription. You can purchase premium for as many servers as you manage.',
    },
    {
      question: 'Do donations activate premium features?',
      answer: "No, donations are separate from premium subscriptions. They support development but don't activate premium features. To get premium, purchase a Pro plan.",
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Absolutely! All payments are processed through Lemon Squeezy, a trusted payment processor. We never store your payment information.',
    },
    {
      question: 'What happens if I cancel my subscription?',
      answer: 'Your premium features will remain active until the end of your current billing period. After that, your server will revert to the free plan.',
    },
    {
      question: 'Can I get a refund?',
      answer: "Yes! We offer a 7-day money-back guarantee on all purchases. Contact support if you're not satisfied.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-slate-900">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Everything you need to know about TON618 Pro
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left transition-all duration-200 hover:border-slate-600 hover:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white pr-8">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 text-slate-300 leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Contact support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400">
            Still have questions?{' '}
            <a
              href="#"
              className="font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Contact support
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
