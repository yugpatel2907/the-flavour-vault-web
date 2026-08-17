'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioSynthesizer } from '@/lib/audioSynthesizer';

export default function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    audioSynthesizer.setMuted(!nextState);
    if (nextState) {
      audioSynthesizer.playGong();
    }
  };

  return (
    <button
      onClick={toggleSound}
      className={`fixed bottom-8 left-8 z-40 px-4 py-3 rounded-full bg-[#120F16]/90 border shadow-2xl transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${
        isPlaying
          ? 'text-gold border-gold scale-105 shadow-saffron/20'
          : 'text-gold-muted/70 hover:text-gold border-gold/30'
      }`}
      title={isPlaying ? 'Mute Royal Ambiance Sound' : 'Enable Royal Audio Ambiance'}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-saffron animate-pulse" />
          <div className="flex items-end gap-0.5 h-3">
            <div className="w-0.5 bg-saffron h-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-0.5 bg-gold h-2/3 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-0.5 bg-saffron-light h-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[10px] font-serif tracking-widest text-gold uppercase hidden sm:inline">
            ROYAL AMBIENCE ON
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-gold-muted" />
          <span className="text-[10px] font-serif tracking-widest text-gold-muted uppercase hidden sm:inline">
            AUDIO AMBIENCE
          </span>
        </>
      )}
    </button>
  );
}
