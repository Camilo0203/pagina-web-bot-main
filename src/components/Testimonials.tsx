import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Community Manager',
    server: 'Gaming Hub',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'This bot has completely transformed how we manage our 50k+ member server. The auto-moderation alone has saved us countless hours.',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Server Owner',
    server: 'Art Community',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The leveling system keeps our members engaged and the music player is incredibly reliable. Best Discord bot we\'ve ever used!',
    rating: 5,
  },
  {
    name: 'Mike Rodriguez',
    role: 'Admin',
    server: 'Tech Talk',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Easy to set up, powerful features, and excellent support. The logging feature has been invaluable for moderating our community.',
    rating: 5,
  },
  {
    name: 'Emma Wilson',
    role: 'Moderator',
    server: 'Study Group',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The custom commands and automation features are game-changers. We\'ve automated so many repetitive tasks. Highly recommended!',
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Server Owner',
    server: 'Music Lovers',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The music quality is outstanding and the economy system keeps everyone engaged. Our server activity has doubled since adding this bot.',
    rating: 5,
  },
  {
    name: 'Lisa Anderson',
    role: 'Community Lead',
    server: 'Fitness Squad',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Professional, reliable, and feature-rich. The dashboard makes configuration so easy. This bot is worth every penny!',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by Server Owners Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our community has to say.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-purple-200" />

              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-purple-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-purple-600 font-medium">{testimonial.server}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
