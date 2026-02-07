import React from 'react';

const ThinkingDots = ({ color = 'currentColor' }) => {
    return (
        <div className="thinking-dots-container">
            <style>
                {`
          .thinking-dots-container {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            width: 48px;
            height: 24px;
            justify-content: flex-start;
          }

          .thinking-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: ${color};
            opacity: 0.3;
            animation: thinking-dot-sequence 1.2s infinite;
          }

          .thinking-dot:nth-child(1) {
            animation-delay: 0s;
          }

          .thinking-dot:nth-child(2) {
            animation-delay: 0.4s;
          }

          .thinking-dot:nth-child(3) {
            animation-delay: 0.8s;
          }

          @keyframes thinking-dot-sequence {
            0% {
              opacity: 0.3;
              transform: translateY(0);
            }
            25% {
              opacity: 1;
              transform: translateY(-2px);
            }
            50% {
              opacity: 0.3;
              transform: translateY(0);
            }
            100% {
              opacity: 0.3;
              transform: translateY(0);
            }
          }
        `}
            </style>
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
            <div className="thinking-dot"></div>
        </div>
    );
};

export default ThinkingDots;
