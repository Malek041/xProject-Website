import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup } from 'firebase/auth';
import { frameworkData } from '../data/frameworks';
import FadeIn from '../components/FadeIn';
import { ChevronLeft } from 'lucide-react';

const FrameworkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const framework = frameworkData[id];
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (framework) {
            document.title = `${t(framework.title)} | hiro`;
            // SEO Meta tags optimization
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = "description";
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = t(framework.description);

            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = "keywords";
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = framework.seoKeywords.join(', ');
        }
    }, [framework, t]);

    if (!framework) {
        return (
            <div style={{ padding: '100px', textAlign: 'center', color: 'var(--color-text-main)' }}>
                <h2>Framework not found</h2>
                <button onClick={() => navigate('/')}>{t({ en: "Go Home", fr: "Retour à l'accueil" })}</button>
            </div>
        );
    }

    const handleGoogleSignUp = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/sop-builder');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-text-main)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background-color 0.3s ease'
        }}>
            <main style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: isMobile ? '120px 20px 40px' : '160px 40px 80px',
                width: '100%'
            }}>
                <FadeIn direction="up" distance={30}>
                    <p style={{
                        color: 'var(--color-primary)',
                        fontWeight: '700',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '16px'
                    }}>
                        {t(framework.subtitle)}
                    </p>
                    <h1 style={{
                        fontSize: isMobile ? '32px' : '56px',
                        fontWeight: '850',
                        lineHeight: '1.1',
                        letterSpacing: '-0.04em',
                        marginBottom: '24px',
                        color: 'var(--color-text-main)'
                    }}>
                        {t(framework.title)}
                    </h1>
                    <p style={{
                        fontSize: isMobile ? '16px' : '20px',
                        lineHeight: '1.5',
                        color: 'var(--color-text-muted)',
                        maxWidth: '700px',
                        marginBottom: isMobile ? '40px' : '64px'
                    }}>
                        {t(framework.description)}
                    </p>
                </FadeIn>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '40px',
                    marginBottom: '80px'
                }}>
                    <FadeIn delay={0.2}>
                        <div style={{
                            backgroundColor: 'var(--color-bg-sidebar)',
                            borderRadius: isMobile ? '20px' : '32px',
                            padding: isMobile ? '16px' : '40px',
                            border: 'var(--border-notion)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-notion)'
                        }}>
                            <img
                                src={framework.image}
                                alt={t(framework.title)}
                                style={{ width: '100%', borderRadius: '16px', border: 'var(--border-notion)' }}
                            />
                        </div>
                    </FadeIn>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '24px'
                    }}>
                        {framework.details.map((detail, index) => (
                            <FadeIn key={index} delay={0.4 + (index * 0.1)} direction="up" distance={20}>
                                <div style={{
                                    padding: '24px',
                                    borderRadius: '20px',
                                    backgroundColor: 'var(--color-bg-sidebar)',
                                    border: 'var(--border-notion)',
                                    height: '100%'
                                }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        marginBottom: '12px',
                                        color: 'var(--color-text-main)'
                                    }}>
                                        {t(detail.heading)}
                                    </h3>
                                    <p style={{
                                        fontSize: '15px',
                                        lineHeight: '1.6',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        {t(detail.text)}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <FadeIn delay={0.7} direction="up">
                    <div style={{
                        textAlign: 'center',
                        padding: isMobile ? '60px 0' : '100px 0',
                        borderTop: 'var(--border-notion)'
                    }}>
                        <h2 style={{ fontSize: isMobile ? '24px' : '32px', marginBottom: '24px', letterSpacing: '-0.02em' }}>
                            {t({
                                en: "Ready to systemise?",
                                fr: "Prêt à systématiser ?"
                            })}
                        </h2>
                        <button
                            onClick={handleGoogleSignUp}
                            style={{
                                padding: '16px 32px',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '18px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                boxShadow: '0 10px 25px rgba(2, 101, 210, 0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {t({ en: "Get Started Free", fr: "Démarrer gratuitement" })}
                        </button>
                    </div>
                </FadeIn>
            </main>

            {/* Avatar Decoration */}
            <div style={{
                position: 'fixed',
                bottom: '40px',
                right: '40px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--color-bg-sidebar)',
                boxShadow: 'var(--shadow-notion)',
                zIndex: 10
            }}>
                <img
                    src="/images/Avatar Photos/Logo Avatar.jpg"
                    alt="hiro avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
        </div>
    );
};

export default FrameworkDetail;
