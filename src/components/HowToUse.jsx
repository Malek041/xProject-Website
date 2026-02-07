import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FeatureCard = ({ category }) => {
    const { t } = useLanguage();
    const [activeStep, setActiveStep] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 968);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
                width: '100%',
                backgroundColor: 'var(--color-bg-base)',
                borderRadius: isMobile ? '16px' : '24px',
                border: 'var(--border-notion)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 400px) 1fr',
                minHeight: isMobile ? 'auto' : '480px',
                marginBottom: '2rem'
            }}
        >
            {/* Left Sidebar */}
            <div style={{
                padding: isMobile ? '2rem 1.5rem' : '3rem 2.5rem',
                borderRight: isMobile ? 'none' : 'var(--border-notion)',
                borderBottom: isMobile ? 'var(--border-notion)' : 'none',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{t(category.label)}</span>
                        <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--color-text-accent-blue)',
                            backgroundColor: 'var(--color-bg-accent-blue-light)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                        }}>{t(category.tag)}</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <h3 style={{
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            lineHeight: '1.2',
                            color: 'var(--color-text-main)',
                            marginRight: '3rem'
                        }}>
                            {t(category.heading)}
                        </h3>
                        <div
                            onClick={() => navigate('/signup')}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                width: isMobile ? '32px' : '40px',
                                height: isMobile ? '32px' : '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <ArrowRight size={isMobile ? 16 : 20} color="var(--color-bg-base)" />
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    gap: isMobile ? '1.5rem' : '1rem',
                    marginTop: isMobile ? '1rem' : 'auto',
                    overflowX: isMobile ? 'auto' : 'visible',
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: isMobile ? '0.5rem' : '0'
                }}>
                    {category.steps.map((step, idx) => (
                        <div
                            key={step.id}
                            onMouseEnter={() => !isMobile && setActiveStep(idx)}
                            onClick={() => isMobile && setActiveStep(idx)}
                            style={{
                                cursor: 'pointer',
                                padding: isMobile ? '0' : '1.2rem 0',
                                borderTop: (isMobile || idx === 0) ? 'none' : 'var(--border-notion)',
                                transition: 'all 0.2s ease',
                                flexShrink: 0
                            }}
                        >
                            <h4 style={{
                                fontSize: isMobile ? '0.95rem' : '1.1rem',
                                fontWeight: 700,
                                color: activeStep === idx ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                marginBottom: (activeStep === idx && !isMobile) ? '0.5rem' : '0',
                                borderBottom: (isMobile && activeStep === idx) ? '2px solid var(--color-notion-blue)' : 'none',
                                paddingBottom: isMobile ? '4px' : '0'
                            }}>
                                {isMobile ? `${t({ en: 'Step', fr: 'Étape' })} ${step.id}` : t(step.title)}
                            </h4>
                            {!isMobile && activeStep === idx && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    style={{
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5',
                                        color: 'var(--color-text-muted)',
                                        fontWeight: 450
                                    }}
                                >
                                    {t(step.description)}
                                </motion.p>
                            )}
                        </div>
                    ))}
                </div>

                {isMobile && (
                    <motion.div
                        key={`desc-${category.steps[activeStep].id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '1.5rem' }}
                    >
                        <h5 style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: 'var(--color-text-main)',
                            marginBottom: '0.4rem'
                        }}>
                            {t(category.steps[activeStep].title)}
                        </h5>
                        <p style={{
                            fontSize: '0.95rem',
                            lineHeight: '1.5',
                            color: 'var(--color-text-muted)',
                            fontWeight: 450
                        }}>
                            {t(category.steps[activeStep].description)}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Right Media Area */}
            <div style={{
                backgroundColor: 'var(--color-bg-sidebar)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: isMobile ? '250px' : 'auto'
            }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={category.steps[activeStep].id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            width: '100%',
                            height: '100%',
                            padding: '2rem'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '16px',
                            overflow: 'hidden'
                        }}>
                            <video
                                src={category.steps[activeStep].video}
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Second styling variant (Full Width)
const FullWidthCard = ({ category }) => {
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
                width: '100%',
                backgroundColor: 'var(--color-bg-base)',
                borderRadius: isMobile ? '16px' : '24px',
                border: 'var(--border-notion)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: isMobile ? 'auto' : '560px'
            }}
        >
            <div style={{ padding: isMobile ? '2rem' : '3.5rem', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{t(category.label)}</span>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--color-text-accent-blue)',
                        backgroundColor: 'var(--color-bg-accent-blue-light)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                    }}>{t(category.tag)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: '1rem' }}>
                    <h3 style={{
                        fontSize: isMobile ? '1.75rem' : '2.5rem',
                        fontWeight: 800,
                        lineHeight: '1.1',
                        color: 'var(--color-text-main)',
                        letterSpacing: '-0.03em'
                    }}>
                        {t(category.heading)}
                    </h3>
                    <div
                        onClick={() => navigate('/signup')}
                        style={{
                            width: isMobile ? '40px' : '48px',
                            height: isMobile ? '40px' : '48px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <ArrowRight size={isMobile ? 20 : 24} color="var(--color-bg-base)" />
                    </div>
                </div>
            </div>

            <div style={{
                padding: '0 3.5rem 3.5rem',
                flex: 1,
                backgroundColor: 'var(--color-bg-dark-accent)',
                position: 'relative',
                margin: isMobile ? '0 1.5rem 2rem' : '0 3.5rem 3.5rem',
                borderRadius: '20px',
                overflow: 'hidden',
                minHeight: isMobile ? '250px' : 'auto'
            }}>
                <div style={{
                    position: 'absolute',
                    top: isMobile ? '1rem' : '2rem',
                    left: isMobile ? '1rem' : '2rem',
                    right: isMobile ? '1rem' : '2rem',
                    bottom: isMobile ? '0' : '-2rem',
                    backgroundColor: 'var(--color-bg-base)',
                    borderRadius: '16px 16px 0 0',
                    overflow: 'hidden',
                    border: 'var(--border-notion)',
                    borderBottom: 'none'
                }}>
                    <video
                        src={category.steps[0].video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

const HowToUse = () => {
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const categories = [
        {
            id: 'foundation',
            label: { en: 'Foundation', fr: 'Fondation' },
            tag: { en: 'Essential', fr: 'Essentiel' },
            heading: { en: 'Set The context. hiro Follows.', fr: 'Définissez le contexte. hiro suit.' },
            steps: [
                {
                    id: 1,
                    title: { en: 'Define your Mission', fr: 'Définissez votre mission' },
                    description: { en: 'Set the absolute foundation for your business growth before you start mapping systems.', fr: 'Posez les bases absolues de la croissance de votre entreprise avant de commencer à cartographier les systèmes.' },
                    video: '/videos/intro-dark.mp4'
                },
                {
                    id: 2,
                    title: { en: 'Revenue Systems', fr: 'Systèmes de revenus' },
                    description: { en: 'Map your current money-making flows with AI-guided precision.', fr: 'Cartographiez vos flux de revenus actuels avec une précision guidée par l\'IA.' },
                    video: '/videos/define-dark.mp4'
                },
                {
                    id: 3,
                    title: { en: 'Assign Ownership', fr: 'Assigner les responsabilités' },
                    description: { en: 'Clarify exactly who is responsible for each department in your organization.', fr: 'Clarifiez exactement qui est responsable de chaque département dans votre organisation.' },
                    video: '/videos/assign-dark.mp4'
                }
            ]
        },
        {
            id: 'extraction',
            label: { en: 'Extraction', fr: 'Extraction' },
            tag: { en: 'Workflow', fr: 'Flux de travail' },
            heading: { en: 'Expose the hidden work. Build the manual.', fr: 'Exposez le travail caché. Construisez le manuel.' },
            steps: [
                {
                    id: 4,
                    title: { en: 'Brainstorm Tasks', fr: 'Brainstorming des tâches' },
                    description: { en: 'Drill down into every sub-activity and task happening in your business.', fr: 'Analysez chaque sous-activité et tâche se déroulant dans votre entreprise.' },
                    video: '/videos/Videos for Web/Brainstorm as much sub-activities or tasks as possible .mov'
                },
                {
                    id: 5,
                    title: { en: 'Capture Methods', fr: 'Méthodes de capture' },
                    description: { en: 'Choose the most efficient way to record each specific process.', fr: 'Choisissez le moyen le plus efficace d\'enregistrer chaque processus spécifique.' },
                    video: '/videos/Videos for Web/Define Capture method for each sub-activity.mov'
                },
                {
                    id: 6,
                    title: { en: 'Set Standards', fr: 'Définir les normes' },
                    description: { en: 'Define what a "win" looks like for every single task in your library.', fr: 'Définissez ce qu\'est une « réussite » pour chaque tâche de votre bibliothèque.' },
                    video: '/videos/Videos for Web/Set a standard for each sub-activity.mov'
                }
            ]
        },
        {
            id: 'operations',
            label: { en: 'Operations', fr: 'Opérations' },
            tag: { en: 'Habitual', fr: 'Habituel' },
            heading: { en: 'Execute. Organize. Integrate.', fr: 'Exécuter. Organiser. Intégrer.' },
            steps: [
                {
                    id: 7,
                    title: { en: 'Execute Checklist', fr: 'Exécuter la liste de contrôle' },
                    description: { en: 'Follow the generated checklist to ensure nothing is missed during extraction.', fr: 'Suivez la liste de contrôle générée pour vous assurer que rien n\'est oublié lors de l\'extraction.' },
                    video: '/videos/Videos for Web/Execute the checklist.mov'
                },
                {
                    id: 8,
                    title: { en: 'Organize Systems', fr: 'Organiser les systèmes' },
                    description: { en: 'Keep your systems accessible and structured in the SystemHUB.', fr: 'Gardez vos systèmes accessibles et structurés dans le SystemHUB.' },
                    video: '/videos/Videos for Web/Organize your the systems you extracted.mov'
                },
                {
                    id: 9,
                    title: { en: 'Integrate & Adopt', fr: 'Intégrer et Adopter' },
                    description: { en: 'Turn your documentation into standard habits for your entire team.', fr: 'Transformez votre documentation en habitudes standard pour toute votre équipe.' },
                    video: '/videos/Videos for Web/Integrate the extracted systems using checklist.mov'
                }
            ]
        }
    ];

    return (
        <section style={{
            padding: isMobile ? '2.5rem 3rem' : '6rem 2rem',
            backgroundColor: 'var(--color-bg-sidebar)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{ maxWidth: '1350px', width: '100%' }}>
                <div style={{ textAlign: 'left', marginBottom: isMobile ? '2rem' : '4rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        color: 'var(--color-text-main)',
                        marginBottom: isMobile ? '1rem' : '1.5rem'
                    }}>
                        {t({ en: "How to use it", fr: "Comment l'utiliser" })}
                    </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '2rem' }}>
                    <FeatureCard category={categories[0]} />
                    <FeatureCard category={categories[1]} />
                    <FullWidthCard category={categories[2]} />
                </div>
            </div>
        </section>
    );
};

export default HowToUse;
