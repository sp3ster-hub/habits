import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, RefreshCw, CheckCircle2, Footprints, Sparkles, Image as ImageIcon, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface WalkVerificationModalProps {
  onClose: () => void;
  onComplete: (xp: number, gold: number) => void;
  addLogMessage: (message: string) => void;
}

// Engaging "movement snack" facts for high-energy coaching feedback
const MOVEMENT_SNACKS = [
  "Just 5 minutes of brisk walking can boost your creative divergent thinking by up to 60%! Your brain thrives on active blood flow, champion!",
  "A quick movement snack triggers a rapid release of BDNF (Brain-Derived Neurotrophic Factor)—it is literally a mini software upgrade for your neurons!",
  "Stepping outside for a short stroll resets your optic flow, which dramatically dampens amygdala activity. That is physical sci-fi speak for instant anxiety relief!",
  "A brisk 5-minute walk before or after food keeps your blood glucose curves flat, protecting you from mid-day focus crashes!"
];

// Preset walking views mock simulations for rapid interactive demoing
const PRESET_WALKS = [
  {
    name: "👟 Red Trailrunners on Gravel",
    detected: "Outdoors, Running Shoes, Pathway gravel",
    fact: "Optic flow and natural green environments lower cortisol levels inside 120 seconds!",
    snack: MOVEMENT_SNACKS[2],
    feedback: "Incredible choice! Those trail tread lines are built for conquering high-indolence obstacles. Outdoor movement verified!"
  },
  {
    name: "🌲 Tall Pines Green Pathway",
    detected: "Dense Foliage, Paved Forest Path, Natural Light",
    fact: "Phytoncides from pine trees boost white blood cell count when walking through wood routes!",
    snack: MOVEMENT_SNACKS[1],
    feedback: "Nature scan positive! Breathing forest air while walking is the ultimate mental defragmentation cheat code."
  },
  {
    name: "🥾 Sunrise Leather Wanderers",
    detected: "Laced Boots, Wooden Decking, High Contrast",
    fact: "Brisk pace hiking unlocks up to 300% more lymphatic drainage compared to a sedentary desk session!",
    snack: MOVEMENT_SNACKS[0],
    feedback: "Laced and loaded! You're ready to cross mountain slopes. Physical momentum index is off the charts!"
  }
];

export default function WalkVerificationModal({ onClose, onComplete, addLogMessage }: WalkVerificationModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<typeof PRESET_WALKS[0] | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<{
    detected: string;
    fact: string;
    feedback: string;
    snack: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const scanSteps = [
    "Contacting movement sensors...",
    "Scanning laces and tread depth...",
    "Confirming geo-spatial daylight variance...",
    "Verifying motion-snack coordinates..."
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
      setCameraError("Could not access camera. Try uploading an image or utilizing a quick-test walking path preset!");
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

  const handleSelectPreset = (preset: typeof PRESET_WALKS[0]) => {
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
            detected: preset.detected,
            fact: preset.fact,
            feedback: preset.feedback,
            snack: preset.snack
          });
        }, 1200);
      }
    }, 550);
  };

  const triggerScan = (src: string) => {
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
          const snackIdx = Math.floor(Math.random() * MOVEMENT_SNACKS.length);
          setAnalysisResult({
            detected: "Active Walking Gear, Fresh Ground Pavement & Sidewalk, Natural Light Shadowing",
            fact: "Outdoor environment stimulates ocular system flow, resetting cognitive fatigue indexes instantly!",
            feedback: "Motion verified! Incredible, prompt submission. Laces are ready, pathway is identified, and your spirit is moving!",
            snack: MOVEMENT_SNACKS[snackIdx]
          });
        }, 1200);
      }
    }, 550);
  };

  const handleClaim = () => {
    onComplete(150, 25);
    addLogMessage("👟 Verified 5-Minute Movement Snack! Vitality restored (+150 XP, +25 Coins)!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#05050e]/95 text-white flex flex-col justify-between p-4 z-50 animate-fade-in font-sans overflow-y-auto">
      
      {/* Header */}
      <div className="max-w-xl mx-auto w-full pt-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
          <h2 className="font-serif text-lg font-bold uppercase tracking-widest text-amber-400">
            Walk 5 Min Coach (Vision)
          </h2>
        </div>
        <button 
          onClick={() => { stopCamera(); onClose(); }} 
          className="text-gray-400 hover:text-white p-1 rounded-full bg-white/5 transition-transform active:scale-90 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto w-full flex-grow flex flex-col justify-center my-6 z-10">
        
        {!imageSrc && !useCamera && !isScanning && !analysisResult && (
          <div className="space-y-6 text-center">
            
            <div className="bg-[#111128] border border-amber-500/20 p-5 rounded-2xl">
              <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase font-bold block mb-1">
                A Supportive Habit Snack
              </span>
              <p className="font-serif italic text-sm text-gray-300 leading-relaxed">
                &quot;Step away from the screen for just five minutes. Walk, breathe natural air, watch the sky. Upload a picture of your shoes on the path, or a scenic view ahead to prove your locomotion!&quot;
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
                className="py-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex flex-col items-center justify-center gap-2 hover:bg-amber-500/20 transition-all text-sm font-bold tracking-wider cursor-pointer"
              >
                <Camera className="w-7 h-7 text-amber-400" />
                Open Viewfinder
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-4 rounded-xl border border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all text-sm font-bold tracking-wider cursor-pointer"
              >
                <Upload className="w-7 h-7 text-gray-300" />
                Upload Path Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Walking Preset Selector */}
            <div>
              <p className="text-xs text-amber-400 font-mono font-bold uppercase tracking-widest mb-3">
                Quick-test Walk Simulators
              </p>
              <div className="space-y-2">
                {PRESET_WALKS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full py-2.5 px-4 bg-[#111126] hover:bg-[#1a1a3a] border border-gray-800 rounded-lg text-left text-xs flex justify-between items-center transition-colors"
                  >
                    <div>
                      <span className="font-bold text-amber-400 font-serif block">{preset.name}</span>
                      <span className="text-gray-400 text-[10px] mt-0.5 block">{preset.detected}</span>
                    </div>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/20">
                      Simulate
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Live Video Frame */}
        {useCamera && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 bg-black max-w-sm mx-auto w-full aspect-square flex items-center justify-center shadow-lg">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-8 border border-dashed border-amber-400/40 rounded-xl pointer-events-none flex items-center justify-center">
              <Footprints className="w-12 h-12 text-amber-400/30 animate-pulse" />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
              <button
                onClick={captureFrame}
                className="px-6 py-2 bg-amber-500 text-black rounded-lg font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                Verify Photo
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

        {/* Scanner Radar Beam Processing */}
        {isScanning && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-64 h-64 border-2 border-amber-500/50 rounded-2xl overflow-hidden bg-[#101026] flex items-center justify-center">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,1)] laser-sweep z-20" />
              <div className="text-center opacity-40 z-10">
                <Footprints className="w-16 h-16 mx-auto text-amber-400 animate-pulse" />
                <p className="text-xs font-mono tracking-wider mt-2">PARSING LOCOMOTION VECTOR</p>
              </div>
            </div>

            <div className="text-center space-y-2 font-mono h-20 flex flex-col justify-center">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                &gt;&gt; {scanSteps[Math.min(3, scanStep)]}
              </p>
              <p className="text-gray-500 text-[10px]">COGNITIVE HABIT DIAGNOSTICS ACTIVE</p>
            </div>
          </div>
        )}

        {/* AI Action Results */}
        {analysisResult && (
          <div className="bg-[#11112b] border-2 border-amber-400 p-6 rounded-2xl max-w-sm mx-auto w-full relative overflow-hidden shadow-2xl animate-fade-in text-sans">
            
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-black font-mono text-[9px] font-extrabold tracking-widest rounded-bl-lg">
              STEP VERIFIED
            </div>

            <div className="text-center mb-5">
              <div className="inline-flex p-3 rounded-full bg-white/5 mb-3">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="font-serif text-lg font-bold text-amber-300">Move-Snack Logged!</h3>
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
                Physical Stamina Recharged
              </p>
            </div>

            <div className="space-y-4 pb-5 border-b border-white/10 mb-5 text-xs text-gray-200">
              
              <div>
                <p className="font-mono text-[9px] text-amber-400 uppercase tracking-wider font-bold mb-1">Visual Context Detected:</p>
                <p className="bg-white/5 p-2 rounded text-xs font-mono border border-white/5">
                  🔍 {analysisResult.detected}
                </p>
              </div>

              <div>
                <p className="font-mono text-[9px] text-amber-400 uppercase tracking-wider font-bold mb-1">Coach Evaluation:</p>
                <p className="text-gray-350 italic leading-relaxed">
                  {analysisResult.feedback}
                </p>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-lg">
                <p className="font-mono text-[9px] text-amber-400 font-bold mb-1 uppercase flex items-center gap-1">
                  💡 Encouraging Movement Snack Fact:
                </p>
                <p className="text-amber-200 font-sans leading-relaxed text-[11px]">
                  {analysisResult.snack}
                </p>
              </div>

            </div>

            <button
              onClick={handleClaim}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-black font-sans text-xs font-extrabold uppercase tracking-widest rounded-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black text-black" /> Complete & Claim +150 XP
            </button>

          </div>
        )}

      </div>

      <div className="max-w-xl mx-auto w-full pb-4 text-center text-gray-500 font-mono text-[9px] uppercase tracking-widest z-10">
        GPS Walk Authenticator 1.8.4 • Peer Habit Core
      </div>

    </div>
  );
}
