import { Activity } from 'lucide-react';
import { config } from '../config';

export default function StatusSection() {
  const hasStatus = Boolean(config.statusUrl);

  return (
    <section id="status" className="py-20 bg-gray-50 border-y border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold mb-6">
          <Activity className="w-4 h-4" />
          Service Status
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Stay Updated on Bot Health</h2>
        {hasStatus ? (
          <a
            href={config.statusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800"
          >
            Open Status Page
          </a>
        ) : (
          <p className="text-gray-600">
            Public status page is not available yet. Visit <a href="#support" className="text-purple-700 font-semibold hover:text-purple-800">support</a> for incident updates.
          </p>
        )}
      </div>
    </section>
  );
}
