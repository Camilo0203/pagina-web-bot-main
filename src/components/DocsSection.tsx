import { BookOpen, TerminalSquare } from 'lucide-react';
import { config } from '../config';

export default function DocsSection() {
  return (
    <section id="docs" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Documentation</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn commands, setup flow, and best practices to launch in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <BookOpen className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Full Docs</h3>
            <p className="text-gray-600 mb-5">Guides, troubleshooting, and integration references.</p>
            {config.docsUrl ? (
              <a
                href={config.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-5 py-2.5 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800"
              >
                Open Docs
              </a>
            ) : (
              <a href="#guide" className="inline-flex px-5 py-2.5 rounded-lg bg-purple-100 text-purple-700 font-semibold hover:bg-purple-200">
                Read Setup Guide
              </a>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <TerminalSquare className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Command Reference</h3>
            <p className="text-gray-600 mb-5">Browse slash commands and common usage examples.</p>
            <a href="#commands" className="inline-flex px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700">
              View Commands
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
