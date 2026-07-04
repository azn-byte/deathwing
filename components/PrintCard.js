"use client";

import { useState } from "react";

export default function PrintCard({ print }) {
  const [license, setLicense] = useState("personal");
  const price = license === "personal" ? print.personalPrice : print.commercialPrice;

  return (
    <div className="overflow-hidden rounded-sm border border-white/10">
      <img
        src={`/images/prints/${print.file}`}
        alt={print.title}
        className="w-full"
      />
      <div className="p-4">
        <h2 className="font-medium">{print.title}</h2>
        {print.description && (
          <p className="mt-1 text-sm text-white/50">{print.description}</p>
        )}

        <div className="mt-4 flex gap-2 text-sm">
          <button
            onClick={() => setLicense("personal")}
            className={`rounded-full border px-3 py-1.5 ${
              license === "personal"
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/70"
            }`}
          >
            Personal use
          </button>
          <button
            onClick={() => setLicense("commercial")}
            className={`rounded-full border px-3 py-1.5 ${
              license === "commercial"
                ? "border-white bg-white text-black"
                : "border-white/20 text-white/70"
            }`}
          >
            Commercial use
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold">${price}</span>
          <button
            disabled
            title="Checkout isn't wired up yet — coming once Stripe is connected"
            className="cursor-not-allowed rounded-full bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-500"
          >
            Buy — coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
