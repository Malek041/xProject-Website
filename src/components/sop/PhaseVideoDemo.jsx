import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const PhaseVideoDemo = ({ phase, isShowing, onComplete }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef(null);

    // Define videos for each phase
    const phaseVideos = {
        define: [
            {
                filename: 'Work with the Expert Box to define your current revenue systems.mov',
                duration: 10000
            }
        ],
        assign: [
            {
                filename: 'Assign the defined to department head and knowledgeable worker.mov',
                duration: 10000
            }
        ],
        brainstorm: [
            {
                filename: 'Brainstorm as much sub-activities or tasks as possible .mov',
                duration: 10000
            },
            {
                filename: 'Define Capture method for each sub-activity.mov',
                duration: 10000
            },
            {
                filename: 'Set a standard for each sub-activity.mov',
                duration: 10000
            },
            {
                filename: 'Execute the checklist.mov',
                duration: 10000
            }
        ],
        organize: [
            {
                filename: 'Organize your the systems you extracted.mov',
                duration: 10000
            }
        ],
        integrate: [
            {
                filename: 'Integrate the extracted systems using checklist.mov',
                duration: 10000
            }
        ]
    };

    const currentPhaseVideos = phaseVideos[phase] || [];

    useEffect(() => {
        if (isShowing && currentPhaseVideos.length > 0) {
            setIsVisible(true);
            setCurrentVideoIndex(0);
        } else {
            setIsVisible(false);
        }
    }, [isShowing, phase, currentPhaseVideos.length]);

    useEffect(() => {
        if (!isVisible || currentPhaseVideos.length === 0) return;

        const currentVideo = currentPhaseVideos[currentVideoIndex];
        if (!currentVideo) return;

        const timer = setTimeout(() => {
            if (currentVideoIndex < currentPhaseVideos.length - 1) {
                setCurrentVideoIndex(prev => prev + 1);
            } else {
                setIsVisible(false);
                if (onComplete) {
                    onComplete();
                }
            }
        }, currentVideo.duration);

        return () => clearTimeout(timer);
    }, [currentVideoIndex, isVisible, currentPhaseVideos, onComplete]);

    const handleClose = () => {
        setIsVisible(false);
        if (onComplete) {
            onComplete();
        }
    };

    const currentVideo = currentPhaseVideos[currentVideoIndex];
    const videoSrc = currentVideo ? encodeURI(`/videos/Videos for Web/${currentVideo.filename}`) : '';

    return (
        <AnimatePresence>
            {isVisible && currentPhaseVideos.length > 0 && currentVideo && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="phase-video-demo"
                    style={{
                        position: 'fixed',
                        right: '508px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 9998,
                        width: '640px',
                        maxWidth: 'calc(100vw - 550px)',
                    }}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @media (max-width: 768px) {
                                .phase-video-demo {
                                    right: 16px !important;
                                    left: 16px !important;
                                    top: auto !important;
                                    bottom: 24px !important;
                                    transform: none !important;
                                    width: calc(100vw - 32px) !important;
                                    max-width: calc(100vw - 32px) !important;
                                    z-index: 10000 !important;
                                }
                            }
                        `
                    }} />
                    <div
                        style={{
                            backgroundColor: '#000',
                            borderRadius: '15px',
                            border: 'none',
                            boxShadow: 'none',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 20 }}>
                            <button
                                onClick={handleClose}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'white',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <video
                            ref={videoRef}
                            key={videoSrc}
                            src={videoSrc}
                            autoPlay
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                minHeight: '300px',
                                backgroundColor: '#000',
                                borderRadius: '15px'
                            }}
                        />

                        <div style={{
                            padding: '16px 24px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: 'none',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10
                        }}>
                            <span style={{ fontSize: '15px', fontWeight: '500', color: 'white', letterSpacing: '-0.01em' }}>
                                {phase === 'brainstorm' ? '8. Extract' : phase.charAt(0).toUpperCase() + phase.slice(1)} Phase Demo
                            </span>
                            {currentPhaseVideos.length > 1 && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {currentPhaseVideos.map((_, i) => (
                                        <div key={i} style={{
                                            width: '8px',
                                            height: '2px',
                                            borderRadius: '1px',
                                            background: i === currentVideoIndex ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PhaseVideoDemo;
