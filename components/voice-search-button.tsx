'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2 } from 'lucide-react';

interface VoiceSearchButtonProps {
  onResult: (transcript: string) => void;
  className?: string;
}

export default function VoiceSearchButton({
  onResult,
  className = '',
}: VoiceSearchButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [animationState, setAnimationState] = useState<
    'idle' | 'listening' | 'processing'
  >('idle');

  // Check if browser supports speech recognition
  const browserSupportsSpeechRecognition =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setError("Your browser doesn't support voice search");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    setAnimationState('listening');
    setError(null);

    // In a real implementation, you would use the Web Speech API:
    // const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    // const recognition = new SpeechRecognition()
    // recognition.continuous = false
    // recognition.interimResults = true
    // recognition.onresult = (event) => {
    //   const transcript = event.results[0][0].transcript
    //   setTranscript(transcript)
    // }
    // recognition.start()

    // For demo purposes, simulate voice recognition
    setTimeout(() => {
      setAnimationState('processing');
      setTimeout(() => {
        const mockTranscripts = [
          'attack on titan',
          'demon slayer',
          'my hero academia',
          'one piece latest episode',
        ];
        const randomTranscript =
          mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
        setTranscript(randomTranscript);
        onResult(randomTranscript);
        setIsListening(false);
        setAnimationState('idle');
      }, 1500);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setAnimationState('idle');

    // In a real implementation:
    // recognition.stop()
  };

  // Pulse animation for the voice waves
  const pulseVariants = {
    listening: (i: number) => ({
      scale: [1, 1.5, 1],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        delay: i * 0.1,
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'easeInOut',
      },
    }),
    idle: { scale: 0, opacity: 0 },
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        className={`relative flex items-center justify-center h-10 w-10 rounded-full ${
          isListening
            ? 'bg-gradient-to-r from-primary to-secondary text-white'
            : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
        }`}
        onClick={toggleListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={!browserSupportsSpeechRecognition}
      >
        {animationState === 'processing' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isListening ? (
          <Mic className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}

        {/* Voice waves animation */}
        <AnimatePresence>
          {isListening && animationState === 'listening' && (
            <>
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-white/30"
                  custom={i}
                  variants={pulseVariants}
                  animate="listening"
                  exit={{ scale: 0, opacity: 0 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-red-500/90 text-white text-xs rounded-md whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript preview */}
      <AnimatePresence>
        {transcript && animationState === 'processing' && (
          <motion.div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-purple-500/90 text-white text-xs rounded-md whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {transcript}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
