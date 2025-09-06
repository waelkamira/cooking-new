'use client';
import React, { useEffect, useState } from 'react';
export default function ShootingStar() {
  const [shootingStars, setShootingStars] = useState([]);

  //   Generate Shooting Star;
  useEffect(() => {
    const generateShootingStar = () => {
      const newStar = {
        id: Date.now() + Math.random(),
        top: Math.floor(Math.random() * 40), // Appear in top 40% of screen
        left: -10, // Start from off-screen left
        delay: 0,
        duration: 1.5 + Math.random() * 1.5, // Faster shooting stars
        angle: 15 + Math.random() * 30, // Random angle between 15-45 degrees
      };

      setShootingStars((stars) => [...stars, newStar]);

      // Remove star after animation completes
      setTimeout(() => {
        setShootingStars((stars) =>
          stars.filter((star) => star.id !== newStar.id)
        );
      }, (newStar.duration + 0.5) * 2000);
    };

    // Generate initial shooting star
    generateShootingStar();

    // Generate a shooting star every 2-4 seconds
    const interval = setInterval(
      generateShootingStar,
      2000 + Math.random() * 2000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            transform: `rotate(${star.angle}deg)`,
          }}
        >
          <div className="star-head"></div>
          <div className="star-tail"></div>
        </div>
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(180deg);
          }
        }

        /* Improved shooting star animation with better trajectory */
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(var(--angle, 30deg));
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateX(120vw) translateY(60vh)
              rotate(var(--angle, 30deg));
            opacity: 0;
          }
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        /* Enhanced shooting star styling with better glow effects */
        .shooting-star {
          position: absolute;
          width: 120px;
          height: 3px;
          transform-origin: left center;
          animation: shoot var(--duration, 2s) linear forwards;
          z-index: 30;
        }

        .star-head {
          position: absolute;
          right: -2px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #ffffff;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.9),
            0 0 20px 4px rgba(135, 206, 250, 0.6),
            0 0 30px 6px rgba(255, 255, 255, 0.3);
        }

        .star-tail {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 20%,
            rgba(135, 206, 250, 0.8) 60%,
            rgba(255, 255, 255, 1) 100%
          );
          border-radius: 2px;
        }

        .sparkle-svg {
          filter: drop-shadow(0 0 6px currentColor);
        }
      `}</style>
    </div>
  );
}
