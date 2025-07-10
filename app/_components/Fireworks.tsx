"use client";

import { useEffect, useRef } from "react";

interface FireworksProps {
    isVisible: boolean;
    onAnimationEnd: () => void;
}

export const Fireworks: React.FC<FireworksProps> = ({ isVisible, onAnimationEnd }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!isVisible) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let timeoutId: ReturnType<typeof setTimeout>;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // --- Particle class ---
        class Particle {
            x: number;
            y: number;
            color: string;
            radius: number;
            velocity: { x: number; y: number };
            alpha: number;
            friction: number;
            gravity: number;

            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.radius = Math.random() * 2 + 1;
                this.velocity = {
                    x: (Math.random() - 0.5) * (Math.random() * 6),
                    y: (Math.random() - 0.5) * (Math.random() * 6),
                };
                this.alpha = 1;
                this.friction = 0.99;
                this.gravity = 0.05;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }

            update(ctx: CanvasRenderingContext2D) {
                this.velocity.x *= this.friction;
                this.velocity.y *= this.friction;
                this.velocity.y += this.gravity;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= 0.008;
                this.draw(ctx);
            }
        }

        const createFirework = (x: number, y: number) => {
            const particleCount = 80;
            const hue = Math.random() * 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(x, y, color));
            }
        };

        const launchRandomFireworks = () => {
            const numberOfFireworks = 5;
            for (let i = 0; i < numberOfFireworks; i++) {
                const randomX = Math.random() * canvas.width;
                const randomY = Math.random() * canvas.height * 0.7;
                createFirework(randomX, randomY);
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update(ctx);
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }
        };

        launchRandomFireworks();
        animate();

        timeoutId = setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            onAnimationEnd();
        }, 3000);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeoutId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [isVisible, onAnimationEnd]);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 9999,
                pointerEvents: "none",
            }}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};
