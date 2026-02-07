import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import FadeIn from './FadeIn';

const Framework = () => {
    const { t } = useLanguage();

    const steps = t({
        en: [
            { id: 1, name: "DEFINE", tagline: "Reality Check", description: "Identify revenue streams and kill non-essential activities." },
            { id: 2, name: "EXTRACT", tagline: "Get It Out of Heads", description: "Capture operational knowledge and decision logic into SOPs." },
            { id: 3, name: "ORGANIZE", tagline: "Make It Usable", description: "Group systems by function and define absolute ownership." },
            { id: 4, name: "INTEGRATE", tagline: "Work Together", description: "Connect handoffs so business flows without intervention." },
            { id: 5, name: "SCALE", tagline: "Reduce Dependency", description: "Train replacements and stress-test for autonomous growth." },
            { id: 6, name: "OPTIMIZE", tagline: "Continuous Excellence", description: "Measure, refine, and update SOPs in a continuous loop." }
        ],
        fr: [
            { id: 1, name: "DÉFINIR", tagline: "État des Lieux", description: "Identifier les sources de revenus et supprimer l'accessoire." },
            { id: 2, name: "EXTRAIRE", tagline: "Sortir des Têtes", description: "Capturer le savoir opérationnel dans des procédures claires." },
            { id: 3, name: "ORGANISER", tagline: "Rendre Utilisable", description: "Grouper par fonction et définir une propriété absolue." },
            { id: 4, name: "INTÉGRER", tagline: "Travailler Ensemble", description: "Connecter les flux pour une autonomie totale." },
            { id: 5, name: "DILLY", tagline: "Réduire la Dépendance", description: "Former les remplaçants pour une croissance autonome." },
            { id: 6, name: "OPTIMISER", tagline: "Excellence Continue", description: "Mesurer, affiner et mettre à jour les SOP en boucle." }
        ]
    });

    return (
        <section style={{
            padding: '10rem 0',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-dark)'
        }}>
            <div className="container">
                <div style={{ marginBottom: '8rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                        {t({ en: "The xProject Framework", fr: "Le Framework xProject" })}
                    </h2>
                    <p style={{ fontSize: '1.25rem', opacity: 0.6, fontWeight: '500' }}>
                        {t({ en: "A non-negotiable order for engineering stability.", fr: "Un ordre non-négociable pour l'ingénierie de la stabilité." })}
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '8rem' }}>
                    {steps.map((step, index) => (
                        <FadeIn key={step.id}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '5rem',
                                alignItems: 'center'
                            }}>
                                {/* Number Section */}
                                <div style={{
                                    order: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FadeIn direction="left">
                                        <div style={{
                                            fontSize: 'clamp(8rem, 15vw, 18rem)',
                                            fontWeight: '900',
                                            lineHeight: '1',
                                            color: 'var(--color-dark)',
                                            fontFamily: 'var(--font-heading)',
                                            letterSpacing: '-0.05em',
                                            opacity: '0.9'
                                        }}>
                                            {step.id}
                                        </div>
                                    </FadeIn>
                                </div>

                                {/* Text Section */}
                                <div style={{ order: 2 }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.4rem 1rem',
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                        borderRadius: '99px',
                                        fontSize: '0.9rem',
                                        fontWeight: '700',
                                        marginBottom: '1.5rem',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {t({ en: "STEP", fr: "ÉTAPE" })} 0{step.id} — {step.tagline}
                                    </div>
                                    <h3 style={{
                                        fontSize: 'clamp(2rem, 3vw, 3rem)',
                                        marginBottom: '1.5rem',
                                        letterSpacing: '-0.02em'
                                    }}>
                                        {step.name}
                                    </h3>
                                    <FadeIn delay={0.3} direction="right">
                                        <p style={{
                                            fontSize: '1.25rem',
                                            lineHeight: '1.6',
                                            color: '#444',
                                            marginBottom: '0',
                                            maxWidth: '500px'
                                        }}>
                                            {step.description}
                                        </p>
                                    </FadeIn>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Framework;

