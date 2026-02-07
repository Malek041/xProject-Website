import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Star, Bookmark, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const AlephSection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 968);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const alephFeatures = [
        {
            title: t({ en: 'Structural Clarity', fr: 'Clarté Structurelle' }),
            quote: t({
                en: 'The platform breaks a business into clear responsibilities, processes, and SOPs.',
                fr: 'La plateforme décompose une entreprise en responsabilités, processus et SOP clairs.'
            }),
            icon: <Bookmark size={18} />
        },
        {
            title: t({ en: 'Chaos Removal', fr: 'Élimination du chaos' }),
            quote: t({
                en: 'By making work explicit and repeatable, hiro removes chaos and reduces dependency.',
                fr: 'En rendant le travail explicite et reproductible, hiro élimine le chaos et réduit la dépendance.'
            }),
            icon: <Zap size={18} />
        },
        {
            title: t({ en: 'Operational Consistency', fr: 'Cohérence opérationnelle' }),
            quote: t({
                en: 'Creates a system that runs predictably, ensuring quality and performance.',
                fr: 'Crée un système qui fonctionne de manière prévisible, garantissant la qualité et la performance.'
            }),
            icon: <ShieldCheck size={18} />
        },
        {
            title: t({ en: 'Forced Execution', fr: 'Exécution forcée' }),
            quote: t({
                en: 'Not consulting or advice. It is a system that forces clarity, discipline, and execution.',
                fr: 'Ni conseil ni recommandation. C\'est un système qui impose clarté, discipline et exécution.'
            }),
            icon: <Star size={18} />
        },
        {
            title: t({ en: 'Founder Freedom', fr: 'Liberté du fondateur' }),
            quote: t({
                en: 'The platform frees the founder to focus on growth and vision.',
                fr: 'La plateforme libère le fondateur pour qu\'il se concentre sur la croissance et la vision.'
            }),
            icon: <Zap size={18} />
        },
        {
            title: t({ en: 'Predictable Scale', fr: 'Croissance prévisible' }),
            quote: t({
                en: 'A business that works on its own and scales faster.',
                fr: 'Une entreprise qui fonctionne d\'elle-même et se développe plus rapidement.'
            }),
            icon: <ArrowRight size={18} />
        }
    ];

    const systemStats = [
        { icon: <Star size={14} />, text: t({ en: "100% Founder-Independent", fr: "100 % indépendant du fondateur" }) },
        { icon: <Bookmark size={14} />, text: t({ en: "System-Driven", fr: "Piloté par les systèmes" }) },
        { icon: <ShieldCheck size={14} />, text: t({ en: "Chaos-Free", fr: "Sans chaos" }) },
        { icon: <Zap size={14} />, text: t({ en: "Scale-Ready", fr: "Prêt pour la croissance" }) }
    ];

    const detailedFeatures = [
        {
            id: 'define',
            title: t({ en: 'An AI IDE Core', fr: 'Un Cœur d\'IDE IA' }),
            description: t({
                en: "hiro's Editor view offers tab autocompletion, natural language code commands, and a configurable, context-aware agent that understands your entire workspace.",
                fr: "La vue Éditeur de hiro propose l'autocomplétion, des commandes en langage naturel et un agent contextuel qui comprend tout votre espace de travail."
            }),
            video: '/videos/Videos for Web/It moves your through a process for web.mov'
        }
    ];

    return (
        <section style={{
            padding: isMobile ? '3rem 1.5rem' : '5rem 0 2.5rem',
            backgroundColor: 'var(--color-bg-base)',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
        }}>
            <div className="container" style={{
                maxWidth: '1350px',
                margin: '0 auto',
                padding: isMobile ? '0 1rem' : '0 2rem'
            }}>
                {/* Introducing Aleph1 Section */}
                <div style={{ marginBottom: isMobile ? '6rem' : '5rem' }}>
                    <h2 style={{
                        fontSize: isMobile ? '2.5rem' : '5.5rem',
                        fontWeight: 700,
                        lineHeight: '1.1',
                        marginBottom: isMobile ? '2.5rem' : '3.5rem',
                        letterSpacing: '-0.04em',
                        color: 'var(--color-text-main)',
                        maxWidth: '900px'
                    }}>
                        hiro Aleph1.
                    </h2>

                    {/* Featured Model Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            backgroundColor: 'var(--color-bg-sidebar)',
                            borderRadius: '16px',
                            border: 'var(--border-notion)',
                            boxShadow: 'var(--shadow-notion)',
                            padding: isMobile ? '1.25rem' : '3.5rem',
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? '2.5rem' : '4rem',
                            marginBottom: '2rem'
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                marginBottom: isMobile ? '1.5rem' : '2rem',
                                color: 'var(--color-text-main)',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                fontSize: '0.8rem'
                            }}>
                                <Zap size={16} />
                                {t({ en: "INTRODUCING ALEPH1", fr: "PRÉSENTATION D'ALEPH1" })}
                            </div>
                            <h3 style={{
                                fontSize: isMobile ? '1.5rem' : '2.2rem',
                                fontWeight: 600,
                                lineHeight: '1.2',
                                color: 'var(--color-text-main)',
                                letterSpacing: '-0.02em',
                                marginBottom: '2rem'
                            }}>
                                {t({
                                    en: "“It guides founders to turn a founder-dependent business into a system that runs predictably without constant involvement.”",
                                    fr: "« Il guide les fondateurs pour transformer une entreprise dépendante de son créateur en un système qui fonctionne de manière prévisible sans implication constante. »"
                                })}
                            </h3>
                            <div
                                onClick={() => navigate('/signup')}
                                style={{
                                    color: 'var(--color-text-accent-blue)',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem'
                                }}
                            >
                                {t({ en: "Explore the model", fr: "Explorer le modèle" })} <ArrowRight size={16} />
                            </div>
                        </div>

                    </motion.div>

                    {/* Features Model Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: '1.5rem'
                    }}>
                        {alephFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    padding: '2rem',
                                    backgroundColor: 'var(--color-bg-sidebar)',
                                    borderRadius: '16px',
                                    border: 'var(--border-notion)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    minHeight: '220px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate('/signup')}
                            >
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <div style={{
                                        color: 'var(--color-text-main)',
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        letterSpacing: '-0.02em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--color-hover-overlay)',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {feature.icon}
                                        </div>
                                        {feature.title}
                                    </div>
                                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: '1.5', fontWeight: 500 }}>
                                        {feature.quote}
                                    </div>
                                </div>
                                <div style={{ color: 'var(--color-notion-blue)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {t({ en: "Learn more", fr: "En savoir plus" })} <span style={{ marginLeft: '0.2rem' }}>→</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Model Ribbon */}
                    <div style={{
                        marginTop: '4rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: isMobile ? '1.5rem 2rem' : '4rem',
                        padding: '1rem 0',
                        opacity: 1,
                        borderTop: 'var(--border-notion)',
                        paddingTop: '3rem'
                    }}>
                        {systemStats.map((stat, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                color: 'var(--color-text-muted)',
                                fontSize: '0.85rem',
                                fontWeight: 500
                            }}>
                                {stat.icon}
                                <span>{stat.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AlephSection;
