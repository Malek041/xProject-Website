import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Layout } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FloatingProgressBar = ({ phase, data, onStartOrganize }) => {
    const { t } = useLanguage();
    // Only show during Extraction Action Plan (when map is complete) until Organize starts
    const isExtractPhase = (phase === 'extract' || phase === 'diy_extraction');
    const hasExtractionRegistry = data.extractionRegistry && data.extractionRegistry.length > 0;

    // Check if methods are all selected
    const methodsSelected = hasExtractionRegistry && data.extractionRegistry.every(item => item.method);

    if (!isExtractPhase || !methodsSelected) return null;

    // Calculate Action Plan progress
    const plan = data.extractionActionPlan || {};
    const totalSteps = 5;
    const completedSteps = Object.values(plan).filter(Boolean).length;
    const progress = (completedSteps / totalSteps) * 100;
    const isComplete = completedSteps === totalSteps;

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                backgroundColor: '#fff',
                borderRadius: '50px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                border: '1px solid #f3f4f6',
                minWidth: '400px'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isComplete ? '#000' : '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: isComplete ? '#fff' : '#6b7280' }}>
                        {Math.round(progress)}%
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        {t({ en: 'ACTION PLAN STATUS', fr: "STATUT DU PLAN D'ACTION" })}
                    </span>
                    <span style={{ fontSize: '14px', color: '#111827', fontWeight: '600' }}>
                        {isComplete ? t({ en: 'Ready to Organize', fr: 'Prêt à organiser' }) : t({ en: 'Extraction in Progress', fr: 'Extraction en cours' })}
                    </span>
                </div>
            </div>

            {/* Progress Bar Track */}
            <div style={{ flex: 1, height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden', minWidth: '120px' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ height: '100%', backgroundColor: '#000' }}
                />
            </div>

            {/* Organize Button - Appears when complete */}
            <AnimatePresence>
                {isComplete && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0, width: 0 }}
                        animate={{ scale: 1, opacity: 1, width: 'auto' }}
                        onClick={onStartOrganize}
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Layout size={14} />
                        {t({ en: 'Start Organize Phase', fr: 'Démarrer la phase Organiser' })}
                        <ArrowRight size={14} />
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FloatingProgressBar;
