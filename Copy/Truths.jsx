import React from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';
import Typewriter from './Typewriter';
import { useLanguage } from '../context/LanguageContext';

const Truths = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <section style={{ paddingTop: '8rem', paddingBottom: '0', backgroundColor: 'var(--color-surface)', color: 'var(--color-dark)' }}>
            <div className="container">
                {/* Massive Headline */}
                <FadeIn>
                    <h2 style={{
                        fontSize: 'clamp(20rem, 10vw, 8rem)',
                        lineHeight: '1.05',
                        fontWeight: '400',
                        marginBottom: '1rem',
                        maxWidth: '1200px',
                        textAlign: 'Left'
                    }}>
                        {t({
                            en: <><Typewriter text="xProject Aleph 1" speed={30} /></>,
                            fr: <><Typewriter text="xProject Aleph 1" speed={30} /></>
                        })}
                    </h2>
                </FadeIn>
            </div>
        </section>
    );
};

export default Truths;
