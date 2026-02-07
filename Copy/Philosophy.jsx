import React from 'react';
import { Clock, BookOpen, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

const Philosophy = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const rules = t({
        en: [
            { title: "People fail. Systems don't.", desc: "Rely on structure, not individual effort." },
            { title: "If it lives in a head, it's a liability.", desc: "Operational knowledge must be extracted." },
            { title: "Consistency beats intensity.", desc: "Sustainable machines outlast heroic sprints." }
        ],
        fr: [
            { title: "Les gens échouent. Pas les systèmes.", desc: "Miser sur la structure, pas sur l'effort individuel." },
            { title: "Tout savoir interne est un risque.", desc: "La connaissance opérationnelle doit être extraite." },
            { title: "La constance bat l'intensité.", desc: "Les machines durables surpassent les sprints héroïques." }
        ]
    });

    const featureImage = "/images/philosophy_visual.jpg";

    return (
        <section style={{ padding: '8rem 0', backgroundColor: 'var(--color-surface)', color: 'var(--color-dark)' }}>
            <div className="container">

                {/* Editorial Heading */}
                <h2 style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: '800',
                    marginBottom: '5rem',
                    letterSpacing: '-0.04em'
                }}>
                    {t({ en: "#OurPhilosophy", fr: "#NotrePhilosophie" })}
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '6rem',
                    alignItems: 'center'
                }}>

                    {/* Left Column: Content */}
                    <div>
                        <h3 style={{
                            fontSize: '2.5rem',
                            lineHeight: '1.2',
                            marginBottom: '2rem',
                            maxWidth: '12ch'
                        }}>
                            {t({
                                en: <>Reliability Through <span className="highlight">Design</span>.</>,
                                fr: <>La fiabilité par le <span className="highlight">design</span>.</>
                            })}
                        </h3>



                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                            {rules.map((rule, i) => (
                                <div key={i}>
                                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{rule.title}</h4>
                                    <p style={{ color: '#888', fontSize: '1rem' }}>{rule.desc}</p>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => navigate('/apply')} className="btn-primary">
                            {t({ en: "Get xProject Free", fr: "Obtenez xProject gratuitement" })}
                        </button>
                    </div>

                    {/* Right Column: Framed Image (LifeAtTikTok Style) */}
                    <div style={{ position: 'relative', justifySelf: 'center' }}>
                        {/* Offset borders */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '-20px',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #FF3B5C 0%, #2AFADF 100%)',
                            borderRadius: '2rem',
                            opacity: 0.3,
                            zIndex: 0
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <img
                                src={featureImage}
                                alt="Philosophy Visual"
                                style={{
                                    width: '100%',
                                    maxWidth: '450px',
                                    aspectRatio: '9/16',
                                    objectFit: 'cover',
                                    borderRadius: '2rem',
                                    border: '1px solid rgba(0,0,0,0.08)'
                                }}
                            />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default Philosophy;

