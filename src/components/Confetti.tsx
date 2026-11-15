import React, { useEffect } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, onComplete }) => {
  useEffect(() => {
    if (active) {
      onComplete?.();
    }
  }, [active, onComplete]);

  return null;
};
