import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

const FeedbackModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);

        const feedbackData = {
            rating,
            feedback,
            userId: currentUser?.uid || 'anonymous',
            userEmail: currentUser?.email || 'anonymous',
            createdAt: new Date().toISOString(),
            timestamp: Date.now()
        };

        try {
            // Save to Firebase
            await addDoc(collection(db, 'feedback'), feedbackData);
            console.log('Feedback saved to Firebase:', feedbackData);

            setSubmitted(true);
            setTimeout(() => {
                onClose();
                // Reset for next time
                setSubmitted(false);
                setRating(0);
                setFeedback('');
                setIsSubmitting(false);
            }, 2000);
        } catch (error) {
            console.error('Error saving feedback:', error);
            alert('Failed to submit feedback. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001,
                        padding: '20px',
                        backdropFilter: 'blur(12px)'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#111',
                            borderRadius: '32px',
                            padding: '40px',
                            width: '100%',
                            maxWidth: '460px',
                            position: 'relative',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center'
                        }}
                    >
                        {!submitted ? (
                            <>
                                <button
                                    onClick={onClose}
                                    style={{
                                        position: 'absolute',
                                        top: '24px',
                                        right: '24px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        cursor: 'pointer',
                                        color: '#999',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <X size={20} />
                                </button>

                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    margin: '0 auto 24px auto',
                                    border: '2px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                                }}>
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    >
                                        <source src="/videos/avatar-left.mp4" type="video/mp4" />
                                    </video>
                                </div>

                                <h2 style={{
                                    color: '#fff',
                                    fontSize: '28px',
                                    fontWeight: '800',
                                    marginBottom: '12px',
                                    letterSpacing: '-0.02em'
                                }}>
                                    How's hiro Aleph?
                                </h2>
                                <p style={{
                                    color: '#888',
                                    fontSize: '16px',
                                    marginBottom: '32px',
                                    lineHeight: '1.5'
                                }}>
                                    Help us build the future of business systems. Your feedback means everything.
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            onClick={() => setRating(star)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                transition: 'transform 0.1s ease'
                                            }}
                                        >
                                            <Star
                                                size={36}
                                                fill={(hover || rating) >= star ? "#FFC107" : "transparent"}
                                                color={(hover || rating) >= star ? "#FFC107" : "#333"}
                                                style={{ transition: 'all 0.2s ease' }}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Tell us what you think..."
                                    style={{
                                        width: '100%',
                                        minHeight: '120px',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        padding: '16px',
                                        color: '#fff',
                                        fontSize: '15px',
                                        fontFamily: 'inherit',
                                        resize: 'none',
                                        outline: 'none',
                                        marginBottom: '24px',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
                                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />

                                <button
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || isSubmitting}
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        backgroundColor: (rating > 0 && !isSubmitting) ? '#fff' : '#222',
                                        color: (rating > 0 && !isSubmitting) ? '#000' : '#666',
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        border: 'none',
                                        cursor: (rating > 0 && !isSubmitting) ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s ease',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'} <Send size={18} />
                                </button>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ padding: '20px 0' }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '50%',
                                    backgroundColor: '#22C55E',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 24px auto'
                                }}>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                    >
                                        <X size={32} color="#fff" style={{ transform: 'rotate(45deg)' }} />
                                    </motion.div>
                                </div>
                                <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
                                    Thank you!
                                </h3>
                                <p style={{ color: '#888', fontSize: '16px' }}>
                                    We received your feedback.
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackModal;
