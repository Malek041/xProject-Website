import React from 'react';
import { Tag } from 'lucide-react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

const Pricing = () => {
    const { t } = useLanguage();

    return (
        <section style={{
            padding: '4rem 0',
            backgroundColor: 'var(--color-surface)',
            overflow: 'hidden',
        }}>
            <div className="container">
                <FadeIn>
                    <div style={{
                        backgroundColor: 'var(--color-dark)',
                        padding: '8rem 4rem',
                        borderRadius: '1rem',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        {/* Background pattern */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-5%',
                            right: '-2%',
                            fontSize: '15rem',
                            fontWeight: '900',
                            opacity: 0.1,
                            userSelect: 'none',
                            lineHeight: 1,
                            color: 'var(--color-surface)',
                            zIndex: 0
                        }}>
                            400DH
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '1rem',
                                backgroundColor: 'rgba(0,0,0,0.07)',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '99px',
                                marginBottom: '3rem',
                                fontWeight: '700',
                                fontFamily: 'var(--font-heading)',
                                color: 'var(--color-surface)'
                            }}>
                                <Tag size={20} />
                                {t({ en: "Transparent Engineering", fr: "Ingénierie Transparente" })}
                            </div>

                            <h2 style={{
                                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                                lineHeight: '1.1',
                                marginBottom: '2.5rem',
                                letterSpacing: '-0.04em',
                                color: 'var(--color-surface)',
                                fontWeight: '300'
                            }}>
                                {t({
                                    en: <>We Charge <span style={{ borderBottom: '0.1em solid var(--color-surface)' }}>400dh</span> per each system delivered.</>,
                                    fr: <>Nous facturons <span style={{ borderBottom: '0.1em solid var(--color-surface)' }}>400dh</span> par système livré.</>
                                })}
                            </h2>

                            <p style={{
                                fontSize: '1.4rem',
                                fontWeight: '300',
                                opacity: 0.7,
                                maxWidth: '600px',
                                margin: '0 auto',
                                color: 'var(--color-surface)',
                                lineHeight: '1.4'
                            }}>
                                {t({
                                    en: "No hidden fees. No hourly waste. Just high-performance systems delivered one by one.",
                                    fr: "Pas de frais cachés. Pas de temps perdu au tarif horaire. Juste des systèmes haute performance livrés l'un après l'autre."
                                })}
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default Pricing;

