import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Typewriter from './Typewriter';

const StoryChat = () => {
    const { t } = useLanguage();
    const [visibleCount, setVisibleCount] = useState(0);
    const containerRef = useRef(null);
    const sectionRef = useRef(null);

    const storyData = [
        { type: 'user', content: t({ en: "How did xProject start?", fr: "Comment xProject a-t-il commencé ?" }) },
        {
            type: 'bot',
            title: t({ en: "The Realization", fr: "La Prise de Conscience" }),
            content: t({
                en: "It started with a simple realization: Most founders aren't building businesses—they're building high-stress jobs for themselves.",
                fr: "Tout a commencé par un constat simple : la plupart des fondateurs ne bâtissent pas des entreprises, ils se créent des emplois très stressants."
            })
        },
        { type: 'user', content: t({ en: "What do you mean by that?", fr: "Qu'est-ce que tu veux dire par là ?" }) },
        {
            type: 'bot',
            title: t({ en: "The Trap", fr: "Le Piège" }),
            content: t({
                en: "If you, the founder, leave for a month and the business stops... you have 'Owner Dependency'. You are the bottleneck.",
                fr: "Si vous, le fondateur, partez pendant un mois et que l'entreprise s'arrête... vous avez une 'dépendance au propriétaire'. Vous êtes le goulot d'étranglement."
            })
        },
        { type: 'user', content: t({ en: "So how does xProject solve this?", fr: "Alors comment xProject résout-il cela ?" }) },
        {
            type: 'bot',
            title: t({ en: "The Solution", fr: "La Solution" }),
            content: t({
                en: "We developed a 6-phase framework to extract knowledge from your head and turn it into repeatable systems. We build the infrastructure that lets you scale—and finally be free.",
                fr: "Nous avons développé un cadre en 6 phases pour extraire les connaissances de votre tête et les transformer en systèmes reproductibles. Nous construisons l'infrastructure qui vous permet de scaler—et d'être enfin libre."
            })
        }
    ];

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const nextCount = Math.min(storyData.length, Math.floor(latest * (storyData.length + 1)));
        if (nextCount !== visibleCount) {
            setVisibleCount(nextCount);
        }
    });

    const messages = storyData.slice(0, visibleCount);

    useEffect(() => {
        if (containerRef.current) {
            const { scrollHeight, clientHeight } = containerRef.current;
            if (scrollHeight > clientHeight) {
                containerRef.current.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [visibleCount]);

    return (
        <section
            ref={sectionRef}
            style={{
                height: '400vh',
                backgroundColor: '#ffffff',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{
                position: 'sticky',
                top: '0',
                left: 0,
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'hidden',
                backgroundColor: '#ffffff'
            }}>
                <div className="container" style={{ maxWidth: '1500px', width: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{
                            fontSize: 'clamp(10rem, 20vw, 20rem)',
                            fontWeight: '400',
                            marginBottom: '1rem',
                            color: '#1d1d1f',
                            letterSpacing: '-0.02em'
                        }}>
                            {t({ en: "Our Story", fr: "Notre Histoire" })}
                        </h2>
                    </div>

                    <motion.div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '2.5rem',
                            padding: '3rem',
                            height: '65vh',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2.5rem',
                            position: 'relative',
                            overflowY: 'auto',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                        ref={containerRef}
                    >
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        damping: 20,
                                        stiffness: 100
                                    }}
                                    style={{
                                        alignSelf: msg.type === 'bot' ? 'flex-start' : 'flex-end',
                                        maxWidth: '85%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.4rem'
                                    }}
                                >
                                    {msg.type === 'bot' && msg.title && (
                                        <div style={{
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            color: '#86868b',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            marginLeft: '1.5rem'
                                        }}>
                                            {msg.title}
                                        </div>
                                    )}
                                    <div style={{
                                        backgroundColor: msg.type === 'bot' ? 'transparent' : '#f5f5f7',
                                        color: '#1d1d1f',
                                        padding: msg.type === 'bot' ? '0 1rem' : '1.25rem 2rem',
                                        borderRadius: '1.5rem',
                                        fontSize: msg.type === 'bot' ? '2.25rem' : '1.1rem',
                                        lineHeight: msg.type === 'bot' ? '1.2' : '1.5',
                                        fontWeight: msg.type === 'bot' ? '400' : '400',
                                        textAlign: msg.type === 'user' ? 'right' : 'left',
                                        letterSpacing: msg.type === 'bot' ? '-0.02em' : 'normal'
                                    }}>
                                        {msg.type === 'bot' ? (
                                            <Typewriter text={msg.content} speed={20} />
                                        ) : (
                                            msg.content
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};


export default StoryChat;
