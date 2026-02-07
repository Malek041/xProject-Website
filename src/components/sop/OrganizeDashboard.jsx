import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Folder,
    FileText,
    Plus,
    Search,
    Settings,
    ChevronRight,
    ChevronDown,
    Video,
    File,
    Type,
    Trash2,
    CheckCircle2,
    Layout,
    ArrowLeft
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

import { useTheme } from '../../context/ThemeContext';

const OrganizeDashboard = ({ data, onUpdate, onStartIntegrate }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const colors = {
        bg: isDark ? '#262626' : '#fff',
        bgSecondary: isDark ? '#202020' : '#f9fafb',
        bgTertiary: isDark ? '#333' : '#f3f4f6',
        text: isDark ? '#FFFFFF' : '#111827',
        textSecondary: isDark ? '#9B9A97' : '#6b7280',
        border: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb',
        activeItem: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
        inputBg: isDark ? '#333' : '#fff'
    };
    const { t } = useLanguage();
    const departments = data.departments?.map(d => d.name) || [];
    const [activeDept, setActiveDept] = useState(departments[0] || 'General');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSystemId, setSelectedSystemId] = useState(null);

    const systemsLibrary = data.systemLibrary || [];
    const systems = systemsLibrary.filter(item => {
        const matchDept = item.department === activeDept;
        const matchSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchDept && matchSearch;
    });

    const selectedSystem = useMemo(
        () => systemsLibrary.find(sys => sys.id === selectedSystemId),
        [systemsLibrary, selectedSystemId]
    );

    const handleSelectSystem = (system) => {
        setSelectedSystemId(system.id);
    };

    useEffect(() => {
        if (!departments.includes(activeDept)) {
            setActiveDept(departments[0] || 'General');
        }
    }, [departments, activeDept]);

    const handleBackToDashboard = () => {
        setSelectedSystemId(null);
    };

    const handleCreateSystem = () => {
        const newSystem = {
            id: `sys-${Date.now()}`,
            title: t({ en: 'New System', fr: 'Nouveau système' }),
            department: activeDept,
            responsibility: '',
            subActivity: '',
            owner: '',
            method: '',
            standard: '',
            status: 'Draft',
            updatedAt: new Date().toISOString(),
            overview: '',
            goal: '',
            trigger: '',
            inputs: [],
            steps: [],
            tools: [],
            media: [],
            resources: []
        };
        const next = [...systemsLibrary, newSystem];
        onUpdate?.(next);
        setSelectedSystemId(newSystem.id);
    };

    const handleSaveSystem = (updatedSystem) => {
        const next = systemsLibrary.map(sys => sys.id === updatedSystem.id ? updatedSystem : sys);
        onUpdate?.(next);
    };

    const handleDeleteSystem = (systemId) => {
        const next = systemsLibrary.filter(sys => sys.id !== systemId);
        onUpdate?.(next);
        setSelectedSystemId(null);
    };

    return (
        <div style={{
            display: 'flex',
            height: '85vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: colors.bgSecondary,
            borderRadius: '16px',
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
            {/* Sidebar */}
            <div style={{
                width: '260px',
                backgroundColor: colors.bg,
                borderRight: `1px solid ${colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 16px'
            }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: colors.text, marginBottom: '32px', paddingLeft: '12px' }}>
                    SystemHUB
                </div>

                <button onClick={handleCreateSystem} style={{
                    backgroundColor: '#111827',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '32px',
                    cursor: 'pointer'
                }}>
                    <Plus size={18} /> {t({ en: 'New System', fr: 'Nouveau système' })}
                </button>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '12px', paddingLeft: '12px', textTransform: 'uppercase' }}>
                        {t({ en: 'Departments', fr: 'Départements' })}
                    </div>
                    {departments.map(dept => (
                        <div
                            key={dept}
                            onClick={() => { setActiveDept(dept); setSelectedSystemId(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: activeDept === dept ? colors.activeItem : 'transparent',
                                color: activeDept === dept ? colors.text : colors.textSecondary,
                                marginBottom: '4px',
                                fontSize: '14px',
                                fontWeight: activeDept === dept ? '600' : '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Folder size={18} fill={activeDept === dept ? '#9ca3af' : 'none'} />
                            {dept}
                        </div>
                    ))}
                </div>


            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: colors.bg }}>
                {selectedSystem ? (
                    <SystemEditor
                        system={selectedSystem}
                        onBack={handleBackToDashboard}
                        onSave={handleSaveSystem}
                        onDelete={handleDeleteSystem}
                        departments={data.departments || []}
                        colors={colors}
                    />
                ) : (
                    <>
                        {/* Dashboard Header */}
                        <div style={{
                            padding: '24px 32px',
                            borderBottom: `1px solid ${colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: colors.text, margin: 0 }}>
                                    {activeDept === 'General' ? t({ en: 'General', fr: 'Général' }) : activeDept}
                                </h1>
                                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                                    {t({ en: 'Manage your systems and processes', fr: 'Gérez vos systèmes et processus' })}
                                </div>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    placeholder={t({ en: 'Search systems...', fr: 'Rechercher des systèmes...' })}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '10px 16px 10px 40px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        fontSize: '14px',
                                        width: '280px',
                                        outline: 'none',
                                        backgroundColor: colors.bgSecondary,
                                        color: colors.text
                                    }}
                                />
                            </div>
                        </div>

                        {/* Systems List */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            <div style={{ backgroundColor: colors.bg, borderRadius: '12px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
                                {/* Table Header */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '100px 2fr 1fr 1fr 1fr',
                                    padding: '16px 24px',
                                    backgroundColor: colors.bgSecondary,
                                    borderBottom: `1px solid ${colors.border}`,
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: colors.textSecondary,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    <div>{t({ en: 'State', fr: 'État' })}</div>
                                    <div>{t({ en: 'Title', fr: 'Titre' })}</div>
                                    <div>{t({ en: 'Owner', fr: 'Responsable' })}</div>
                                    <div>{t({ en: 'Updated', fr: 'Mis à jour' })}</div>
                                    <div>{t({ en: 'Path', fr: 'Chemin' })}</div>
                                </div>

                                {/* Items */}
                                {systems.length > 0 ? (
                                    systems.map((sys, idx) => (
                                        <motion.div
                                            key={sys.id || idx}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => handleSelectSystem(sys)}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '100px 2fr 1fr 1fr 1fr',
                                                padding: '16px 24px',
                                                borderBottom: idx === systems.length - 1 ? 'none' : `1px solid ${colors.border}`,
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                alignItems: 'center',
                                                transition: 'background-color 0.2s',
                                                color: colors.text
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgSecondary}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5',
                                                    color: isDark ? '#34d399' : '#059669',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    border: isDark ? '1px solid rgba(52, 211, 153, 0.2)' : 'none'
                                                }}>
                                                    {t({ en: 'ACTIVE', fr: 'ACTIF' })}
                                                </span>
                                            </div>
                                            <div style={{ fontWeight: '600', color: colors.text }}>{sys.title}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: colors.text }}>
                                                    {(sys.owner || 'U').charAt(0)}
                                                </div>
                                                <span style={{ color: colors.textSecondary }}>{sys.owner || t({ en: 'Unassigned', fr: 'Non assigné' })}</span>
                                            </div>
                                            <div style={{ color: colors.textSecondary, fontSize: '13px' }}>{t({ en: 'Today', fr: "Aujourd'hui" })}</div>
                                            <div style={{ color: colors.textSecondary, fontSize: '13px', fontStyle: 'italic', opacity: 0.8 }}>
                                                {sys.responsibility || '—'}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
                                        <Folder size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                        <div style={{ fontWeight: '500' }}>{t({ en: 'No systems found', fr: 'Aucun système trouvé' })}</div>
                                        <div style={{ fontSize: '13px' }}>
                                            {t({ en: 'Select a different department or create a new system', fr: 'Sélectionnez un autre département ou créez un nouveau système' })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const SystemEditor = ({ system, onBack, onSave, onDelete, departments, colors }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [form, setForm] = useState(() => ({
        ...system,
        inputsText: (system.inputs || []).join('\n'),
        stepsText: (system.steps || []).join('\n'),
        toolsText: (system.tools || []).join('\n'),
        mediaText: (system.media || []).join('\n'),
        resourcesText: (system.resources || []).join('\n')
    }));

    useEffect(() => {
        setForm({
            ...system,
            inputsText: (system.inputs || []).join('\n'),
            stepsText: (system.steps || []).join('\n'),
            toolsText: (system.tools || []).join('\n'),
            mediaText: (system.media || []).join('\n'),
            resourcesText: (system.resources || []).join('\n')
        });
    }, [system]);

    const deptOptions = departments.map(d => d.name);
    const currentDept = departments.find(d => d.name === form.department);
    const responsibilityOptions = currentDept?.responsibilities || [];
    const subActivityOptions = currentDept?.subActivities?.[form.responsibility] || [];

    const parseLines = (text) =>
        text.split('\n').map((line) => line.trim()).filter(Boolean);

    const handleSave = () => {
        const updatedSystem = {
            ...system,
            ...form,
            inputs: parseLines(form.inputsText || ''),
            steps: parseLines(form.stepsText || ''),
            tools: parseLines(form.toolsText || ''),
            media: parseLines(form.mediaText || ''),
            resources: parseLines(form.resourcesText || ''),
            updatedAt: new Date().toISOString()
        };
        onSave?.(updatedSystem);
        onBack?.(); // Return to dashboard after saving
    };

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            {/* Editor Main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                {/* Header */}
                <div style={{
                    padding: '24px 32px',
                    borderBottom: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: colors.bg,
                    zIndex: 10
                }}>
                    <button
                        onClick={onBack}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: colors.textSecondary, display: 'flex' }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: colors.textSecondary, marginBottom: '4px' }}>
                            {form.department || t({ en: 'Department', fr: 'Département' })} / {form.responsibility || t({ en: 'Responsibility', fr: 'Responsabilité' })}
                        </div>
                        <input
                            value={form.title}
                            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                            style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                backgroundColor: 'transparent',
                                color: colors.text
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleSave}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                backgroundColor: isDark ? '#fff' : '#111827',
                                color: isDark ? '#000' : '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            {t({ en: 'Save Changes', fr: 'Enregistrer les modifications' })}
                        </button>
                    </div>
                </div>

                {/* Content Sections */}
                <div style={{ padding: '40px 60px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
                    {/* Method & Standards Block */}
                    <div style={{ marginBottom: '40px', padding: '24px', backgroundColor: colors.bgSecondary, borderRadius: '12px', border: `1px solid ${colors.border}` }}>
                        <div style={{ fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Settings size={16} /> {t({ en: 'Configuration', fr: 'Configuration' })}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: colors.textSecondary, marginBottom: '6px' }}>{t({ en: 'CAPTURE METHOD', fr: 'MÉTHODE DE CAPTURE' })}</label>
                                <input
                                    value={form.method}
                                    onChange={(e) => setForm(prev => ({ ...prev, method: e.target.value }))}
                                    placeholder={t({ en: 'e.g. Screen Recording', fr: "ex. Enregistrement d'écran" })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: colors.inputBg,
                                        color: colors.text
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: colors.textSecondary, marginBottom: '6px' }}>{t({ en: 'QUALITY STANDARD', fr: 'NORME DE QUALITÉ' })}</label>
                                <input
                                    value={form.standard}
                                    onChange={(e) => setForm(prev => ({ ...prev, standard: e.target.value }))}
                                    placeholder={t({ en: 'e.g. Under 5 minutes', fr: 'ex. Moins de 5 minutes' })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: colors.inputBg,
                                        color: colors.text
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <EditorSection title={t({ en: 'System Meta', fr: 'Métadonnées système' })} icon={<Layout size={18} />} defaultOpen={true}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: colors.textSecondary, marginBottom: '6px' }}>{t({ en: 'DEPARTMENT', fr: 'DÉPARTEMENT' })}</label>
                                <select
                                    value={form.department}
                                    onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value, responsibility: '', subActivity: '' }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        fontSize: '14px',
                                        backgroundColor: colors.inputBg,
                                        color: colors.text
                                    }}
                                >
                                    <option value="">{t({ en: 'Select department', fr: 'Sélectionner un département' })}</option>
                                    {deptOptions.map((dept) => (
                                        <option key={dept} value={dept} style={{ backgroundColor: colors.inputBg, color: colors.text }}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: colors.textSecondary, marginBottom: '6px' }}>{t({ en: 'RESPONSIBILITY', fr: 'RESPONSABILITÉ' })}</label>
                                <select
                                    value={form.responsibility}
                                    onChange={(e) => setForm(prev => ({ ...prev, responsibility: e.target.value, subActivity: '' }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        fontSize: '14px',
                                        backgroundColor: colors.inputBg,
                                        color: colors.text
                                    }}
                                >
                                    <option value="">{t({ en: 'Select responsibility', fr: 'Sélectionner une responsabilité' })}</option>
                                    {responsibilityOptions.map((resp) => (
                                        <option key={resp} value={resp} style={{ backgroundColor: colors.inputBg, color: colors.text }}>{resp}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: colors.textSecondary, marginBottom: '6px' }}>{t({ en: 'SUB-ACTIVITY', fr: 'SOUS-ACTIVITÉ' })}</label>
                                <select
                                    value={form.subActivity}
                                    onChange={(e) => setForm(prev => ({ ...prev, subActivity: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        fontSize: '14px',
                                        backgroundColor: colors.inputBg,
                                        color: colors.text
                                    }}
                                >
                                    <option value="">{t({ en: 'Select sub-activity', fr: 'Sélectionner une sous-activité' })}</option>
                                    {subActivityOptions.map((sub) => (
                                        <option key={sub} value={sub} style={{ backgroundColor: colors.inputBg, color: colors.text }}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: colors.textSecondary, marginBottom: '6px' }}>{t({ en: 'OWNER', fr: 'RESPONSABLE' })}</label>
                                <input
                                    value={form.owner}
                                    onChange={(e) => setForm(prev => ({ ...prev, owner: e.target.value }))}
                                    placeholder={t({ en: 'e.g. Alex', fr: 'ex. Alex' })}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: `1px solid ${colors.border}`,
                                        fontSize: '14px',
                                        backgroundColor: colors.inputBg,
                                        color: colors.text
                                    }}
                                />
                            </div>
                        </div>
                    </EditorSection>

                    <EditorSection title={t({ en: 'Overview', fr: 'Aperçu' })} icon={<Layout size={18} />}>
                        <textarea
                            value={form.overview}
                            onChange={(e) => setForm(prev => ({ ...prev, overview: e.target.value }))}
                            placeholder={t({ en: 'Purpose, goal, and trigger summary...', fr: "Résumé de l'objectif, du but et du déclencheur..." })}
                            rows={5}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                backgroundColor: colors.inputBg,
                                color: colors.text
                            }}
                        />
                        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <input
                                value={form.goal}
                                onChange={(e) => setForm(prev => ({ ...prev, goal: e.target.value }))}
                                placeholder={t({ en: 'Goal', fr: 'Objectif' })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.border}`,
                                    fontSize: '14px',
                                    backgroundColor: colors.inputBg,
                                    color: colors.text
                                }}
                            />
                            <input
                                value={form.trigger}
                                onChange={(e) => setForm(prev => ({ ...prev, trigger: e.target.value }))}
                                placeholder={t({ en: 'Trigger', fr: 'Déclencheur' })}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${colors.border}`,
                                    fontSize: '14px',
                                    backgroundColor: colors.inputBg,
                                    color: colors.text
                                }}
                            />
                        </div>
                    </EditorSection>

                    <EditorSection title={t({ en: 'Inputs', fr: 'Entrées' })} icon={<FileText size={18} />}>
                        <textarea
                            value={form.inputsText}
                            onChange={(e) => setForm(prev => ({ ...prev, inputsText: e.target.value }))}
                            placeholder={t({ en: 'One input per line', fr: 'Une entrée par ligne' })}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                backgroundColor: colors.inputBg,
                                color: colors.text
                            }}
                        />
                    </EditorSection>

                    <EditorSection title={t({ en: 'Steps', fr: 'Étapes' })} icon={<File size={18} />}>
                        <textarea
                            value={form.stepsText}
                            onChange={(e) => setForm(prev => ({ ...prev, stepsText: e.target.value }))}
                            placeholder={t({ en: 'One step per line', fr: 'Une étape par ligne' })}
                            rows={8}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                backgroundColor: colors.inputBg,
                                color: colors.text
                            }}
                        />
                    </EditorSection>

                    <EditorSection title={t({ en: 'Tools', fr: 'Outils' })} icon={<Type size={18} />}>
                        <textarea
                            value={form.toolsText}
                            onChange={(e) => setForm(prev => ({ ...prev, toolsText: e.target.value }))}
                            placeholder={t({ en: 'One tool per line', fr: 'Un outil par ligne' })}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                backgroundColor: colors.inputBg,
                                color: colors.text
                            }}
                        />
                    </EditorSection>

                    <EditorSection title={t({ en: 'Media & Resources', fr: 'Médias et ressources' })} icon={<Video size={18} />}>
                        <textarea
                            value={form.mediaText}
                            onChange={(e) => setForm(prev => ({ ...prev, mediaText: e.target.value }))}
                            placeholder={t({ en: 'Media links (one per line)', fr: 'Liens média (un par ligne)' })}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                backgroundColor: colors.inputBg,
                                color: colors.text
                            }}
                        />
                        <textarea
                            value={form.resourcesText}
                            onChange={(e) => setForm(prev => ({ ...prev, resourcesText: e.target.value }))}
                            placeholder={t({ en: 'Resources / links (one per line)', fr: 'Ressources / liens (un par ligne)' })}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`,
                                fontSize: '14px',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                marginTop: '12px',
                                backgroundColor: colors.inputBg,
                                color: colors.text
                            }}
                        />
                    </EditorSection>
                </div>
            </div>

            {/* Right Actions Sidebar */}
            <div style={{
                width: '60px',
                borderLeft: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 0',
                gap: '24px'
            }}>
                <ActionButton icon={<CheckCircle2 size={20} />} tooltip={t({ en: 'Save', fr: 'Enregistrer' })} onClick={handleSave} />
                <ActionButton icon={<Trash2 size={20} />} tooltip={t({ en: 'Delete', fr: 'Supprimer' })} color="#ef4444" onClick={() => onDelete?.(system.id)} />
            </div>
        </div>
    );
};

const EditorSection = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div style={{ marginBottom: '24px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f3f4f6', paddingBottom: '24px' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: isOpen ? '16px' : '0' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: '700', color: isDark ? '#fff' : '#111827' }}>
                    {icon} {title}
                </div>
                {isOpen ? <ChevronDown size={20} color={isDark ? '#999' : '#9ca3af'} /> : <ChevronRight size={20} color={isDark ? '#999' : '#9ca3af'} />}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActionButton = ({ icon, tooltip, color = '#6b7280', onClick }) => (
    <button
        onClick={onClick}
        title={tooltip}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: color, padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }}
    >
        {icon}
    </button>
);

export default OrganizeDashboard;
