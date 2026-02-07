import React, { useEffect, useMemo, useRef } from 'react';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const IntegrateActionPlan = ({ departments = [], plan = {}, onPlanChange, onComplete }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const colors = {
        bg: isDark ? '#191919' : '#fff',
        cardBg: isDark ? '#262626' : '#fff',
        text: isDark ? '#FFFFFF' : '#111',
        textSecondary: isDark ? '#A1A1AA' : '#666',
        textMuted: isDark ? '#71717A' : '#999',
        border: isDark ? 'rgba(255, 255, 255, 0.1)' : '#eee',
        borderStrong: isDark ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0',
        accent: isDark ? '#fff' : '#111',
        accentText: isDark ? '#000' : '#fff',
        progressBar: isDark ? '#333' : '#f3f4f6',
        itemBg: isDark ? '#202020' : '#fafafa',
        itemBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f0f0f0',
        shadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.04)'
    };

    const integrateSteps = [
        {
            id: 'leader',
            title: t({ en: 'Identify who’s leading the charge', fr: 'Identifier qui mène la charge' }),
            description: t({ en: 'Assign the owner who will drive SYSTEMology inside this department.', fr: 'Assignez le responsable qui pilotera la SYSTEMology dans ce département.' })
        },
        {
            id: 'benefits',
            title: t({ en: 'Know your selling points', fr: 'Connaître vos points forts' }),
            description: t({ en: 'List the benefits that matter to this team and use them often.', fr: 'Listez les bénéfices qui comptent pour cette équipe et utilisez-les souvent.' })
        },
        {
            id: 'introduce',
            title: t({ en: 'Introduce SYSTEMology to the team', fr: 'Introduire la SYSTEMology à l’équipe' }),
            description: t({ en: 'Walk through the CCF and DRTC, invite questions, and secure buy-in.', fr: 'Passez en revue le CCF et le DRTC, invitez aux questions et obtenez l’adhésion.' })
        },
        {
            id: 'extract',
            title: t({ en: 'Start the extraction process', fr: "Démarrer le processus d'extraction" }),
            description: t({ en: 'Schedule recordings and keep it a two-person job.', fr: 'Planifiez les enregistrements et gardez un binôme.' })
        },
        {
            id: 'software',
            title: t({ en: 'Introduce your software', fr: 'Introduire vos logiciels' }),
            description: t({ en: 'Link systems directly inside project tasks and train the habit.', fr: 'Reliez les systèmes directement dans les tâches et installez l’habitude.' })
        },
        {
            id: 'manage',
            title: t({ en: 'Manage via the systems', fr: 'Manager via les systèmes' }),
            description: t({ en: 'Require teams to reference systems before asking for help.', fr: 'Exigez que les équipes consultent les systèmes avant de demander de l’aide.' })
        },
        {
            id: 'resistance',
            title: t({ en: 'Identify resistance and meet it head-on', fr: 'Identifier les résistances et les traiter' }),
            description: t({ en: 'Handle blockers with clarity and accountability.', fr: 'Traitez les blocages avec clarté et responsabilité.' })
        },
        {
            id: 'culture',
            title: t({ en: 'Build systems-thinking culture', fr: 'Construire une culture orientée systèmes' }),
            description: t({ en: 'Celebrate process discipline and reinforce it in hiring.', fr: 'Célébrez la discipline des processus et renforcez-la dans le recrutement.' })
        }
    ];

    const allComplete = useMemo(() => {
        if (!departments.length) return false;
        return departments.every((dept) => {
            const steps = plan?.[dept]?.steps || {};
            return integrateSteps.every(step => steps[step.id]);
        });
    }, [departments, integrateSteps, plan]);

    const wasComplete = useRef(false);

    useEffect(() => {
        if (allComplete && !wasComplete.current) {
            wasComplete.current = true;
            onComplete?.();
        }
        if (!allComplete) {
            wasComplete.current = false;
        }
    }, [allComplete, onComplete]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
                borderRadius: '20px',
                padding: '20px 24px',
                boxShadow: colors.shadow
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        backgroundColor: colors.accent,
                        color: colors.accentText,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: colors.text }}>{t({ en: 'Integrate Action Plan', fr: "Plan d'action d'intégration" })}</div>
                        <div style={{ fontSize: '13px', color: colors.textSecondary }}>
                            {t({ en: 'Drive adoption and accountability across every department.', fr: "Assurez l'adoption et la responsabilité dans chaque département." })}
                        </div>
                    </div>
                </div>
                <div style={{
                    padding: '10px 16px',
                    borderRadius: '999px',
                    backgroundColor: allComplete ? colors.accent : (isDark ? '#333' : '#f3f4f6'),
                    color: allComplete ? colors.accentText : colors.text,
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {allComplete ? t({ en: 'COMPLETE', fr: 'TERMINÉ' }) : t({ en: 'IN PROGRESS', fr: 'EN COURS' })}
                    <ArrowRight size={14} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {departments.map((dept) => {
                    const steps = plan?.[dept]?.steps || {};
                    const total = integrateSteps.length;
                    const done = integrateSteps.filter(step => steps[step.id]).length;
                    const progress = Math.round((done / total) * 100);

                    return (
                        <div key={dept} style={{
                            backgroundColor: colors.cardBg,
                            borderRadius: '24px',
                            border: `1px solid ${colors.border}`,
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '18px',
                            boxShadow: colors.shadow
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.08em', color: colors.textMuted }}>{t({ en: 'DEPARTMENT', fr: 'DÉPARTEMENT' })}</div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: colors.text }}>{dept}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '11px', color: colors.textMuted, fontWeight: '700' }}>{t({ en: 'PROGRESS', fr: 'PROGRÈS' })}</div>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: colors.text }}>{progress}%</div>
                                </div>
                            </div>

                            <div style={{ height: '6px', backgroundColor: colors.progressBar, borderRadius: '999px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    style={{ height: '100%', backgroundColor: colors.accent }}
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {integrateSteps.map((step) => {
                                    const checked = !!steps[step.id];
                                    return (
                                        <div
                                            key={step.id}
                                            onClick={() => onPlanChange?.(dept, { ...steps, [step.id]: !checked })}
                                            style={{
                                                display: 'flex',
                                                gap: '12px',
                                                alignItems: 'flex-start',
                                                cursor: 'pointer',
                                                padding: '10px 12px',
                                                borderRadius: '12px',
                                                border: checked ? `1px solid ${colors.accent}` : `1px solid ${colors.itemBorder}`,
                                                backgroundColor: checked ? (isDark ? 'rgba(255, 255, 255, 0.05)' : '#fff') : colors.itemBg
                                            }}
                                        >
                                            {checked ? (
                                                <CheckCircle2 size={20} color={colors.accent} />
                                            ) : (
                                                <Circle size={20} color={isDark ? '#444' : '#c9c9c9'} />
                                            )}
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: colors.text }}>{step.title}</div>
                                                <div style={{ fontSize: '12px', color: colors.textSecondary, lineHeight: '1.4' }}>{step.description}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IntegrateActionPlan;

