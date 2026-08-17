"use client";

import React, { useEffect, useRef } from "react";

interface InteractiveParticleTextProps {
  text?: string;
  className?: string;
}

export default function InteractiveParticleText({
  text = "AMBROCIA'S",
  className = "",
}: InteractiveParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 160);

    const mouse = {
      x: -9999,
      y: -9999,
      radius: 90,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      color: string;
      vx: number;
      vy: number;

      constructor(x: number, y: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 2 + 1.2;
        this.density = Math.random() * 30 + 10;
        this.vx = 0;
        this.vy = 0;
        const colors = ["#D4AF37", "#F5D77F", "#FF9E3B", "#E6C665"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.shadowColor = "#D4AF37";
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / (distance || 1);
        const forceDirectionY = dy / (distance || 1);
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;

        if (distance < mouse.radius) {
          const pushX = forceDirectionX * force * this.density * 0.6;
          const pushY = forceDirectionY * force * this.density * 0.6;
          this.x -= pushX;
          this.y -= pushY;
        } else {
          if (this.x !== this.baseX) {
            const dxBase = this.x - this.baseX;
            this.x -= dxBase * 0.08;
          }
          if (this.y !== this.baseY) {
            const dyBase = this.y - this.baseY;
            this.y -= dyBase * 0.08;
          }
        }
      }
    }

    let particlesArray: Particle[] = [];

    const init = () => {
      particlesArray = [];
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 160;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#D4AF37";
      ctx.font = `900 ${Math.min(width / (text.length * 0.75), 110)}px Cinzel, "Playfair Display", Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);

      const textCoordinates = ctx.getImageData(0, 0, width, height);
      ctx.clearRect(0, 0, width, height);

      const step = Math.max(Math.floor(width / 320), 3);

      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const alphaIndex = (y * 4 * textCoordinates.width) + (x * 4) + 3;
          if (textCoordinates.data[alphaIndex] > 128) {
            particlesArray.push(new Particle(x, y));
          }
        }
      }
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [text]);

  return (
    <div className={`relative w-full h-[140px] sm:h-[180px] flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer select-none"
      />
    </div>
  );
}
