import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * A premium Typewriter component that reveals text in chunks
 * for a smoother, faster, and more "streaming" feel.
 */
const Typewriter = ({ text, speed = 1, onComplete, render }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayedText('');
        setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                // Reveal text in chunks for a more organic, faster feel
                // If text is short, character by character
                // If text is long, reveals up to 8 characters at a time
                const increment = text.length > 100 ? Math.ceil(text.length / 40) : 2;
                const nextIndex = Math.min(currentIndex + increment, text.length);

                setDisplayedText(text.substring(0, nextIndex));
                setCurrentIndex(nextIndex);
            }, speed);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    const content = render ? render(displayedText) : (
        <span style={{ fontFamily: 'inherit' }}>{displayedText}</span>
    );

    return (
        <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'relative' }}
        >
            {content}
            {currentIndex < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '1.2em',
                        backgroundColor: '#000',
                        marginLeft: '2px',
                        verticalAlign: 'middle'
                    }}
                />
            )}
        </motion.div>
    );
};

export default Typewriter;
