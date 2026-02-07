import React, { useState } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import FadeIn from '../components/FadeIn';

const SignUp = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleGoogleSignUp = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/sop-builder');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };



    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: isMobile ? '2rem 1.5rem' : '4rem 2rem'
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: isMobile ? '1.1rem' : '1.2rem',
                    marginBottom: isMobile ? '2.5rem' : '4rem',
                    letterSpacing: '-0.02em'
                }}
            >
                <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src="/images/Avatar Photos/Logo Avatar.jpg"
                        alt="Logo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                hiro
            </div>

            <div style={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <FadeIn direction="up" distance={20}>
                    <h1 style={{
                        fontSize: isMobile ? '2rem' : '2.5rem',
                        fontWeight: 800,
                        lineHeight: '1.1',
                        marginBottom: '1rem',
                        letterSpacing: '-0.03em',
                        textAlign: 'center'
                    }}>
                        {t({
                            en: "Think it. Build it.",
                            fr: "Pensez-le. Bâtissez-le."
                        })}
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center',
                        marginBottom: '2.5rem'
                    }}>
                        {t({
                            en: "Sign up to start systemising your business.",
                            fr: "Inscrivez-vous pour systématiser votre entreprise."
                        })}
                    </p>
                </FadeIn>

                <FadeIn delay={0.2} direction="up" distance={20}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Google Sign Up Button */}
                        <button
                            onClick={handleGoogleSignUp}
                            style={{
                                width: '100%',
                                padding: '0.6rem 1rem',
                                backgroundColor: 'var(--color-bg-base)',
                                border: '1px solid var(--color-border-default)',
                                borderRadius: '6px',
                                color: 'var(--color-text-main)',
                                fontSize: '0.95rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: 'background 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hover-overlay)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-base)'}
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                                <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                                <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                            </svg>
                            {t({ en: "Continue with Google", fr: "Continuer avec Google" })}
                        </button>

                        {error && <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>}
                        <p style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-text-muted)',
                            marginTop: '1.5rem',
                            lineHeight: '1.5',
                            textAlign: 'center'
                        }}>
                            {t({
                                en: "By continuing, you acknowledge our Terms and Privacy Policy.",
                                fr: "En continuant, vous acceptez nos conditions et notre politique de confidentialité."
                            })}
                        </p>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default SignUp;
