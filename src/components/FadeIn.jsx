import React, { useRef, useEffect, useState } from 'react';

const FadeIn = ({
    children,
    delay = 0,
    direction = 'up',
    distance = 20,
    duration = 0.6,
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            });
        }, { threshold, rootMargin });

        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [threshold]);

    const getTransform = () => {
        if (!isVisible) {
            switch (direction) {
                case 'up': return `translateY(${distance}px)`;
                case 'down': return `translateY(-${distance}px)`;
                case 'left': return `translateX(${distance}px)`;
                case 'right': return `translateX(-${distance}px)`;
                default: return `translateY(${distance}px)`;
            }
        }
        return 'translate(0, 0)';
    };

    return (
        <div
            ref={domRef}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
};

export default FadeIn;
