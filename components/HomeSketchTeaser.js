"use client";

import { useRef } from "react";

export default function HomeSketchTeaser() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const start = (e) => {
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          className="w-full touch-none rounded-sm border border-white/15 bg-black"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
        />
        <button
          onClick={clear}
          className="absolute right-3 top-3 rounded-full border border-white/20 px-3 py-1 text-xs text-white/60 hover:border-white/40"
        >
          Clear
        </button>
      </div>
      <p className="mt-3 text-xs text-white/40">
        Draw something — this canvas is real, not a screenshot.
      </p>
    </div>
  );
}
