/**
 * Ambrocia 5-Star Luxury Restaurant Audio Engine
 * Real 5-star luxury dining ambiance streams & crystal glassware audio feedback.
 */

class AudioSynthesizer {
  private isMuted: boolean = true;
  private ambientAudio: HTMLAudioElement | null = null;
  private isAmbientPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Real 5-Star Luxury Restaurant Dining Ambiance Stream
      this.ambientAudio = new Audio('https://actions.google.com/sounds/v1/ambiences/restaurant_chatter.ogg');
      this.ambientAudio.loop = true;
      this.ambientAudio.volume = 0.35;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play Subtle 5-Star Crystal Wine Glass Clink / Luxury Chime (on hover)
   */
  public playHoverChime() {
    if (this.isMuted || typeof window === 'undefined') return;

    try {
      const chime = new Audio('https://actions.google.com/sounds/v1/tools/wine_glass_clink.ogg');
      chime.volume = 0.3;
      chime.play().catch(() => {});
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Play Deep Luxury Restaurant Chime / Gong (on primary actions)
   */
  public playGong() {
    if (this.isMuted || typeof window === 'undefined') return;

    try {
      const gong = new Audio('https://actions.google.com/sounds/v1/tools/wine_glass_clink.ogg');
      gong.volume = 0.5;
      gong.play().catch(() => {});
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Play Sizzling Gourmet Dish Sound (on order added)
   */
  public playSizzle() {
    if (this.isMuted || typeof window === 'undefined') return;

    try {
      const sizzle = new Audio('https://actions.google.com/sounds/v1/household/kitchen_sizzle.ogg');
      sizzle.volume = 0.4;
      sizzle.play().catch(() => {});
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Start Real 5-Star Luxury Restaurant Ambiance Stream
   */
  public startAmbient() {
    if (this.isAmbientPlaying || !this.ambientAudio) return;

    try {
      this.ambientAudio.play().then(() => {
        this.isAmbientPlaying = true;
      }).catch((e) => {
        console.warn('Ambient play restricted by browser:', e);
      });
    } catch (e) {
      console.warn('Ambient audio error:', e);
    }
  }

  /**
   * Stop ambient audio stream
   */
  public stopAmbient() {
    if (!this.ambientAudio) return;
    try {
      this.ambientAudio.pause();
      this.isAmbientPlaying = false;
    } catch (e) {
      this.isAmbientPlaying = false;
    }
  }
}

export const audioSynthesizer = new AudioSynthesizer();
