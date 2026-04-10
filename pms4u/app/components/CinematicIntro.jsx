"use client";
import { useEffect, useState } from "react";

export default function CinematicIntro() {
  const [show, setShow] = useState(true);
  const [text, setText] = useState("");
  const fullText = "Control Execution.";

  useEffect(() => {
    let i = 0;

    const typing = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;

      if (i > fullText.length) clearInterval(typing);
    }, 50);

    setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => clearInterval(typing);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white animate-pulse">
        {text}
      </h1>
    </div>
  );
}