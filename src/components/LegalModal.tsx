interface LegalModalProps {
  type: 'terms' | 'privacy' | 'cookies' | null;
  onClose: () => void;
  botName: string;
}

const legalCopy = {
  terms: {
    title: 'Terms of Service',
    content:
      'By using this bot you agree to use it responsibly, follow Discord policies, and avoid abuse. Service availability may change over time, and features can be updated without prior notice.',
  },
  privacy: {
    title: 'Privacy Policy',
    content:
      'We only process data required for bot functionality, moderation, and analytics. We do not sell personal data. You can request removal of server-related data by contacting support.',
  },
  cookies: {
    title: 'Cookies Policy',
    content:
      'This site may use essential and analytics cookies to improve performance and user experience. You can control cookies through your browser settings at any time.',
  },
};

export default function LegalModal({ type, onClose, botName }: LegalModalProps) {
  if (!type) {
    return null;
  }

  const content = legalCopy[type];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-gray-900/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4">
          <div>
            <h3 id="legal-modal-title" className="text-2xl font-bold text-gray-900">
              {content.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{botName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
          >
            Close
          </button>
        </div>

        <div className="p-6 text-gray-700 leading-relaxed">
          <p>{content.content}</p>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: March 5, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
