import React from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';
import Typewriter from './Typewriter';
import { useLanguage } from '../context/LanguageContext';

const Truths = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const features = [
        {
            icon: '📋',
            title: t({ en: 'Build Systemology', fr: 'Bâtir la Systémologie' }),
            description: t({
                en: 'Go from brainstorm to defined roles and responsibilities in minutes.',
                fr: 'Passez du brainstorming aux rôles et responsabilités définis en quelques minutes.'
            })
        },
        {
            icon: '💬',
            title: t({ en: 'AI-Driven Extraction', fr: 'Extraction pilotée par l\'IA' }),
            description: t({
                en: 'Turn conversations into structured SOPs without lifting a finger.',
                fr: 'Transformez les conversations en SOP structurées sans lever le petit doigt.'
            })
        },
        {
            icon: '🚀',
            title: t({ en: 'Achieve Scale', fr: 'Atteindre l\'Échelle' }),
            description: t({
                en: 'Organize your workspace and empower your team to operate independently.',
                fr: 'Organisez votre espace de travail et permettez à votre équipe d\'opérer de manière autonome.'
            })
        }
    ];

    return (
        <section style={{
            padding: '8rem 1.5rem',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ textAlign: 'left', marginBottom: '4rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        letterSpacing: '-0.03em'
                    }}>
                        {t({ en: "Let hiro handle the busywork.", fr: "Laissez hiro s'occuper des tâches fastidieuses." })}
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>
                        {t({ en: "Pick a use case to see how hiro does the work for you.", fr: "Choisissez un cas d'utilisation pour voir comment hiro travaille pour vous." })}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            style={{
                                padding: '2rem',
                                backgroundColor: '#fcfcfb',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.06)',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#fff';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#fcfcfb';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                            }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{feature.title}</h3>
                            <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.5' }}>{feature.description}</p>
                            <div style={{ marginTop: '1.5rem', color: 'var(--color-notion-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                {t({ en: "Learn more", fr: "En savoir plus" })} <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Truths;
