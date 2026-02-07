import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, Activity, TrendingUp, Check, Target, Shield, Zap, ArrowRight, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Typewriter from '../components/Typewriter';

const Application = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { t, lang } = useLanguage();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const questions = [
        {
            id: 'teamSize',
            type: 'single',
            question: {
                en: "How many people are in your team?",
                fr: "Combien de personnes sont dans votre équipe ?"
            },
            options: [
                { id: 'solo', en: "Solo (1-2)", fr: "Solo (1-2)", icon: <Users className="w-5 h-5" /> },
                { id: 'small', en: "Small (3–5)", fr: "Petite (3–5)", icon: <Users className="w-5 h-5" /> },
                { id: 'medium', en: "Medium (6–15)", fr: "Moyenne (6–15)", icon: <Users className="w-5 h-5" /> },
                { id: 'large', en: "Large (16–50)", fr: "Grande (16–50)", icon: <Users className="w-5 h-5" /> },
                { id: 'enterprise', en: "Enterprise (50+)", fr: "Entreprise (50+)", icon: <Users className="w-5 h-5" /> }
            ]
        },
        {
            id: 'profitable',
            type: 'single',
            question: {
                en: "Is the business profitable?",
                fr: "L'entreprise est-elle rentable ?"
            },
            options: [
                { id: 'yes', en: "Yes", fr: "Oui", icon: <DollarSign className="w-5 h-5" /> },
                { id: 'breakeven', en: "Break-even", fr: "À l'équilibre", icon: <Activity className="w-5 h-5" /> },
                { id: 'no', en: "No", fr: "Non", icon: <TrendingUp className="w-5 h-5" /> }
            ]
        },
        {
            id: 'businessWithoutFounder',
            type: 'single',
            question: {
                en: "Can the business run without you?",
                fr: "L'entreprise peut-elle fonctionner sans vous ?"
            },
            options: [
                { id: 'yes', en: "Yes, completely", fr: "Oui, complètement", icon: <Check className="w-5 h-5" /> },
                { id: 'partially', en: "Partially", fr: "Partiellement", icon: <Activity className="w-5 h-5" /> },
                { id: 'no', en: "No", fr: "Non", icon: <Target className="w-5 h-5" /> }
            ]
        },
        {
            id: 'opsBlockingGrowth',
            type: 'single',
            question: {
                en: "Are operations blocking growth?",
                fr: "Les opérations bloquent-elles la croissance ?"
            },
            options: [
                { id: 'yes', en: "Yes", fr: "Oui", icon: <Shield className="w-5 h-5" /> },
                { id: 'partially', en: "Partially", fr: "Partiellement", icon: <Activity className="w-5 h-5" /> },
                { id: 'no', en: "No", fr: "Non", icon: <Check className="w-5 h-5" /> }
            ]
        },
        {
            id: 'systemisationLevel',
            type: 'single',
            question: {
                en: "Your systemisation level?",
                fr: "Votre niveau de systématisation ?"
            },
            options: [
                { id: 'chaos', en: "Chaos", fr: "Chaos", icon: <Zap className="w-5 h-5" /> },
                { id: 'founderDependent', en: "Founder-dependent", fr: "Dépendant du fondateur", icon: <Users className="w-5 h-5" /> },
                { id: 'partiallySystemised', en: "Partially systemised", fr: "Partiellement systématisé", icon: <Activity className="w-5 h-5" /> },
                { id: 'systemDriven', en: "System-driven", fr: "Piloté par système", icon: <Target className="w-5 h-5" /> },
                { id: 'sellable', en: "Sellable", fr: "Vendable", icon: <DollarSign className="w-5 h-5" /> }
            ]
        }
    ];

    const handleOptionSelect = (id, value) => {
        setFormData({ ...formData, [id]: value });
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep(step + 1);
        }
    };

    const handleMultiSelect = (questionId, optionId) => {
        const current = formData[questionId] || [];
        const updated = current.includes(optionId)
            ? current.filter(id => id !== optionId)
            : [...current, optionId];
        setFormData({ ...formData, [questionId]: updated });
    };

    const handleNumberInput = (id, value) => {
        setFormData({ ...formData, [id]: value });
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setStep(step + 1);
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Please sign in first');
            return;
        }

        setIsSubmitting(true);
        const formElement = e.target;
        const whatsappNumber = formElement[0].value;

        const finalData = {
            ...formData,
            whatsappNumber,
            completedAt: new Date().toISOString(),
            userId: currentUser.uid,
            userEmail: currentUser.email
        };

        try {
            // Store in Firebase
            await setDoc(doc(db, 'applications', currentUser.uid), finalData);
            currentUser.hasCompletedApplication = true;
            console.log('Application saved to Firebase and state updated');
            navigate('/sop-builder');
        } catch (error) {
            console.error('Error saving application:', error);
            alert('Failed to save application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentQuestion = questions[step];
    const totalSteps = questions.length + 1;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div className="container" style={{ maxWidth: '800px', width: '100%' }}>

                {/* Progress Indicator */}
                <div style={{
                    display: 'flex',
                    gap: '0.4rem',
                    marginBottom: '3rem',
                    justifyContent: 'center'
                }}>
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} style={{
                            height: '4px',
                            width: '32px',
                            backgroundColor: i <= step ? 'var(--color-notion-blue)' : 'var(--color-border-default)',
                            borderRadius: '2px',
                            transition: 'all 0.3s ease'
                        }} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step < questions.length ? (
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                marginBottom: '2.5rem',
                                textAlign: 'center',
                                maxWidth: '600px',
                                margin: '0 auto 3rem',
                                lineHeight: '1.3',
                                color: 'var(--color-text-main)'
                            }}>
                                {t(currentQuestion.question)}
                            </h2>

                            {/* Single Select */}
                            {currentQuestion.type === 'single' && (
                                <div style={{
                                    display: 'grid',
                                    gap: isMobile ? '0.6rem' : '0.75rem',
                                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))'
                                }}>
                                    {currentQuestion.options.map((opt) => (
                                        <motion.div
                                            key={opt.id}
                                            whileHover={!isMobile ? { backgroundColor: 'var(--color-hover-overlay)', borderColor: 'var(--color-notion-blue)' } : {}}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                                            style={{
                                                backgroundColor: 'var(--color-bg-surface)',
                                                padding: isMobile ? '1.25rem' : '1.5rem',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: isMobile ? 'row' : 'column',
                                                alignItems: 'center',
                                                gap: isMobile ? '1rem' : '1rem',
                                                textAlign: isMobile ? 'left' : 'center',
                                                border: '1px solid var(--color-border-default)',
                                                transition: 'all 0.15s ease',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {opt.icon && <div style={{ color: 'var(--color-text-muted)' }}>{opt.icon}</div>}
                                            <div style={{ fontWeight: '500', fontSize: '1rem', color: 'var(--color-text-main)' }}>{t(opt)}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Number Input */}
                            {currentQuestion.type === 'number' && (
                                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                                    <input
                                        type="number"
                                        min={currentQuestion.min}
                                        max={currentQuestion.max}
                                        placeholder={t(currentQuestion.placeholder)}
                                        value={formData[currentQuestion.id] || ''}
                                        onChange={(e) => handleNumberInput(currentQuestion.id, e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1.5rem',
                                            borderRadius: '6px',
                                            border: '1px solid var(--color-border-default)',
                                            fontSize: '1.1rem',
                                            backgroundColor: 'var(--color-bg-base)',
                                            color: 'var(--color-text-main)',
                                            outline: 'none',
                                            textAlign: 'center',
                                            fontWeight: '500',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = 'var(--color-notion-blue)'}
                                        onBlur={(e) => e.target.style.borderColor = 'var(--color-border-default)'}
                                    />
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData[currentQuestion.id]}
                                        style={{
                                            marginTop: '2rem',
                                            width: '100%',
                                            padding: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            backgroundColor: formData[currentQuestion.id] ? 'var(--color-notion-blue)' : 'var(--color-hover-overlay)',
                                            color: formData[currentQuestion.id] ? '#fff' : 'var(--color-text-muted)',
                                            borderRadius: '6px',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            cursor: formData[currentQuestion.id] ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {t({ en: "Continue", fr: "Continuer" })} <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Multi Select */}
                            {currentQuestion.type === 'multi' && (
                                <>
                                    <div style={{
                                        display: 'grid',
                                        gap: isMobile ? '0.6rem' : '0.75rem',
                                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 1fr))',
                                        marginBottom: '2rem'
                                    }}>
                                        {currentQuestion.options.map((opt) => {
                                            const isSelected = (formData[currentQuestion.id] || []).includes(opt.id);
                                            return (
                                                <div
                                                    key={opt.id}
                                                    onClick={() => handleMultiSelect(currentQuestion.id, opt.id)}
                                                    style={{
                                                        backgroundColor: isSelected ? 'var(--color-bg-accent-blue-light)' : 'var(--color-bg-surface)',
                                                        padding: isMobile ? '0.8rem 1rem' : '1rem',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        border: isSelected ? '1px solid var(--color-notion-blue)' : '1px solid var(--color-border-default)',
                                                        color: isSelected ? 'var(--color-notion-blue)' : 'var(--color-text-main)',
                                                        transition: 'all 0.15s ease',
                                                        fontWeight: '500',
                                                        fontSize: isMobile ? '0.9rem' : '0.95rem',
                                                        boxShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.05)'
                                                    }}
                                                >
                                                    {t(opt)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!(formData[currentQuestion.id] || []).length}
                                        style={{
                                            maxWidth: '400px',
                                            margin: '2rem auto 0',
                                            width: '100%',
                                            padding: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            backgroundColor: (formData[currentQuestion.id] || []).length ? 'var(--color-notion-blue)' : 'var(--color-hover-overlay)',
                                            color: (formData[currentQuestion.id] || []).length ? '#fff' : 'var(--color-text-muted)',
                                            borderRadius: '6px',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            cursor: (formData[currentQuestion.id] || []).length ? 'pointer' : 'not-allowed',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {t({ en: "Continue", fr: "Continuer" })} <ArrowRight size={18} />
                                    </button>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="final"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ textAlign: 'center' }}
                        >
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                                {t({ en: "Here you go.", fr: "C'est parti." })}
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
                                {t({ en: "Share your details to get started.", fr: "Partagez vos informations pour commencer." })}
                            </p>

                            <form onSubmit={handleFinalSubmit} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    required
                                    type="tel"
                                    placeholder={t({ en: "WhatsApp Number (+212...)", fr: "Numéro WhatsApp (+212...)" })}
                                    pattern="[+][0-9]{1,4}[0-9]{9,}"
                                    title="Please enter a valid phone number with country code (e.g., +212612345678)"
                                    style={{
                                        padding: '0.8rem 1rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--color-border-default)',
                                        fontSize: '1rem',
                                        backgroundColor: 'var(--color-bg-base)',
                                        color: 'var(--color-text-main)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--color-notion-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--color-border-default)'}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        fontSize: '1rem',
                                        backgroundColor: isSubmitting ? '#666' : 'var(--color-notion-blue)',
                                        color: '#fff',
                                        borderRadius: '6px',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        transition: 'opacity 0.2s',
                                        opacity: isSubmitting ? 0.7 : 1
                                    }}
                                    onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.opacity = '0.9')}
                                    onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.opacity = '1')}
                                >
                                    {isSubmitting ? t({ en: "Submitting...", fr: "Envoi en cours..." }) : t({ en: "Submit Qualification", fr: "Envoyer la Qualification" })} <Send size={18} />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Application;
