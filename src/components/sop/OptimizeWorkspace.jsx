import React, { useMemo, useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus, ListChecks, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const OptimizeWorkspace = ({ departments = [], data = {}, onUpdate }) => {
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
        inputBg: isDark ? '#202020' : '#fff',
        inputBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
        itemBg: isDark ? '#202020' : '#fafafa',
        itemBorder: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f0f0f0',
        shadow: isDark ? '0 10px 30px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.04)'
    };

    const kpis = data.kpis || [];
    const problems = data.problems || [];

    const [newKpi, setNewKpi] = useState({ name: '', current: '', target: '', unit: '', frequency: 'Monthly' });
    const [newProblem, setNewProblem] = useState({ department: '', responsibility: '', subActivity: '', description: '', impact: 'Medium', owner: '' });

    const departmentOptions = departments.map(d => d.name);

    const getResponsibilities = (deptName) => {
        const dept = departments.find(d => d.name === deptName);
        return dept?.responsibilities || [];
    };

    const getSubActivities = (deptName, responsibility) => {
        const dept = departments.find(d => d.name === deptName);
        return dept?.subActivities?.[responsibility] || [];
    };

    const updateKpis = (next) => onUpdate?.({ kpis: next });
    const updateProblems = (next) => onUpdate?.({ problems: next });

    const handleAddKpi = () => {
        if (!newKpi.name.trim()) return;
        const next = [
            ...kpis,
            {
                id: `kpi-${Date.now()}`,
                name: newKpi.name.trim(),
                current: Number(newKpi.current || 0),
                target: Number(newKpi.target || 0),
                unit: newKpi.unit.trim(),
                frequency: newKpi.frequency,
                trend: 'flat'
            }
        ];
        updateKpis(next);
        setNewKpi({ name: '', current: '', target: '', unit: '', frequency: 'Monthly' });
    };

    const handleUpdateKpi = (id, changes) => {
        const next = kpis.map(kpi => kpi.id === id ? { ...kpi, ...changes } : kpi);
        updateKpis(next);
    };

    const handleRemoveKpi = (id) => {
        updateKpis(kpis.filter(kpi => kpi.id !== id));
    };

    const handleAddProblem = () => {
        if (!newProblem.description.trim()) return;
        const next = [
            ...problems,
            {
                id: `prob-${Date.now()}`,
                ...newProblem,
                description: newProblem.description.trim(),
                status: 'Open',
                resolved: false,
                actions: []
            }
        ];
        updateProblems(next);
        setNewProblem({ department: '', responsibility: '', subActivity: '', description: '', impact: 'Medium', owner: '' });
    };

    const handleUpdateProblem = (id, changes) => {
        const next = problems.map(problem => problem.id === id ? { ...problem, ...changes } : problem);
        updateProblems(next);
    };

    const handleRemoveProblem = (id) => {
        updateProblems(problems.filter(problem => problem.id !== id));
    };

    const groupedPlan = useMemo(() => {
        const groups = {};
        problems.forEach((problem) => {
            const dept = problem.department || 'General';
            const resp = problem.responsibility || 'General';
            const sub = problem.subActivity || 'General';
            groups[dept] = groups[dept] || {};
            groups[dept][resp] = groups[dept][resp] || {};
            groups[dept][resp][sub] = groups[dept][resp][sub] || [];
            groups[dept][resp][sub].push(problem);
        });
        return groups;
    }, [problems]);

    const renderTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp size={16} color="#16a34a" />;
        if (trend === 'down') return <TrendingDown size={16} color="#dc2626" />;
        return <Minus size={16} color={colors.textSecondary} />;
    };

    const inputStyle = {
        padding: '10px 12px',
        borderRadius: '8px',
        border: `1px solid ${colors.inputBorder}`,
        fontSize: '13px',
        backgroundColor: colors.inputBg,
        color: colors.text
    };

    const inlineInputStyle = {
        padding: '6px 8px',
        borderRadius: '8px',
        border: `1px solid ${colors.inputBorder}`,
        fontSize: '12px',
        backgroundColor: colors.inputBg,
        color: colors.text
    };

    const primaryButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 14px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: colors.accent,
        color: colors.accentText,
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer'
    };

    const secondaryButtonStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: '10px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.cardBg,
        color: colors.text,
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer'
    };

    const iconButtonStyle = {
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: '8px',
        color: colors.textMuted
    };

    const checkRowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        color: colors.textSecondary,
        backgroundColor: colors.itemBg,
        padding: '8px 10px',
        borderRadius: '10px',
        border: `1px solid ${colors.itemBorder}`
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Workboard */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: colors.text }}>{t({ en: 'Optimization Workboard', fr: "Tableau d'optimisation" })}</div>
                        <div style={{ fontSize: '13px', color: colors.textSecondary }}>{t({ en: 'List the friction points blocking momentum.', fr: 'Listez les points de friction qui bloquent la progression.' })}</div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '24px',
                    border: `1px solid ${colors.border}`,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    boxShadow: colors.shadow
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <select
                            value={newProblem.department}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, department: e.target.value, responsibility: '', subActivity: '' }))}
                            style={{ ...inputStyle, flex: '1 1 140px' }}
                        >
                            <option value="">{t({ en: 'Department', fr: 'Département' })}</option>
                            {departmentOptions.map((dept) => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <select
                            value={newProblem.responsibility}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, responsibility: e.target.value, subActivity: '' }))}
                            style={{ ...inputStyle, flex: '1 1 140px' }}
                        >
                            <option value="">{t({ en: 'Responsibility', fr: 'Responsabilité' })}</option>
                            {getResponsibilities(newProblem.department).map((resp) => (
                                <option key={resp} value={resp}>{resp}</option>
                            ))}
                        </select>
                        <select
                            value={newProblem.subActivity}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, subActivity: e.target.value }))}
                            style={{ ...inputStyle, flex: '1 1 140px' }}
                        >
                            <option value="">{t({ en: 'Sub-activity', fr: 'Sous-activité' })}</option>
                            {getSubActivities(newProblem.department, newProblem.responsibility).map((sub) => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                        <input
                            placeholder={t({ en: 'Problem description', fr: 'Description du problème' })}
                            value={newProblem.description}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, description: e.target.value }))}
                            style={{ ...inputStyle, flex: '2 1 200px' }}
                        />
                        <select
                            value={newProblem.impact}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, impact: e.target.value }))}
                            style={{ ...inputStyle, flex: '1 1 100px' }}
                        >
                            <option value="Low">{t({ en: 'Low', fr: 'Faible' })}</option>
                            <option value="Medium">{t({ en: 'Medium', fr: 'Moyen' })}</option>
                            <option value="High">{t({ en: 'High', fr: 'Élevé' })}</option>
                        </select>
                        <input
                            placeholder={t({ en: 'Owner', fr: 'Responsable' })}
                            value={newProblem.owner}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, owner: e.target.value }))}
                            style={{ ...inputStyle, flex: '1 1 100px' }}
                        />
                        <button onClick={handleAddProblem} style={{ ...primaryButtonStyle, flex: '0 0 auto', whiteSpace: 'nowrap' }}>
                            <Plus size={16} /> {t({ en: 'Add', fr: 'Ajouter' })}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {problems.map((problem) => (
                            <div key={problem.id} style={{
                                border: `1px solid ${colors.itemBorder}`,
                                borderRadius: '18px',
                                padding: '16px',
                                backgroundColor: colors.itemBg,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <AlertTriangle size={16} color="#dc2626" />
                                        <input
                                            value={problem.description}
                                            onChange={(e) => handleUpdateProblem(problem.id, { description: e.target.value })}
                                            style={{ ...inlineInputStyle, fontWeight: '700', width: '320px', border: 'none', backgroundColor: 'transparent' }}
                                        />
                                    </div>
                                    <button onClick={() => handleRemoveProblem(problem.id)} style={iconButtonStyle}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                                    <select
                                        value={problem.department}
                                        onChange={(e) => handleUpdateProblem(problem.id, { department: e.target.value, responsibility: '', subActivity: '' })}
                                        style={inlineInputStyle}
                                    >
                                        <option value="">{t({ en: 'Department', fr: 'Département' })}</option>
                                        {departmentOptions.map((dept) => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={problem.responsibility}
                                        onChange={(e) => handleUpdateProblem(problem.id, { responsibility: e.target.value, subActivity: '' })}
                                        style={inlineInputStyle}
                                    >
                                        <option value="">{t({ en: 'Responsibility', fr: 'Responsabilité' })}</option>
                                        {getResponsibilities(problem.department).map((resp) => (
                                            <option key={resp} value={resp}>{resp}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={problem.subActivity}
                                        onChange={(e) => handleUpdateProblem(problem.id, { subActivity: e.target.value })}
                                        style={inlineInputStyle}
                                    >
                                        <option value="">{t({ en: 'Sub-activity', fr: 'Sous-activité' })}</option>
                                        {getSubActivities(problem.department, problem.responsibility).map((sub) => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={problem.impact}
                                        onChange={(e) => handleUpdateProblem(problem.id, { impact: e.target.value })}
                                        style={inlineInputStyle}
                                    >
                                        <option value="Low">{t({ en: 'Low', fr: 'Faible' })}</option>
                                        <option value="Medium">{t({ en: 'Medium', fr: 'Moyen' })}</option>
                                        <option value="High">{t({ en: 'High', fr: 'Élevé' })}</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        placeholder={t({ en: 'Owner', fr: 'Responsable' })}
                                        value={problem.owner || ''}
                                        onChange={(e) => handleUpdateProblem(problem.id, { owner: e.target.value })}
                                        style={inlineInputStyle}
                                    />
                                    <select
                                        value={problem.status || 'Open'}
                                        onChange={(e) => handleUpdateProblem(problem.id, { status: e.target.value })}
                                        style={inlineInputStyle}
                                    >
                                        <option value="Open">{t({ en: 'Open', fr: 'Ouvert' })}</option>
                                        <option value="In Progress">{t({ en: 'In Progress', fr: 'En cours' })}</option>
                                        <option value="Resolved">{t({ en: 'Resolved', fr: 'Résolu' })}</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(problem.actions || []).map((action) => (
                                        <div key={action.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input
                                                type="checkbox"
                                                checked={action.done}
                                                onChange={(e) => {
                                                    const updatedActions = (problem.actions || []).map(a => a.id === action.id ? { ...a, done: e.target.checked } : a);
                                                    handleUpdateProblem(problem.id, { actions: updatedActions });
                                                }}
                                            />
                                            <input
                                                value={action.text}
                                                onChange={(e) => {
                                                    const updatedActions = (problem.actions || []).map(a => a.id === action.id ? { ...a, text: e.target.value } : a);
                                                    handleUpdateProblem(problem.id, { actions: updatedActions });
                                                }}
                                                style={{ ...inlineInputStyle, flex: 1 }}
                                            />
                                            <button
                                                onClick={() => {
                                                    const updatedActions = (problem.actions || []).filter(a => a.id !== action.id);
                                                    handleUpdateProblem(problem.id, { actions: updatedActions });
                                                }}
                                                style={iconButtonStyle}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            const updatedActions = [...(problem.actions || []), { id: `act-${Date.now()}`, text: '', done: false }];
                                            handleUpdateProblem(problem.id, { actions: updatedActions });
                                        }}
                                        style={{ ...secondaryButtonStyle, alignSelf: 'flex-start' }}
                                    >
                                        <Plus size={14} /> {t({ en: 'Add Solution', fr: 'Ajouter une solution' })}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {problems.length === 0 && (
                            <div style={{ padding: '24px', border: `1px dashed ${colors.border}`, borderRadius: '18px', color: colors.textMuted, fontSize: '13px' }}>
                                {t({ en: 'List your first optimization issue to generate an action plan.', fr: "Listez votre premier problème d'optimisation pour générer un plan d'action." })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Optimization Action Plan */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <ListChecks size={20} color={colors.text} />
                    <div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: colors.text }}>{t({ en: 'Optimization Action Plan', fr: "Plan d'action d'optimisation" })}</div>
                        <div style={{ fontSize: '13px', color: colors.textSecondary }}>{t({ en: 'Execute fixes by department, responsibility, and sub-activity.', fr: "Exécutez les corrections par département, responsabilité et sous-activité." })}</div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Object.keys(groupedPlan).length === 0 && (
                        <div style={{ padding: '24px', border: `1px dashed ${colors.border}`, borderRadius: '18px', color: colors.textMuted, fontSize: '13px' }}>
                            {t({ en: 'Add problems to populate the optimization checklist.', fr: "Ajoutez des problèmes pour alimenter la checklist d'optimisation." })}
                        </div>
                    )}

                    {Object.entries(groupedPlan).map(([dept, resps]) => (
                        <div key={dept} style={{ border: `1px solid ${colors.border}`, borderRadius: '24px', padding: '20px', backgroundColor: colors.cardBg, boxShadow: colors.shadow }}>
                            <div style={{ fontSize: '14px', fontWeight: '800', color: colors.text, marginBottom: '12px' }}>
                                {dept === 'General' ? t({ en: 'General', fr: 'Général' }) : dept}
                            </div>
                            {Object.entries(resps).map(([resp, subs]) => (
                                <div key={resp} style={{ marginBottom: '16px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: '700', color: colors.text, marginBottom: '8px' }}>
                                        {resp === 'General' ? t({ en: 'General', fr: 'Général' }) : resp}
                                    </div>
                                    {Object.entries(subs).map(([sub, probList]) => (
                                        <div key={sub} style={{ marginLeft: '12px', marginBottom: '12px' }}>
                                            <div style={{ fontSize: '12px', fontWeight: '600', color: colors.textSecondary, marginBottom: '6px' }}>
                                                {sub === 'General' ? t({ en: 'General', fr: 'Général' }) : sub}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {probList.map((problem) => {
                                                    if (problem.actions && problem.actions.length > 0) {
                                                        return problem.actions.map((action) => (
                                                            <label key={action.id} style={{ ...checkRowStyle, color: colors.text }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={action.done}
                                                                    onChange={(e) => {
                                                                        const updatedActions = problem.actions.map(a => a.id === action.id ? { ...a, done: e.target.checked } : a);
                                                                        handleUpdateProblem(problem.id, { actions: updatedActions });
                                                                    }}
                                                                />
                                                                <span>{action.text || problem.description}</span>
                                                            </label>
                                                        ));
                                                    }
                                                    return (
                                                        <label key={problem.id} style={{ ...checkRowStyle, color: colors.text }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={problem.resolved}
                                                                onChange={(e) => handleUpdateProblem(problem.id, { resolved: e.target.checked })}
                                                            />
                                                            <span>{problem.description}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default OptimizeWorkspace;

