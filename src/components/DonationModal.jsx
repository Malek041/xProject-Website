import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Copy, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DonationModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('350810000000000880844466');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    id="donation-modal-overlay"
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
                        zIndex: 10000,
                        padding: '20px',
                        backdropFilter: 'blur(8px)'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#161616',
                            borderRadius: '32px',
                            padding: '40px',
                            width: '100%',
                            maxWidth: '440px',
                            position: 'relative',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}
                    >
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
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#ff4b4b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 16px rgba(255, 75, 75, 0.3)'
                            }}>
                                <Heart size={32} color="#fff" fill="#fff" />
                            </div>
                            <h2 style={{
                                color: '#fff',
                                fontSize: '26px',
                                fontWeight: '700',
                                margin: 0,
                                lineHeight: '1.2'
                            }}>
                                {t({ en: 'Thanks for Donating!', fr: 'Merci de votre don !' })}
                            </h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    {t({ en: 'BANK', fr: 'BANQUE' })}
                                </label>
                                <div style={{ fontSize: '22px', fontWeight: '600', color: '#fff' }}>
                                    Al Barid Bank
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    {t({ en: 'NAME', fr: 'NOM' })}
                                </label>
                                <div style={{ fontSize: '22px', fontWeight: '600', color: '#fff' }}>
                                    Abdelmalek Tahri
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em'
                                }}>
                                    {t({ en: 'RIB', fr: 'RIB' })}
                                </label>
                                <div
                                    onClick={handleCopy}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: '1.5px dashed rgba(255,255,255,0.15)',
                                        borderRadius: '20px',
                                        padding: '20px 24px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                    }}
                                >
                                    <span style={{
                                        fontSize: '22px',
                                        fontWeight: '700',
                                        color: '#fff',
                                        letterSpacing: '1px'
                                    }}>
                                        350810...4466
                                    </span>
                                    {copied ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '700' }}>{t({ en: 'COPIED', fr: 'COPIÉ' })}</span>
                                            <Check size={20} />
                                        </div>
                                    ) : (
                                        <Copy size={20} color="#666" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DonationModal;
