import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, X, Sparkles, CheckCircle2, AlertCircle, Play, Square, FileText } from "lucide-react";

interface BrainDumpModalProps {
  onClose: () => void;
  onComplete: (xp: number, gold: number) => void;
  addLogMessage: (message: string) => void;
}

export default function BrainDumpModal({ onClose, onComplete, addLogMessage }: BrainDumpModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [typedInput, setTypedInput] = useState(""); // typed fallback text
  const [useTypedFallback, setUseTypedFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState(60);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);

  const [nlpResult, setNlpResult] = useState<{
    summary: string;
    actions: string[];
    stressFlags: string[];
    affirmation: string;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  const analyzeSteps = [
    "AI is reading your thoughts...",
    "Identifying stress patterns...",
    "Building your action plan..."
  ];

  // Initialize SpeechRecognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let interimText = "";
        let finalOutput = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalOutput += event.results[i][0].transcript + " ";
          } else {
            interimText += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => {
          const base = prev.trim();
          return (base + " " + finalOutput + interimText).trim();
        });
      };

      rec.onerror = (err: any) => {
        console.error("Speech Recognition Error", err);
        if (err.error === "not-allowed") {
          addLogMessage("Speech authorization denied. Switching to scroll typed fallback.");
          setUseTypedFallback(true);
        }
      };

      rec.onend = () => {
        if (isRecording) {
          // Restart recording if cut off early automatically
          try { rec.start(); } catch (e) {}
        }
      };

      recognitionRef.current = rec;
    } else {
      setUseTypedFallback(true);
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  // Handle Animated Waveform
  useEffect(() => {
    if (isRecording && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let phase = 0;

      const draw = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Wave lines
        ctx.strokeStyle = "rgba(195, 155, 211, 0.8)";
        ctx.lineWidth = 2.5;

        // Draw multiple overlapping sine waves to replicate highly realistic micro speech response
        for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
          ctx.beginPath();
          // Amplitude variance based on randomly modulated mock volume
          const amplitude = (35 / (waveIndex + 1)) * (0.4 + Math.random() * 0.6);
          const frequency = 0.02 * (waveIndex + 1);

          for (let x = 0; x < canvas.width; x++) {
            const y = (canvas.height / 2) + Math.sin(x * frequency + phase + waveIndex) * amplitude;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        phase += 0.15;
        animationRef.current = requestAnimationFrame(draw);
      };
      
      animationRef.current = requestAnimationFrame(draw);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isRecording]);

  // Start Voice Session
  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setSecondsRecorded(0);
    setTimeLeft(60);
    setNlpResult(null);

    if (!useTypedFallback && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }

    timerIntervalRef.current = setInterval(() => {
      setSecondsRecorded(prev => {
        const next = prev + 1;
        // Auto stop at 60s
        if (next >= 60) {
          stopRecording();
        }
        return next;
      });
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
  };

  // Stop Recording
  const stopRecording = () => {
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Run AI analysis on spoken transcripts
  const processNlp = () => {
    stopRecording();
    const sourceText = useTypedFallback ? typedInput : transcript;

    if (!sourceText.trim()) {
      setError("Alas! The ledger cannot read an empty mind. Please record your thoughts or type an inscription first.");
      return;
    }
    setError(null);

    setIsAnalyzing(true);
    setAnalyzeStep(0);

    // Multi-step mock processing timeline
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setAnalyzeStep(step);
      if (step === 3) {
        clearInterval(interval);
        
        // Extract real NLP details client-side
        setTimeout(() => {
          analyzeTextNlp(sourceText);
        }, 300);
      }
    }, 800);
  };

  // Incredibly detailed local NLP parsing heuristic
  const analyzeTextNlp = (text: string) => {
    const cleaned = text.toLowerCase();
    
    // 1. Identify Stress Flags (words occurring 3+ times)
    const words = cleaned.match(/\b([a-z]{3,})\b/g) || [];
    const counts: { [key: string]: number } = {};
    words.forEach(w => {
      if (!["the", "and", "that", "this", "for", "with", "from", "your", "have", "you"].includes(w)) {
        counts[w] = (counts[w] || 0) + 1;
      }
    });

    const stressFlags = Object.entries(counts)
      .filter(([_, count]) => count >= 3)
      .map(([word]) => word);

    // 2. Draft action items (heuristics looking for verbs and key phrases)
    const actionItems: string[] = [];
    const sentences = text.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      const lowerS = sentence.toLowerCase().trim();
      if (
        lowerS.includes("need to") || 
        lowerS.includes("should") || 
        lowerS.includes("must") || 
        lowerS.includes("want to") ||
        lowerS.includes("have to") ||
        lowerS.includes("don't forget") ||
        lowerS.includes("remember to")
      ) {
        // Strip out trailing commas/spacings and refine
        actionItems.push(sentence.trim());
      }
    });

    // Populate fallbacks if none are explicitly flagged
    if (actionItems.length === 0) {
      actionItems.push("Formulate tactical agenda for immediate stress points");
      actionItems.push("Silence peripheral mental chatter with cold discipline");
      actionItems.push("Execute the primary priority tasks documented in the Ledger Arena");
    }

    // Limit to top 3 actions as requested
    const finalActions = actionItems.slice(0, 3);

    // Highlight stress flags as red in the summary
    let finalSummary = `Traveler expressed clear conscious objectives: "${text.substring(0, 110)}...". `;
    if (stressFlags.length > 0) {
      finalSummary += `Detected notable stress focal markers: ${stressFlags.join(", ")}.`;
    } else {
      finalSummary += "Mental vector indicates harmonious balance and clarity.";
    }

    const affirmations = [
      "The fog of clutter clears under the warm sun of focused presence. You have declared your battle agenda.",
      "A warrior fears not the multitude of tasks, but the lack of a structured blueprint.",
      "Clear the ledger, soothe the spirit. You have outlined your steps; now tread them with valor."
    ];

    setIsAnalyzing(false);
    setNlpResult({
      summary: finalSummary,
      actions: finalActions,
      stressFlags: stressFlags,
      affirmation: affirmations[Math.floor(Math.random() * affirmations.length)]
    });
  };

  // Complete and claim reward tokens
  const handleClaim = () => {
    onComplete(60, 20);
    addLogMessage("🎙️ Concluded mental brain dump with AI cataloging (+60 XP, +20 Coins)!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#050511]/95 text-white flex flex-col justify-between p-4 z-50 animate-fade-in font-sans overflow-y-auto">
      
      {/* Top Header toolbar */}
      <div className="max-w-xl mx-auto w-full pt-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#9B59B6] animate-ping" />
          <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-[#D4AC0D] text-[#C39BD3]">
            Sovereign Brain Dump NLP
          </h2>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white p-1 rounded-full bg-white/5 transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Center Workboard */}
      <div className="max-w-xl mx-auto w-full flex-grow flex flex-col justify-center my-6 z-10">
        
        {/* Step 1: Voice recording board */}
        {!isAnalyzing && !nlpResult && (
          <div className="space-y-6">
            
            <div className="bg-[#11112b] border border-[#9B59B6]/30 p-5 rounded-2xl text-center">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#C39BD3] uppercase font-bold block mb-1">
                Conceive Daily Battle Plans
              </span>
              <p className="font-serif italic text-sm text-gray-300 leading-relaxed">
                &quot;Unload your early thoughts, anxieties, and hidden obligations. Let the transcript system harvest the wheat from the chaff, leaving you with cold action items and calm resolve.&quot;
              </p>
            </div>

            {/* Main Interactive Mic Toggle Frame */}
            <div className="p-6 bg-[#101026] border border-white/10 rounded-2xl flex flex-col items-center">
              
              {/* Fallback Selector Toggle */}
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setUseTypedFallback(false)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    !useTypedFallback ? "bg-[#9B59B6] text-white" : "bg-white/5 text-gray-400"
                  }`}
                >
                  Voice dump
                </button>
                <button
                  type="button"
                  onClick={() => setUseTypedFallback(true)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    useTypedFallback ? "bg-[#9B59B6] text-white" : "bg-white/5 text-gray-400"
                  }`}
                >
                  Type inscription fallback
                </button>
              </div>

              {/* VOICE REC UI DISPLAY */}
              {!useTypedFallback ? (
                <div className="w-full flex flex-col items-center py-4">
                  
                  {/* Waveform graphic view */}
                  <div className="w-full h-24 mb-4 rounded-xl overflow-hidden bg-black/40 border border-white/5 relative flex items-center justify-center">
                    {isRecording ? (
                      <canvas ref={canvasRef} className="w-full h-full" width={400} height={96} />
                    ) : (
                      <div className="text-gray-500 font-mono text-xs flex items-center gap-2">
                        <MicOff className="w-4 h-4 text-gray-500" /> Viewfinder ready. Tap start to vocalize.
                      </div>
                    )}
                  </div>

                  {/* Recording diagnostics */}
                  <div className="flex justify-between w-full text-xs font-mono text-gray-400 px-1 mb-6">
                    <span className="flex items-center gap-1.5 font-bold">
                      {isRecording ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Recording...
                        </>
                      ) : (
                        "Ready"
                      )}
                    </span>
                    <span>{secondsRecorded}s / 60s minimum</span>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex justify-center gap-4">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="w-16 h-16 rounded-full bg-[#9B59B6] hover:bg-[#8e44ad] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Start vocal stream"
                      >
                        <Mic className="w-8 h-8" />
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-red-650 bg-red-800 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
                        title="Pause vocal stream"
                      >
                        <Square className="w-7 h-7" />
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                /* TEXT INITIATIVE FALLBACK WRITER */
                <div className="w-full space-y-3">
                  <textarea
                    placeholder="Type out your raw thoughts. What's nagging at your attention? What needs to get done? Don't censor anything."
                    value={typedInput}
                    onChange={(e) => setTypedInput(e.target.value)}
                    className="w-full h-32 p-3.5 bg-black/30 border border-white/10 rounded-xl text-sm leading-relaxed text-gray-200 placeholder-gray-500 focus:outline-[#9B59B6] resize-none"
                  />
                  <div className="text-right text-[10px] font-mono text-gray-400">
                    {typedInput.length} characters typed
                  </div>
                </div>
              )}

              {/* Real-time transcript monitor block */}
              {!useTypedFallback && (isRecording || transcript) && (
                <div className="w-full mt-4 bg-black/20 border border-white/5 rounded-xl p-4">
                  <span className="text-[9px] font-mono tracking-wider font-semibold text-gray-400 uppercase block mb-1">
                    Telemetry Live Transcript
                  </span>
                  <div className="max-h-24 overflow-y-auto text-xs text-[#C39BD3] font-mono leading-relaxed select-text whitespace-pre-wrap">
                    {transcript || <span className="text-gray-500 italic">Vocal frequencies translating...</span>}
                    {isRecording && <span className="inline-block w-1.5 h-4 bg-[#9B59B6] ml-1 animate-ping" />}
                  </div>
                </div>
              )}

            </div>

            {error && (
              <div className="w-full text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl text-xs leading-relaxed font-bold mb-4 animate-fade-in flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Stop and Analyze Action Trigger */}
            <button
              onClick={processNlp}
              disabled={useTypedFallback ? !typedInput.trim() : (!transcript.trim() && secondsRecorded < 10)}
              className={`w-full py-3 bg-[#9B59B6] hover:bg-[#8e44ad] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer border-[1.5px] border-[#9B59B6] shadow-md flex items-center justify-center gap-2 ${
                useTypedFallback 
                  ? (!typedInput.trim() ? "opacity-50 cursor-not-allowed" : "")
                  : (!transcript.trim() && secondsRecorded < 10 ? "opacity-50 cursor-not-allowed" : "")
              }`}
            >
              <FileText className="w-4 h-4" /> Analyse Conscious Dump
            </button>
            
          </div>
        )}

        {/* Step 2: NLP Analysis Processing Overlay */}
        {isAnalyzing && (
          <div className="text-center space-y-6 animate-fade-in flex flex-col justify-center py-10">
            <div className="w-20 h-20 rounded-full border-2 border-t-transparent border-[#9B59B6] animate-spin mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#9B59B6] animate-pulse" />
            </div>
            <div className="space-y-2">
              <p className="font-mono text-sm tracking-widest text-[#C39BD3] font-semibold uppercase">
                &gt;&gt; {analyzeSteps[analyzeStep]}
              </p>
              <p className="text-[10px] font-mono text-gray-500 uppercase">
                Parsing linguistic tokens for active semantic indicators...
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Finished AI Analysis Card */}
        {nlpResult && (
          <div className="bg-[#11112c] border-2 border-[#9B59B6] p-6 rounded-2xl max-w-sm mx-auto w-full relative overflow-hidden shadow-2xl animate-fade-in text-sans">
            
            {/* Absolute badge */}
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#9B59B6] text-white font-mono text-[9px] font-extrabold tracking-widest rounded-bl-lg">
              NLP RESOLVED
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-white/5 mb-3">
                <CheckCircle2 className="w-10 h-10 text-[#9B59B6]" />
              </div>
              <h3 className="font-serif text-lg font-bold">Thoughts Documented</h3>
              <p className="text-[10px] font-mono text-gray-450 mt-0.5 uppercase tracking-wider text-gray-400">
                Mental Clutter Successfully Cleared
              </p>
            </div>

            <div className="space-y-4 pb-5 border-b border-white/10 mb-5 text-xs">
              
              {/* Summary */}
              <div>
                <p className="font-mono text-[9px] text-[#C39BD3] uppercase tracking-wider font-bold mb-1">Linguistic Summary:</p>
                <p className="text-gray-300 italic leading-relaxed">
                  {/* Color word counts red if matching stress flags */}
                  {nlpResult.summary.split(" ").map((word, i) => {
                    const cleaned = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
                    const isStress = nlpResult.stressFlags.includes(cleaned);
                    return (
                      <span key={i} className={isStress ? "text-rose-500 font-bold underline" : ""}>
                        {word}{" "}
                      </span>
                    );
                  })}
                </p>
              </div>

              {/* Stress keywords */}
              {nlpResult.stressFlags.length > 0 && (
                <div>
                  <p className="font-mono text-[9px] text-rose-450 uppercase tracking-widest font-bold mb-1.5 text-rose-400">Recurrent Stress Flags:</p>
                  <div className="flex gap-2.5 flex-wrap">
                    {nlpResult.stressFlags.map((flag, i) => (
                      <span key={i} className="px-2 py-0.5 border border-rose-500/20 bg-rose-950/20 text-rose-400 text-[10px] font-mono uppercase font-bold rounded">
                        ⚠️ {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action items extracted */}
              <div>
                <p className="font-mono text-[9px] text-[#C39BD3] uppercase tracking-wider font-bold mb-1.5">Actionable Agenda:</p>
                <ul className="space-y-2">
                  {nlpResult.actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white/5 p-2 rounded border border-white/5 leading-snug">
                      <span className="text-[#9B59B6] font-bold font-mono">#{i + 1}</span>
                      <p className="text-gray-200 mt-0.5">{act}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scribe affirmation text */}
              <div className="pt-2">
                <p className="font-sans italic text-[11px] text-gray-400 leading-relaxed text-center">
                  &quot;{nlpResult.affirmation}&quot;
                </p>
              </div>

            </div>

            {/* Claim Rewards button */}
            <button
              onClick={handleClaim}
              className="w-full py-3 bg-[#9B59B6] text-white font-sans text-xs font-extrabold uppercase tracking-widest rounded-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-white" /> Complete & Claim rewards
            </button>

          </div>
        )}

      </div>

      {/* Runic Console Watermark */}
      <div className="max-w-xl mx-auto w-full pb-4 text-center text-gray-500 font-mono text-[9px] uppercase tracking-widest z-10">
        NLP Processor V3.0 • Cognitive Diagnostic Engine
      </div>

    </div>
  );
}
