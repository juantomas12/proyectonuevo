"use client";

import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "./MagneticButton";

type Status = "idle" | "requesting" | "active" | "denied" | "error";

export function WebcamController({ onLook }: { onLook: (value: { x: number; y: number } | null) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const tracker = useRef<FaceLandmarker | null>(null);
  const frame = useRef<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);

  const stop = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    tracker.current?.close();
    tracker.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    onLook(null);
    setStatus("idle");
  };

  useEffect(() => stop, []);

  const start = async () => {
    setConsent(false);
    setStatus("requesting");
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      stream.current = media;
      if (!video.current) return;
      video.current.srcObject = media;
      await video.current.play();

      const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm",
      );
      tracker.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.55,
        minTrackingConfidence: 0.55,
      });

      setStatus("active");
      const detect = () => {
        const currentVideo = video.current;
        const currentTracker = tracker.current;
        if (!currentVideo || !currentTracker) return;
        if (currentVideo.readyState >= 2) {
          const result = currentTracker.detectForVideo(currentVideo, performance.now());
          const nose = result.faceLandmarks[0]?.[1];
          if (nose) {
            onLook({
              x: Math.max(-1, Math.min(1, (0.5 - nose.x) * 3.2)),
              y: Math.max(-1, Math.min(1, (0.5 - nose.y) * 2.6)),
            });
          }
        }
        frame.current = requestAnimationFrame(detect);
      };
      detect();
    } catch (error) {
      console.error("Face tracking could not start", error);
      stream.current?.getTracks().forEach((track) => track.stop());
      setStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "denied" : "error");
    }
  };

  return (
    <div className="relative">
      <video ref={video} muted playsInline className={`absolute bottom-full right-0 mb-3 aspect-video w-44 rounded-xl border border-white/15 object-cover grayscale ${status === "active" ? "block" : "hidden"}`} />
      {status === "active" ? (
        <MagneticButton onClick={stop} className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-cyan-100">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-cyan-300" /> Stop face mode
        </MagneticButton>
      ) : (
        <MagneticButton onClick={() => setConsent(true)} disabled={status === "requesting"} className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur disabled:opacity-50">
          {status === "requesting" ? "Loading vision…" : "Try face mode"}
        </MagneticButton>
      )}
      {(status === "denied" || status === "error") && (
        <p className="mt-2 max-w-56 text-[10px] leading-relaxed text-amber-200/70">
          {status === "denied" ? "Camera permission was not granted. Cursor mode remains active." : "Face tracking is unavailable here. Cursor mode remains active."}
        </p>
      )}

      {consent && (
        <div className="fixed inset-0 z-[300] grid place-items-center bg-black/75 p-5 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="camera-title">
          <div className="max-w-md rounded-[2rem] border border-white/15 bg-[#101416] p-7 text-white shadow-2xl md:p-9">
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-cyan-300">Optional input</p>
            <h2 id="camera-title" className="font-display text-4xl tracking-[-0.04em]">Use your movement.</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              If you continue, the browser will request camera access. Frames are analysed locally to estimate head position; they are not recorded, uploaded or stored. This is head orientation, not precise eye tracking.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={start} className="rounded-full bg-cyan-300 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black">Allow & start</button>
              <button onClick={() => setConsent(false)} className="rounded-full border border-white/20 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white">Not now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
