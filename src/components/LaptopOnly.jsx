import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LaptopOnly = ({ children }) => {
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 1024); // Tablet and below
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!isMobile) return children;

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg-base)',
            padding: '2rem',
            textAlign: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}
            >
                <div style={{ position: 'relative' }}>
                    <Monitor size={80} color="var(--color-notion-blue)" strokeWidth={1.5} />
                    <motion.div
                        animate={{
                            opacity: [1, 0.4, 1],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            bottom: -5,
                            right: -5,
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            padding: '4px'
                        }}
                    >
                        <Smartphone size={32} color="var(--color-text-muted)" strokeWidth={1.5} />
                    </motion.div>
                </div>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--color-text-main)',
                    letterSpacing: '-0.02em'
                }}>
                    {t({
                        en: "Only Available for Laptop/Desktop",
                        fr: "Uniquement disponible sur ordinateur"
                    })}
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: '1.6',
                    fontWeight: 500
                }}>
                    {t({
                        en: "The SOPBuilder requires a larger screen for the best experience. Please switch to a desktop or laptop to build your systems.",
                        fr: "Le SOPBuilder nécessite un écran plus grand pour une expérience optimale. Veuillez passer sur un ordinateur pour construire vos systèmes."
                    })}
                </p>

                <button
                    onClick={() => window.location.href = '/'}
                    style={{
                        padding: '0.8rem 1.5rem',
                        backgroundColor: 'var(--color-notion-blue)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}
                >
                    {t({ en: "Return Home", fr: "Retourner à l'accueil" })}
                </button>
            </motion.div>
        </div>
    );
};

export default LaptopOnly;
