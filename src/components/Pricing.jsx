import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';
import DonationModal from './DonationModal';

const Pricing = () => {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section style={{
            padding: '6rem 1.5rem',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <FadeIn>
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        backgroundColor: '#fcfcfb',
                        borderRadius: '16px',
                        border: '1px solid rgba(0,0,0,0.06)'
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontWeight: 700,
                            lineHeight: '1.2',
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.03em',
                            color: '#111'
                        }}>
                            {t({
                                en: "Support hiro Today.",
                                fr: "Soutenez hiro aujourd'hui."
                            })}
                        </h2>

                        <p style={{
                            fontSize: '1.2rem',
                            color: '#666',
                            lineHeight: '1.5',
                            marginBottom: '2.5rem',
                            maxWidth: '600px',
                            margin: '0 auto 2.5rem'
                        }}>
                            {t({
                                en: "hiro Aleph 1 is 100% built in Morocco and 100% free. We're building advanced tools to help startups scale globally.",
                                fr: "hiro Aleph 1 est conçu au Maroc et 100% gratuit. Nous bâtissons des outils avancés pour aider les startups à croître."
                            })}
                        </p>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button style={{
                                padding: '0.8rem 1.5rem',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                backgroundColor: 'var(--color-notion-blue)',
                                color: '#fff',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Tag size={18} />
                                {t({ en: "Donate Now", fr: "Faire un don" })}
                            </button>
                        </div>
                    </div>
                </FadeIn>
                <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div >
        </section >
    );
};

export default Pricing;

