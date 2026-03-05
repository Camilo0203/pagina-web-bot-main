import { useState } from 'react';
import { Bot, Menu, X } from 'lucide-react';
import { getDiscordInviteUrl, config } from '../config';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Stats', href: '#stats' },
  { label: 'Commands', href: '#commands' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'Support', href: '#support' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const inviteUrl = getDiscordInviteUrl();
  const inviteEnabled = Boolean(inviteUrl);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="#top" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline">{config.botName}</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={inviteEnabled ? inviteUrl : '#top'}
              target={inviteEnabled ? '_blank' : undefined}
              rel={inviteEnabled ? 'noopener noreferrer' : undefined}
              aria-disabled={!inviteEnabled}
              onClick={(event) => {
                if (!inviteEnabled) {
                  event.preventDefault();
                }
              }}
              className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                inviteEnabled
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
              }`}
            >
              Invite
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200/50">
            <div className="space-y-2 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={inviteEnabled ? inviteUrl : '#top'}
                target={inviteEnabled ? '_blank' : undefined}
                rel={inviteEnabled ? 'noopener noreferrer' : undefined}
                aria-disabled={!inviteEnabled}
                onClick={(event) => {
                  if (!inviteEnabled) {
                    event.preventDefault();
                    return;
                  }
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 rounded-lg font-semibold text-center mt-2 ${
                  inviteEnabled
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-300'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-70'
                }`}
              >
                Invite Bot
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
