"use client";

import { useRef, useState } from "react";

export default function SketchPad() {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#111111");

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
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
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
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold mb-2">Sketch Pad</h1>
      <p className="mb-6 text-neutral-500">
        Click and drag on the canvas to draw. A tiny example of an
        interactive page.
      </p>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded border border-neutral-300 dark:border-neutral-700"
        />
        <button
          onClick={clear}
          className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm dark:border-neutral-700"
        >
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={640}
        height={420}
        className="w-full touch-none rounded-lg border border-neutral-200 bg-white dark:border-neutral-800"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={stop}
      />
    </section>
  );
}
