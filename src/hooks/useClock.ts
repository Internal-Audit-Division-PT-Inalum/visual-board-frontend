import { useState, useEffect } from 'react';

interface ClockState {
  time: string;
  date: string;
}

export function useClock(): ClockState {
  const [clock, setClock] = useState<ClockState>({
    time: '',
    date: '',
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      
      const date = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      setClock({ time: time.replace(/\./g, ':'), date });
    };

    updateClock(); 
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId); 
  }, []);

  return clock;
}

