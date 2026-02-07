import React from 'react';
import { CheckCircle, LogOut, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CTA = () => {
    const { t, lang } = useLanguage();
    const navigate = useNavigate();

    const deliverables = t({
        en: [
            "Documented core systems",
            "Clear ownership",
            "Founder removed from daily ops",
            "Business runs without constant decisions"
        ],
        fr: [
            "Systèmes cœurs documentés",
            "Propriété claire",
            "Fondateur libéré de l'opérationnel",
            "Le business tourne sans micro-décisions"
        ]
    });

    const exitConditions = t({
        en: [
            "Systems run the business",
            "Founder works on vision, not operations"
        ],
        fr: [
            "Les systèmes dirigent l'entreprise",
            "Le fondateur travaille sur la vision, pas l'opérationnel"
        ]
    });

    return (
        <footer style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-dark)', paddingTop: '8rem', paddingBottom: '4rem' }}>
            <div className="container">

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', marginBottom: '8rem' }}>

                    {/* Deliverables */}
                    <div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-dark)' }}>
                            {t({ en: "Deliverables", fr: "Livrables" })}
                        </h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {deliverables.map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: '#000000ff' }}>
                                    <CheckCircle size={20} color="var(--color-dark)" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Exit Condition */}
                    <div>
                        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-dark)' }}>
                            {t({ en: "Exit Condition", fr: "Critères de Sortie" })}
                        </h3>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {exitConditions.map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', color: '#000000ff' }}>
                                    <LogOut size={20} color="var(--color-dark)" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Final CTA */}
                <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6rem' }}>
                    <h2 style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', marginBottom: '3rem' }}>
                        {t({ en: <>Ready to engineer<br />your exit?</>, fr: <>Prêt à concevoir<br />votre sortie ?</> })}
                    </h2>
                    <button
                        onClick={() => navigate('/apply')}
                        className="btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 3rem', fontSize: '1.5rem' }}
                    >
                        {t({ en: "Get xProject Free", fr: "Obtenir xProject Gratuit" })} <ArrowRight size={28} />
                    </button>

                    <div style={{ marginTop: '4rem', color: '#666', fontSize: '0.9rem' }}>
                        &copy; {new Date().getFullYear()} xProject. {t({ en: "All rights reserved.", fr: "Tous droits réservés." })}
                    </div>
                </div>



            </div>

        </footer>
    );
};

export default CTA;


