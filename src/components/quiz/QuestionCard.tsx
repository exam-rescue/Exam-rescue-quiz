'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore, QuestionData } from '@/lib/store';
import MathJaxText from './MathJaxText';

interface QuestionCardProps {
  question: QuestionData;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
  answered: boolean;
  mode: 'battle' | 'practice';
}

export default function QuestionCard({ question, selectedIndex, onAnswer, answered, mode }: QuestionCardProps) {
  const options = [
    { label: 'A', text: question.optionA },
    { label: 'B', text: question.optionB },
    { label: 'C', text: question.optionC },
    { label: 'D', text: question.optionD },
  ];

  const correctIndex = question.correct - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Question */}
      <div className="study-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
            {question.subject}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
            {question.difficulty}
          </span>
        </div>
        <MathJaxText content={question.text} as="h2" className="text-base sm:text-lg md:text-xl font-semibold text-white leading-relaxed" />
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => {
          let btnClass = 'option-btn rounded-xl p-3 sm:p-4 cursor-pointer text-left w-full';

          if (answered) {
            if (index === selectedIndex && index === correctIndex) {
              btnClass += ' selected-correct';
            } else if (index === selectedIndex && index !== correctIndex) {
              btnClass += ' selected-wrong';
            } else if (index === correctIndex && index !== selectedIndex) {
              btnClass += ' reveal-correct';
            }
          }

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={btnClass}
              onClick={() => !answered && onAnswer(index)}
              disabled={answered}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-sm sm:text-base text-indigo-400">
                  {option.label}
                </span>
                <MathJaxText content={option.text} className="text-sm sm:text-base text-white/90 font-medium" />
                {answered && index === correctIndex && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-emerald-400 text-xl"
                  >
                    &#10003;
                  </motion.span>
                )}
                {answered && index === selectedIndex && index !== correctIndex && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-rose-400 text-xl"
                  >
                    &#10007;
                  </motion.span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && mode === 'practice' && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          className="mt-4 study-card p-4 border-l-4 border-l-amber-400"
        >
          <h4 className="text-sm font-bold text-amber-400 mb-1">Explanation</h4>
          <MathJaxText content={question.explanation} className="text-sm text-white/80" />
        </motion.div>
      )}
    </motion.div>
  );
}

