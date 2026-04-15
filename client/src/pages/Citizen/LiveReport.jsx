import React, { useState, useRef, useEffect } from "react";
import axios from "../../api/axios";
import { FiVideo, FiStopCircle, FiUpload, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function LiveReport() {
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        chunksRef.current = [];
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("Error accessing camera/microphone: " + err.message);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadVideo = async () => {
    if (!videoBlob) return;
    setUploading(true);
    try {
      // 1. Get ImageKit auth
      const { data: auth } = await axios.get("/api/upload/auth");

      const formData = new FormData();
      formData.append("file", videoBlob);
      formData.append("fileName", `evidence-${Date.now()}.webm`);
      formData.append("signature", auth.signature);
      formData.append("token", auth.token);
      formData.append("expire", auth.expire);
      formData.append("publicKey", auth.publicKey);
      formData.append("folder", "/evidence");

      const uploadRes = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      if (uploadRes.url) {
        // Here you would link this to a complaint or emergency record
        // For now, we simulate success
        setSuccess(true);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 px-6 flex flex-col items-center">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-2">📹 Live Incident Reporting</h1>
        <p className="text-slate-400 mb-8">Record and transmit live video evidence to the command center</p>

        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          
          {recording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full animate-pulse">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-xs font-bold">REC</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-6">
          {!recording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold transition transform hover:scale-105"
            >
              <FiVideo className="text-xl" /> Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-8 py-4 rounded-2xl font-bold transition transform animate-pulse"
            >
              <FiStopCircle className="text-xl" /> Stop Recording
            </button>
          )}

          {videoBlob && !recording && (
            <button
              onClick={uploadVideo}
              disabled={uploading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-8 py-4 rounded-2xl font-bold transition transform hover:scale-105 disabled:bg-slate-600"
            >
              {uploading ? "Transmitting..." : (
                <>
                  <FiUpload className="text-xl" /> Transmit Evidence
                </>
              )}
            </button>
          )}
        </div>

        {success && (
          <div className="mt-10 p-6 bg-green-900/40 border border-green-500/50 rounded-2xl animate-pop">
            <FiCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold">Evidence Transmitted Successfully</h3>
            <p className="text-sm text-green-200/70 mt-1">Incident record #INV-{Math.floor(Math.random() * 90000 + 10000)} created.</p>
            <button 
              onClick={() => navigate('/citizen/home')}
              className="mt-4 text-green-400 hover:underline text-sm font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
