import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Plus, X } from 'lucide-react';

const StoryChat = () => {
    const { t } = useLanguage();
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const faqs = [
        {
            question: t({
                en: "What Problem hiro Aleph 1 is solving?",
                fr: "Quel problème hiro Aleph 1 résout-il ?"
            }),
            answer: t({
                en: "SMEs in Morocco represent 95% of businesses but only contribute 22% to the GDP. This massive gap is caused by the \"founder-dependency trap\"—a centralized management style where the business owner remains the primary operational bottleneck. Without documented systems and processes, these businesses can't scale beyond the founder's personal capacity. hiro helps founders break free by building systems that enable their teams to operate independently.",
                fr: "Les PME au Maroc représentent 95 % des entreprises, mais ne contribuent qu’à 22 % du PIB. Cet écart massif est causé par le « piège de la dépendance au fondateur » — un style de gestion centralisé où le propriétaire de l'entreprise reste le principal goulot d'étranglement opérationnel. Sans systèmes et processus documentés, ces entreprises ne peuvent pas évoluer au-delà de la capacité personnelle du fondateur. hiro aide les fondateurs à se libérer en construisant des systèmes qui permettent à leurs équipes de fonctionner de manière indépendante."
            })
        },
        {
            question: t({
                en: "What exactly is hiro?",
                fr: "Qu'est-ce que hiro exactement ?"
            }),
            answer: t({
                en: "hiro is where founders build systems, solve real problems, set and achieve business goals. It's the platform that turns chaos into scale. We guide you through creating comprehensive Standard Operating Procedures (SOPs) that capture your business knowledge and enable your team to execute without constant oversight.",
                fr: "hiro est l'endroit où les fondateurs construisent des systèmes, résolvent de vrais problèmes, fixent et atteignent des objectifs commerciaux. C'est la plateforme qui transforme le chaos en croissance. Nous vous guidons dans la création de procédures opérationnelles standard (SOP) complètes qui capturent vos connaissances commerciales et permettent à votre équipe d'exécuter sans supervision constante."
            })
        },
        {
            question: t({
                en: "How does hiro help me build systems for my business?",
                fr: "Comment hiro m'aide-t-il à construire des systèmes pour mon entreprise ?"
            }),
            answer: t({
                en: "hiro uses AI to guide you through a structured process of documenting your operations. Instead of staring at a blank page, our platform asks the right questions to extract your knowledge, helps you organize it into clear systems, and ensures nothing critical is missed. You'll transform tribal knowledge into repeatable processes that anyone on your team can follow.",
                fr: "hiro utilise l'IA pour vous guider à travers un processus structuré de documentation de vos opérations. Au lieu de fixer une page blanche, notre plateforme pose les bonnes questions pour extraire vos connaissances, vous aide à les organiser en systèmes clairs et garantit qu'aucun élément critique n'est manqué. Vous transformerez les connaissances tribales en processus reproductibles que n'importe qui dans votre équipe peut suivre."
            })
        },
        {
            question: t({
                en: "What kind of real problems can hiro help me solve?",
                fr: "Quel type de problèmes réels hiro peut-il m'aider à résoudre ?"
            }),
            answer: t({
                en: "hiro tackles the core operational challenges that hold SMEs back: inconsistent quality, team members who don't know what to do, constant firefighting, inability to delegate, and the feeling that you're the only one who can do things right. By building clear systems, you solve these problems at their root—creating clarity, consistency, and capability across your organization.",
                fr: "hiro s'attaque aux principaux défis opérationnels qui freinent les PME : qualité incohérente, membres de l'équipe qui ne savent pas quoi faire, lutte constante contre les incendies, incapacité à déléguer et sentiment que vous êtes le seul à pouvoir bien faire les choses. En construisant des systèmes clairs, vous résolvez ces problèmes à la racine — créant clarté, cohérence et capacité dans toute votre organisation."
            })
        },
        {
            question: t({
                en: "How does hiro help me set and achieve business goals?",
                fr: "Comment hiro m'aide-t-il à fixer et atteindre des objectifs commerciaux ?"
            }),
            answer: t({
                en: "You can't scale what you can't systematize. hiro helps you define clear business goals and then builds the operational foundation to achieve them. Whether you want to double revenue, expand to new markets, or finally take a vacation without your phone ringing constantly, we help you create the systems that make those goals achievable—not just aspirational.",
                fr: "Vous ne pouvez pas faire évoluer ce que vous ne pouvez pas systématiser. hiro vous aide à définir des objectifs commerciaux clairs, puis construit la base opérationnelle pour les atteindre. Que vous souhaitiez doubler vos revenus, vous développer sur de nouveaux marchés ou enfin prendre des vacances sans que votre téléphone sonne constamment, nous vous aidons à créer les systèmes qui rendent ces objectifs réalisables — pas seulement aspirationnels."
            })
        },
        {
            question: t({
                en: "How does hiro turn chaos into scale?",
                fr: "Comment hiro transforme-t-il le chaos en croissance ?"
            }),
            answer: t({
                en: "Chaos exists when knowledge lives only in people's heads and every situation requires custom problem-solving. Scale happens when you have documented systems that work consistently. hiro transforms chaos into scale by helping you capture what works, standardize it, and make it repeatable. The result? Your business can grow without you becoming the bottleneck.",
                fr: "Le chaos existe lorsque les connaissances ne vivent que dans la tête des gens et que chaque situation nécessite une résolution de problèmes personnalisée. La croissance se produit lorsque vous avez des systèmes documentés qui fonctionnent de manière cohérente. hiro transforme le chaos en croissance en vous aidant à capturer ce qui fonctionne, à le standardiser et à le rendre reproductible. Le résultat ? Votre entreprise peut croître sans que vous ne deveniez le goulot d'étranglement."
            })
        }
    ];

    const toggleQuestion = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section style={{
            padding: isMobile ? '3rem 1.5rem' : '1rem 15rem',
            backgroundColor: 'var(--color-bg-base)',
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{
                maxWidth: '1350px',
                margin: '0 auto',
                padding: isMobile ? '0 1.5rem' : '0 2rem'
            }}>
                {/* Heading */}
                <h2 style={{
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    fontWeight: '700',
                    color: 'var(--color-text-main)',
                    marginBottom: isMobile ? '2rem' : '3rem',
                    letterSpacing: '-0.02em'
                }}>
                    {t({ en: "Questions & answers", fr: "Questions & réponses" })}
                </h2>

                {/* FAQ Items */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            style={{
                                borderTop: 'var(--border-notion)',
                                paddingTop: isMobile ? '1.5rem' : '1rem',
                                paddingBottom: isMobile ? '1.5rem' : '1rem'
                            }}
                        >
                            {/* Question */}
                            <button
                                onClick={() => toggleQuestion(index)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: isMobile ? '1rem' : '1.125rem',
                                    fontWeight: '500',
                                    color: 'var(--color-text-main)',
                                    lineHeight: '1.5'
                                }}
                            >
                                <span style={{ flex: 1 }}>{faq.question}</span>
                                <span style={{
                                    flexShrink: 0,
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-text-muted)',
                                    transition: 'transform 0.2s ease'
                                }}>
                                    {expandedIndex === index ? (
                                        <X size={20} />
                                    ) : (
                                        <Plus size={20} />
                                    )}
                                </span>
                            </button>

                            {/* Answer */}
                            <AnimatePresence>
                                {expandedIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            paddingTop: '1rem',
                                            paddingRight: isMobile ? '0' : '2.5rem',
                                            fontSize: isMobile ? '0.9375rem' : '1rem',
                                            lineHeight: '1.6',
                                            color: 'var(--color-text-muted)'
                                        }}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StoryChat;
