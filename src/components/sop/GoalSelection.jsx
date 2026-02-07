import React from 'react';
import { motion } from 'framer-motion';
import { Network, Layers, Target, ArrowRight, Lock, Trash2, Clock, X, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import { useTheme } from '../../context/ThemeContext';

const GoalSelection = ({ onSelect, projects = [], onSelectProject, onRemoveProject }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Notion Design Tokens
    const COLOR_BG = isDark ? '#191919' : '#FFFFFF';
    const COLOR_TEXT = isDark ? '#D4D4D4' : '#37352F';
    const COLOR_TEXT_LIGHT = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(55, 53, 47, 0.65)';
    const COLOR_BORDER = isDark ? 'rgba(255, 255, 255, 0.13)' : 'rgba(55, 53, 47, 0.09)';
    const COLOR_HOVER = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(55, 53, 47, 0.08)';
    const COLOR_BLUE = '#2383E2';
    const CARD_BG = isDark ? '#262626' : '#FFFFFF';
    const CARD_HOVER = isDark ? '#333333' : '#F7F7F5';

    const goals = [
        {
            id: 1,
            title: t({
                en: "Total Organizational Architecture",
                fr: "Architecture organisationnelle totale"
            }),
            description: t({
                en: "Map out the core systems that transform inputs into revenue across your entire business.",
                fr: "Cartographiez les systèmes clés qui transforment les intrants en revenus dans toute votre entreprise."
            }),
            icon: <Network size={20} />,
            enabled: true,
            tag: t({ en: "Recommended", fr: "Recommandé" })
        },
        {
            id: 2,
            title: t({
                en: "Departmental Deep-Dive",
                fr: "Analyse par département"
            }),
            description: t({
                en: "Focus on a specific area like Marketing, Fulfillment, or Sales to optimize local performance.",
                fr: "Concentrez-vous sur un domaine précis comme le marketing, l'exécution ou les ventes pour optimiser la performance locale."
            }),
            icon: <Layers size={20} />,
            enabled: false,
            tag: t({ en: "Coming Soon", fr: "Bientôt" })
        },
        {
            id: 3,
            title: t({
                en: "Specific Problem Solver",
                fr: "Résolution d'un problème précis"
            }),
            description: t({
                en: "Target a single bottleneck or failure point in your current workflow and fix it fast.",
                fr: "Ciblez un seul goulot d'étranglement ou point de défaillance dans votre flux de travail actuel et corrigez-le rapidement."
            }),
            icon: <Target size={20} />,
            enabled: false,
            tag: t({ en: "Coming Soon", fr: "Bientôt" })
        },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: '100dvh',
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: COLOR_BG,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 6000,
            overflowY: 'auto',
            padding: '80px 20px',
            boxSizing: 'border-box'
        }}>
            <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                {/* Avatar Stack - Notion Style Decoration */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    position: 'relative',
                    width: '100%',
                    gap: '0'
                }}>
                    {/* Back Face Left (Video) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: isDark ? '3px solid #222' : '3px solid #fff',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            marginRight: '-20px',
                            zIndex: 1,
                            backgroundColor: '#000'
                        }}
                    >
                        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src="/videos/kling_20260207_Image_to_Video_It_moves_f_3954_0.mp4" type="video/mp4" />
                        </video>
                    </motion.div>

                    {/* Front Center Face (Main Video) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                        style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: isDark ? '4px solid #222' : '4px solid #fff',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                            zIndex: 3,
                            position: 'relative',
                            backgroundColor: '#000'
                        }}
                    >
                        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src="/videos/Animated avatars/kling_20260207_Image_to_Video_It_moves_f_4075_0.mp4" type="video/mp4" />
                        </video>
                    </motion.div>

                    {/* Back Face Right (Image) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: isDark ? '3px solid #222' : '3px solid #fff',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            marginLeft: '-20px',
                            zIndex: 1,
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src="/videos/Videos for Web/kling_20260207_Image_to_Video_Wise__focu_4216_0.mp4" type="video/mp4" />
                        </video>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '40px', width: '100%', textAlign: 'center' }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '24px',
                        color: COLOR_TEXT_LIGHT,
                        fontSize: '14px',
                        fontWeight: '500'
                    }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F7F7F5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${COLOR_BORDER}`,
                            fontSize: '12px'
                        }}>
                            H
                        </div>
                        <span>hiro / Start</span>
                    </div>

                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        letterSpacing: '-0.02em',
                        marginBottom: '16px',
                        color: COLOR_TEXT,
                        lineHeight: '1.1'
                    }}>
                        {t({ en: <>Where to become a<br />systems-run Startup.</>, fr: <>Devenez une<br />Startup gérée par des systèmes.</> })}
                    </h1>
                    <p style={{ fontSize: '18px', color: COLOR_TEXT_LIGHT, maxWidth: '600px', lineHeight: '1.5', margin: '0 auto' }}>
                        {t({ en: "Choose the scope of your project to get started.", fr: "Choisissez la portée de votre projet pour commencer." })}
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '16px',
                    width: '100%'
                }}>
                    {goals.map((goal, index) => (
                        <motion.button
                            key={goal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            disabled={!goal.enabled}
                            onClick={() => goal.enabled && onSelect(goal.id)}
                            style={{
                                padding: '20px',
                                borderRadius: '4px', // Notion uses smaller radii
                                border: `1px solid ${COLOR_BORDER}`,
                                backgroundColor: CARD_BG,
                                color: COLOR_TEXT,
                                textAlign: 'left',
                                cursor: goal.enabled ? 'pointer' : 'not-allowed',
                                transition: 'background-color 0.1s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                height: '220px', // Uniform height
                                position: 'relative',
                                boxShadow: goal.enabled ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                opacity: goal.enabled ? 1 : 0.6
                            }}
                            onMouseOver={(e) => {
                                if (goal.enabled) {
                                    e.currentTarget.style.backgroundColor = CARD_HOVER; // Notion hover
                                }
                            }}
                            onMouseOut={(e) => {
                                if (goal.enabled) {
                                    e.currentTarget.style.backgroundColor = CARD_BG;
                                }
                            }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '4px',
                                backgroundColor: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: COLOR_TEXT
                            }}>
                                {goal.icon}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                                        {goal.title}
                                    </h3>
                                    {goal.tag && goal.enabled && (
                                        <span style={{
                                            fontSize: '11px',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(35, 131, 226, 0.1)',
                                            color: COLOR_BLUE,
                                            fontWeight: '500'
                                        }}>
                                            {goal.tag}
                                        </span>
                                    )}
                                </div>
                                <p style={{ fontSize: '14px', color: COLOR_TEXT_LIGHT, margin: 0, lineHeight: '1.5' }}>
                                    {goal.description}
                                </p>
                            </div>

                            <div style={{ paddingTop: '12px', borderTop: `1px solid ${COLOR_BORDER}`, width: '100%', display: 'flex', justifyContent: 'flex-end', opacity: 0.4 }}>
                                {goal.enabled ? <ArrowRight size={16} /> : <Lock size={14} />}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Continue Working Section */}
                {projects.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ marginTop: '50px', width: '100%', borderTop: `1px solid ${COLOR_BORDER}`, paddingTop: '32px' }}
                    >
                        <div style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: COLOR_TEXT_LIGHT,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Clock size={14} /> {t({ en: 'Continue Project', fr: 'Reprendre un projet' })}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                            {projects.map((p) => (
                                <div
                                    key={p.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        backgroundColor: CARD_BG,
                                        border: `1px solid ${COLOR_BORDER}`,
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.1s ease',
                                    }}
                                    onClick={() => onSelectProject?.(p.id)}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = CARD_HOVER}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = CARD_BG}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                                        <div style={{ fontSize: '16px' }}>📄</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '500', color: COLOR_TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                                            <span style={{ fontSize: '12px', color: COLOR_TEXT_LIGHT }}>
                                                {p.data?.phase ? `${t({ en: 'Phase', fr: 'Phase' })}: ${p.data.phase}` : t({ en: 'Just started', fr: 'À peine commencé' })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(t({ en: 'Delete this project?', fr: 'Supprimer ce projet ?' }))) {
                                                onRemoveProject?.(p.id);
                                            }
                                        }}
                                        style={{
                                            padding: '6px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            color: COLOR_TEXT_LIGHT,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.color = '#EB5757';
                                            e.currentTarget.style.backgroundColor = 'rgba(235, 87, 87, 0.1)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.color = COLOR_TEXT_LIGHT;
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GoalSelection;
