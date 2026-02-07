import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PhaseProgress from './PhaseProgress';
import {
    PanelLeft,
    SquarePen,
    Search,
    Settings,
    Languages,
    HelpCircle,
    LogOut,
    ChevronRight,
    MoreVertical,
    Trash2,
    Edit2,
    Heart,
    Copy,
    Check,
    Moon,
    Sun
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import DonationModal from '../DonationModal';

const ICON_STROKE_WIDTH = 2.5;

const AppSidebar = ({
    isOpen,
    setIsOpen,
    onNewProject,
    projects = [],
    currentProjectId,
    onSelectProject,
    onRenameProject,
    onRemoveProject,
    onClearProjects,
    phase,
    systemTrack,
    onSystemTrackChange,
    onPhaseClick
}) => {
    const navigate = useNavigate();
    const { t, lang, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { currentUser } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [activeOptionsMenu, setActiveOptionsMenu] = useState(null);
    const [showDonationInfo, setShowDonationInfo] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

    // Notion Colors (Dynamic)
    const isDark = theme === 'dark';
    const NOTION_BG = isDark ? '#202020' : '#F7F7F5';
    const NOTION_HOVER = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(55, 53, 47, 0.08)';
    const NOTION_TEXT = isDark ? '#FFFFFF' : '#37352F';
    const NOTION_TEXT_LIGHT = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(55, 53, 47, 0.65)';
    const BG_COLOR = isDark ? '#202020' : 'rgba(255, 255, 255, 1)';
    const BORDER_COLOR = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.06)';

    const menuItems = [
        {
            key: 'settings',
            icon: <Settings size={16} strokeWidth={ICON_STROKE_WIDTH} />,
            label: t({ en: 'Personal Setting', fr: 'Paramètres personnels' }),
            onClick: () => setShowSettingsMenu((prev) => !prev)
        },
        {
            key: 'translate',
            icon: <Languages size={16} strokeWidth={ICON_STROKE_WIDTH} />,
            label: t({ en: 'Translate', fr: 'Traduire' }),
            onClick: () => setShowLanguageMenu((prev) => !prev)
        },
        {
            key: 'help',
            icon: <HelpCircle size={16} strokeWidth={ICON_STROKE_WIDTH} />,
            label: t({ en: 'Help', fr: 'Aide' }),
            hasChevron: true,
            onClick: () => window.open('https://wa.me/212702814355', '_blank', 'noopener,noreferrer')
        },
        {
            key: 'logout',
            icon: <LogOut size={16} strokeWidth={ICON_STROKE_WIDTH} />,
            label: t({ en: 'Go out', fr: 'Se déconnecter' }),
            onClick: () => navigate('/signup')
        }
    ];

    return (
        <>
            {/* Click-outside overlay for menus */}
            {(activeOptionsMenu || showProfileMenu || showDonationInfo || showLanguageMenu || showSettingsMenu) && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                        backgroundColor: 'transparent'
                    }}
                    onClick={() => {
                        setActiveOptionsMenu(null);
                        setShowProfileMenu(false);
                        setShowDonationInfo(false);
                        setShowLanguageMenu(false);
                        setShowSettingsMenu(false);
                    }}
                />
            )}

            {/* Search Overlay Placeholder */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                        onClick={() => setShowSearch(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                backgroundColor: isDark ? '#262626' : '#FFFFFF',
                                width: '100%',
                                maxWidth: '640px',
                                borderRadius: '12px',
                                padding: '16px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                color: NOTION_TEXT
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: NOTION_TEXT }}>
                                <Search size={20} strokeWidth={ICON_STROKE_WIDTH} />
                                <input
                                    autoFocus
                                    placeholder={t({ en: 'Search SOPs...', fr: 'Rechercher des SOP...' })}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        width: '100%',
                                        fontSize: '16px',
                                        color: NOTION_TEXT,
                                        backgroundColor: 'transparent'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Floating Toggle Button for Mobile - Always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="mobile-sidebar-toggle"
                style={{
                    position: 'fixed',
                    top: '16px',
                    left: '16px',
                    zIndex: 1001,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isDark ? '#000' : '#000',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    minWidth: '44px',
                    minHeight: '44px'
                }}
            >
                <PanelLeft size={20} strokeWidth={2} />
            </button>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media (max-width: 768px) {
                        .mobile-sidebar-toggle {
                            display: flex !important;
                        }
                    }
                `
            }} />

            {/* Backdrop overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        display: 'none'
                    }}
                />
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media (max-width: 768px) {
                        .sidebar-backdrop {
                            display: block !important;
                        }
                    }
                `
            }} />

            <motion.div
                initial={false}
                animate={{ width: isOpen ? 260 : 48 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    height: '100vh',
                    backgroundColor: BG_COLOR,
                    color: NOTION_TEXT,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 1000,
                    flexShrink: 0,
                    borderRight: `1px solid ${BORDER_COLOR}`
                }}
                className="app-sidebar"
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @media (max-width: 768px) {
                            .app-sidebar {
                                position: fixed !important;
                                left: 0;
                                top: 0;
                                width: ${isOpen ? '100vw' : '0'} !important;
                                transform: translateX(${isOpen ? '0' : '-100%'});
                                transition: transform 0.3s ease;
                                box-shadow: ${isOpen ? '0 0 20px rgba(0,0,0,0.2)' : 'none'};
                            }
                        }
                    `
                }} />
                {/* Top Header: Always visible Toggle, Search, New */}
                <div style={{
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: isOpen ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: isOpen ? '260px' : '48px',
                    gap: isOpen ? '0' : '20px'
                }}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            color: NOTION_TEXT,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '44px',
                            minHeight: '44px',
                            position: 'relative'
                        }}
                    >
                        <PanelLeft size={24} strokeWidth={2} />
                        {isOpen && (
                            <span style={{
                                position: 'absolute',
                                left: '48px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '10px',
                                padding: '2px 8px',
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: '100px',
                                letterSpacing: '0.05em',
                                fontWeight: '800',
                                whiteSpace: 'nowrap'
                            }}>BETA TEST</span>
                        )}
                    </button>

                    <div style={{
                        display: 'flex',
                        flexDirection: isOpen ? 'row' : 'column',
                        gap: isOpen ? '16px' : '20px',
                        alignItems: 'center'
                    }}>
                        <button
                            onClick={() => setShowSearch(true)}
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                color: NOTION_TEXT,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '44px',
                                minHeight: '44px'
                            }}
                        >
                            <Search size={24} strokeWidth={2} />
                        </button>

                        <button
                            onClick={onNewProject}
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                color: NOTION_TEXT,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '44px',
                                minHeight: '44px'
                            }}
                        >
                            <SquarePen size={24} strokeWidth={2} />
                        </button>
                    </div>
                </div>



                {/* Phase Progress (Favorites / Private style) */}
                <PhaseProgress
                    currentPhase={phase}
                    systemTrack={systemTrack}
                    onSystemTrackChange={onSystemTrackChange}
                    onPhaseClick={onPhaseClick}
                    isSidebarOpen={isOpen}
                />

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '12px 12px',
                                minWidth: '260px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px'
                            }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 4px',
                                marginTop: '12px'
                            }}>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: NOTION_TEXT_LIGHT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    {t({ en: 'Your Projects', fr: 'Vos projets' })}
                                </div>
                                {projects.length > 0 && (
                                    <button
                                        onClick={() => onClearProjects?.()}
                                        style={{
                                            border: `1.5px solid ${isDark ? '#444' : '#E9E9E8'}`,
                                            backgroundColor: 'transparent',
                                            color: NOTION_TEXT,
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t({ en: 'Clear', fr: 'Effacer' })}
                                    </button>
                                )}
                            </div>
                            {projects.length === 0 ? (
                                <div style={{ padding: '8px 12px', color: NOTION_TEXT_LIGHT, fontSize: '13px', fontStyle: 'italic' }}>
                                    {t({ en: 'No projects yet', fr: 'Aucun projet pour le moment' })}
                                </div>
                            ) : (
                                projects.map((p, i) => {
                                    const isActive = p.id === currentProjectId;
                                    const isMenuOpen = activeOptionsMenu === p.id;

                                    return (
                                        <div
                                            key={p.id || i}
                                            style={{
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                backgroundColor: (isActive || isMenuOpen) ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : 'transparent',
                                                borderRadius: '8px',
                                                marginBottom: '2px',
                                                paddingRight: '4px'
                                            }}
                                            className="sidebar-history-item-container"
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = NOTION_HOVER}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = (isActive || isMenuOpen) ? NOTION_HOVER : 'transparent'}
                                        >
                                            <div
                                                onClick={() => {
                                                    onSelectProject?.(p.id);
                                                    setActiveOptionsMenu(null);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0, // Fix for text truncation in flex container
                                                    padding: '8px 12px',
                                                    cursor: 'pointer',
                                                    color: NOTION_TEXT,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '2px'
                                                }}
                                                className="sidebar-history-item"
                                            >
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: isActive ? '700' : '600',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {p.name}
                                                </div>
                                                {p.data?.documentData?.ccf?.coreService && (
                                                    <div style={{
                                                        fontSize: '12px',
                                                        fontWeight: '400',
                                                        color: NOTION_TEXT_LIGHT,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        lineHeight: '1.3'
                                                    }}>
                                                        {p.data.documentData.ccf.coreService}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Options Button: Appears on hover of container */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveOptionsMenu(isMenuOpen ? null : p.id);
                                                }}
                                                style={{
                                                    padding: '4px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    color: NOTION_TEXT,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: isMenuOpen ? 1 : 0, // Logic for hover will be in CSS
                                                    transition: 'opacity 0.2s'
                                                }}
                                                className="sidebar-item-options-btn"
                                            >
                                                <MoreVertical size={14} strokeWidth={ICON_STROKE_WIDTH} />
                                            </button>

                                            {/* Project Options Menu */}
                                            <AnimatePresence>
                                                {isMenuOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '100%',
                                                            right: '4px',
                                                            zIndex: 100,
                                                            backgroundColor: isDark ? '#262626' : '#FFFFFF',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                            padding: '4px',
                                                            minWidth: '140px',
                                                            border: `1px solid ${BORDER_COLOR}`
                                                        }}
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newName = prompt(t({ en: 'Enter new project name:', fr: 'Entrez un nouveau nom de projet :' }), p.name);
                                                                if (newName) onRenameProject?.(p.id, newName);
                                                                setActiveOptionsMenu(null);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px 10px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                border: 'none',
                                                                backgroundColor: 'transparent',
                                                                color: NOTION_TEXT,
                                                                fontSize: '13px',
                                                                cursor: 'pointer',
                                                                borderRadius: '4px',
                                                                textAlign: 'left'
                                                            }}
                                                            className="sidebar-menu-item"
                                                        >
                                                            <Edit2 size={14} /> {t({ en: 'Rename', fr: 'Renommer' })}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm(t({ en: 'Delete this project? This cannot be undone.', fr: 'Supprimer ce projet ? Cette action est irréversible.' }))) {
                                                                    onRemoveProject?.(p.id);
                                                                }
                                                                setActiveOptionsMenu(null);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                padding: '8px 10px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                border: 'none',
                                                                backgroundColor: 'transparent',
                                                                color: '#ff4b4b',
                                                                fontSize: '13px',
                                                                cursor: 'pointer',
                                                                borderRadius: '4px',
                                                                textAlign: 'left'
                                                            }}
                                                            className="sidebar-menu-item"
                                                        >
                                                            <Trash2 size={14} /> {t({ en: 'Remove', fr: 'Supprimer' })}
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            )}
                        </motion.div>
                    )}
                    {!isOpen && <div style={{ flex: 1 }} />}
                </AnimatePresence>

                <div style={{
                    padding: '12px 16px',
                    borderTop: `1px solid ${BORDER_COLOR}`,
                    minWidth: isOpen ? '260px' : '48px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: isOpen ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    gap: '12px'
                }}>
                    {/* Profile Menu Popup */}
                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '60px',
                                    left: isOpen ? '12px' : '52px',
                                    width: '240px',
                                    backgroundColor: isDark ? '#262626' : '#FFFFFF',
                                    borderRadius: '12px',
                                    padding: '8px',
                                    boxShadow: '0 -10px 25px rgba(0,0,0,0.1)',
                                    zIndex: 1100,
                                    border: `1px solid ${BORDER_COLOR}`,
                                    color: NOTION_TEXT
                                }}
                            >
                                {/* User Header in Menu */}
                                <div style={{ padding: '8px 12px', marginBottom: '4px', borderBottom: `1px solid ${BORDER_COLOR}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isDark ? '#333' : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {currentUser?.photoURL ? (
                                                <img src={currentUser.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: NOTION_TEXT }}>
                                                    {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '700', color: NOTION_TEXT }}>{currentUser?.displayName || 'User'}</span>
                                            <span style={{ fontSize: '11px', color: NOTION_TEXT_LIGHT }}>{currentUser?.email || 'No Email'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Menu List */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    {menuItems.map((item, i) => (
                                        <div key={item.key || i}>
                                            <div
                                                onClick={() => {
                                                    item.onClick?.();
                                                    if (item.key !== 'translate' && item.key !== 'settings') {
                                                        setShowLanguageMenu(false);
                                                        setShowSettingsMenu(false);
                                                    }
                                                    if (item.key === 'settings') {
                                                        setShowLanguageMenu(false);
                                                    }
                                                    if (item.key === 'translate') {
                                                        setShowSettingsMenu(false);
                                                    }
                                                }}
                                                style={{
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    justifyContent: 'space-between'
                                                }}
                                                className="profile-menu-item"
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    {item.icon}
                                                    <span>{item.label}</span>
                                                </div>
                                                {item.hasChevron && <ChevronRight size={14} color="#666" />}
                                            </div>

                                            {/* Translate Submenu */}
                                            {item.key === 'translate' && showLanguageMenu && (
                                                <div style={{
                                                    marginTop: '6px',
                                                    marginLeft: '26px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '6px'
                                                }}>
                                                    {[
                                                        { key: 'en', label: 'English' },
                                                        { key: 'fr', label: 'Français' }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.key}
                                                            onClick={() => {
                                                                setLanguage(option.key);
                                                                setShowLanguageMenu(false);
                                                            }}
                                                            style={{
                                                                border: `1px solid ${BORDER_COLOR}`,
                                                                backgroundColor: lang === option.key ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)') : (isDark ? '#262626' : '#fff'),
                                                                color: NOTION_TEXT,
                                                                fontSize: '13px',
                                                                fontWeight: '600',
                                                                padding: '8px 10px',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Settings (Theme) Submenu */}
                                            {item.key === 'settings' && showSettingsMenu && (
                                                <div style={{
                                                    marginTop: '6px',
                                                    marginLeft: '26px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '6px'
                                                }}>
                                                    {[
                                                        { key: 'light', label: t({ en: 'Light Mode', fr: 'Mode clair' }), icon: <Sun size={14} /> },
                                                        { key: 'dark', label: t({ en: 'Dark Mode', fr: 'Mode sombre' }), icon: <Moon size={14} /> }
                                                    ].map((option) => (
                                                        <button
                                                            key={option.key}
                                                            onClick={() => {
                                                                toggleTheme(option.key);
                                                                setShowSettingsMenu(false);
                                                            }}
                                                            style={{
                                                                border: `1px solid ${BORDER_COLOR}`,
                                                                backgroundColor: theme === option.key ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)') : (isDark ? '#262626' : '#fff'),
                                                                color: NOTION_TEXT,
                                                                fontSize: '13px',
                                                                fontWeight: '600',
                                                                padding: '8px 10px',
                                                                borderRadius: '8px',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            {option.icon}
                                                            {option.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div
                        onClick={() => {
                            if (!isOpen) setIsOpen(true);
                            setShowProfileMenu(!showProfileMenu);
                        }}
                        style={{
                            display: 'flex',
                            flexDirection: isOpen ? 'row' : 'column',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            width: isOpen ? '100%' : 'auto',
                            padding: isOpen ? '4px 8px' : '0',
                            borderRadius: '12px',
                            transition: 'background-color 0.2s ease',
                            marginLeft: isOpen ? '4px' : '0'
                        }}
                        className="sidebar-profile-row"
                        title={t({ en: 'User menu', fr: 'Menu utilisateur' })}
                    >
                        <div
                            style={{
                                width: isOpen ? '42px' : '32px',
                                height: isOpen ? '42px' : '32px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                marginBottom: isOpen ? '0' : '4px',
                                backgroundColor: isDark ? '#333' : '#f0f0f0'
                            }}
                        >
                            {currentUser?.photoURL ? (
                                <img
                                    src={currentUser.photoURL}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: NOTION_TEXT }}>
                                    {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                                </span>
                            )}
                        </div>

                        {isOpen && (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <span style={{ fontSize: '15px', fontWeight: '800', color: NOTION_TEXT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                                    {currentUser?.displayName || 'User'}
                                </span>
                                <span style={{ fontSize: '12px', color: NOTION_TEXT_LIGHT, fontWeight: '500' }}>{t({ en: 'Free', fr: 'Gratuit' })}</span>
                            </div>
                        )}
                    </div>

                    {/* Rail Mode Donate Icon */}
                    {!isOpen && (
                        <button
                            onClick={() => {
                                setIsOpen(true);
                                setShowDonationInfo(true);
                            }}
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: '1.5px solid #ff4343ff',
                                backgroundColor: '#ff4343ff',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            title={t({ en: 'Support hiro', fr: 'Soutenir hiro' })}
                        >
                            <Heart size={16} color="#fff" strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Donate Section at bottom */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ padding: '0 16px 20px', minWidth: '260px' }}>

                            {!showDonationInfo ? (
                                <button
                                    onClick={() => setShowDonationInfo(true)}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#000000ff',
                                        border: '1px solid #2b2b2bff',
                                        borderRadius: '10px',
                                        padding: '12px 12px',
                                        color: '#ffffffff',
                                        fontSize: '15px',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <Heart size={18} fill="#FF4B4B" strokeWidth={0} />
                                    {t({ en: 'Support hiro', fr: 'Soutenir hiro' })}
                                </button>
                            ) : (
                                <DonationModal
                                    isOpen={showDonationInfo}
                                    onClose={() => setShowDonationInfo(false)}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Global Styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          .sidebar-icon-btn:hover { background-color: rgba(0,0,0,0.04) !important; }
          .sidebar-nav-item:hover { background-color: rgba(0,0,0,0.04); }
          .sidebar-history-item:hover { background-color: rgba(0,0,0,0.04); }
          .sidebar-history-item-container:hover .sidebar-item-options-btn { opacity: 1 !important; }
          .sidebar-item-options-btn:hover { background-color: rgba(0,0,0,0.08) !important; color: #171717 !important; }
          .sidebar-profile-btn:hover { border-color: rgba(0,0,0,0.2) !important; background-color: #fcfcfc !important; }
          .profile-menu-item:hover { background-color: rgba(0,0,0,0.04); }
        `}} />
            </motion.div >
        </>
    );
};

const SidebarNavItem = ({ icon, label, isOpen, unclickable, hideLabel }) => (
    <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '12px',
        padding: '8px 12px',
        borderRadius: '8px',
        cursor: unclickable ? 'default' : 'pointer',
        fontSize: '14px',
        color: '#000',
        fontWeight: '500',
        opacity: unclickable ? 0.6 : 1
    }} title={label} className={unclickable ? "" : "sidebar-nav-item"}>
        {icon}
        {!hideLabel && <span>{label}</span>}
    </div>
);

const HistoryItem = ({ label }) => (
    <div style={{
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: '#171717'
    }} className="sidebar-history-item">
        {label}
    </div>
);

export default AppSidebar;
