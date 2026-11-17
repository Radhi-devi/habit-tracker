import confetti from 'canvas-confetti';

export function triggerCelebration() {
  try {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'],
    });

    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'],
    });

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.6 },
        shapes: ['star', 'circle'],
        colors: ['#F59E0B', '#10B981', '#6366F1'],
      });
    }, 200);
  } catch (err) {
    // Fallback gracefully if canvas isn't supported or fails
    console.debug('Confetti effect skipped:', err);
  }
}
