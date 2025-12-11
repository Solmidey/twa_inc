import React from 'react';

const ChristmasSnow: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="snow-layer snow-layer-1" />
      <div className="snow-layer snow-layer-2" />
      <style jsx>{`
        .snow-layer {
          position: absolute;
          inset: -10% 0;
          width: 120%;
          height: 120%;
          background-repeat: repeat;
          background-size: 240px 240px;
          animation: snowfall 18s linear infinite;
          opacity: 0.55;
          mix-blend-mode: screen;
        }

        .snow-layer-1 {
          background-image:
            radial-gradient(1.5px 1.5px at 25px 35px, rgba(255, 255, 255, 0.9), transparent 45%),
            radial-gradient(1.2px 1.2px at 120px 80px, rgba(255, 255, 255, 0.7), transparent 45%),
            radial-gradient(1px 1px at 200px 150px, rgba(255, 255, 255, 0.55), transparent 45%),
            radial-gradient(1.4px 1.4px at 80px 200px, rgba(255, 255, 255, 0.8), transparent 45%);
        }

        .snow-layer-2 {
          background-image:
            radial-gradient(1.6px 1.6px at 60px 20px, rgba(255, 255, 255, 0.8), transparent 45%),
            radial-gradient(1px 1px at 170px 120px, rgba(255, 255, 255, 0.6), transparent 45%),
            radial-gradient(1.3px 1.3px at 240px 210px, rgba(255, 255, 255, 0.75), transparent 45%),
            radial-gradient(1px 1px at 30px 180px, rgba(255, 255, 255, 0.5), transparent 45%);
          background-size: 320px 320px;
          animation-duration: 26s;
          animation-delay: -6s;
          opacity: 0.4;
        }

        @keyframes snowfall {
          0% {
            background-position: 0 0;
            transform: translate3d(0, -10px, 0);
          }
          100% {
            background-position: 0 240px;
            transform: translate3d(0, 20px, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChristmasSnow;
