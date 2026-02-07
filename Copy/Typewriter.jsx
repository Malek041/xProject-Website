import React, { useState, useEffect } from 'react';

const TypewriterInner = ({ text, speed = 30, delay = 0, className, style, startDelay = 0 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setHasStarted(true);
        }, startDelay);

        return () => clearTimeout(startTimeout);
    }, [startDelay]);

    useEffect(() => {
        if (!hasStarted) return;

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed, hasStarted]);

    return (
        <span className={className} style={style}>
            {displayedText}
        </span>
    );
};

const Typewriter = (props) => {
    // Using key={props.text} forces the component to remount when text changes,
    // ensuring clean state reset and no ghost text from previous language.
    return <TypewriterInner key={props.text} {...props} />;
};

export default Typewriter;
