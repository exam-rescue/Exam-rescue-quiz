'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Atom, FlaskConical, Leaf, Brain, BookOpen, Zap, BarChart3, Swords, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/lib/store';

const subjects = [
  {
    name: 'Physics',
    icon: <Atom size={28} />,
    questions: 1173,
    chapters: '30+',
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
  },
  {
    name: 'Chemistry',
    icon: <FlaskConical size={28} />,
    questions: 1781,
    chapters: '35+',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-400',
  },
  {
    name: 'Biology',
    icon: <Leaf size={28} />,
    questions: 2422,
    chapters: '40+',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },
  {
    name: 'General',
    icon: <Brain size={28} />,
    questions: 280,
    chapters: '1',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
  },
];

const steps = [
  {
    icon: <BookOpen size={24} />,
    title: 'Pick a Subject',
    desc: 'Choose from Physics, Chemistry, Biology or General Knowledge',
  },
  {
    icon: <Zap size={24} />,
    title: 'Answer Questions',
    desc: 'Battle against the clock or practice at your own pace',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Track Progress',
    desc: 'Earn XP, build streaks, and climb the leaderboard',
  },
];

function FadeInSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomeTab() {
  const { setActiveTab, setBattleCategory } = useGameStore();

  async function handleSubjectClick(subjectName: string) {
    const store = useGameStore.getState();
    store.resetBattle();
    store.setBattleCategory(subjectName);
    store.setActiveTab('battle');
    if (subjectName !== 'Mixed') store.addSubjectPlayed(subjectName);
    try {
      const res = await fetch(`/api/questions?category=${subjectName}&count=10`);
      const data = await res.json();
      if (data.questions) {
        store.setBattleQuestions(data.questions);
        store.setBattleStartTime(Date.now());
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  }

  return (
    <div className="pb-20 sm:pb-8">
      {/* Section 1: Hero */}
      <section className="flex flex-col items-center text-center py-16 sm:py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight">
            <span className="gradient-text">Master Every Subject</span>
          </h1>
          <p className="text-base sm:text-lg text-white/60 max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed">
            5,600+ questions across Physics, Chemistry, Biology &amp; General Knowledge.
            Practice, compete, and track your progress.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('battle')}
              className="btn-primary py-3 px-8 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Swords size={18} />
              Start Quiz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('practice')}
              className="btn-secondary py-3 px-8 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              Practice Mode
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Section 2: Subject Cards */}
      <section className="py-8 sm:py-12 px-4 max-w-3xl mx-auto">
        <FadeInSection>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Choose a Subject</h2>
        </FadeInSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((subject, i) => (
            <FadeInSection key={subject.name} delay={i * 0.1}>
              <button
                onClick={() => handleSubjectClick(subject.name)}
                className="subject-card group text-left w-full"
              >
                <div className={`subject-icon ${subject.iconBg} ${subject.iconColor} group-hover:scale-110 transition-transform`}>
                  {subject.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{subject.name}</h3>
                <p className="text-sm text-white/50 mb-3">{subject.questions.toLocaleString()} questions</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">{subject.chapters} chapters</span>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="py-8 sm:py-12 px-4 max-w-3xl mx-auto">
        <FadeInSection>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">How It Works</h2>
        </FadeInSection>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step, i) => (
            <FadeInSection key={step.title} delay={i * 0.1}>
              <div className="study-card text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-indigo-400 mb-2">Step {i + 1}</div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* Section 4: Quick Stats Bar */}
      <section className="py-8 sm:py-12 px-4 max-w-3xl mx-auto">
        <FadeInSection>
          <div className="study-card">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">5,600+</p>
                <p className="text-xs text-white/40">Questions</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">4</p>
                <p className="text-xs text-white/40">Subjects</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div>
                <p className="text-lg sm:text-xl font-bold text-white">100+</p>
                <p className="text-xs text-white/40">Chapters</p>
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/10" />
              <div>
                <p className="text-lg sm:text-xl font-bold text-emerald-400">Free Forever</p>
                <p className="text-xs text-white/40">No hidden costs</p>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Section 5: Community Links */}
      <section className="py-8 sm:py-12 px-4 max-w-3xl mx-auto">
        <FadeInSection>
          <div className="text-center">
            <p className="text-sm text-white/40 mb-4">Join our community</p>
            <div className="flex justify-center gap-3">
              <a
                href="https://chat.whatsapp.com/GcFBrH3SVAK2Mn3XBTRvNF"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white/60 hover:text-emerald-400 transition-colors"
              >
                💬 WhatsApp
              </a>
              <span className="text-white/20">|</span>
              <a
                href="https://t.me/examrescue"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white/60 hover:text-indigo-400 transition-colors"
              >
                ✈️ Telegram
              </a>
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
