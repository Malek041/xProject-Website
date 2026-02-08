import React from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    Users,
    Brain,
    LayoutGrid,
    Zap,
    Activity
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const PhaseProgress = ({ currentPhase, onPhaseClick, isSidebarOpen, systemTrack = 'revenue', onSystemTrackChange }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Notion Design Tokens
    const COLOR_TEXT = isDark ? '#FFFFFF' : '#37352F';
    const COLOR_GRAY = isDark ? '#888888' : '#9B9A97';
    const COLOR_BG_ACTIVE = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(55, 53, 47, 0.08)';
    const COLOR_BG_WHITE = isDark ? '#262626' : '#FFFFFF'; // Input/Card bg
    const COLOR_BORDER = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(55, 53, 47, 0.09)';
    const COLOR_BG_TRACK = isDark ? '#191919' : '#F1F1F0'; // Track selector bg
    const COLOR_CIRCLE_ACTIVE = isDark ? '#FFFFFF' : '#000';
    const COLOR_CIRCLE_INACTIVE = isDark ? '#444' : '#E9E9E8';
    const COLOR_CIRCLE_TEXT_ACTIVE = isDark ? '#000' : '#FFF';

    // Explicit white for active circle text in dark mode if background is white?
    // In light mode: BG #000, Text #FFF.
    // In dark mode: BG #FFF, Text #000.

    const systems = [
        { id: 'revenue', label: t({ en: 'Revenue', fr: 'Revenus' }) },
        { id: 'growth', label: t({ en: 'Growth', fr: 'Croissance' }) },
    ];

    const phases = [
        { id: 'define', label: t({ en: 'Define', fr: 'Définir' }), icon: <Target size={16} /> },
        { id: 'assign', label: t({ en: 'Assign', fr: 'Assigner' }), icon: <Users size={16} /> },
        { id: 'extract', label: t({ en: 'Extract', fr: 'Extraire' }), icon: <Brain size={16} /> },
        { id: 'organize', label: t({ en: 'Organize', fr: 'Organiser' }), icon: <LayoutGrid size={16} /> },
        { id: 'integrate', label: t({ en: 'Integrate', fr: 'Intégrer' }), icon: <Zap size={16} /> },
        { id: 'optimize', label: t({ en: 'Optimize', fr: 'Optimiser' }), icon: <Activity size={16} /> },
    ];

    const getActivePhaseId = (phase) => {
        if (phase === 'brainstorm' || phase === 'diy_extraction' || phase === 'brainstorming') return 'extract';
        return phase;
    };

    const activePhaseId = getActivePhaseId(currentPhase);
    const activeIndex = phases.findIndex(p => p.id === activePhaseId);

    // Circular icon styles
    const getCircleStyle = (isActive, isExecuted) => ({
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: isActive ? COLOR_CIRCLE_ACTIVE : COLOR_BG_WHITE,
        border: isActive ? 'none' : `1.5px solid ${isExecuted ? COLOR_CIRCLE_ACTIVE : COLOR_CIRCLE_INACTIVE}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isActive ? COLOR_CIRCLE_TEXT_ACTIVE : (isExecuted ? COLOR_TEXT : COLOR_GRAY),
        cursor: isExecuted ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        zIndex: 1, // ensure above line
        flexShrink: 0
    });

    if (!isSidebarOpen) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 0',
                width: '100%'
            }}>
                {phases.map((p, index) => {
                    const isActive = p.id === activePhaseId;
                    const isExecuted = index <= activeIndex;
                    return (
                        <div
                            key={p.id}
                            onClick={() => isExecuted && onPhaseClick?.(p.id)}
                            style={getCircleStyle(isActive, isExecuted)}
                            title={p.label}
                        >
                            {React.cloneElement(p.icon, { size: 16, strokeWidth: isActive ? 3 : 2 })}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div style={{
            padding: '16px 12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '100%'
        }}>
            {/* Systems Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                    padding: '0 4px',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: COLOR_GRAY,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                }}>
                    {t({ en: 'Systems For', fr: 'Systèmes Pour' })}
                </div>
                <div style={{
                    display: 'flex',
                    backgroundColor: COLOR_BG_TRACK,
                    padding: '2px',
                    borderRadius: '8px',
                    gap: '2px'
                }}>
                    {systems.map((sys) => {
                        const isActive = sys.id === systemTrack;
                        const isGrowth = sys.id === 'growth';
                        return (
                            <button
                                key={sys.id}
                                onClick={() => onSystemTrackChange?.(sys.id)}
                                style={{
                                    flex: 1,
                                    padding: '6px 2px',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    borderRadius: '6px',
                                    border: 'none',
                                    textTransform: 'uppercase',
                                    backgroundColor: isActive ? COLOR_BG_WHITE : 'transparent',
                                    color: isActive ? COLOR_TEXT : COLOR_GRAY,
                                    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    cursor: onSystemTrackChange ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {sys.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Vertical Stepper Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    color: COLOR_GRAY,
                    paddingLeft: '4px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                }}>
                    {t({ en: 'Process', fr: 'Processus' })}
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    paddingLeft: '6px'
                }}>
                    {phases.map((p, index) => {
                        const isActive = p.id === activePhaseId;
                        const isExecuted = index <= activeIndex;
                        const isLast = index === phases.length - 1;

                        return (
                            <div
                                key={p.id}
                                onClick={() => isExecuted && onPhaseClick?.(p.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '4px 0',
                                    cursor: isExecuted ? 'pointer' : 'default',
                                    position: 'relative',
                                    minHeight: '42px'
                                }}
                            >
                                {/* Connecting Line */}
                                {!isLast && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '32px',
                                        width: '2px',
                                        height: '24px',
                                        backgroundColor: index < activeIndex ? COLOR_CIRCLE_ACTIVE : COLOR_CIRCLE_INACTIVE,
                                        zIndex: 0
                                    }} />
                                )}

                                {/* Circular Icon Container */}
                                <div style={getCircleStyle(isActive, isExecuted)}>
                                    {React.cloneElement(p.icon, { size: 16, strokeWidth: isActive ? 3 : 2 })}
                                </div>

                                {/* Phase Label */}
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: isActive ? '700' : '600',
                                    color: isExecuted ? COLOR_TEXT : COLOR_GRAY,
                                    transition: 'all 0.2s ease'
                                }}>
                                    {p.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PhaseProgress;
