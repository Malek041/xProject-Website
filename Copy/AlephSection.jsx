import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { MousePointer, Share2, Code, Layout, Terminal, Database, Cpu, Globe, Cloud, Eye, Search, Maximize } from 'lucide-react';

const IconBar = () => {
    const icons = [
        <MousePointer size={24} />, <Share2 size={24} />, <Code size={24} />,
        <Layout size={24} />, <Terminal size={24} />, <Database size={24} />,
        <Cpu size={24} />, <Globe size={24} />, <Cloud size={24} />,
        <Eye size={24} />, <Search size={24} />, <Maximize size={24} />
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            padding: '6rem 0',
            opacity: 0.8,
            flexWrap: 'wrap'
        }}>
            {icons.map((icon, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -15, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15
                    }}
                    style={{
                        padding: '1.25rem',
                        borderRadius: '50%',
                        backgroundColor: '#f5f5f7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e5e5e7',
                    }}
                >
                    {icon}
                </motion.div>
            ))}
        </div>
    );
};

const TypewriterText = ({ text }) => {
    const chars = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.015, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            display: "inline-block", // Ensures space is taken but hidden chars don't show
            transition: {
                duration: 0, // "Typewriter" feel: instant appearance
            },
        },
        hidden: {
            opacity: 0,
            display: "inline-block", // Keeps layout stable
            transition: {
                duration: 0,
            },
        },
    };

    return (
        <motion.p
            style={{
                fontSize: '1.5rem',
                lineHeight: '1.6',
                color: 'var(--color-grey-600)',
                maxWidth: '500px',
                minHeight: '150px' // Reserve height to prevent layout shift
            }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }} // Trigger when 30% visible
        >
            {chars.map((char, index) => (
                <motion.span variants={child} key={index}>
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.p>
    );
};

const WindowMockup = ({ videoSrc }) => {
    return (
        <div style={{
            width: '100%',
            aspectRatio: '16/10',
            backgroundColor: '#1e1e1e',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
        }}>
            <div style={{
                height: '2.5rem',
                backgroundColor: '#2d2d2d',
                display: 'flex',
                alignItems: 'center',
                padding: '0 1.25rem',
                gap: '0.6rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>

            <div style={{ width: '100%', height: 'calc(100% - 2.5rem)', position: 'relative' }}>
                <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
        </div>
    );
};

const FeatureItem = ({ feature, index }) => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    return (
        <div
            ref={sectionRef}
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: '12vw',
                alignItems: 'start',
                minHeight: '60vh',
                padding: '5vh 0',
                position: 'relative'
            }}
        >
            <div style={{
                position: 'sticky',
                top: '30vh'
            }}>
                <motion.h3
                    style={{
                        fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                        fontWeight: '600',
                        marginBottom: '2rem',
                        color: 'var(--color-dark)',
                        letterSpacing: '-0.04em',
                        lineHeight: '1.1'
                    }}
                >
                    {feature.title}
                </motion.h3>

                <TypewriterText text={feature.description} />
            </div>

            <div style={{
                position: 'sticky',
                top: '25vh'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <WindowMockup videoSrc={feature.video} />
                </motion.div>
            </div>
        </div>
    );
};


const AlephSection = () => {
    const { t } = useLanguage();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 968);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const features = [
        {
            id: 'define',
            title: t({ en: "An AI IDE Core", fr: "An AI IDE Core" }),
            description: t({
                en: "xProject's Editor view offers tab autocompletion, natural language code commands, and a configurable, and context-aware agent that understands your entire workspace.",
                fr: "xProject's Editor view offers tab autocompletion, natural language code commands, and a configurable, and context-aware agent."
            }),
            video: "/videos/Videos for Web/It moves your through a process for web.mov"
        },
        {
            id: 'assign',
            title: t({ en: "Higher-level Abstractions", fr: "Higher-level Abstractions" }),
            description: t({
                en: "A more intuitive task-based approach to monitoring agent activity, presenting you with essential artifacts and verification results to build absolute trust in your autonomous systems.",
                fr: "A more intuitive task-based approach to monitoring agent activity, presenting you with essential artifacts and verification results to build trust."
            }),
            video: "/videos/Videos for Web/Minimalistic Intefrace. An Expert Guide for Web.mov"
        },
        {
            id: 'extract',
            title: t({ en: "Cross-surface Agents", fr: "Cross-surface Agents" }),
            description: t({
                en: "Synchronized agentic control across your editor, terminal, and browser for powerful development workflows that bridge the gap between planning and execution.",
                fr: "Synchronized agentic control across your editor, terminal, and browser for powerful development workflows."
            }),
            video: "/videos/Videos for Web/Optional Answers to choose from for web.mov"
        }
    ];

    if (isMobile) {
        return (
            <section style={{ padding: '4rem 5rem', backgroundColor: '#ffffff' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '500', marginBottom: '3rem', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                    {t({
                        en: "xProject Aleph is our agentic development platform, evolving the IDE into the agent-first era.",
                        fr: "xProject Aleph est notre plateforme de développement agentique."
                    })}
                </h2>
                {features.map((feature) => (
                    <div key={feature.id} style={{ marginBottom: '6rem' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>{feature.title}</h3>
                        <p style={{ color: 'var(--color-grey-600)', marginBottom: '2.5rem', lineHeight: '1.6', fontSize: '1.1rem' }}>{feature.description}</p>
                        <WindowMockup videoSrc={feature.video} />
                    </div>
                ))}
            </section>
        );
    }

    return (
        <section style={{ backgroundColor: '#ffffff', overflow: 'hidden', paddingBottom: '10vh' }}>
            <div className="container" style={{ padding: '0 4rem' }}>
                <IconBar />

                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'left', textAlign: 'left', padding: '10vh 0' }}>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 3.5vw, 5rem)',
                        fontWeight: '350',
                        letterSpacing: '-0.02em',
                        color: '#1d1d1f',
                        maxWidth: '1100px'
                    }}>
                        {t({
                            en: "xProject Aleph is our agentic development platform, evolving the IDE into the agent-first era.",
                            fr: "xProject Aleph est notre plateforme de développement agentique, faisant évoluer l'IDE vers l'ère des agents."
                        })}
                    </h2>
                </div>

                <div style={{ marginTop: '10vh' }}>
                    {features.map((feature, index) => (
                        <FeatureItem key={feature.id} feature={feature} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default AlephSection;
