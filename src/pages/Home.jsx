import React from 'react';
import Hero from '../components/Hero';
import HowToUse from '../components/HowToUse';
import Truths from '../components/Truths';
import Framework from '../components/Framework';
import AlephSection from '../components/AlephSection';
import StoryChat from '../components/StoryChat';
import StrictFilter from '../components/StrictFilter';
import DonationSection from '../components/DonationSection';
import ResourceSection from '../components/ResourceSection';
import CTA from '../components/CTA';

const Home = () => {
    return (
        <main>
            <Hero />
            <HowToUse />
            <AlephSection />
            <StoryChat />
            <DonationSection />
            <ResourceSection />
        </main>
    );
};

export default Home;
