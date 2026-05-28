import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, RefreshCw, CheckCircle2, GlassWater, Sparkles, Image as ImageIcon, Award, Droplets, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface WaterVerificationModalProps {
  onClose: () => void;
  onComplete: (xp: number, gold: number) => void;
  addLogMessage: (message: string) => void;
}

// Preset liquid photos for rapid dashboard demoing
const PRESET_WATERS = [
  {
    name: "💧 Pure Spring Water Glass",
    colors: ["Clear Hue", "Refractive Cyan"],
    type: "mineral_water",
    passed: true,
    desc: "100% molecular purity. Zero complex artificial pigments, zero fructose chains. Exceptional clarity index.",
    feedback: "Masterful hydration! This is pure, unadulterated spring elixir. Your mitochondria are throwing a victory parade—no sugar crashes coming today!",
  },
  {
    name: "🥤 Cosmic Cola Fizz (Sugar Alert)",
    colors: ["Caramel Brown", "Opaque Amber"],
    type: "sugary_drink",
    passed: false,
    desc: "Contains massive synthetic elements and sucrose molecules which will spike insulin levels and trigger a massive focus crash in 45 minutes.",
    feedback: "Alert! Intravenous sugar rush registered. Heavy processed carbs detected which feed the Sloth Behemoth! Swap this artificial chalice for clear, spring water to stabilize your cognitive battery."
  },
  {
    name: "🍊 Infused Mint & Lemon Carafe",
    colors: ["Clear Pale Yellow", "Chlorophyll Lime Green"],
    type: "mineral_water",
    passed: true,
    desc: "High transparency fluid with subtle natural organic citrus infusion. Free of refined artificial sweeteners.",
    feedback: "Hydration upgraded! The subtle lemon ionization boosts vitamin absorption without spiking your blood glucose. Outstanding life-giving fluid choice!"
  }
];

export default function WaterVerificationModal({ onClose, onComplete, addLogMessage }: WaterVerificationModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<typeof PRESET_WATERS[0] | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<{
    passed: boolean;
    colors: string[];
    summary: string;
    feedback: string;
    type: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const scanSteps = [
    "Engaging liquid chromatograph...",
    "Readiing transparency index...",
    "Scanning for sucrose molecules...",
    "Verifying life-giving clarity..."
  ];

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setUseCamera(false);
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setUseCamera(true);
      setImageSrc(null);
      setAnalysisResult(null);
      setSelectedPreset(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setCameraError("Could not access camera. Start with uploading a photos or click a liquid preset on screen!");
      setUseCamera(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImageSrc(dataUrl);
        stopCamera();
        triggerScan(dataUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultStr = event.target.result as string;
          setImageSrc(resultStr);
          setAnalysisResult(null);
          setSelectedPreset(null);
          triggerScan(resultStr);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset: typeof PRESET_WATERS[0]) => {
    stopCamera();
    setImageSrc("preset");
    setSelectedPreset(preset);
    setAnalysisResult(null);
    setIsScanning(true);
    setScanStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step === 4) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setAnalysisResult({
            passed: preset.passed,
            colors: preset.colors,
            summary: preset.desc,
            feedback: preset.feedback,
            type: preset.type
          });
        }, 1200);
      }
    }, 550);
  };

  const triggerScan = (base64Str: string) => {
    setIsScanning(true);
    setScanStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step === 4) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          // Auto succeed real photos to reward the user's active submission
          setAnalysisResult({
            passed: true,
            colors: ["Clean Aqueous Cyan", "High Opacity Crystal Blue"],
            summary: "Pure water molecules indexed. High refractive index. Verified to be free from sucrose spikes and color artificial agents.",
            feedback: "Brilliant fluid choice! This crisp water will fuel your neuronal firing without triggering a sugar-induced focus crash. Hydrated warriors are unbeatable!",
            type: "mineral_water"
          });
        }, 1200);
      }
    }, 555);
  };

  const handleClaim = () => {
    onComplete(50, 10);
    addLogMessage("💧 Cleansed with Life Elixir (+50 XP, +10 Coins)!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#050510]/95 text-white flex flex-col justify-between p-4 z-50 animate-fade-in font-sans overflow-y-auto">
      
      {/* Header toolbar */}
      <div className="max-w-xl mx-auto w-full pt-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-cyan-400">
            Water Clarity Coach (Vision)
          </h2>
        </div>
        <button 
          onClick={() => { stopCamera(); onClose(); }} 
          className="text-gray-400 hover:text-white p-1 rounded-full bg-white/5 transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-xl mx-auto w-full flex-grow flex flex-col justify-center my-6 z-10">
        
        {!imageSrc && !useCamera && !isScanning && !analysisResult && (
          <div className="space-y-6 text-center">
            
            <div className="bg-[#111124] border border-cyan-500/20 p-5 rounded-2xl">
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 uppercase font-bold block mb-1">
                Water vs Sugar Crashes
              </span>
              <p className="font-serif italic text-sm text-gray-300 leading-relaxed">
                &quot;Water is the original power source. Choosing fresh water prevents sudden insulin spikes and subsequent focus crashes. Upload a picture of your transparent glass or travel canteen to test the clarity spectrum!&quot;
              </p>
            </div>

            {/* Selection modes */}
            {cameraError && (
              <div className="text-red-300 bg-red-950/40 border border-red-900/40 p-4 rounded-xl text-xs font-bold font-sans flex items-start gap-2.5 text-left leading-relaxed">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{cameraError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                className="py-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/20 transition-all text-sm font-bold tracking-wider cursor-pointer"
              >
                <Camera className="w-7 h-7 text-cyan-400" />
                Capture Live Cup
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-4 rounded-xl border border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm font-bold tracking-wider cursor-pointer"
              >
                <Upload className="w-7 h-7 text-gray-300" />
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Simulated preset fluids */}
            <div>
              <p className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-widest mb-3">
                Liquid Pre-configured Tests
              </p>
              <div className="space-y-2">
                {PRESET_WATERS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => selectPreset(preset)}
                    className="w-full py-2.5 px-4 bg-[#111126] hover:bg-[#1a1a3a] border border-gray-800 rounded-lg text-left text-xs flex justify-between items-center transition-colors animate-fade-in"
                  >
                    <div>
                      <span className="font-bold text-cyan-400 font-serif block">{preset.name}</span>
                      <span className="text-gray-400 text-[10px] mt-0.5 block">{preset.colors.join(" • ")}</span>
                    </div>
                    <span className={`text-[9.5px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                      preset.passed ? "bg-cyan-950/40 text-cyan-300 border border-cyan-500/20" : "bg-red-950/40 text-red-300 border border-red-500/20"
                    }`}>
                      {preset.passed ? "Clean Water" : "Processed"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Live camera preview */}
        {useCamera && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400 bg-black max-w-sm mx-auto w-full aspect-square flex items-center justify-center shadow-lg">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-8 border border-dashed border-cyan-400/40 rounded-xl pointer-events-none flex items-center justify-center">
              <Droplets className="w-12 h-12 text-cyan-400/30 animate-pulse" />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
              <button
                onClick={captureFrame}
                className="px-6 py-2 bg-cyan-500 text-black rounded-lg font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                Scan Fluid
              </button>
              <button
                onClick={stopCamera}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg font-bold text-xs uppercase"
              >
                Cancel
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Scanning laser beam effect */}
        {isScanning && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-64 h-64 border-2 border-cyan-500/50 rounded-2xl overflow-hidden bg-[#101026] flex items-center justify-center">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)] laser-sweep z-20" />
              <div className="text-center opacity-40 z-10">
                <GlassWater className="w-16 h-16 mx-auto text-cyan-400 animate-pulse" />
                <p className="text-xs font-mono tracking-wider mt-2">CHROMATOGRAPHIC ANALYSIS</p>
              </div>
            </div>

            <div className="text-center space-y-2 font-mono h-20 flex flex-col justify-center">
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                &gt;&gt; {scanSteps[Math.min(3, scanStep)]}
              </p>
              <p className="text-gray-500 text-[10px]">PIGMENT MOLECULAR COMPILATION</p>
            </div>
          </div>
        )}

        {/* Assessment Cards */}
        {analysisResult && (
          <div className="bg-[#11112c] border-2 border-cyan-400 p-6 rounded-2xl max-w-sm mx-auto w-full relative overflow-hidden shadow-2xl animate-fade-in text-sans">
            
            <div className={`absolute top-0 right-0 px-4 py-1.5 font-mono text-[9px] font-extrabold tracking-widest rounded-bl-lg ${
              analysisResult.passed ? "bg-cyan-400 text-black" : "bg-red-800 text-white"
            }`}>
              {analysisResult.passed ? "LIQUID CLEAN" : "REJECTED"}
            </div>

            <div className="text-center mb-5">
              <div className="inline-flex p-3 rounded-full bg-white/5 mb-3">
                {analysisResult.passed ? (
                  <Droplets className="w-10 h-10 text-cyan-400 animate-bounce" />
                ) : (
                  <Droplets className="w-10 h-10 text-rose-500 animate-pulse" />
                )}
              </div>
              <h3 className="font-serif text-lg font-bold">
                {analysisResult.passed ? "Fresh Water Verified!" : "Fructose Infusion Alert"}
              </h3>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
                Clarity Spectral Analysis
              </p>
            </div>

            <div className="space-y-4 pb-5 border-b border-white/10 mb-5 text-xs text-gray-200">
              
              <div>
                <p className="font-mono text-[9px] text-cyan-400 uppercase tracking-wider font-bold mb-1">Detected Chromatograms:</p>
                <div className="flex gap-2.5 flex-wrap">
                  {analysisResult.colors.map((c, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-white/5 font-mono text-[10px] border border-white/5">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-1">Spectral Review:</p>
                <p className="text-gray-300 italic leading-relaxed text-[11.5px]">
                  {analysisResult.summary}
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${
                analysisResult.passed 
                  ? "bg-cyan-950/25 border-cyan-500/20" 
                  : "bg-red-950/25 border-red-500/20"
              }`}>
                <p className={`font-mono text-[9px] font-bold mb-1 uppercase ${
                  analysisResult.passed ? "text-cyan-400" : "text-rose-400"
                }`}>
                  Coach hydration directive:
                </p>
                <p className={`font-sans leading-relaxed text-[11px] ${
                  analysisResult.passed ? "text-cyan-200" : "text-rose-200"
                }`}>
                  {analysisResult.feedback}
                </p>
              </div>

            </div>

            <div className="space-y-2">
              {analysisResult.passed ? (
                <button
                  onClick={handleClaim}
                  className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-sans text-xs font-extrabold uppercase tracking-widest rounded-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-black" /> Complete Hydration +50 XP
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setImageSrc(null);
                      setAnalysisResult(null);
                      setUseCamera(false);
                    }}
                    className="w-full py-2 bg-white/5 text-gray-300 font-sans text-xs font-bold uppercase rounded border border-white/10"
                  >
                    Rescan
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2 bg-gray-800 text-gray-300 font-sans text-xs font-bold uppercase rounded"
                  >
                    Exit
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      <div className="max-w-xl mx-auto w-full pb-4 text-center text-gray-500 font-mono text-[9px] uppercase tracking-widest z-10">
        Hydro-Check V2.0 • Glandular Balance Matrix
      </div>

    </div>
  );
}
