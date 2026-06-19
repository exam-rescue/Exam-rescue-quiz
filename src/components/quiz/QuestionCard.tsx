'use client';

import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore, QuestionData } from '@/lib/store';

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

  const correctIndex = question.correct - 1; // 0-indexed

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      {/* Question */}
      <div className="glass-card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neon-orange/20 text-neon-orange">
            {question.subject}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neon-amber/20 text-neon-amber">
            {question.difficulty}
          </span>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white leading-relaxed">
          {question.text}
        </h2>
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
                <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-neon-orange/10 border border-neon-orange/20 flex items-center justify-center font-bold text-sm sm:text-base text-neon-orange">
                  {option.label}
                </span>
                <span className="text-sm sm:text-base text-white/90 font-medium">{option.text}</span>
                {answered && index === correctIndex && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-neon-green text-xl"
                  >
                    ✓
                  </motion.span>
                )}
                {answered && index === selectedIndex && index !== correctIndex && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-neon-red text-xl"
                  >
                    ✗
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
          className="mt-4 glass-card p-4 border-l-4 border-neon-amber"
        >
          <h4 className="text-sm font-bold text-neon-amber mb-1">💡 Explanation</h4>
          <p className="text-sm text-white/80">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
