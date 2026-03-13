import { Bot, Twitter, Github, MessageCircle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { config } from '../config';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy' | 'cookies') => void;
}

export default function Footer({ onOpenLegal }: FooterProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">{config.botName}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The ultimate Discord bot for community management, engagement, and automation.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Features</a></li>
              <li><a href="#commands" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Commands</a></li>
              <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#dashboard" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Dashboard</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#docs" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#guide" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Setup Guide</a></li>
              <li><a href="#support" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Support</a></li>
              <li><a href="#status" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Status</a></li>
              <li><a href="#faq" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('cookies')}
                  className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors"
                >
                  Cookies
                </button>
              </li>
              <li><a href="#top" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white transition-colors">Back to Top</a></li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} {config.botName}. All rights reserved.
            </p>

            <div className="flex gap-4">
              {config.twitterUrl && (
                <a
                  href={config.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {config.githubUrl && (
                <a
                  href={config.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {config.supportServerUrl && (
                <a
                  href={config.supportServerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  aria-label="Discord"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {config.contactEmail && (
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
