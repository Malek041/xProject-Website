import React, { useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

const StrictFilter = () => {
    const { t } = useLanguage();
    const [openSections, setOpenSections] = useState({ good: false, bad: false });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const goodFit = t({
        en: [
            "Already making money",
            "Have ≥3 team members",
            "Want to scale but feel stuck",
            "Suffer from owner-dependency"
        ],
        fr: [
            "Génère déjà des revenus",
            "Équipe de ≥3 membres",
            "Besoin de scaler mais bloqué",
            "Dépendance excessive au fondateur"
        ]
    });

    const badFit = t({
        en: [
            "Idea-stage founders",
            "Solo freelancers",
            "Looking for motivation, not structure"
        ],
        fr: [
            "Fondateurs au stade d'idée",
            "Freelances en solo",
            "Recherche de motivation, pas de structure"
        ]
    });

    const filterImage = "/images/uploaded_media_2_1769438041963.jpg";

    return (
        <section style={{ padding: '10rem 0', backgroundColor: 'transparent', color: 'var(--color-dark)' }}>
            <div className="container">
                <FadeIn>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '6rem',
                        alignItems: 'start'
                    }}>
                        {/* Left side: Editorial Headline */}
                        <div>
                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                lineHeight: '1.1',
                                marginBottom: '2rem',
                                letterSpacing: '-0.03em',
                                color: '#1d1d1f',
                                fontWeight: '600',
                            }}>
                                {t({ en: <>Strict Filter <span style={{ color: '#86868b' }}>enforced</span>.</>, fr: <>Filtre Strict <span style={{ color: '#86868b' }}>appliqué</span>.</> })}
                            </h2>
                            <p style={{ fontSize: '1.25rem', lineHeight: '1.6', color: '#86868b', maxWidth: '400px' }}>
                                {t({
                                    en: "We only work with founders ready to scale their autonomy.",
                                    fr: "Nous ne travaillons qu'avec des fondateurs prêts à scaler leur autonomie."
                                })}
                            </p>
                        </div>

                        {/* Right side: The Lists with Notion-style Toggles */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                            {/* Who we work with */}
                            <div style={{ borderBottom: '1px solid #f5f5f7', paddingBottom: '2rem' }}>
                                <div
                                    onClick={() => toggleSection('good')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        cursor: 'pointer',
                                        marginBottom: openSections.good ? '2rem' : '0',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <motion.div
                                        animate={{ rotate: openSections.good ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight size={20} color="#1d1d1f" />
                                    </motion.div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#1d1d1f' }}>
                                        {t({ en: "Who needs hiro", fr: "Qui a besoin de hiro" })}
                                    </h3>
                                </div>
                                <AnimatePresence>
                                    {openSections.good && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden', paddingLeft: '2.25rem' }}
                                        >
                                            {goodFit.map((item, i) => (
                                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', color: '#424245' }}>
                                                    <div style={{
                                                        backgroundColor: '#e8f5e9',
                                                        borderRadius: '50%',
                                                        padding: '4px',
                                                        display: 'flex',
                                                        color: '#2e7d32'
                                                    }}>
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    {item}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Who we don't work with */}
                            <div style={{ paddingBottom: '2rem' }}>
                                <div
                                    onClick={() => toggleSection('bad')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        cursor: 'pointer',
                                        marginBottom: openSections.bad ? '2rem' : '0',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <motion.div
                                        animate={{ rotate: openSections.bad ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight size={20} color="#86868b" />
                                    </motion.div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#86868b' }}>
                                        {t({ en: "Who Don't Need hiro", fr: "Qui n'a pas besoin de hiro" })}
                                    </h3>
                                </div>
                                <AnimatePresence>
                                    {openSections.bad && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden', paddingLeft: '2.25rem' }}
                                        >
                                            {badFit.map((item, i) => (
                                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', color: '#86868b' }}>
                                                    <div style={{
                                                        backgroundColor: '#f5f5f7',
                                                        borderRadius: '50%',
                                                        padding: '4px',
                                                        display: 'flex',
                                                        color: '#86868b'
                                                    }}>
                                                        <X size={12} strokeWidth={3} />
                                                    </div>
                                                    {item}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default StrictFilter;
