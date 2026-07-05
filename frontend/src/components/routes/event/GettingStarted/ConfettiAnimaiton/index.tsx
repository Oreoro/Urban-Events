import { FC, useEffect, useRef, useState } from 'react';

interface ConfettiAnimationProps {
    duration?: number;
}

const CONFETTI_COLORS = ['#0E7C70', '#253044', '#EAF4FF', '#E3F8F3', '#B7791F'];
const CONFETTI_SHAPES = ['circle', 'square', 'bar'] as const;

const ConfettiAnimation: FC<ConfettiAnimationProps> = ({ duration = 4000 }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!canvasRef.current || !isActive) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const context = ctx;

        let animationFrameId: number;
        const particles: Particle[] = [];
        const maxParticles = 80;
        const startTime = performance.now();

        const resizeCanvas = () => {
            const ratio = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * ratio;
            canvas.height = window.innerHeight * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            x: number;
            y: number;
            shape: typeof CONFETTI_SHAPES[number];
            color: string;
            size: number;
            velocityY: number;
            velocityX: number;
            opacity: number;
            rotation: number;
            rotationSpeed: number;

            constructor() {
                this.x = Math.random() * window.innerWidth;
                this.y = -30;
                this.shape = CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)];
                this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
                this.size = Math.random() * 12 + 8; // 8-20px
                this.velocityY = Math.random() * 2 + 1; // slower: 1-3 px/frame
                this.velocityX = (Math.random() - 0.5) * 1.5; // gentle drift
                this.opacity = 1;
                this.rotation = Math.random() * Math.PI;
                this.rotationSpeed = (Math.random() - 0.5) * 0.12;
            }

            update(): boolean {
                this.y += this.velocityY;
                this.x += this.velocityX;
                this.velocityY += 0.05; // gentle gravity
                this.rotation += this.rotationSpeed;

                if (this.y > window.innerHeight * 0.7) {
                    this.opacity -= 0.015;
                }

                return this.y < window.innerHeight + 40 && this.opacity > 0;
            }

            draw(): void {
                context.save();
                context.globalAlpha = this.opacity;
                context.translate(this.x, this.y);
                context.rotate(this.rotation);
                context.fillStyle = this.color;

                if (this.shape === 'circle') {
                    context.beginPath();
                    context.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    context.fill();
                } else if (this.shape === 'bar') {
                    context.fillRect(-this.size / 2, -2, this.size, 4);
                } else {
                    context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                }

                context.restore();
            }
        }

        for (let i = 0; i < 40; i++) {
            particles.push(new Particle());
        }

        const animate = (time: number) => {
            const elapsed = time - startTime;
            context.clearRect(0, 0, canvas.width, canvas.height);

            if (elapsed < duration && Math.random() < 0.05 && particles.length < maxParticles) {
                particles.push(new Particle());
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                if (p.update()) {
                    p.draw();
                } else {
                    particles.splice(i, 1);
                }
            }

            if (particles.length > 0 || elapsed < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setIsActive(false);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [duration, isActive]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 99099,
            }}
        />
    );
};

export default ConfettiAnimation;
