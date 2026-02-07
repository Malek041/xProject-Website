import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 640);
            setIsTablet(window.innerWidth <= 1024);
        };
        window.addEventListener('resize', handleResize);

        if (videoRef.current) {
            videoRef.current.playbackRate = 2.5;
        }

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section style={{
            padding: isMobile ? '10rem 2.5rem 2rem' : '7rem 1.5rem 3rem',
            backgroundColor: 'var(--color-bg-base)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: isMobile ? 'auto' : '85vh',
            transition: 'background-color 0.3s ease'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ maxWidth: '900px', width: '100%' }}
            >
                {/* Avatar Stack - Notion Style Decoration */}
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    marginBottom: isMobile ? '1.5rem' : '2.5rem',
                    position: 'relative',
                    gap: isMobile ? '8px' : '0'
                }}>
                    {/* Back Face Left (Video) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                            width: isMobile ? '60px' : '100px',
                            height: isMobile ? '60px' : '100px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: isDark ? '3px solid #222' : '3px solid #fff',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            marginRight: isMobile ? '0' : '-25px',
                            zIndex: 1,
                            backgroundColor: '#000'
                        }}
                    >
                        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src="/videos/kling_20260207_Image_to_Video_It_moves_f_3954_0.mp4" type="video/mp4" />
                        </video>
                    </motion.div>

                    {/* Front Center Face (Main Video) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                        style={{
                            width: isMobile ? '100px' : '180px',
                            height: isMobile ? '100px' : '180px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: isDark ? '4px solid #222' : '4px solid #fff',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
                            zIndex: 3,
                            position: 'relative',
                            backgroundColor: '#000'
                        }}
                    >
                        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src="/videos/Animated avatars/kling_20260207_Image_to_Video_It_moves_f_4075_0.mp4" type="video/mp4" />
                        </video>
                    </motion.div>

                    {/* Back Face Right (Image) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{
                            width: isMobile ? '60px' : '100px',
                            height: isMobile ? '60px' : '100px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: isDark ? '3px solid #222' : '3px solid #fff',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            marginLeft: isMobile ? '0' : '-25px',
                            zIndex: 1,
                            backgroundColor: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                            <source src="/videos/Videos for Web/kling_20260207_Image_to_Video_Wise__focu_4216_0.mp4" type="video/mp4" />
                        </video>
                    </motion.div>
                </div>

                {/* Main Headline - Notion Style */}
                <h1 style={{
                    fontSize: isMobile ? '2.5rem' : '4.5rem',
                    fontWeight: 700,
                    lineHeight: '1',
                    letterSpacing: '-0.03em',
                    marginBottom: '1rem',
                    color: 'var(--color-text-main)',
                    padding: isMobile ? '0 0.5rem' : '0'
                }}>
                    {t({
                        en: <>Where to become a<br /><span style={{ fontWeight: 700 }}>systems-run Startup.</span></>,
                        fr: <>Devenez une<br /><span style={{ fontWeight: 700 }}>Startup gérée par des systèmes.</span></>
                    })}
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: isMobile ? '1rem' : '1.3rem',
                    color: 'var(--color-text-main)',
                    marginBottom: '2rem',
                    fontWeight: 300,
                    lineHeight: '1.5',
                    maxWidth: isMobile ? '400px' : '750px',
                    margin: '0 auto 2rem',
                    padding: isMobile ? '0 1rem' : '0',
                    opacity: 0.9
                }}>
                    {t({
                        en: "Build Systems. Solve Real Problems. Set and Achieve Business Goals. hiro is where founders turn chaos into scale.",
                        fr: "Créez des systèmes. Résolvez de vrais problèmes. Fixez et atteignez vos objectifs commerciaux. hiro est là où les fondateurs transforment le chaos en croissance."
                    })}
                </p>

                {/* CTA Buttons - Notion Style */}
                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'row',
                    gap: isMobile ? '0.75rem' : '1rem',
                    justifyContent: 'center',
                    marginBottom: isMobile ? '3rem' : '4rem',
                    padding: isMobile ? '0 1rem' : '0',
                    width: '100%'
                }}>
                    <Link
                        to="/signup"
                        style={{
                            padding: isMobile ? '0.6rem 1rem' : '0.8rem 1.5rem',
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            fontWeight: '600',
                            backgroundColor: 'var(--color-notion-blue)',
                            color: 'var(--color-bg-base)',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            transition: 'opacity 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        {t({ en: "Get hiro free", fr: "Obtenir hiro gratuitement" })}
                    </Link>
                    <button
                        onClick={() => navigate('/application')}
                        style={{
                            padding: isMobile ? '0.6rem 1rem' : '0.8rem 1.5rem',
                            fontSize: isMobile ? '0.9rem' : '1.1rem',
                            fontWeight: '600',
                            backgroundColor: 'var(--color-notion-light-blue)',
                            color: 'var(--color-notion-blue)',
                            borderRadius: '6px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(2, 101, 210, 0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-notion-light-blue)'}
                    >
                        {t({ en: "Test your Readiness", fr: "Testez votre Readiness" })}
                    </button>
                </div>

                {/* Product Preview - Notion Style */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        width: '100%',
                        maxWidth: '900px',
                        backgroundColor: 'var(--color-bg-base)',
                        borderRadius: isMobile ? '12px' : '16px',
                        boxShadow: 'var(--shadow-notion)',
                        overflow: 'hidden',
                        border: 'var(--border-notion)',
                        marginBottom: isMobile ? '3rem' : '4rem'
                    }}
                >
                    <div style={{
                        width: '100%',
                        aspectRatio: '16/10',
                        backgroundColor: 'var(--color-bg-base)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <video
                            ref={videoRef}
                            src="/videos/Animated avatars/Dark SOPBuilder Demo.mov"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </motion.div>

                {/* Trusted By Logos - Below Preview like Notion */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.2rem',
                    opacity: 0.6
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: isMobile ? '2rem' : '3rem',
                        flexWrap: 'wrap',
                        filter: 'grayscale(100%) invert(var(--dark-mode-invert, 0))',
                        opacity: 0.5
                    }}>
                        <img src="/images/logos/flosi.png" alt="Flosi" style={{ height: isMobile ? '16px' : '20px', objectFit: 'contain' }} />
                        <img src="/images/logos/hiro.png" alt="Hiro" style={{ height: isMobile ? '20px' : '24px', objectFit: 'contain' }} />
                        <img src="/images/logos/drok.png" alt="Drok" style={{ height: isMobile ? '18px' : '22px', objectFit: 'contain' }} />
                        <img src="/images/logos/nobank.png" alt="NoBank" style={{ height: isMobile ? '18px' : '22px', objectFit: 'contain' }} />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;


