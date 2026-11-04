import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  title: string;
  audioUrl?: string | null;
}

export default function AudioPlayer({ text, title, audioUrl }: Props) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const stop = () => {
    stopAll();
    setPlaying(false);
    setProgress(0);
  };

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }

    if (audioUrl) {
      if (!audioRef.current) {
        const a = new Audio(audioUrl);
        a.addEventListener('timeupdate', () => {
          if (a.duration) setProgress((a.currentTime / a.duration) * 100);
        });
        a.addEventListener('ended', stop);
        audioRef.current = a;
      }
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'vi-VN';
      u.rate = 0.95;
      u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(u);
      setPlaying(true);
    }
  };

  useEffect(() => {
    return () => stopAll();
  }, []);

  return (
    <div className="mt-4 rounded-xl bg-background-100 border border-background-200 p-4 flex items-center gap-4">
      <button
        onClick={toggle}
        aria-label={playing ? 'Dừng phát' : `Nghe đọc ${title}`}
        className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full text-background-50 cursor-pointer transition-colors ${
          playing ? 'bg-foreground-900 hover:bg-foreground-800' : 'bg-primary-500 hover:bg-primary-600'
        }`}
      >
        <i className={`text-xl ${playing ? 'ri-stop-fill' : 'ri-play-fill'}`}></i>
      </button>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground-900">
          {playing ? 'Đang phát...' : audioUrl ? 'Phát bản ghi âm' : 'Nghe đọc nội dung'}
        </div>
        {audioUrl ? (
          <div className="mt-2 h-1.5 rounded-full bg-background-300 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-1 h-4">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`eq-bar w-1 h-full rounded-full ${playing ? 'bg-primary-500' : 'bg-background-400'}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              ></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}