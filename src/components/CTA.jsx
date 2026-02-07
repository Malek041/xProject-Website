import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import FadeIn from './FadeIn';

const CTA = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 968);

    React.useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 968);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <section style={{
            padding: isMobile ? '3rem 0' : '6rem 0',
            backgroundColor: 'var(--color-bg-base)',
            textAlign: 'center',
            transition: 'background-color 0.3s ease'
        }}>
            <div className="container" style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: isMobile ? '0 1.5rem' : '0 2rem'
            }}>
                <FadeIn direction="up" distance={30}>
                    <h2 style={{
                        fontSize: isMobile ? '2.5rem' : '4.5rem',
                        fontWeight: 900,
                        lineHeight: '1.05',
                        letterSpacing: '-0.05em',
                        marginBottom: '1.5rem',
                        color: 'var(--color-text-main)'
                    }}>
                        {t({
                            en: "Ready to Grow your Business?",
                            fr: "Prêt à améliorer votre entreprise ?"
                        })}
                    </h2>



                    <button
                        onClick={() => navigate('/signup')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            padding: isMobile ? '1rem 2rem' : '1.2rem 3rem',
                            fontSize: isMobile ? '1.1rem' : '1rem',
                            borderRadius: '10px',
                            backgroundColor: 'var(--color-text-main)',
                            color: 'var(--color-bg-base)',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, background-color 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-text-main)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-text-main)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {t({ en: "Get Started Free", fr: "Commencer Gratuitement" })}
                        <ArrowRight size={20} />
                    </button>
                </FadeIn>

                <div style={{
                    marginTop: isMobile ? '6rem' : '10rem',
                    paddingTop: '3rem',
                    borderTop: 'var(--border-notion)',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 500
                }}>
                    <div>
                        &copy; {new Date().getFullYear()} hiro. {t({ en: "All rights reserved.", fr: "Tous droits réservés." })}
                    </div>



                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🇲🇦</span>
                        {t({ en: "MADE IN MOROCCO", fr: "FABRIQUÉ AU MAROC" })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
