'use client';

import React, { useEffect, useRef, useId } from 'react';

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: Element[]) => Promise<void>;
      typesetClear?: (elements?: Element[]) => Promise<void>;
      startup?: {
        promise?: Promise<void>;
      };
    };
  }
}

interface MathJaxTextProps {
  content: string;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4';
}

export default function MathJaxText({ content, className = '', as: Tag = 'span' }: MathJaxTextProps) {
  const ref = useRef<HTMLElement>(null);
  const id = useId();
  const prevContentRef = useRef(content);

  useEffect(() => {
    prevContentRef.current = content;
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    const typeset = async () => {
      if (window.MathJax?.typesetPromise) {
        try {
          if (window.MathJax.typesetClear) {
            await window.MathJax.typesetClear([el]);
          }
          await window.MathJax.typesetPromise([el]);
        } catch (e) {
          // MathJax errors are non-fatal
        }
      }
    };

    // Wait for MathJax to be ready
    if (window.MathJax?.startup?.promise) {
      window.MathJax.startup.promise.then(typeset);
    } else {
      // MathJax might not be loaded yet, retry after a delay
      const timer = setTimeout(typeset, 500);
      return () => clearTimeout(timer);
    }
  }, [content, id]);

  return <Tag ref={ref} className={className} dangerouslySetInnerHTML={{ __html: content }} />;
}

