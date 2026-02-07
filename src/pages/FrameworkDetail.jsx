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
            {/* Minimal Premium Header */}
            <header style={{
                padding: '24px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: 'var(--color-bg-translucent)',
                backdropFilter: 'blur(10px)',
                borderBottom: 'var(--border-notion)'
            }}>
                <div
                    onClick={() => navigate('/')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '15px',
                        color: 'var(--color-text-muted)',
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text-main)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                    <ChevronLeft size={18} />
                    {t({ en: "Back", fr: "Retour" })}
                </div>

                {!currentUser ? (
                    <button
                        onClick={handleGoogleSignUp}
                        style={{
                            padding: '10px 18px',
                            backgroundColor: 'var(--color-text-main)',
                            color: 'var(--color-bg-base)',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'transform 0.2s ease, opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                        </svg>
                        {t({ en: "Continue with Google", fr: "Continuer avec Google" })}
                    </button>
                ) : (
                    <div
                        onClick={() => navigate('/sop-builder')}
                        style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer',
                            color: 'var(--color-primary)'
                        }}
                    >
                        {t({ en: "Go to Dashboard", fr: "Aller au tableau de bord" })}
                    </div>
                )}
            </header>

            <main style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '80px 40px',
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
                        fontSize: '56px',
                        fontWeight: '850',
                        lineHeight: '1.05',
                        letterSpacing: '-0.04em',
                        marginBottom: '32px',
                        color: 'var(--color-text-main)'
                    }}>
                        {t(framework.title)}
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        lineHeight: '1.5',
                        color: 'var(--color-text-muted)',
                        maxWidth: '700px',
                        marginBottom: '64px'
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
                            borderRadius: '32px',
                            padding: '40px',
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
                        padding: '100px 0',
                        borderTop: 'var(--border-notion)'
                    }}>
                        <h2 style={{ fontSize: '32px', marginBottom: '24px', letterSpacing: '-0.02em' }}>
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
