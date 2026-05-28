import { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX, Sparkles, AlertCircle } from "lucide-react";

interface SoundtrackPlayerProps {
  isUnlocked: boolean;
}

export default function SoundtrackPlayer({ isUnlocked }: SoundtrackPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humNodeRef = useRef<BiquadFilterNode | null>(null);
  const timerIdRef = useRef<number | null>(null);

  // Initialize and start audio cozy synth
  const startAudio = async () => {
    try {
      setErrorMsg(null);
      // Create audio context
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) {
        throw new Error("Web Audio API not supported in this browser.");
      }

      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Ensure Context is resumed (browser safety rules)
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // --- CREATE BROWN NOISE NODE FOR TAPE HUM ---
      const bufferSize = ctx.sampleRate * 2; // 2 seconds
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brownian filter formula
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 4.5; // Gain factor
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Low pass filter to make it deeply warm
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 350; // Deep low hum

      const humGain = ctx.createGain();
      humGain.gain.value = 0.08; // Gentle background hum

      noiseSource.connect(filter);
      filter.connect(humGain);
      humGain.connect(ctx.destination);
      noiseSource.start();

      // --- PROCEDURAL MEDITATIVE CHIMES ---
      const pentatonicScale = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // G3, A3, C4, D4, E4, G4, A4

      const playRandomChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const chimeCtx = audioCtxRef.current;

        // Pick random tone from cozy pentatonic scale
        const freq = pentatonicScale[Math.floor(Math.random() * pentatonicScale.length)];
        
        // Sine wave oscillator
        const osc = chimeCtx.createOscillator();
        const gainNode = chimeCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.value = freq;

        // Smooth acoustic chime envelopment
        const now = chimeCtx.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.04 + Math.random() * 0.04, now + 0.05); // Random soft velocity
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0 + Math.random() * 2.0); // Slow ring decay (3-5s)

        osc.connect(gainNode);
        gainNode.connect(chimeCtx.destination);
        osc.start(now);
        osc.stop(now + 6);

        // Schedule next note between 4 to 8 seconds
        const nextTime = 4000 + Math.random() * 4000;
        timerIdRef.current = window.setTimeout(playRandomChime, nextTime);
      };

      // Play first chime after brief delay
      timerIdRef.current = window.setTimeout(playRandomChime, 1000);
      setIsPlaying(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Click again to authorize audio.");
    }
  };

  const stopAudio = () => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSoundtrack = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  useEffect(() => {
    return () => {
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  if (!isUnlocked) return null;

  return (
    <div className="bg-[#fff3d9]/80 border-[1.5px] border-[#817567] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto mt-4 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-1 opacity-15">
        <Music className="w-12 h-12 text-[#7e5714]" />
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#7e5714] text-white flex items-center justify-center shadow-md animate-pulse">
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <Music className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="font-serif text-md font-bold text-[#7e5714] flex items-center gap-1">
            Scholar Soundtrack Active <Sparkles className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600" />
          </h4>
          <p className="text-xs text-[#4f4538] font-medium">Procedural relaxing focus chimes & deep tape-noise tape-lo hum.</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
        <button
          onClick={toggleSoundtrack}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
            isPlaying
              ? "bg-[#805533] text-white hard-offset"
              : "bg-[#7e5714] text-white hard-offset hover:bg-[#805533]"
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-4 h-4" /> Mute Chimes
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" /> Listen to Chimes
            </>
          )}
        </button>
        {errorMsg && (
          <span className="text-[10px] text-red-600 flex items-center gap-1 font-medium mt-1">
            <AlertCircle className="w-3 h-3" /> {errorMsg}
          </span>
        )}
      </div>
    </div>
  );
}
