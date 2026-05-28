import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Sparkles, CheckCircle2, Square, Clock, ListTodo, Moon, ClipboardList } from "lucide-react";
import { motion } from "motion/react";

interface SlumberVerificationModalProps {
  onClose: () => void;
  onComplete: (xp: number, gold: number) => void;
  addLogMessage: (message: string) => void;
}

export default function SlumberVerificationModal({ onClose, onComplete, addLogMessage }: SlumberVerificationModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [typedInput, setTypedInput] = useState(""); // backup
  const [useTypedFallback, setUseTypedFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const [slumberResult, setSlumberResult] = useState<{
    toneRating: string;
    todos: string[];
    stressSummary: string;
    recordedAt: string;
    wakeUpAt: string;
    fact: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  const steps = [
    "Humming sleeping waves...",
    "Ears tuned for physical frequency...",
    "Cataloging thoughts to clear the ledger...",
    "Securing your 8-hour slumber gateway..."
  ];

  // Configure Web Speech API if supported
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (e: any) => {
        let interimText = "";
        let finalOutput = "";
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            finalOutput += e.results[i][0].transcript + " ";
          } else {
            interimText += e.results[i][0].transcript;
          }
        }
        setTranscript(p => (p.trim() + " " + finalOutput + interimText).trim());
      };

      rec.onerror = (e: any) => {
        console.error("Speech error", e);
        if (e.error === "not-allowed") {
          setUseTypedFallback(true);
        }
      };

      rec.onend = () => {
        if (isRecording) {
          try { rec.start(); } catch (err) {}
        }
      };

      recognitionRef.current = rec;
    } else {
      setUseTypedFallback(true);
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (err) {}
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  // Handle Dynamic Ocean-style Wave Visualizer
  useEffect(() => {
    if (isRecording && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let phase = 0;

      const draw = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Smooth Sleep Wave (representing soothing alpha frequencies)
        ctx.strokeStyle = "rgba(100, 149, 237, 0.75)";
        ctx.lineWidth = 1.8;

        for (let wave = 0; wave < 3; wave++) {
          ctx.beginPath();
          const amplitude = (20 / (wave + 1)) * (0.5 + Math.random() * 0.5);
          const frequency = 0.015 * (wave + 1);

          for (let x = 0; x < canvas.width; x++) {
            const y = (canvas.height / 2) + Math.sin(x * frequency + phase + wave) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        phase += 0.06; // Calm wave pacing
        animationRef.current = requestAnimationFrame(draw);
      };

      animationRef.current = requestAnimationFrame(draw);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setSecondsRecorded(0);
    setSlumberResult(null);

    if (!useTypedFallback && recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (err) { console.error(err); }
    }

    timerIntervalRef.current = setInterval(() => {
      setSecondsRecorded(p => {
        // Complete/Cap after 30 seconds for slumber goals
        if (p >= 30) {
          stopRecording();
          return 30;
        }
        return p + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  const processSlumber = () => {
    stopRecording();
    const txt = useTypedFallback ? typedInput : transcript;

    if (!txt.trim() && !useTypedFallback) {
      setError("Please vocalize custom subconscious concerns so the coach can structure your tasks!");
      return;
    }
    setError(null);

    setIsAnalyzing(true);
    setAnalyzeStep(0);

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setAnalyzeStep(idx);
      if (idx === 4) {
        clearInterval(interval);
        setTimeout(() => {
          compileSlumberNlp(txt);
        }, 200);
      }
    }, 700);
  };

  const compileSlumberNlp = (text: string) => {
    const raw = text || "Prepare coordinates for fresh sunrise battle plans tomorrow.";
    const clean = raw.toLowerCase();

    // 1. Identify Stressors and extract into actionable To-Dos
    // Search words like have to, need to, finish, email, project, clean etc
    const generatedTodos: string[] = [];
    const sentences = raw.split(/[.!?]+/);

    sentences.forEach(s => {
      const trimmed = s.trim();
      if (!trimmed) return;
      
      const lowerS = trimmed.toLowerCase();
      if (
        lowerS.includes("need") || 
        lowerS.includes("must") || 
        lowerS.includes("should") || 
        lowerS.includes("tomorrow") || 
        lowerS.includes("work") || 
        lowerS.includes("call") ||
        lowerS.includes("finish")
      ) {
        generatedTodos.push(trimmed);
      }
    });

    if (generatedTodos.length === 0) {
      generatedTodos.push("Organize early prioritized workflow sequences.");
      generatedTodos.push("Vanquish outstanding administrative clutter.");
      generatedTodos.push("Drink clear spring water upon sunrise crossing.");
    }

    const finalTodos = generatedTodos.slice(0, 3);

    // 2. Timing logic: Keep accurate track of timestamp and add exactly 8 hours
    const recordedDate = new Date();
    const wakeUpDate = new Date(recordedDate.getTime() + 8 * 60 * 60 * 1000);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const getAmPm = (h: number) => h >= 12 ? "PM" : "AM";
    const getFormattedHour = (h: number) => {
      const hrs = h % 12;
      return hrs === 0 ? 12 : hrs;
    };

    const recordedTimeStr = `${getFormattedHour(recordedDate.getHours())}:${pad(recordedDate.getMinutes())} ${getAmPm(recordedDate.getHours())}`;
    const wakeUpTimeStr = `${getFormattedHour(wakeUpDate.getHours())}:${pad(wakeUpDate.getMinutes())} ${getAmPm(wakeUpDate.getHours())}`;

    setIsAnalyzing(false);
    setSlumberResult({
      toneRating: "Calm, slow-paced alpha mental waves detected. Resonates at a soothing harmonic slumber frequency.",
      todos: finalTodos,
      stressSummary: `Extracted ${finalTodos.length} mental stressors from background awareness and locked them safely into Tomorrow's Agenda list.`,
      recordedAt: recordedTimeStr,
      wakeUpAt: wakeUpTimeStr,
      fact: "An 8-hour sleep window maximizes stage 4 slow-wave recovery, cleansing spinal beta-amyloid clusters to keep your memory banks perfectly crystallized."
    });
  };

  const handleClaimSlumber = () => {
    onComplete(300, 50);
    addLogMessage(`🌙 Closed slumber gates with 8-Hour cycle calculated to wake at ${slumberResult?.wakeUpAt}! (+300 XP, +50 Coins)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#04040a]/95 text-white flex flex-col justify-between p-4 z-50 animate-fade-in font-sans overflow-y-auto">
      
      {/* Header */}
      <div className="max-w-xl mx-auto w-full pt-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-violet-400 animate-pulse animate-spin-slow" />
          <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-violet-400">
            Slumber Gate Coach (Audio)
          </h2>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white p-1 rounded-full bg-white/5 transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Board */}
      <div className="max-w-xl mx-auto w-full flex-grow flex flex-col justify-center my-6 z-10">
        
        {!isAnalyzing && !slumberResult && (
          <div className="space-y-6">
            
            <div className="bg-[#101024] border border-violet-500/20 p-5 rounded-2xl text-center">
              <span className="text-[10px] font-mono tracking-[0.25em] text-violet-400 uppercase font-bold block mb-1">
                Subconscious Sleep Purge
              </span>
              <p className="font-serif italic text-sm text-gray-300 leading-relaxed">
                &quot;Do not hold the stress ledger in your mind as you cross the Slumber Threshold. Speak your remaining duties, anxieties, or early tasks. We will file them safely into Tomorrow's To-Dos, and calculate your target wake-up hour!&quot;
              </p>
            </div>

            <div className="p-6 bg-[#0c0c1b]/80 border border-violet-500/25 rounded-2xl flex flex-col items-center">
              
              {/* Type fallback toggler */}
              <div className="mb-4 flex gap-1.5 bg-white/5 p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setUseTypedFallback(false)}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    !useTypedFallback ? "bg-violet-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Voice Record (30s)
                </button>
                <button
                  type="button"
                  onClick={() => setUseTypedFallback(true)}
                  className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    useTypedFallback ? "bg-violet-600 text-white shadow-md" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Write Fallsback
                </button>
              </div>

              {!useTypedFallback ? (
                <div className="w-full flex flex-col items-center py-2">
                  
                  {/* Slow alpha waves visualizer */}
                  <div className="w-full h-24 mb-4 rounded-xl overflow-hidden bg-black/60 border border-violet-500/20 relative flex items-center justify-center">
                    {isRecording ? (
                      <canvas ref={canvasRef} className="w-full h-full" width={400} height={96} />
                    ) : (
                      <span className="text-gray-500 font-mono text-xs flex items-center gap-1.5 leading-none">
                        <MicOff className="w-3.5 h-3.5 text-violet-500/50" /> Micro sleepstream ready.
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between w-full text-[11px] font-mono text-gray-500 px-1 mb-5">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                      {isRecording ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" /> Subconscious recording...
                        </>
                      ) : (
                        "Sleep Signal Offline"
                      )}
                    </span>
                    <span>{secondsRecorded}s / 30s target</span>
                  </div>

                  <div className="flex justify-center">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Start Voice Dump"
                      >
                        <Mic className="w-7 h-7" />
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-red-650 bg-red-800 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
                        title="Halt Stream"
                      >
                        <Square className="w-6 h-6" />
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                <div className="w-full space-y-2">
                  <textarea
                    placeholder="Whisper your thoughts here. What tasks are spinning in your head? Get them onto the scroll..."
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    className="w-full h-28 p-3 bg-black/40 border border-violet-500/10 rounded-xl text-xs leading-relaxed text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none font-sans"
                  />
                  <div className="text-right text-[9px] font-mono text-gray-400">
                    {typedInput.length} character inscriptions.
                  </div>
                </div>
              )}

              {/* Speech transcript monitor */}
              {!useTypedFallback && (isRecording || transcript) && (
                <div className="w-full mt-4 bg-[#0a0a14] border border-white/5 rounded-xl p-3.5">
                  <span className="text-[8.5px] font-mono tracking-widest text-violet-400 uppercase font-bold block mb-1">
                    Vocal Stream Analytics:
                  </span>
                  <div className="max-h-20 overflow-y-auto text-xs text-violet-300 font-mono leading-relaxed whitespace-pre-wrap select-text">
                    {transcript || <span className="text-gray-650 text-gray-600 italic">Vocalizing feeds...</span>}
                    {isRecording && <span className="inline-block w-1.5 h-3.5 bg-violet-500 ml-1 animate-ping" />}
                  </div>
                </div>
              )}

            </div>

            {error && (
              <div className="w-full text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-xs leading-relaxed font-bold mb-4 animate-fade-in text-center self-stretch">
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={processSlumber}
              disabled={useTypedFallback ? !typedInput.trim() : (!transcript.trim() && secondsRecorded < 5)}
              className={`w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-sans text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                useTypedFallback 
                  ? (!typedInput.trim() ? "opacity-50 cursor-not-allowed" : "")
                  : (!transcript.trim() && secondsRecorded < 5 ? "opacity-50 cursor-not-allowed" : "")
              }`}
            >
              <Moon className="w-4 h-4" /> Purge Thoughts & Slumber
            </button>

          </div>
        )}

        {/* Processing loop */}
        {isAnalyzing && (
          <div className="text-center space-y-6 animate-fade-in py-10">
            <div className="w-16 h-16 rounded-full border-2 border-t-transparent border-violet-400 animate-spin mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <p className="font-mono text-xs tracking-widest text-violet-300 font-bold uppercase animate-pulse">
                &gt;&gt; {steps[Math.min(3, analyzeStep)]}
              </p>
              <p className="text-[10px] font-mono text-gray-500">
                TRANSFORMING ADRENAL BURDENS TO ASCENDANT SCHEDULES...
              </p>
            </div>
          </div>
        )}

        {/* Verification outcome & Slumber sleep countdown */}
        {slumberResult && (
          <div className="bg-[#101026] border-2 border-violet-500 p-6 rounded-2xl max-w-sm mx-auto w-full relative overflow-hidden shadow-2xl animate-fade-in text-sans">
            
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-violet-600 text-white font-mono text-[9px] font-extrabold tracking-widest rounded-bl-lg">
              CYCLE LOCKED
            </div>

            <div className="text-center mb-5">
              <div className="p-3 bg-white/5 rounded-full inline-flex mb-3">
                <Moon className="w-10 h-10 text-violet-400 animate-pulse" />
              </div>
              <h3 className="font-serif text-lg font-bold text-violet-300">Gates of Sleep Open</h3>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
                Mental ledger cleaned and catalogued
              </p>
            </div>

            {/* Timings summary */}
            <div className="grid grid-cols-2 gap-3.5 mb-5 bg-[#0a0a14] border border-[#2d1b4e] rounded-xl p-3.5 text-center">
              <div>
                <p className="text-[9px] font-mono font-bold uppercase text-gray-400 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-violet-400" /> Recorded At:
                </p>
                <p className="text-md font-serif font-bold text-violet-300 mt-0.5">
                  {slumberResult.recordedAt}
                </p>
              </div>
              <div className="border-l border-white/10">
                <p className="text-[9px] font-mono font-bold uppercase text-gray-400 flex items-center justify-center gap-1">
                  <Moon className="w-3 h-3 text-emerald-400" /> Optimal Wake Up:
                </p>
                <p className="text-md font-serif font-bold text-emerald-400 mt-0.5">
                  {slumberResult.wakeUpAt}
                </p>
              </div>
            </div>

            <div className="space-y-4 pb-5 border-b border-white/10 mb-5 text-xs text-gray-200">
              
              <div>
                <p className="font-mono text-[9px] text-violet-400 uppercase tracking-widest font-bold mb-1">Tone & Frequency Rating:</p>
                <p className="text-gray-300 italic bg-white/5 p-2 rounded border border-white/5 text-[11px]">
                  💤 {slumberResult.toneRating}
                </p>
              </div>

              <div>
                <p className="font-mono text-[9px] text-violet-400 uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1">
                  <ListTodo className="w-3.5 h-3.5 text-violet-400" /> Transferred To-Do Tasks for Tomorrow:
                </p>
                <ul className="space-y-2">
                  {slumberResult.todos.map((todo, idx) => (
                    <li key={idx} className="flex gap-2 p-2 rounded bg-black/35 border border-white/5 font-sans leading-snug">
                      <span className="text-violet-400 font-mono font-bold">#{idx + 1}</span>
                      <p className="text-gray-200">{todo}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-violet-950/25 border border-violet-500/20 p-3 rounded-lg">
                <p className="font-mono text-[9px] text-violet-400 font-bold mb-1 uppercase">
                  Slumber science check:
                </p>
                <p className="text-violet-200 text-[11px] leading-relaxed">
                  {slumberResult.fact}
                </p>
              </div>

            </div>

            <button
              onClick={handleClaimSlumber}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-sans text-xs font-extrabold uppercase tracking-widest rounded-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-white" /> Complete & Claim +300 XP
            </button>

          </div>
        )}

      </div>

      <div className="max-w-xl mx-auto w-full pb-4 text-center text-gray-500 font-mono text-[9px] uppercase tracking-widest z-10">
        Slumber Diagnostics V3.9 • Neural Refresh Gateway
      </div>

    </div>
  );
}
