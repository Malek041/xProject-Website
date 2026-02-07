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
            padding: '12rem 0',
            backgroundColor: 'transparent',
            color: 'var(--color-dark)',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <div className="container">
                <div style={{ marginBottom: '12rem', textAlign: 'center' }}>
                    <FadeIn>
                        <h2 style={{
                            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                            marginBottom: '2rem',
                            letterSpacing: '-0.04em',
                            fontWeight: '400',
                            lineHeight: '0.9'
                        }}>
                            {t({ en: "The hiro", fr: "Le Framework" })} <br />
                            <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Aleph1 Framework</span>
                        </h2>
                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                            opacity: 0.5,
                            fontWeight: '300',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            {t({
                                en: "The engineering process hiro Aleph empowers using AI and complex software architecture to build autonomous systems.",
                                fr: "Le processus d’ingénierie qu’hiro Aleph rend possible grâce à l’IA et à des architectures logicielles complexes pour bâtir des systèmes autonomes."
                            })}
                        </p>
                    </FadeIn>
                </div>

                <div style={{
                    position: 'relative',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Visual Connector Line (Desktop) */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        bottom: '0',
                        width: '1px',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.1) 10%, rgba(0,0,0,0.1) 90%, transparent)',
                        display: 'none', // Shown via media query logic if possible or just simplified
                        zIndex: 0
                    }} className="framework-connector" />

                    {steps.map((step, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div key={step.id} style={{
                                marginBottom: '10rem',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: isEven ? 'row' : 'row-reverse',
                                    alignItems: 'center',
                                    gap: '4rem',
                                    flexWrap: 'wrap'
                                }}>
                                    {/* Number Backdrop */}
                                    <div style={{
                                        flex: '1',
                                        minWidth: '300px',
                                        display: 'flex',
                                        justifyContent: isEven ? 'flex-end' : 'flex-start',
                                        position: 'relative'
                                    }}>
                                        <FadeIn direction={isEven ? 'left' : 'right'}>
                                            <div style={{
                                                fontSize: 'clamp(10rem, 20vw, 24rem)',
                                                fontWeight: '700',
                                                lineHeight: '0.8',
                                                color: 'var(--color-dark)',
                                                fontFamily: 'var(--font-heading)',
                                                letterSpacing: '-0.08em',
                                                opacity: '0.04',
                                                pointerEvents: 'none',
                                                userSelect: 'none'
                                            }}>
                                                {step.id}
                                            </div>
                                        </FadeIn>
                                    </div>

                                    {/* Content Card */}
                                    <div style={{
                                        flex: '1',
                                        minWidth: '320px'
                                    }}>
                                        <FadeIn delay={0.2}>
                                            <div className="card-hover" style={{
                                                padding: '3rem',
                                                backgroundColor: 'var(--color-light)',
                                                borderRadius: '24px',
                                                border: '1px solid rgba(0,0,0,0.03)',
                                            }}>
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: 'var(--color-primary)',
                                                    borderRadius: '99px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '800',
                                                    marginBottom: '2rem',
                                                    letterSpacing: '0.05em',
                                                    color: 'var(--color-dark)'
                                                }}>
                                                    <span style={{ opacity: 0.5 }}>{t({ en: "PHASE", fr: "PHASE" })}</span>
                                                    <span>0{step.id}</span>
                                                </div>

                                                <h4 style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    color: 'var(--color-grey-500)',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    {step.tagline}
                                                </h4>

                                                <h3 style={{
                                                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                                    marginBottom: '1.5rem',
                                                    letterSpacing: '-0.03em',
                                                    fontWeight: '600'
                                                }}>
                                                    {step.name}
                                                </h3>

                                                <p style={{
                                                    fontSize: '1.15rem',
                                                    lineHeight: '1.6',
                                                    color: 'rgba(0,0,0,0.6)',
                                                    marginBottom: '0',
                                                    maxWidth: '400px'
                                                }}>
                                                    {step.description}
                                                </p>
                                            </div>
                                        </FadeIn>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Global style for connector and mobile adjustments */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 1024px) {
                    .framework-connector {
                        display: block !important;
                    }
                }
                @media (max-width: 768px) {
                    .container { padding: 0 2rem; }
                }
            `}} />
        </section>
    );
};

export default Framework;

