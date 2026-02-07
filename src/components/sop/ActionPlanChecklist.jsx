import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, User, Camera, Mic, Video, Lightbulb, Users, Layout, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import { useTheme } from '../../context/ThemeContext';

const getMethodLabel = (method, t) => {
    const labels = {
        'Screen Recording': t({ en: 'Screen Recording', fr: "Enregistrement d'écran" }),
        'Camera/GoPro': t({ en: 'Camera/GoPro', fr: 'Caméra/GoPro' }),
        'Audio Notes': t({ en: 'Audio Notes', fr: 'Notes audio' }),
        'Role-play': t({ en: 'Role-play', fr: 'Jeu de rôle' }),
        'Other': t({ en: 'Other', fr: 'Autre' })
    };
    return labels[method] || method;
};

const ActionPlanChecklist = ({ department, systems, onStartOrganize }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const colors = {
        bg: isDark ? '#191919' : '#ffffff',
        text: isDark ? '#D4D4D4' : '#333',
        textStrong: isDark ? '#fff' : '#111',
        textSecondary: isDark ? '#9B9A97' : '#999',
        border: isDark ? 'rgba(255, 255, 255, 0.1)' : '#eef2f6',
        itemBg: isDark ? '#262626' : '#fafafa',
        itemBgChecked: isDark ? '#1F1F1F' : '#fff',
        check: isDark ? '#fff' : '#000',
        checkInactive: isDark ? '#444' : '#ddd',
        shadow: isDark ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(0,0,0,0.04)'
    };
    const [openTips, setOpenTips] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});

    // Filter systems for this department
    const deptSystems = systems || [];
    if (deptSystems.length === 0) return null;

    // Total tasks = Step 1 + Step 2 + (Number of Systems) + Step 4
    const totalTasksList = [
        'step1',
        'step2',
        ...deptSystems.map((_, idx) => `sys_${idx}`),
        'step4'
    ];

    const totalCount = totalTasksList.length;
    const checkedCount = totalTasksList.filter(id => checkedItems[id]).length;
    const progress = Math.round((checkedCount / totalCount) * 100);

    const toggleCheck = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const containerStyle = {
        padding: '32px',
        background: colors.bg,
        borderRadius: '32px',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
    };

    const sectionStyle = {
        marginBottom: '24px'
    };

    const itemStyle = {
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        alignItems: 'flex-start',
        cursor: 'pointer'
    };

    const checkStyle = (checked) => ({
        marginTop: '2px',
        color: checked ? colors.check : colors.checkInactive,
        minWidth: '22px',
        transition: 'all 0.2s'
    });

    const textStyle = {
        fontSize: '15px',
        color: colors.text,
        lineHeight: '1.6'
    };

    const boldStyle = {
        fontWeight: '700',
        color: colors.textStrong,
        fontSize: '16px',
        marginBottom: '4px'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={containerStyle}
        >
            {/* Header matching IntegrateActionPlan style */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.08em', color: colors.textSecondary }}>
                        {t({ en: 'DEPARTMENT', fr: 'DÉPARTEMENT' })}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: colors.textStrong }}>{department}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: colors.textSecondary, fontWeight: '700' }}>{t({ en: 'PROGRESS', fr: 'PROGRÈS' })}</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: colors.textStrong }}>{progress}%</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '6px', backgroundColor: isDark ? '#333' : '#f3f4f6', borderRadius: '999px', overflow: 'hidden', marginBottom: '24px' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    style={{ height: '100%', backgroundColor: isDark ? '#fff' : '#111' }}
                />
            </div>

            {/* Steps Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                <style>
                    {`
                        .steps-container::-webkit-scrollbar { width: 4px; }
                        .steps-container::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
                    `}
                </style>
                <div className="steps-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={sectionStyle} onClick={() => toggleCheck('step1')}>
                        <div style={itemStyle}>
                            {checkedItems.step1 ? (
                                <CheckCircle2 size={24} style={checkStyle(true)} fill={isDark ? '#fff' : '#000'} color={isDark ? '#000' : '#fff'} />
                            ) : (
                                <Circle size={24} style={checkStyle(false)} />
                            )}
                            <div style={textStyle}>
                                <div style={boldStyle}>{t({ en: 'Step 1: Assign the Systems Champion', fr: 'Étape 1 : Assigner le champion des systèmes' })}</div>
                                <div>{t({ en: 'Identify who in', fr: 'Identifiez qui dans' })} <strong>{department}</strong> {t({ en: 'will document these systems.', fr: 'documentera ces systèmes.' })}</div>
                            </div>
                        </div>
                    </div>

                    <div style={sectionStyle} onClick={() => toggleCheck('step2')}>
                        <div style={itemStyle}>
                            {checkedItems.step2 ? (
                                <CheckCircle2 size={24} style={checkStyle(true)} fill={isDark ? '#fff' : '#000'} color={isDark ? '#000' : '#fff'} />
                            ) : (
                                <Circle size={24} style={checkStyle(false)} />
                            )}
                            <div style={textStyle}>
                                <div style={boldStyle}>{t({ en: 'Step 2: Brief Knowledgeable Worker', fr: "Étape 2 : Brief du collaborateur expert" })}</div>
                                <div>{t({ en: 'Inform worker:', fr: 'Informez le collaborateur :' })} "{t({ en: 'Your role is the expertise; Champion handles the capture.', fr: "Votre rôle est l'expertise ; le champion gère la capture." })}"</div>
                            </div>
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <div style={itemStyle}>
                            <div style={{ paddingTop: '4px' }}>
                                <Camera size={24} color={colors.textStrong} />
                            </div>
                            <div style={textStyle}>
                                <div style={boldStyle}>{t({ en: 'Step 3: Capture the following Sub-Activities', fr: 'Étape 3 : Capturer les sous-activités suivantes' })}</div>
                                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {deptSystems.map((s, idx) => {
                                        const id = `sys_${idx}`;
                                        const isChecked = checkedItems[id];
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => toggleCheck(id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '16px 24px',
                                                    backgroundColor: isChecked ? colors.itemBgChecked : colors.itemBg,
                                                    border: isChecked ? `1px solid ${colors.check}` : `1px solid ${colors.border}`,
                                                    borderRadius: '20px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    opacity: isChecked ? 1 : 0.8
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    {isChecked ? (
                                                        <CheckCircle2 size={20} fill={isDark ? '#fff' : '#000'} color={isDark ? '#000' : '#fff'} />
                                                    ) : (
                                                        <Circle size={20} color={colors.checkInactive} />
                                                    )}
                                                    <div style={{ fontWeight: '700', color: colors.textStrong, fontSize: '15px' }}>{s.subActivity}</div>
                                                </div>
                                                <Badge icon={getMethodIcon(s.method)} text={getMethodLabel(s.method, t)} isDark={isDark} colors={colors} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={sectionStyle} onClick={() => toggleCheck('step4')}>
                        <div style={itemStyle}>
                            {checkedItems.step4 ? (
                                <CheckCircle2 size={24} style={checkStyle(true)} fill={isDark ? '#fff' : '#000'} color={isDark ? '#000' : '#fff'} />
                            ) : (
                                <Circle size={24} style={checkStyle(false)} />
                            )}
                            <div style={textStyle}>
                                <div style={boldStyle}>{t({ en: 'Step 4: Review & Finalize', fr: 'Étape 4 : Réviser et finaliser' })}</div>
                                <div>{t({ en: 'Review captured data for accuracy and save to SystemHUB.', fr: 'Vérifiez la précision des données capturées et enregistrez-les dans SystemHUB.' })}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organize Button - Only show if 100% */}
            <AnimatePresence>
                {progress === 100 && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={onStartOrganize}
                        style={{
                            marginTop: '20px',
                            backgroundColor: isDark ? '#fff' : '#000',
                            color: isDark ? '#000' : '#fff',
                            border: 'none',
                            padding: '20px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '800',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            width: '100%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Layout size={20} />
                        {t({ en: 'Transfer systems to Organize Phase', fr: 'Transférer les systèmes vers la phase Organiser' })}
                        <ArrowRight size={20} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Tips Section */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
                <button
                    onClick={() => setOpenTips(!openTips)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#999'
                    }}
                >
                    {openTips ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <Lightbulb size={16} color="#fbbf24" fill="#fbbf24" />
                    {t({ en: 'Extraction Speed Tips', fr: "Conseils pour accélérer l'extraction" })}
                </button>

                <AnimatePresence>
                    {openTips && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ paddingTop: '16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Tip text={t({ en: 'Focus on the Goal first. Steps are secondary.', fr: "Concentrez-vous d'abord sur l'objectif. Les étapes viennent ensuite." })} />
                                <Tip text={t({ en: 'Recording a quick audio note is better than no documentation.', fr: "Enregistrer une courte note audio vaut mieux qu'aucune documentation." })} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const getMethodIcon = (method) => {
    switch (method) {
        case 'Screen Recording': return '🖥️';
        case 'Camera/GoPro': return '📷';
        case 'Audio Notes': return '🎤';
        case 'Role-play': return '🎭';
        case 'Other': return '❓';
        default: return '✅';
    }
};

const Badge = ({ icon, text, isDark, colors }) => (
    <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: colors?.itemBgChecked || '#fff',
        border: `1px solid ${colors?.border || '#eee'}`,
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '700',
        color: colors?.textSecondary || '#555'
    }}>
        <span>{icon}</span> {text}
    </span>
);

const Tip = ({ text }) => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'start', fontSize: '14px', color: '#666' }}>
        <div style={{ marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ddd', flexShrink: 0 }} />
        {text}
    </div>
);

export default ActionPlanChecklist;
