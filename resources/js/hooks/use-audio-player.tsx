// resources/js/Hooks/useAudioPlayer.ts
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseAudioPlayer {
    play: () => void;
    pause: () => void;
    stop: () => void;
    isPlaying: boolean;
}

export function useAudioPlayer(src: string): UseAudioPlayer {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = new Audio(src);
        audioRef.current = audio;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.pause();
            audio.currentTime = 0;
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audioRef.current = null;
        };
    }, [src]);

    const play = () => {
        if (!audioRef.current) return;

        audioRef.current.play().catch((err) => {
            // Browser blocked audio (no user interaction)
            if (err.name === 'NotAllowedError') {
                toast.warning('Sound blocked by browser. Tap anywhere to enable notification audio.');
            } else {
                toast.error(`Audio error: ${err.message}`);
            }
        });
    };

    const pause = () => audioRef.current?.pause();

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    return { play, pause, stop, isPlaying };
}
