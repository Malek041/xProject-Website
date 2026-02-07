import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import DonationModal from './DonationModal';

const DonationSection = () => {
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    const [isModalOpen, setIsModalOpen] = useState(false);

    React.useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <section style={{
            padding: isMobile ? '4rem 1.5rem' : '10rem 2rem',
            backgroundColor: 'var(--color-bg-base)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
            borderTop: 'var(--border-notion)',
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        fontSize: isMobile ? '24px' : '48px',
                        lineHeight: '1.3',
                        fontWeight: '400',
                        color: 'var(--color-text-main)',
                        marginBottom: isMobile ? '30px' : '40px',
                        fontFamily: 'serif',
                        letterSpacing: '-0.02em',
                        maxWidth: '900px'
                    }}
                >
                    {t({
                        en: "“hiro Aleph is our first step—100% free and built in Morocco. To develop the next generation of advanced models that will turn local startups into global leaders, we need your support.”",
                        fr: "« hiro Aleph est notre première étape — 100 % gratuit et conçu au Maroc. Pour développer la prochaine génération de modèles avancés qui transformeront les startups locales en leaders mondiaux, nous avons besoin de votre soutien. »"
                    })}
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: isMobile ? '24px' : '32px'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                            fontSize: isMobile ? '24px' : '32px',
                            fontWeight: '500',
                            color: 'var(--color-text-main)',
                            letterSpacing: '-0.04em',
                        }}>
                            hiro Research
                        </div>

                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            padding: isMobile ? '1rem 2rem' : '1.2rem 3rem',
                            backgroundColor: 'var(--color-text-main)',
                            color: 'var(--color-bg-base)',
                            borderRadius: '10px',
                            border: 'none',
                            fontSize: isMobile ? '1rem' : '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            width: isMobile ? '100%' : 'auto'
                        }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {t({ en: "Support the Mission", fr: "Soutenir la mission" })}
                    </motion.button>

                    <div style={{
                        marginTop: '16px',
                        fontSize: isMobile ? '12px' : '13px',
                        color: 'var(--color-text-muted)',
                        fontWeight: '500',
                        maxWidth: isMobile ? '250px' : 'none',
                        margin: '0 auto'
                    }}>
                        {t({
                            en: "100% of contributions fund team building & R&D for hiro.",
                            fr: "100 % des contributions financent l'équipe et la R&D pour hiro."
                        })}
                    </div>
                </motion.div>
            </div>
            <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
};

export default DonationSection;
