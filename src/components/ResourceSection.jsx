import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ResourceSection = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const resources = [
        {
            id: 'ccf-framework',
            title: t({
                en: "The CCF Framework",
                fr: "Le cadre CCF"
            }),
            linkText: t({ en: "Learn the framework", fr: "Découvrir le cadre" }),
            image: "/images/SOPBuilder frameworks/CCF.png"
        },
        {
            id: 'drtc-chart',
            title: t({
                en: "The DRTC Chart",
                fr: "Le tableau DRTC"
            }),
            linkText: t({ en: "Learn the framework", fr: "Découvrir le cadre" }),
            image: "/images/SOPBuilder frameworks/DRTC.png"
        },
        {
            id: 'sas-method',
            title: t({
                en: "The SAS Method",
                fr: "La méthode SAS"
            }),
            linkText: t({ en: "Learn the framework", fr: "Découvrir le cadre" }),
            image: "/images/SOPBuilder frameworks/SAS.png"
        }
    ];

    return (
        <section style={{
            padding: '100px 20px',
            backgroundColor: 'var(--color-bg-base)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'background-color 0.3s ease'
        }}>
            <h2 style={{
                textAlign: 'center',
                fontSize: '44px',
                maxWidth: '900px',
                fontWeight: '800',
                marginBottom: '64px',
                color: 'var(--color-text-main)',
                letterSpacing: '-0.03em'
            }}>
                {t({ en: "Dive deeper.", fr: "Approfondissez." })}
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '24px',
                width: '100%',
                maxWidth: '1200px'
            }}>
                {resources.map((res, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        onClick={() => navigate(`/framework/${res.id}`)}
                        style={{
                            backgroundColor: 'var(--color-bg-sidebar)',
                            borderRadius: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '480px',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer',
                            border: 'var(--border-notion)'
                        }}
                    >
                        <div style={{ padding: '36px 36px 20px 36px' }}>
                            <h3 style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                color: 'var(--color-text-main)',
                                marginBottom: '16px',
                                lineHeight: '1.3',
                                letterSpacing: '-0.01em'
                            }}>
                                {res.title}
                            </h3>
                            <div style={{
                                color: 'var(--color-text-accent-blue)',
                                fontSize: '16px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'color 0.2s'
                            }}>
                                {res.linkText} <span style={{ fontSize: '18px', fontWeight: '400', transform: 'translateY(-1px)' }}>→</span>
                            </div>
                        </div>

                        <div style={{
                            flex: 1,
                            margin: '10px 36px 0 36px',
                            backgroundColor: 'var(--color-bg-base)',
                            borderRadius: '30px 30px 0 0',
                            padding: '24px',
                            boxShadow: 'var(--shadow-notion)',
                            border: 'var(--border-notion)',
                            borderBottom: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src={res.image}
                                alt={res.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ResourceSection;
