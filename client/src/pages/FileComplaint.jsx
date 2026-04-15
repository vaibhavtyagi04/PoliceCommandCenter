import React, { useState, useEffect } from "react";
import { FiMic, FiCamera, FiMapPin, FiTwitter, FiCheck, FiChevronRight, FiChevronLeft, FiAlertTriangle } from "react-icons/fi";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function FileComplaint() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Theft",
    location: { latitude: 0, longitude: 0 },
    images: [],
    priority: "Medium",
    shareToTwitter: false
  });
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  // Voice Recognition Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({ ...prev, description: prev.description + " " + transcript }));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
    }
  }, [recognition]);

  const toggleListening = () => {
    if (!recognition) return toast.error("Speech recognition not supported in this browser.");
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("/api/complaints", formData);
      toast.success("Complaint filed successfully!", { duration: 5000 });
      navigate("/status");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Theft", "Assault", "Harassment", "Cyber Crime", "Fraud", "Other"];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-12 px-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 scale-110 shadow-lg ${step >= s ? 'bg-navy text-white ring-4 ring-navy/20' : 'bg-white text-gray-400 border border-gray-200'}`}>
              {step > s ? <FiCheck /> : s}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-100 min-h-[500px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-black text-navy leading-tight">What happened?<br/><span className="text-gold">Basic Details</span></h2>
                
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Incident Title</label>
                  <input 
                    type="text" 
                    placeholder="Brief headline of the incident..." 
                    className="w-full p-5 bg-slate-50 border border-gray-100 rounded-[24px] outline-none focus:border-gold transition-all text-navy font-bold shadow-inner"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map(c => (
                      <button 
                        key={c}
                        onClick={() => setFormData({...formData, category: c})}
                        className={`p-4 rounded-2xl font-bold text-xs transition-all border ${formData.category === c ? 'bg-navy text-white border-navy shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:border-gold'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl font-black text-navy leading-tight">Describe the<br/><span className="text-gold">Incident</span></h2>
                  <button 
                    onClick={toggleListening}
                    className={`p-5 rounded-full shadow-lg transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-slate-50 text-navy hover:bg-gold hover:text-white'}`}
                  >
                    <FiMic className="text-2xl" />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Description</label>
                  <textarea 
                    rows="8"
                    placeholder="Where, when, and how... Speak or type clearly."
                    className="w-full p-6 bg-slate-50 border border-gray-100 rounded-[32px] outline-none focus:border-gold transition-all text-navy font-medium shadow-inner resize-none overflow-hidden"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-black text-navy leading-tight">Attached Case<br/><span className="text-gold">Evidence</span></h2>
                
                <div className="border-4 border-dashed border-gray-100 rounded-[40px] p-12 text-center hover:border-gold/50 transition-colors cursor-pointer bg-slate-50/50">
                  <FiCamera className="text-5xl mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-400 font-bold text-sm mb-1">Click to Capture or Upload</p>
                  <p className="text-[10px] text-gray-400">Supporting evidence helps faster investigation</p>
                </div>

                <div className="bg-orange-50 p-5 rounded-2xl flex gap-3 border border-orange-100">
                  <FiAlertTriangle className="text-orange-500 text-xl shrink-0" />
                  <p className="text-[10px] text-orange-700 font-medium">Providing false information is a punishable offense under Section 182 of the IPC.</p>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-3xl font-black text-navy leading-tight">Final Check &<br/><span className="text-gold">Transparency</span></h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-navy">
                        <FiMapPin />
                      </div>
                      <div>
                        <p className="font-bold text-navy text-sm">Location Sync</p>
                        <p className="text-[10px] text-gray-400">Current GPS will be attached</p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase">Ready</div>
                  </div>

                  <div className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${formData.shareToTwitter ? 'bg-blue-50 border-blue-200 shadow-lg shadow-blue-50/50' : 'bg-slate-50 border-gray-100 opacity-60'}`} onClick={() => setFormData({...formData, shareToTwitter: !formData.shareToTwitter})}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${formData.shareToTwitter ? 'bg-blue-500 text-white' : 'bg-white text-gray-400'}`}>
                        <FiTwitter />
                      </div>
                      <div>
                        <p className="font-bold text-navy text-sm">Public Transparency</p>
                        <p className="text-[10px] text-gray-400">Post community alert on Twitter</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-all ${formData.shareToTwitter ? 'border-blue-500 bg-blue-500' : 'border-gray-200 bg-white'}`}>
                      {formData.shareToTwitter && <FiCheck className="text-white text-xs" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mt-12">
            {step > 1 && (
              <button 
                onClick={handleBack}
                className="w-16 h-16 flex items-center justify-center bg-slate-100 text-navy rounded-2xl hover:bg-slate-200 transition active:scale-95 shadow-lg shadow-slate-200/50"
              >
                <FiChevronLeft fontSize={24} />
              </button>
            )}
            
            {step < 4 ? (
              <button 
                onClick={handleNext}
                className="flex-1 h-16 bg-navy text-white rounded-3xl font-black text-sm tracking-widest hover:bg-slate-800 transition shadow-xl shadow-navy/20 flex items-center justify-center gap-2 group"
              >
                CONTINUE <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 h-16 bg-gold text-navy rounded-3xl font-black text-sm tracking-widest hover:shadow-2xl hover:translate-y-[-2px] transition active:scale-95 shadow-gold/30 flex items-center justify-center gap-2"
              >
                {loading ? "PROVISIONING CASE..." : "LODGE OFFICIAL REPORT"}
              </button>
            )}
          </div>

        </div>

        <p className="text-center text-gray-400 text-[10px] mt-8 font-medium">Digital Policing Protection System v2.0 • Ministry of Home Affairs Interface</p>
      </div>
    </div>
  );
}
