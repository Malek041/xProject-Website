import React from 'react';
import FadeIn from './FadeIn';

const HeroTransition = () => {
    const transitionImage = "/images/hero_transition_hq.png";

    return (
        <section style={{
            padding: '4rem 0',
            backgroundColor: 'var(--color-surface)'
        }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <FadeIn>
                    <div style={{
                        borderRadius: '2.5rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.08)',
                        backgroundColor: '#000' // Matches the image background for a seamless look
                    }}>
                        <img
                            src={transitionImage}
                            alt="Before vs With xProject"
                            style={{
                                width: '100%',
                                display: 'block'
                            }}
                        />
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default HeroTransition;
