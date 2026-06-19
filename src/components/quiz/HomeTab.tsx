'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swords, BookOpen, Trophy, Star, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/lib/store';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const testimonials = [
  { name: "Ravi K.", text: "Exam Rescue made me actually enjoy studying! The battle mode is so addictive.", score: "12,500 XP" },
  { name: "Sneha M.", text: "I went from dreading Physics to topping my class. The combo system is genius!", score: "9,800 XP" },
  { name: "Arjun P.", text: "Practice mode helped me understand concepts deeply. The explanations are clear.", score: "7,200 XP" },
  { name: "Meera T.", text: "My NEET prep changed completely. Exam Rescue is a game-changer!", score: "5,400 XP" },
];

const features = [
  {
    icon: <Swords size={28} />,
    title: 'Battle Mode',
    desc: 'Race against the clock with 30s timers, build combos, and earn massive XP!',
    color: 'neon-orange',
    action: 'battle' as const,
  },
  {
    icon: <BookOpen size={28} />,
    title: 'Practice Mode',
    desc: 'Learn at your own pace with detailed explanations for every question.',
    color: 'neon-green',
    action: 'practice' as const,
  },
  {
    icon: <Trophy size={28} />,
    title: 'Leaderboard',
    desc: 'Compete with students across India and climb the global rankings!',
    color: 'neon-amber',
    action: 'leaderboard' as const,
  },
];

export default function HomeTab() {
  const { setActiveTab } = useGameStore();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Floating Particles */}
      <div className="particles fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center py-12 sm:py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6">
            <span className="gradient-text">Crush Your Exams</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-6 sm:mb-8">
            The most addictive quiz app for CBSE, JEE & NEET preparation.
            Battle, learn, and level up your way to the top! 🚀
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('battle')}
              className="neon-btn bg-neon-orange text-white font-bold py-3 px-8 rounded-xl text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
            >
              <Swords size={18} />
              Start Battle
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('practice')}
              className="neon-btn-green bg-neon-green text-white font-bold py-3 px-8 rounded-xl text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              Train Now
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Live Stats */}
      <section className="relative z-10 py-8 sm:py-12 px-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto">
          {[
            { label: 'Total Players', value: 1247, icon: '👥' },
            { label: 'Questions Done', value: 54230, icon: '📝' },
            { label: 'Games Played', value: 8910, icon: '🎮' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card p-3 sm:p-4 text-center"
            >
              <span className="text-xl sm:text-2xl mb-1 block">{stat.icon}</span>
              <p className="text-xl sm:text-2xl font-bold text-neon-orange">
                <AnimatedCounter target={stat.value} />
              </p>
              <p className="text-[10px] sm:text-xs text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-8 sm:py-12 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-6 sm:mb-8">
          Choose Your <span className="gradient-text">Path</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {features.map((feature, i) => (
            <motion.button
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(feature.action)}
              className="glass-card p-5 sm:p-6 text-center cursor-pointer group relative overflow-hidden"
            >
              <div className={`inline-flex p-3 rounded-xl mb-3 bg-${feature.color}/10 text-${feature.color} group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-${feature.color}/5 to-transparent pointer-events-none`} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-8 sm:py-12 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-6 sm:mb-8">
          What Students <span className="gradient-text">Say</span>
        </h2>
        <div className="max-w-lg mx-auto">
          <div className="relative glass-card p-6 min-h-[140px]">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <p className="text-sm sm:text-base text-white/80 italic mb-3">
                &ldquo;{testimonials[testimonialIndex].text}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neon-orange/20 flex items-center justify-center text-neon-orange font-bold text-sm">
                  {testimonials[testimonialIndex].name[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">{testimonials[testimonialIndex].name}</p>
                  <p className="text-xs text-neon-amber">{testimonials[testimonialIndex].score}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === testimonialIndex ? 'bg-neon-orange w-6' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="relative z-10 py-8 sm:py-12 px-4 text-center">
        <p className="text-sm text-white/40 mb-4">Join our community</p>
        <div className="flex justify-center gap-3">
          <a
            href="https://chat.whatsapp.com/GcFBrH3SVAK2Mn3XBTRvNF"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card px-4 py-2.5 text-sm font-medium text-white/70 hover:text-neon-green transition-colors flex items-center gap-2"
          >
            💬 WhatsApp
          </a>
          <a
            href="https://t.me/examrescue"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card px-4 py-2.5 text-sm font-medium text-white/70 hover:text-neon-orange transition-colors flex items-center gap-2"
          >
            ✈️ Telegram
          </a>
        </div>
      </section>
    </div>
  );
}
