import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2, Maximize2, Send, Paperclip, Globe, ArrowUp, Edit, Edit2, Layout, X, Network, Layers, Target, Clock, XCircle, Lock, ChevronRight, Share2, Zap, Search, Mic, Plus, History, CornerDownLeft, Sparkles, MessageSquare, MessageCircle } from 'lucide-react';
import Typewriter from '../Typewriter';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import ThinkingDots from './ThinkingDots';

const ExpertBox = ({ state, onAction, onSubmit, phase, activeSystemName, projects = [], onSelectProject, onRemoveProject, onTypingComplete, rightOffset = 24, docked = false }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Theme Colors
    const colors = {
        bg: isDark ? '#262626' : '#FFFFFF',
        bgSecondary: isDark ? '#333' : '#F7F7F5', // Hover states, secondary areas
        bgTertiary: isDark ? '#333' : '#F0F0F0', // Messages, Inputs
        text: isDark ? '#FFFFFF' : '#37352F',
        textSecondary: isDark ? '#9B9A97' : '#999999',
        border: isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0',
        shadow: isDark ? '0 5px 20px rgba(0,0,0,0.5)' : '0 5px 10px rgba(15, 15, 15, 0.05), 0 10px 30px rgba(15, 15, 15, 0.07)',
        inputBg: isDark ? '#333' : '#FFFFFF',
        userMsgBg: isDark ? '#333' : '#F0F0F0',
        assistantMsgBg: 'transparent',
        icon: isDark ? '#FFFFFF' : '#37352F',
        iconSecondary: isDark ? '#888' : '#ccc'
    };

    // --- State Management for Multi-Chat ---
    // Start with one "main" conversation that receives updates from the parent 'state' prop
    const [conversations, setConversations] = useState([
        { id: 'main', title: 'Current Task', messages: [], type: 'main', date: new Date() }
    ]);
    const [activeConversationId, setActiveConversationId] = useState('main');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Derived state
    const currentConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
    const isMainChat = currentConversation.id === 'main';

    // UI States
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isAvatarMode, setIsAvatarMode] = useState(false);

    // Legacy/Specific flow states (kept for compatibility with main flow)
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [messageTyped, setMessageTyped] = useState(false); // Controls when input unlocks after AI speaks
    const [otherValue, setOtherValue] = useState('');
    const [isOtherSelected, setIsOtherSelected] = useState(false);

    // Refs
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const mainInputRef = useRef(null);

    // --- Effects ---

    // 1. Sync parent 'state.message' to the MAIN conversation
    // When the app sends a message (e.g. "Welcome to Phase 1"), it goes to the main chat.
    useEffect(() => {
        if (state.message) {
            setConversations(prev => prev.map(c => {
                if (c.id === 'main') {
                    // Avoid duplicating if it's the same message reference or content (simple check)
                    const lastMsg = c.messages[c.messages.length - 1];
                    // Also check if the content is just "..." (loading state), we might want to update it or ignore
                    if (lastMsg?.content !== state.message) {
                        return {
                            ...c,
                            messages: [...c.messages, { role: 'assistant', content: state.message, type: 'text' }]
                        };
                    }
                }
                return c;
            }));

            // If the app is driving the conversation, we generally want to see it.
            // But user requirement says: "others are just for chats... main first expert is fixed... only one that works with preview"
            // So if system sends a message, we might NOT force switch if user is deep in another chat, 
            // OR we might add a badge. For now, let's NOT force switch to avoid disrupting the user's side-chat.
        }
    }, [state.message]);

    // 2. Typing interactions
    useEffect(() => {
        if (isMainChat) {
            if (state.isTyping) {
                setMessageTyped(false);
            } else {
                // controlled by Typewriter onComplete usually, but fallback here
            }
        } else {
            // Secondary chats are always "typed" unless we add fake delay logic
            setMessageTyped(true);
        }
    }, [state.isTyping, isMainChat]);

    const scrollToBottom = (behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    // 3. Scroll to bottom on new messages or UI changes
    useEffect(() => {
        // Use a small timeout to ensure DOM has updated
        const timeoutId = setTimeout(() => scrollToBottom(), 100);
        return () => clearTimeout(timeoutId);
    }, [currentConversation.messages, state.isTyping, state.inputType, isHistoryOpen, messageTyped]);

    // --- Handlers ---

    const handleNewChat = () => {
        const newId = `chat_${Date.now()}`;
        const newChat = {
            id: newId,
            title: t({ en: 'New Chat', fr: 'Nouvelle discussion' }),
            messages: [{ role: 'assistant', content: t({ en: 'How can I help you today?', fr: 'Comment puis-je vous aider aujourd\'hui ?' }), type: 'text' }],
            type: 'chat',
            date: new Date()
        };
        setConversations(prev => [newChat, ...prev]);
        setActiveConversationId(newId);
        setIsHistoryOpen(false);
        setInputValue('');
        setMessageTyped(true);

        // Focus input
        setTimeout(() => mainInputRef.current?.focus(), 100);
    };

    const handleSwitchChat = (id) => {
        setActiveConversationId(id);
        setIsHistoryOpen(false);
        setInputValue('');
        // If switching to main, check if it's typing
        if (id === 'main' && state.isTyping) {
            setMessageTyped(false);
        } else {
            setMessageTyped(true);
        }
        // Force scroll to bottom after switch
        setTimeout(() => scrollToBottom('auto'), 50);

        // Focus input
        setTimeout(() => {
            if (mainInputRef.current) {
                mainInputRef.current.focus();
                // Move cursor to end
                const len = mainInputRef.current.value.length;
                mainInputRef.current.setSelectionRange(len, len);
            }
        }, 150);
    };

    // 4. Auto-focus whenever typing ends or input type changes
    useEffect(() => {
        if (!state.isTyping || messageTyped) {
            setTimeout(() => mainInputRef.current?.focus(), 50);
        }
    }, [state.isTyping, messageTyped, state.inputType]);

    const handleInternalSubmit = (value, action) => {
        let displayContent = value;

        // Format value for display in history
        if (action === 'select_goal') {
            const goal = goals.find(g => g.id === value);
            displayContent = goal ? goal.title : value;
        } else if (Array.isArray(value)) {
            displayContent = value.join(', ');
        }

        // Add user message to current (main) chat
        setConversations(prev => prev.map(c => {
            if (c.id === 'main') {
                return {
                    ...c,
                    messages: [...c.messages, { role: 'user', content: displayContent, type: 'text' }]
                };
            }
            return c;
        }));

        // Call parent logic
        onSubmit(value, action);

        // Ensure input area is ready (though specialized inputs usually take over)
        if (state.inputType === 'text' || !state.inputType) {
            setMessageTyped(false); // Reset typing state if we expect a new AI response
        }
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const msgContent = inputValue.trim();

        // Add user message to current chat
        setConversations(prev => prev.map(c => {
            if (c.id === activeConversationId) {
                // Update title if it's "New Chat" and this is the first user msg
                let newTitle = c.title;
                if (c.type === 'chat' && c.messages.length === 1) { // 1 because init msg is there
                    newTitle = msgContent.substring(0, 30) + (msgContent.length > 30 ? '...' : '');
                }

                return {
                    ...c,
                    title: newTitle,
                    messages: [...c.messages, { role: 'user', content: msgContent, type: 'text' }]
                };
            }
            return c;
        }));

        setInputValue('');

        if (isMainChat) {
            // Main chat interacts with the app logic
            onSubmit(msgContent, state.inputAction);
        } else {
            // Secondary chats - Mock response
            // Simulating a response for the "New Chat" feature
            setTimeout(() => {
                setConversations(prev => prev.map(c => {
                    if (c.id === activeConversationId) {
                        return {
                            ...c,
                            messages: [...c.messages, { role: 'assistant', content: "I'm a simulated expert for this secondary chat. Only the main chat controls the application flow.", type: 'text' }]
                        };
                    }
                    return c;
                }));
            }, 600);
        }
    };

    const resizeTextarea = (el) => {
        if (!el) return;
        el.style.height = 'auto';
        const newHeight = Math.min(el.scrollHeight, 150);
        el.style.height = newHeight + 'px';
    };

    // Goals/Mission options
    const goals = [
        {
            id: 1,
            title: t({ en: "Systemise the Overall Business", fr: "Systématiser l'ensemble de l'entreprise" }),
            description: t({ en: "Follow the 4-phase SYSTEMology process.", fr: "Suivez le processus SYSTEMology en 4 phases." }),
            icon: <Network size={16} />,
            enabled: true
        },
        {
            id: 2,
            title: t({ en: "Systemise a specific Department", fr: "Systématiser un département spécifique" }),
            description: t({ en: "Extract and document one area of your business.", fr: "Extrayez et documentez un domaine de votre entreprise." }),
            icon: <Layers size={16} />,
            enabled: false
        },
        {
            id: 3,
            title: t({ en: "Solve a Problem", fr: "Résoudre un problème" }),
            description: t({ en: "Identify and systemise a recurring bottleneck.", fr: "Identifiez et systématisez un goulot d'étranglement récurrent." }),
            icon: <Target size={16} />,
            enabled: false
        },
        {
            id: 4,
            title: t({ en: "Achieve a Goal", fr: "Atteindre un objectif" }),
            description: t({ en: "Create systems to hit a specific milestone.", fr: "Créez des systèmes pour atteindre une étape spécifique." }),
            icon: <Zap size={16} />,
            enabled: false
        },
    ];

    // Helpers for rendering
    const renderContent = () => {
        if (isHistoryOpen) {
            return (
                <div style={{ padding: '12px', flex: 1, overflowY: 'auto', backgroundColor: colors.bg }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: colors.textSecondary, marginBottom: '8px', paddingLeft: '8px', letterSpacing: '0.5px' }}>
                        RECENT CONVERSATIONS
                    </div>
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => handleSwitchChat(chat.id)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                backgroundColor: activeConversationId === chat.id ? colors.bgSecondary : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '2px',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = activeConversationId === chat.id ? colors.bgSecondary : (isDark ? 'rgba(255,255,255,0.05)' : '#f7f7f5')}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = activeConversationId === chat.id ? colors.bgSecondary : 'transparent'}
                        >
                            <div style={{ color: colors.text }}>
                                {chat.type === 'main' ? <Sparkles size={16} /> : <MessageSquare size={16} />}
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '14px', color: colors.text, fontWeight: '500' }}>
                                    {chat.title}
                                </span>
                                <span style={{ fontSize: '11px', color: colors.textSecondary }}>
                                    {chat.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            {chat.type !== 'main' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setConversations(prev => prev.filter(c => c.id !== chat.id));
                                        if (activeConversationId === chat.id) setActiveConversationId('main');
                                    }}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colors.iconSecondary }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                    onMouseLeave={e => e.currentTarget.style.color = colors.iconSecondary}
                                >
                                    <XCircle size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            );
        }

        // --- Standard Chat View ---
        return (
            <div
                ref={messagesContainerRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    paddingBottom: '20px'
                }}
            >
                {/* Messages */}
                {currentConversation.messages.map((msg, idx) => {
                    const isFirstMainMessage = isMainChat && idx === 0 && state.inputType === 'goal-selection';

                    if (isFirstMainMessage) {
                        return (
                            <div key={idx} style={{ textAlign: 'center', padding: '32px 10px 16px 10px' }}>
                                <div style={{
                                    width: '80px', height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: isDark ? '#262626' : '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 24px auto',
                                    boxShadow: isDark ? '0 4px 25px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.08)',
                                    overflow: 'hidden'
                                }}>
                                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                        <source src="/videos/Videos for Web/kling_20260207_Image_to_Video_Wise__focu_4216_0.mp4" type="video/mp4" />
                                    </video>
                                </div>
                                <h1 style={{ fontSize: '28px', fontWeight: '800', color: colors.text, marginBottom: '10px', letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                                    {t({ en: 'Welcome to hiro', fr: 'Bienvenue sur hiro' })}
                                </h1>
                                <p style={{ fontSize: '16px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(55, 53, 47, 0.65)', marginBottom: '0', lineHeight: '1.6', maxWidth: '320px', margin: '0 auto' }}>
                                    {t({ en: "Every business is a system. What's your goal today?", fr: "Chaque entreprise est un système. Quel est votre objectif aujourd'hui ?" })}
                                </p>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}>
                            {msg.role === 'user' ? (
                                <div style={{
                                    backgroundColor: colors.userMsgBg,
                                    color: colors.text,
                                    padding: '8px 14px',
                                    borderRadius: '20px',
                                    fontSize: '15px',
                                    lineHeight: '1.5',
                                    maxWidth: '85%'
                                }}>
                                    {msg.content}
                                </div>
                            ) : (
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <div style={{
                                            width: '24px', height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                                <source src="/videos/Videos for Web/kling_20260207_Image_to_Video_Wise__focu_4216_0.mp4" type="video/mp4" />
                                            </video>
                                        </div>
                                        <span style={{ fontSize: '20px', fontWeight: '900', color: colors.text }}>hiro Aleph</span>
                                    </div>
                                    <div style={{ fontSize: '15px', lineHeight: '1.6', color: colors.text, paddingLeft: '0' }}>
                                        {/* If it's the very last message of main chat, handle thinking and typing states */}
                                        {isMainChat && idx === currentConversation.messages.length - 1 ? (
                                            state.isThinking ? (
                                                <ThinkingDots color={colors.textSecondary} />
                                            ) : state.isTyping && !messageTyped ? (
                                                <Typewriter
                                                    text={msg.content}
                                                    speed={20}
                                                    onComplete={() => {
                                                        if (onTypingComplete) onTypingComplete();
                                                        setMessageTyped(true);
                                                    }}
                                                    render={(txt) => <MessageWithMarkdown text={txt} isDark={isDark} />}
                                                />
                                            ) : (
                                                <MessageWithMarkdown text={msg.content} isDark={isDark} />
                                            )
                                        ) : (
                                            <MessageWithMarkdown text={msg.content} isDark={isDark} />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Specific UI injections from 'state.inputType' - ONLY for MAIN chat */}
                {isMainChat && (
                    <div style={{ marginTop: '8px' }}>
                        {state.inputType === 'goal-selection' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {goals.map(g => (
                                    <motion.button
                                        key={g.id}
                                        whileHover={g.enabled ? { scale: 1.01, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fafafa', borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#d0d0d0' } : {}}
                                        whileTap={g.enabled ? { scale: 0.99 } : {}}
                                        onClick={() => g.enabled && handleInternalSubmit(g.id, state.inputAction)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            padding: '18px',
                                            borderRadius: '16px',
                                            backgroundColor: colors.bg,
                                            border: `1px solid ${colors.border}`,
                                            cursor: g.enabled ? 'pointer' : 'not-allowed',
                                            opacity: g.enabled ? 1 : 0.6,
                                            textAlign: 'left',
                                            boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.05)',
                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        <div style={{ color: colors.text, padding: '10px', backgroundColor: isDark ? '#333' : '#F7F7F5', borderRadius: '12px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>{React.cloneElement(g.icon, { size: 20 })}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '15px', fontWeight: '700', color: colors.text }}>{g.title}</div>
                                            <div style={{ fontSize: '13px', color: colors.textSecondary, marginTop: '2px', lineHeight: '1.4' }}>{g.description || ''}</div>
                                        </div>
                                        {g.enabled && <ChevronRight size={18} color={colors.iconSecondary} style={{ opacity: 0.5 }} />}
                                    </motion.button>
                                ))}

                                {/* Resume Recent Project */}
                                {projects && projects.length > 0 && (
                                    <div style={{ marginTop: '20px', padding: '0 4px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', opacity: 0.8 }}>
                                            {t({ en: 'Resume Recent Project', fr: 'Reprendre un projet récent' })}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {projects.slice(0, 3).map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => onSelectProject(p.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '12px',
                                                        padding: '12px 14px',
                                                        borderRadius: '10px',
                                                        backgroundColor: 'transparent',
                                                        border: `1px solid ${colors.border}`,
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.bgSecondary; e.currentTarget.style.borderColor = colors.iconSecondary; }}
                                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = colors.border; }}
                                                >
                                                    <Clock size={15} color={colors.iconSecondary} />
                                                    <div style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {p.name}
                                                    </div>
                                                    <ChevronRight size={14} color={colors.iconSecondary} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Option Buttons */}
                        {state.options && state.options.length > 0 && state.inputType !== 'goal-selection' && state.inputType !== 'multi-select' && messageTyped && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {state.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onAction(opt.action, opt.value)}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '6px',
                                            border: `1px solid ${colors.border}`,
                                            backgroundColor: colors.bg,
                                            color: colors.text,
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bgSecondary}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = colors.bg}
                                    >
                                        {opt.label || opt}
                                    </button>
                                ))}
                                {state.inputType === 'brainstorm-departments' && state.data && (
                                    <button
                                        onClick={() => onAction('modify_departments', state.data.departments)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '6px 14px', borderRadius: '12px',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}`,
                                            background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                                            color: colors.text, fontSize: '13px', fontWeight: '600',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0'; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.3)' : '#d0d0d0'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#fff'; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'; }}
                                    >
                                        <Edit2 size={14} /> Modify
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Multi-Select Input */}
                        {state.inputType === 'multi-select' && messageTyped && (
                            <div style={{ marginTop: '10px' }}>
                                <MultiSelectInput
                                    options={state.options}
                                    onSubmit={(selected) => handleInternalSubmit(selected, state.inputAction)}
                                    isDark={isDark}
                                    colors={colors}
                                    onHeightChange={() => scrollToBottom()}
                                />
                            </div>
                        )}

                        {/* Dynamic Steps Input */}
                        {state.inputType === 'dynamic-steps' && messageTyped && (
                            <div style={{ marginTop: '10px' }}>
                                <DynamicStepsInput
                                    onSubmit={(steps) => handleInternalSubmit(steps, state.inputAction)}
                                    initialSteps={state.initialSteps}
                                    placeholderType={state.placeholderType}
                                    isDark={isDark}
                                    colors={colors}
                                    onHeightChange={() => scrollToBottom()}
                                />
                            </div>
                        )}

                        {/* Dynamic List Input */}
                        {state.inputType === 'dynamic-list' && messageTyped && (
                            <div style={{ marginTop: '10px' }}>
                                <DynamicListInput
                                    onSubmit={(items) => handleInternalSubmit(items, state.inputAction)}
                                    placeholder={state.placeholder || t({ en: "Type answer...", fr: "Tapez votre réponse..." })}
                                    isDark={isDark}
                                    colors={colors}
                                    onHeightChange={() => scrollToBottom()}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        );
    };

    // --- Render Main Layout ---
    const baseRight = Number.isFinite(rightOffset) ? rightOffset : 24;

    return (
        <AnimatePresence>
            {isAvatarMode ? (
                <motion.div
                    key="avatar-toggle"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsAvatarMode(false); setIsMinimized(false); }}
                    style={{
                        position: 'fixed', bottom: '24px', right: `${baseRight}px`,
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        cursor: 'pointer', zIndex: 6000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', border: '2px solid #fff'
                    }}
                >
                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src="videos/Animated avatars/kling_20260207_Image_to_Video_It_moves_f_4075_0.mp4" type="video/mp4" />
                    </video>
                </motion.div>
            ) : (
                <motion.div
                    key="expert-box-container"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: `${baseRight}px`,
                        width: '400px',
                        maxWidth: 'calc(100vw - 32px)',
                        height: isMinimized ? 'auto' : '800px',
                        maxHeight: '90vh',
                        backgroundColor: colors.bg,
                        borderRadius: '15px',
                        boxShadow: colors.shadow,
                        display: 'flex',
                        flexDirection: 'column',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
                        zIndex: 5000,
                        overflow: 'hidden',
                        color: colors.text
                    }}
                >
                    {/* --- Drag Handle / Header --- */}
                    <div style={{
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 8px 0 12px',
                        flexShrink: 0,
                        backgroundColor: colors.bg
                    }}>
                        {/* Left Controls - Chats Dropdown Trigger */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <button
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                                    padding: '4px 6px', borderRadius: '4px', border: 'none', background: isHistoryOpen ? colors.bgSecondary : 'transparent',
                                    fontSize: '14px', fontWeight: '600', color: colors.text,
                                    transition: 'background 0.2s'
                                }}
                                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bgSecondary}
                                onMouseLeave={e => !isHistoryOpen && (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <span>Chats</span>
                                <ChevronRight size={12} color={colors.textSecondary} style={{ transform: isHistoryOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }} />
                            </button>
                        </div>

                        {/* Right Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {/* New Chat Button (+) */}
                            <button
                                title="Available soon"
                                style={{
                                    padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent',
                                    cursor: 'default', color: colors.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5
                                }}
                            >
                                <Plus size={18} />
                            </button>

                            {/* Minimize Button */}
                            <button
                                onClick={() => { setIsAvatarMode(true); setIsMinimized(true); }}
                                style={{
                                    padding: '4px', borderRadius: '4px', border: 'none', background: 'transparent',
                                    cursor: 'pointer', color: colors.text, display: 'flex', alignItems: 'center'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.bgSecondary}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <Minimize2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* --- Main Content --- */}
                    {renderContent()}

                    {/* --- Input Area (Stick to bottom) --- */}
                    {!isHistoryOpen && !['goal-selection', 'multi-select', 'dynamic-steps', 'dynamic-list'].includes(state.inputType) && (
                        <div style={{
                            padding: '12px 16px',
                            borderTop: `1px solid ${colors.border}`,
                            backgroundColor: colors.bg
                        }}>
                            {/* Input Box */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                backgroundColor: colors.bg,
                                borderRadius: '15px',
                                border: `1px solid ${colors.border}`,
                                padding: '10px 12px',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                                transition: 'border 0.2s',
                                position: 'relative'
                            }}
                                onClick={() => mainInputRef.current?.focus()}
                                onMouseEnter={e => e.currentTarget.style.borderColor = isDark ? '#444' : '#d0d0d0'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = colors.border}
                                onFocus={e => e.currentTarget.style.borderColor = isDark ? '#666' : '#a0a0a0'}
                                onBlur={e => e.currentTarget.style.borderColor = colors.border}
                            >
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <textarea
                                        ref={mainInputRef}
                                        value={inputValue}
                                        autoFocus
                                        onChange={(e) => {
                                            setInputValue(e.target.value);
                                            resizeTextarea(e.target);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder={t({ en: "Ask AI...", fr: "Demandez à l'IA..." })}
                                        rows={1}
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            resize: 'none',
                                            fontSize: '15px',
                                            lineHeight: '1.5',
                                            maxHeight: '150px',
                                            minHeight: '24px',
                                            fontFamily: 'inherit',
                                            color: colors.text,
                                            backgroundColor: 'transparent',
                                            opacity: (state.isTyping && !messageTyped) ? 0.6 : 1,
                                            pointerEvents: (state.isTyping && !messageTyped) ? 'none' : 'auto'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        <button style={{ padding: '6px', background: 'transparent', border: 'none', cursor: 'pointer', color: colors.iconSecondary, borderRadius: '4px' }} title="Attach">
                                            <Plus size={18} />
                                        </button>

                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '12px', color: colors.textSecondary, fontWeight: '500' }}>Auto</span>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!inputValue.trim()}
                                            style={{
                                                width: '28px', height: '28px',
                                                borderRadius: '50%',
                                                backgroundColor: inputValue.trim() ? (isDark ? '#fff' : '#000') : (isDark ? '#333' : '#f0f0f0'),
                                                border: 'none',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: inputValue.trim() ? 'pointer' : 'default',
                                                color: inputValue.trim() ? (isDark ? '#000' : '#fff') : (isDark ? '#666' : '#ccc'),
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <ArrowUp size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Updated Markdown Render ---
// --- Updated Markdown Render ---
const MessageWithMarkdown = ({ text, isDark }) => {
    if (!text) return null;
    const lines = text.split('\n');
    const color = isDark ? '#d4d4d4' : '#37352f';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} style={{ height: '8px' }} />;

                // Headers
                if (trimmed.startsWith('# ')) return <h1 key={i} style={{ fontSize: '20px', fontWeight: '700', margin: '8px 0 4px', color: color }}>{trimmed.substring(2)}</h1>;
                if (trimmed.startsWith('## ')) return <h2 key={i} style={{ fontSize: '18px', fontWeight: '600', margin: '8px 0 4px', color: color }}>{trimmed.substring(3)}</h2>;

                // Bullets
                if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                    // Check for bold parts
                    const parts = trimmed.substring(2).split(/(\*\*(?:[\s\S]*?)\*\*)/g);
                    return (
                        <div key={i} style={{ display: 'flex', gap: '8px', paddingLeft: '8px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '18px', lineHeight: '1', marginTop: '2px', color: color }}>•</span>
                            <span style={{ fontSize: '15px', lineHeight: '1.6', color: color }}>
                                {parts.map((p, j) => {
                                    if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2, -2)}</strong>;
                                    return p;
                                })}
                            </span>
                        </div>
                    );
                }

                // Standard Text with Bold Support
                const parts = trimmed.split(/(\*\*(?:[\s\S]*?)\*\*)/g);
                return (
                    <div key={i} style={{ fontSize: '15px', lineHeight: '1.6', color: color }}>
                        {parts.map((p, j) => {
                            if (p.startsWith('**') && p.endsWith('**')) return <strong key={j} style={{ fontWeight: 600 }}>{p.slice(2, -2)}</strong>;
                            return p;
                        })}
                    </div>
                );
            })}
        </div>
    );
};

const DynamicStepsInput = ({ onSubmit, initialSteps, placeholderType = 'step', isDark, colors, onHeightChange }) => {
    const [steps, setSteps] = useState(initialSteps || ['']);
    const inputRefs = useRef([]);
    const { t } = useLanguage();

    useEffect(() => { if (initialSteps) setSteps(initialSteps.length ? initialSteps : ['']); }, [initialSteps]);

    // Focus new step
    useEffect(() => {
        if (inputRefs.current[steps.length - 1]) inputRefs.current[steps.length - 1].focus();
    }, [steps.length]);

    const handleChange = (i, v) => { const n = [...steps]; n[i] = v; setSteps(n); };
    const addStep = () => {
        setSteps([...steps, '']);
        if (onHeightChange) setTimeout(onHeightChange, 50);
    };
    const removeStep = (i) => {
        setSteps(steps.filter((_, idx) => idx !== i));
        if (onHeightChange) setTimeout(onHeightChange, 50);
    };

    return (
        <div style={{ backgroundColor: colors?.bgSecondary || '#f9f9f9', padding: '16px', borderRadius: '8px', border: `1px solid ${colors?.border || '#e0e0e0'}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {steps.map((step, i) => (
                <motion.div
                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                    key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <div style={{ width: '20px', fontSize: '12px', color: colors?.textSecondary || '#999', fontWeight: '500', textAlign: 'center' }}>{i + 1}</div>
                    <input
                        ref={el => inputRefs.current[i] = el}
                        value={step} onChange={e => handleChange(i, e.target.value)}
                        placeholder={placeholderType === 'sub-activity' ? t({ en: "Sub-activity...", fr: "Sous-activité..." }) : t({ en: "Step...", fr: "Étape..." })}
                        style={{ flex: 1, padding: '8px 10px', border: `1px solid ${colors?.border || '#e0e0e0'}`, borderRadius: '4px', fontSize: '14px', outline: 'none', backgroundColor: colors?.inputBg || '#fff', color: colors?.text || '#000' }}
                        onFocus={e => e.target.style.borderColor = '#aaa'}
                        onBlur={e => e.target.style.borderColor = colors?.border || '#e0e0e0'}
                        onKeyDown={e => { if (e.key === 'Enter' && step.trim()) addStep(); }}
                    />
                    {steps.length > 1 && (
                        <button onClick={() => removeStep(i)} style={{ border: 'none', background: 'transparent', color: '#ccc', cursor: 'pointer', display: 'flex' }} tabIndex={-1}>
                            <X size={14} />
                        </button>
                    )}
                </motion.div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', alignItems: 'center' }}>
                <button onClick={addStep} style={{ fontSize: '13px', color: isDark ? '#fff' : '#444', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                    <Plus size={14} /> {t({ en: "Add step", fr: "Ajouter étape" })}
                </button>
                <button
                    onClick={() => steps.filter(s => s.trim()).length && onSubmit(steps.filter(s => s.trim()))}
                    disabled={!steps.filter(s => s.trim()).length}
                    style={{
                        fontSize: '13px',
                        backgroundColor: steps.filter(s => s.trim()).length ? (isDark ? '#fff' : '#000') : '#e0e0e0',
                        color: steps.filter(s => s.trim()).length ? (isDark ? '#000' : '#fff') : '#fff',
                        padding: '6px 14px', borderRadius: '4px', border: 'none',
                        cursor: steps.filter(s => s.trim()).length ? 'pointer' : 'default',
                        fontWeight: '500'
                    }}
                >
                    {t({ en: "Done", fr: "Terminé" })}
                </button>
            </div>
        </div>
    );
};

const MultiSelectInput = ({ options, onSubmit, isDark, colors, onHeightChange }) => {
    const [selected, setSelected] = useState([]);
    const [isOtherMode, setIsOtherMode] = useState(false);
    const { t } = useLanguage();

    // Add "Other" to options if not present
    const displayOptions = options.includes(t({ en: 'Other...', fr: 'Autre...' })) ? options : [...options, t({ en: 'Other...', fr: 'Autre...' })];

    const toggleOption = (opt) => {
        if (opt === t({ en: 'Other...', fr: 'Autre...' })) {
            setIsOtherMode(true);
            if (onHeightChange) setTimeout(onHeightChange, 50);
            return;
        }
        setSelected(prev =>
            prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
        );
    };

    if (isOtherMode) {
        return (
            <DynamicListInput
                onSubmit={(items) => onSubmit([...selected, ...items])}
                placeholder={t({ en: "Your other answers...", fr: "Vos autres réponses..." })}
                isDark={isDark}
                colors={colors}
                onCancel={() => {
                    setIsOtherMode(false);
                    if (onHeightChange) setTimeout(onHeightChange, 50);
                }}
                onHeightChange={onHeightChange}
            />
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {displayOptions.map((opt, i) => {
                    const isSelected = selected.includes(opt);
                    const isOther = opt === t({ en: 'Other...', fr: 'Autre...' });

                    return (
                        <button
                            key={i}
                            onClick={() => toggleOption(opt)}
                            style={{
                                padding: '8px 14px',
                                borderRadius: '6px',
                                border: `1px solid ${isSelected ? (isDark ? '#fff' : '#000') : colors?.border || '#e0e0e0'}`,
                                backgroundColor: isSelected ? (isDark ? '#fff' : '#000') : (isOther ? (isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb') : (colors?.bg || '#fff')),
                                color: isSelected ? (isDark ? '#000' : '#fff') : (colors?.text || '#000'),
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                    onClick={() => onSubmit(selected)}
                    disabled={selected.length === 0}
                    style={{
                        fontSize: '13px',
                        backgroundColor: selected.length > 0 ? (isDark ? '#fff' : '#000') : (isDark ? '#333' : '#e0e0e0'),
                        color: selected.length > 0 ? (isDark ? '#000' : '#fff') : (isDark ? '#666' : '#999'),
                        padding: '8px 20px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: selected.length > 0 ? 'pointer' : 'default',
                        fontWeight: '600',
                        boxShadow: selected.length > 0 ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    {t({ en: "Submit", fr: "Envoyer" })}
                </button>
            </div>
        </div>
    );
};

const DynamicListInput = ({ onSubmit, placeholder, isDark, colors, onCancel, onHeightChange }) => {
    const [items, setItems] = useState(['']);
    const inputRefs = useRef([]);
    const { t } = useLanguage();

    // Focus new input
    useEffect(() => {
        if (inputRefs.current[items.length - 1]) inputRefs.current[items.length - 1].focus();
    }, [items.length]);

    const handleChange = (i, v) => { const n = [...items]; n[i] = v; setItems(n); };
    const addItem = () => {
        setItems([...items, '']);
        if (onHeightChange) setTimeout(onHeightChange, 50);
    };
    const removeItem = (i) => {
        setItems(items.filter((_, idx) => idx !== i));
        if (onHeightChange) setTimeout(onHeightChange, 50);
    };

    return (
        <div style={{ backgroundColor: colors?.bgSecondary || '#f9f9f9', padding: '16px', borderRadius: '12px', border: `1px solid ${colors?.border || '#e0e0e0'}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: colors?.textSecondary || '#999', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                {t({ en: "Add your items bellow:", fr: "Ajoutez vos éléments ci-dessous :" })}
            </div>
            {items.map((item, i) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <input
                        ref={el => inputRefs.current[i] = el}
                        value={item} onChange={e => handleChange(i, e.target.value)}
                        placeholder={placeholder || t({ en: "Type here...", fr: "Tapez ici..." })}
                        style={{ flex: 1, padding: '10px 12px', border: `1px solid ${colors?.border || '#e0e0e0'}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: colors?.inputBg || '#fff', color: colors?.text || '#000' }}
                        onKeyDown={e => { if (e.key === 'Enter' && item.trim()) addItem(); }}
                    />
                    {items.length > 1 && (
                        <button onClick={() => removeItem(i)} style={{ border: 'none', background: 'transparent', color: colors?.iconSecondary || '#ccc', cursor: 'pointer', display: 'flex' }} tabIndex={-1}>
                            <X size={16} />
                        </button>
                    )}
                </motion.div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                <button onClick={addItem} style={{ fontSize: '13px', color: isDark ? '#fff' : '#444', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <Plus size={16} /> {t({ en: "Add another", fr: "Ajouter un autre" })}
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {onCancel && (
                        <button onClick={onCancel} style={{ fontSize: '13px', color: colors?.textSecondary || '#666', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                            {t({ en: "Cancel", fr: "Annuler" })}
                        </button>
                    )}
                    <button
                        onClick={() => items.filter(s => s.trim()).length && onSubmit(items.filter(s => s.trim()))}
                        disabled={!items.filter(s => s.trim()).length}
                        style={{
                            fontSize: '13px',
                            backgroundColor: items.filter(s => s.trim()).length ? (isDark ? '#fff' : '#000') : (isDark ? '#333' : '#e0e0e0'),
                            color: items.filter(s => s.trim()).length ? (isDark ? '#000' : '#fff') : (isDark ? '#666' : '#999'),
                            padding: '8px 18px', borderRadius: '8px', border: 'none',
                            cursor: items.filter(s => s.trim()).length ? 'pointer' : 'default',
                            fontWeight: '600',
                            boxShadow: items.filter(s => s.trim()).length ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        {t({ en: "Done", fr: "Terminé" })}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpertBox;

