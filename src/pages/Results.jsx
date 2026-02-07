import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, ArrowLeft, MessageCircle, Rocket } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const formData = location.state?.formData || {};

    // Qualification Logic
    const isQualified = () => {
        const profitable = ['yes', 'breakeven'].includes(formData.profitable);
        const hasTeam = !['solo'].includes(formData.teamSize);
        const needsHelp = ['yes', 'partially'].includes(formData.opsBlockingGrowth);
        const founderDependent = ['chaos', 'founderDependent', 'partiallySystemised'].includes(formData.systemisationLevel);

        return profitable && hasTeam && (needsHelp || founderDependent);
    };

    const qualified = isQualified();

    // Question labels for display
    const questionLabels = {
        teamSize: { en: "Team Size", fr: "Taille de l'équipe" },
        profitable: { en: "Profitable?", fr: "Rentable ?" },
        daysWorked: { en: "Days Worked/Week", fr: "Jours travaillés/semaine" },
        hoursWorked: { en: "Hours Worked/Day", fr: "Heures travaillées/jour" },
        secondPersonImpact: { en: "2nd Person Impact", fr: "Impact 2ème personne" },
        businessWithoutFounder: { en: "Business Without Founder (4 weeks)", fr: "Business sans fondateur (4 semaines)" },
        targetWithoutFounder: { en: "Target Without Founder (3 months)", fr: "Objectif sans fondateur (3 mois)" },
        systemisationLevel: { en: "Systemisation Stage", fr: "Stade de systématisation" },
        opsBlockingGrowth: { en: "Ops Blocking Growth?", fr: "Ops bloquent croissance ?" },
        documentedProcesses: { en: "Documented Processes", fr: "Processus documentés" },
        inconsistentResults: { en: "Inconsistent Results", fr: "Résultats incohérents" },
        growthDefinition: { en: "Growth Definition", fr: "Définition de croissance" }
    };

    const formatAnswer = (key, value) => {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return value || 'N/A';
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-text-main)',
            paddingTop: '8rem',
            paddingBottom: '6rem',
            transition: 'background-color 0.3s ease, color 0.3s ease'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        letterSpacing: '-0.03em',
                        lineHeight: '1.2',
                        color: 'var(--color-text-main)'
                    }}>
                        {t({ en: "Analysis Results", fr: "Résultats de l'Analyse" })}
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: '400', maxWidth: '600px', margin: '0 auto' }}>
                        {t({ en: "Based on your business profile inputs.", fr: "Basé sur les informations de votre profil d'entreprise." })}
                    </p>
                </motion.div>

                {/* Qualification Decision */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div style={{
                        backgroundColor: qualified ? 'rgba(39, 174, 96, 0.08)' : 'rgba(235, 87, 87, 0.08)',
                        padding: '2.5rem',
                        borderRadius: '8px',
                        marginBottom: '3rem',
                        border: qualified ? '1px solid rgba(39, 174, 96, 0.2)' : '1px solid rgba(235, 87, 87, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            marginBottom: '1rem',
                            color: qualified ? '#27ae60' : '#eb5757'
                        }}>
                            {qualified ? <Check size={48} /> : <X size={48} />}
                        </div>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            color: 'var(--color-text-main)'
                        }}>
                            {qualified
                                ? t({ en: "Ready for Engineering", fr: "Prêt pour l'ingénierie" })
                                : t({ en: "Foundation First", fr: "La fondation d'abord" })
                            }
                        </h2>
                        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', opacity: 0.9, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                            {qualified
                                ? t({
                                    en: "Your business is at the perfect stage for systematic engineering. We can help you transition from founder-dependent chaos to a scalable, system-driven asset.",
                                    fr: "Votre entreprise est au stade idéal pour l'ingénierie systématique. Nous pouvons vous aider à passer du chaos dépendant du fondateur à un actif évolutif et piloté par système."
                                })
                                : t({
                                    en: "We recommend focusing on stabilizing your core operations manually before introducing complex system architectures. Let's stay in touch as you grow.",
                                    fr: "Nous vous recommandons de vous concentrer sur la stabilisation manuelle de vos opérations de base avant d'introduire des architectures système complexes."
                                })
                            }
                        </p>
                    </div>
                </motion.div>

                {/* Analysis Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ marginBottom: '3rem' }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        paddingBottom: '0.5rem',
                        borderBottom: '1px solid var(--color-border-default)'
                    }}>
                        <h3 style={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            color: 'var(--color-text-main)'
                        }}>
                            {t({ en: "Detailed Brief", fr: "Bref Détaillé" })}
                        </h3>
                    </div>

                    <div style={{
                        display: 'grid',
                        gap: '1rem',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
                    }}>
                        {Object.entries(formData).map(([key, value]) => {
                            // Skip empty values or internal fields
                            if (!questionLabels[key]) return null;

                            return (
                                <div
                                    key={key}
                                    style={{
                                        backgroundColor: 'var(--color-bg-surface)',
                                        padding: '1.25rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--color-border-default)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <div style={{
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {t(questionLabels[key] || { en: key, fr: key })}
                                    </div>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: 'var(--color-text-main)'
                                    }}>
                                        {formatAnswer(key, value)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginTop: '3rem'
                    }}
                >
                    {qualified ? (
                        <button
                            onClick={() => navigate('/signup')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                fontSize: '1rem',
                                backgroundColor: 'var(--color-notion-blue)',
                                color: '#fff',
                                borderRadius: '4px',
                                border: 'none',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'opacity 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {t({ en: "Begin Onboarding", fr: "Commencer l'intégration" })} <Rocket size={18} />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'transparent',
                                    border: '1px solid var(--color-border-default)',
                                    borderRadius: '4px',
                                    color: 'var(--color-text-main)',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hover-overlay)'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <ArrowLeft size={16} /> {t({ en: "Return Home", fr: "Retour Acceuil" })}
                            </button>
                            <a
                                href="https://wa.me/212702814355"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '0.95rem',
                                    backgroundColor: 'var(--color-notion-blue)',
                                    color: '#fff',
                                    borderRadius: '4px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textDecoration: 'none',
                                    transition: 'opacity 0.2s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                <MessageCircle size={18} /> {t({ en: "Talk to Expert", fr: "Parler à un expert" })}
                            </a>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Results;
