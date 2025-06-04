
"use client";

import { useState, useEffect, type CSSProperties } from 'react';
import { Scale } from 'lucide-react';

interface ShapeStyle extends CSSProperties {
  '--animation-delay': string;
  '--animation-duration': string;
}

interface ShapeConfig {
  id: string;
  type: 'scale' | 'sparkle' | 'circle';
  style: ShapeStyle;
  className: string;
  size: number;
}

const SparkleIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 1.25L13.8225 8.1775L20.75 10L13.8225 11.8225L12 18.75L10.1775 11.8225L3.25 10L10.1775 8.1775L12 1.25Z" />
    <path d="M12 5.5L12.9 8.75L16.25 9.5L12.9 10.25L12 13.5L11.1 10.25L7.75 9.5L11.1 8.75L12 5.5Z" opacity="0.7"/>
  </svg>
);

const CircleIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const shapeTypes: ShapeConfig['type'][] = ['scale', 'sparkle', 'circle'];
const animations = ['animate-float', 'animate-subtle-rotate', 'animate-pulse-opacity'];

export function JusticeAnimationBackground() {
  const [shapes, setShapes] = useState<ShapeConfig[]>([]);

  useEffect(() => {
    const numShapes = 15; // Adjust for density
    const newShapes: ShapeConfig[] = [];

    for (let i = 0; i < numShapes; i++) {
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const size = Math.random() * 30 + 10; // 10px to 40px
      const animationClass = animations[Math.floor(Math.random() * animations.length)];
      
      newShapes.push({
        id: `shape-${i}`,
        type,
        size,
        style: {
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4 opacity
          '--animation-delay': `${Math.random() * 5}s`,
          '--animation-duration': `${Math.random() * 5 + 5}s`, // 5s to 10s duration
        },
        className: `text-primary ${animationClass}`,
      });
    }
    setShapes(newShapes);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0" aria-hidden="true">
      {shapes.map((shape) => (
        <div key={shape.id} style={shape.style}>
          {shape.type === 'scale' && <Scale size={shape.size} className={shape.className} />}
          {shape.type === 'sparkle' && <SparkleIcon size={shape.size} className={shape.className} />}
          {shape.type === 'circle' && <CircleIcon size={shape.size} className={shape.className} />}
        </div>
      ))}
    </div>
  );
}
