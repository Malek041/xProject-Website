import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import FadeIn from './FadeIn';

const EconomyContext = () => {
    const { t } = useLanguage();

    return (
        <section style={{
            padding: '10rem 0',
            backgroundColor: 'transparent',
            color: 'var(--color-dark)',
            overflow: 'hidden'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '6rem',
                    alignItems: 'center'
                }}>
                    <FadeIn direction="right" distance={50}>
                        <h2 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                            fontWeight: '300',
                            lineHeight: '1.1',
                            letterSpacing: '-0.04em',
                            marginBottom: '2rem'
                        }}>
                            {t({
                                en: "The Dual-Speed Reality.",
                                fr: "La Réalité à Double Vitesse."
                            })}
                        </h2>
                        <div style={{
                            width: '80px',
                            height: '4px',
                            backgroundColor: 'var(--color-primary)',
                            marginBottom: '3rem'
                        }} />
                    </FadeIn>

                    <FadeIn direction="left" distance={50} delay={0.2}>
                        <div style={{
                            fontSize: '1.25rem',
                            lineHeight: '1.7',
                            color: '#666',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem'
                        }}>
                            <p>
                                {t({
                                    en: "The Moroccan economy suffers from a \"dual-speed reality\" where a burgeoning startup scene exists alongside an SME sector that contributes only 20% to the GDP despite representing 95% of businesses.",
                                    fr: "L'économie marocaine souffre d'une « réalité à double vitesse » où une scène de startups en plein essor côtoie un secteur des PME qui ne contribue qu'à 20 % du PIB malgré le fait qu'il représente 95 % des entreprises."
                                })}
                            </p>
                            <p style={{ color: 'var(--color-dark)', fontWeight: '500' }}>
                                {t({
                                    en: "This discrepancy is largely due to the \"owner-dependency\" trap—a centralized management style where the founder remains the primary operational bottleneck.",
                                    fr: "Cet écart est largement dû au piège de la « dépendance au propriétaire » — un style de gestion centralisé où le fondateur reste le principal goulot d'étranglement opérationnel."
                                })}
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

export default EconomyContext;
