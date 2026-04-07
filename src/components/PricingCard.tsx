import { Check, Zap, Crown, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface PricingCardProps {
  name: string;
  price: string;
  interval?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: 'zap' | 'crown' | 'sparkles';
  onSelect: () => void;
  loading?: boolean;
  badge?: string;
}

export function PricingCard({
  name,
  price,
  interval,
  description,
  features,
  highlighted = false,
  icon,
  onSelect,
  loading = false,
  badge,
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = {
    zap: Zap,
    crown: Crown,
    sparkles: Sparkles,
  }[icon];

  return (
    <div
      className={`
        relative rounded-2xl p-8 transition-all duration-300
        ${highlighted 
          ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white scale-105 shadow-2xl' 
          : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50'
        }
        ${isHovered && !highlighted ? 'scale-105 shadow-xl' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
          {badge}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${highlighted ? 'bg-white/20' : 'bg-purple-500/20'}`}>
          <IconComponent className={`w-6 h-6 ${highlighted ? 'text-white' : 'text-purple-400'}`} />
        </div>
        <h3 className={`text-2xl font-bold ${highlighted ? 'text-white' : 'text-white'}`}>
          {name}
        </h3>
      </div>

      <p className={`mb-6 ${highlighted ? 'text-white/90' : 'text-gray-400'}`}>
        {description}
      </p>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className={`text-5xl font-bold ${highlighted ? 'text-white' : 'text-white'}`}>
            {price}
          </span>
          {interval && (
            <span className={`text-lg ${highlighted ? 'text-white/70' : 'text-gray-400'}`}>
              /{interval}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={onSelect}
        disabled={loading}
        className={`
          w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200
          ${highlighted
            ? 'bg-white text-purple-600 hover:bg-gray-100'
            : 'bg-purple-600 text-white hover:bg-purple-700'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
      >
        {loading ? 'Processing...' : 'Get Started'}
      </button>

      <div className="mt-8 space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${highlighted ? 'text-white' : 'text-green-400'}`} />
            <span className={`text-sm ${highlighted ? 'text-white/90' : 'text-gray-300'}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
