import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, MessageCircle, Briefcase, Package, DollarSign, Heart, Hash, Target, Zap, Box, Layers, PenTool, Users, Network, Info, EyeOff, ChevronRight, Edit2, Check, X } from 'lucide-react';
import ActionPlanChecklist from './ActionPlanChecklist';
import OrganizeDashboard from './OrganizeDashboard';
import IntegrateActionPlan from './IntegrateActionPlan';
import OptimizeWorkspace from './OptimizeWorkspace';

import { useTheme } from '../../context/ThemeContext';

const PreviewSpace = ({
    data,
    phase,
    systemTrack,
    showIntro,
    isSidebarOpen, // Added prop
    hasAnsweredFirstQuestion,
    onActionPlanUpdate,
    onStartOrganize,
    onStartIntegrate,
    onIntegrateComplete,
    onSystemLibraryUpdate,
    onIntegratePlanUpdate,
    onOptimizeUpdate,
    onIntroFinish,
    onDataUpdate, // New prop
    scrollToSection,
    lastActivityTs,
    highlightKey,
    highlightTrigger,
    isPhaseStarted // New prop
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Theme Colors
    const THEME = {
        bg: isDark ? '#191919' : '#f6f6f6',
        cardBg: isDark ? '#202020' : '#fff',
        text: isDark ? '#FFFFFF' : '#333',
        textSecondary: isDark ? '#9B9A97' : '#666',
        border: isDark ? 'rgba(255, 255, 255, 0.1)' : '#eee',
        borderStrong: isDark ? 'rgba(255, 255, 255, 0.2)' : '#e0e0e0',
        tableHeader: isDark ? '#262626' : '#f3f4f6',
        tableText: isDark ? '#D4D4D4' : '#374151',
        accentBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5'
    };
    const containerRef = useRef(null);

    const defineRef = useRef(null);
    const teamRef = useRef(null);
    const extractionRef = useRef(null);
    const brainstormRef = useRef(null);
    const diyRef = useRef(null);
    const organizeRef = useRef(null);
    const integrateRef = useRef(null);
    const optimizeRef = useRef(null);
    const tableRowRefs = useRef([]);
    const teamCardRefs = useRef([]);
    const brainstormRowRefs = useRef([]);

    const [activeSection, setActiveSection] = useState(null);
    const [phaseSpotlight, setPhaseSpotlight] = useState(null);
    const [highlightedRowIndex, setHighlightedRowIndex] = useState(null);
    const [highlightedTeamIndex, setHighlightedTeamIndex] = useState(null);
    const [highlightedBrainstormRow, setHighlightedBrainstormRow] = useState(null);
    const [isIntegrateRevealed, setIsIntegrateRevealed] = useState(false);
    const [isOptimizeActivated, setIsOptimizeActivated] = useState(false);
    const [editingSection, setEditingSection] = useState(null); // 'team', 'extract', etc.
    const [editData, setEditData] = useState(null); // Temporary state for edits
    const [hiddenInfoCards, setHiddenInfoCards] = useState({
        ccf: true,
        team: true,
        extract: true,
        brainstorm: true,
        organize: true,
        integrate: true,
        optimize: true
    });
    const autoScrollTimeoutRef = useRef(null);
    const highlightTimeoutsRef = useRef({ row: null, team: null, brainstorm: null });
    const userScrollLockUntilRef = useRef(0);
    const isAutoScrollingRef = useRef(false);
    const prefersReducedMotionRef = useRef(false);
    const highlightDurationMs = 2800;
    const isGrowth = systemTrack === 'growth';

    // Infinite Canvas Drag-to-Scroll Logic
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const onMouseDown = (e) => {
        // Prevent drag on interactive elements
        if (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A'].includes(e.target.tagName) || e.target.closest('[role="button"]')) return;
        if (e.button !== 0) return;

        setIsDragging(true);
        setStartY(e.pageY - containerRef.current.offsetTop);
        setScrollTop(containerRef.current.scrollTop);
        userScrollLockUntilRef.current = Date.now() + 1200;
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const onMouseLeave = () => {
        setIsDragging(false);
        if (containerRef.current) containerRef.current.style.cursor = 'default'; // OR grab
    };

    const onMouseUp = () => {
        setIsDragging(false);
        if (containerRef.current) containerRef.current.style.cursor = 'grab';
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const y = e.pageY - containerRef.current.offsetTop;
        const walk = (y - startY) * 1.5; // Scroll speed multiplier
        containerRef.current.scrollTop = scrollTop - walk;
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => {
            prefersReducedMotionRef.current = media.matches;
        };
        updatePreference();
        if (media.addEventListener) {
            media.addEventListener('change', updatePreference);
        } else {
            media.addListener(updatePreference);
        }
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener('change', updatePreference);
            } else {
                media.removeListener(updatePreference);
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            if (autoScrollTimeoutRef.current) clearTimeout(autoScrollTimeoutRef.current);
            if (highlightTimeoutsRef.current.row) clearTimeout(highlightTimeoutsRef.current.row);
            if (highlightTimeoutsRef.current.team) clearTimeout(highlightTimeoutsRef.current.team);
            if (highlightTimeoutsRef.current.brainstorm) clearTimeout(highlightTimeoutsRef.current.brainstorm);
        };
    }, []);

    const getScrollBehavior = (behavior) => (
        behavior || (prefersReducedMotionRef.current ? 'auto' : 'smooth')
    );

    const markAutoScroll = (behavior) => {
        isAutoScrollingRef.current = true;
        const duration = behavior === 'auto' ? 0 : 450;
        if (autoScrollTimeoutRef.current) clearTimeout(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = setTimeout(() => {
            isAutoScrollingRef.current = false;
        }, duration);
    };

    const shouldDeferAutoScroll = () => (
        isDragging || userScrollLockUntilRef.current > Date.now()
    );

    const isElementInView = (element, { topOffset = 80, bottomOffset = 80 } = {}) => {
        if (!containerRef.current || !element) return false;
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        return (
            elementRect.top >= containerRect.top + topOffset &&
            elementRect.bottom <= containerRect.bottom - bottomOffset
        );
    };

    const scrollToPosition = (top, { behavior, force = false } = {}) => {
        if (!containerRef.current) return;
        if (!force && shouldDeferAutoScroll()) return;
        const container = containerRef.current;
        const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
        const nextTop = Math.min(Math.max(0, top), maxTop);
        if (!force && Math.abs(container.scrollTop - nextTop) < 8) return;
        const resolvedBehavior = getScrollBehavior(behavior);
        markAutoScroll(resolvedBehavior);
        container.scrollTo({ top: nextTop, behavior: resolvedBehavior });
    };

    const scrollElementIntoView = (element, { align = 'center', offset = 120, force = true, behavior } = {}) => {
        if (!element || !containerRef.current) return;
        if (!force && isElementInView(element)) return;
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        let targetTop = container.scrollTop + (elementRect.top - containerRect.top);
        if (align === 'center') {
            targetTop = targetTop - (containerRect.height / 2) + (elementRect.height / 2);
        } else {
            targetTop = targetTop - offset;
        }
        scrollToPosition(targetTop, { behavior, force });
    };

    const getDefineComplete = () => {
        if (isGrowth) {
            const gf = data.gf || {};
            return Boolean(
                gf.businessName &&
                (gf.finance?.length || 0) > 0 &&
                (gf.people?.length || 0) > 0 &&
                (gf.management?.length || 0) > 0 &&
                (gf.operations?.length || 0) > 0
            );
        }
        const ccf = data.ccf || {};
        return Boolean(
            ccf.businessName &&
            ccf.coreService &&
            ccf.targetClient &&
            (ccf.attention?.length || 0) > 0 &&
            (ccf.enquiry?.length || 0) > 0 &&
            (ccf.sales?.length || 0) > 0 &&
            (ccf.delivery?.length || 0) > 0 &&
            (ccf.money?.length || 0) > 0 &&
            (ccf.loyalty?.length || 0) > 0
        );
    };

    const getAssignComplete = () => {
        const depts = data.departments || [];
        if (!depts.length) return false;
        return depts.every((dept) => dept.head && dept.worker);
    };

    const getExtractComplete = () => {
        const registry = data.extractionRegistry || [];
        if (!registry.length) return false;
        return registry.every(item => item.standard);
    };

    // Trigger-based highlighting on answer submission
    useEffect(() => {
        if (!highlightTrigger) return;

        const { type, index, timestamp } = highlightTrigger;

        if (type === 'tableRow') {
            // Highlight table row
            setHighlightedRowIndex(index);

            // Scroll to the row
            requestAnimationFrame(() => {
                const rowElement = tableRowRefs.current[index];
                scrollElementIntoView(rowElement, { align: 'center', force: true });
            });

            // Remove highlight after 2 seconds
            if (highlightTimeoutsRef.current.row) {
                clearTimeout(highlightTimeoutsRef.current.row);
            }
            highlightTimeoutsRef.current.row = setTimeout(() => {
                setHighlightedRowIndex(null);
            }, highlightDurationMs);
        } else if (type === 'teamCard') {
            // Highlight team card row
            setHighlightedTeamIndex(index);

            // Scroll to team section
            requestAnimationFrame(() => {
                const teamRow = teamCardRefs.current[index] || teamRef.current;
                scrollElementIntoView(teamRow, { align: 'center', force: true });
            });

            // Remove highlight after 2 seconds
            if (highlightTimeoutsRef.current.team) {
                clearTimeout(highlightTimeoutsRef.current.team);
            }
            highlightTimeoutsRef.current.team = setTimeout(() => {
                setHighlightedTeamIndex(null);
            }, highlightDurationMs);
        } else if (type === 'brainstormRow') {
            const { deptIndex, respIndex } = highlightTrigger;
            setHighlightedBrainstormRow({ deptIndex, respIndex });

            requestAnimationFrame(() => {
                const rowElement = brainstormRowRefs.current[`${deptIndex}-${respIndex}`];
                scrollElementIntoView(rowElement, { align: 'center', force: true });
            });

            if (highlightTimeoutsRef.current.brainstorm) {
                clearTimeout(highlightTimeoutsRef.current.brainstorm);
            }
            highlightTimeoutsRef.current.brainstorm = setTimeout(() => {
                setHighlightedBrainstormRow(null);
            }, highlightDurationMs);
        }
    }, [highlightTrigger]);

    const getOrganizeComplete = () => {
        const library = data.systemLibrary || [];
        if (!library.length) return false;
        return library.some(sys => (sys.steps && sys.steps.length) || sys.overview || sys.goal);
    };

    const getIntegrateComplete = () => {
        const deptNames = (data.departments || []).map(d => d.name);
        if (!deptNames.length) return false;
        return deptNames.every((dept) => {
            const steps = data.integratePlan?.[dept]?.steps || {};
            return Object.values(steps).length >= 8 && Object.values(steps).every(Boolean);
        });
    };

    const getOptimizeComplete = () => {
        const kpis = data.optimize?.kpis || [];
        const problems = data.optimize?.problems || [];
        return kpis.length > 0 && problems.length > 0;
    };

    const toggleInfoCard = (id) => {
        setHiddenInfoCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const phaseStatus = {
        define: getDefineComplete(),
        assign: getAssignComplete(),
        extract: getExtractComplete(),
        organize: getOrganizeComplete(),
        integrate: getIntegrateComplete(),
        optimize: getOptimizeComplete()
    };

    const phaseOrder = ['define', 'assign', 'extract', 'organize', 'integrate', 'optimize'];
    const activeScrollPhase = activeSection || null;
    const currentPhaseId = ['brainstorm', 'diy_extraction'].includes(phase) ? 'extract' : phase;
    const currentIndex = phaseOrder.indexOf(currentPhaseId);
    const nextPhase = currentIndex >= 0 && currentIndex < phaseOrder.length - 1 ? phaseOrder[currentIndex + 1] : null;

    const revenueInfoCards = {
        ccf: {
            title: 'Critical Client Flow',
            eyebrow: 'DEFINE',
            icon: Network,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Map how attention becomes revenue so everyone sees the path a client takes.',
            points: [
                'Use current steps, not future ideas.',
                'Order matters. Keep it simple and real.'
            ],
            tip: 'If a step happens today, capture it.'
        },
        team: {
            title: 'Departments, Responsibilities, & Team Chart',
            eyebrow: 'ASSIGN',
            icon: Users,
            accent: isDark ? '#FFFFFF' : '#0f172a',
            description: 'Set ownership and accountability for every department.',
            points: [
                'One head per department.',
                'Name the worker who knows the work best.'
            ],
            tip: 'Ownership makes systems stick.'
        },
        extract: {
            title: 'Systems to Extract',
            eyebrow: 'EXTRACT',
            icon: Layers,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'List the core systems and decide how you will capture them.',
            points: [
                'Break big responsibilities into clear sub-activities.',
                'Pick the capture method and standard.'
            ],
            tip: 'Start with the highest revenue impact.'
        },
        brainstorm: {
            title: 'Systems Brainstorming',
            eyebrow: 'BRAINSTORM',
            icon: PenTool,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Expose the real work inside each responsibility.',
            points: [
                'Every responsibility becomes tasks and sub-tasks.',
                'The map reveals what to systemize next.'
            ],
            tip: 'If it repeats, it belongs here.'
        },
        organize: {
            title: 'System Library',
            eyebrow: 'ORGANIZE',
            icon: Box,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Store steps, tools, and owners in one trusted place.',
            points: [
                'Keep each system short and repeatable.',
                'Attach tools, files, and standards.'
            ],
            tip: 'Make it easy to follow, not just accurate.'
        },
        integrate: {
            title: 'Adoption Plan',
            eyebrow: 'INTEGRATE',
            icon: Target,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Turn systems into habits across the team.',
            points: [
                'Train, reinforce, and audit weekly.',
                'Link tasks to systems in daily work.'
            ],
            tip: 'Adoption beats documentation.'
        },
        optimize: {
            title: 'Optimization Loop',
            eyebrow: 'OPTIMIZE',
            icon: Zap,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Track KPIs and fix bottlenecks before they grow.',
            points: [
                'Log problems as they appear.',
                'Turn each issue into a system upgrade.'
            ],
            tip: 'Small improvements compound fast.'
        }
    };

    const growthInfoCards = {
        ccf: {
            title: 'Growth Systems Map',
            eyebrow: 'DEFINE',
            icon: Network,
            accent: isDark ? '#FFFFFF' : '#0f172a',
            description: 'Identify the mission-critical systems that make scaling possible.',
            points: [
                'Focus on Finance, Human Resources, and Management.',
                'Capture what you do now (HR hiring/onboarding are the exception).'
            ],
            tip: 'List the 5-8 most repeatable systems per department.'
        },
        team: {
            title: 'System Ownership',
            eyebrow: 'ASSIGN',
            icon: Users,
            accent: isDark ? '#FFFFFF' : '#0f172a',
            description: 'Assign leaders and knowledgeable workers for each growth system.',
            points: [
                'Ownership beats intention.',
                'Pick the person who already does it best.'
            ],
            tip: 'Clarity here removes single-person dependency.'
        },
        extract: {
            title: 'Growth Systems to Extract',
            eyebrow: 'EXTRACT',
            icon: Layers,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Capture the systems that keep scale stable and reliable.',
            points: [
                'Document current best practice first.',
                'Hiring/onboarding can be upgraded immediately.'
            ],
            tip: 'Simple beats perfect. Iterate later.'
        },
        brainstorm: {
            title: 'Systems Brainstorming',
            eyebrow: 'BRAINSTORM',
            icon: PenTool,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Expose the real work inside each responsibility.',
            points: [
                'Every responsibility becomes tasks and sub-tasks.',
                'The map reveals what to systemize next.'
            ],
            tip: 'If it repeats, it belongs here.'
        },
        organize: {
            title: 'System Library',
            eyebrow: 'ORGANIZE',
            icon: Box,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Store steps, tools, and owners in one trusted place.',
            points: [
                'Keep each system short and repeatable.',
                'Attach tools, files, and standards.'
            ],
            tip: 'Make it easy to follow, not just accurate.'
        },
        integrate: {
            title: 'Adoption Plan',
            eyebrow: 'INTEGRATE',
            icon: Target,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Turn growth systems into habits across the team.',
            points: [
                'Train, reinforce, and audit weekly.',
                'Link tasks to systems in daily work.'
            ],
            tip: 'Adoption beats documentation.'
        },
        optimize: {
            title: 'Optimization Loop',
            eyebrow: 'OPTIMIZE',
            icon: Zap,
            accent: isDark ? '#FFFFFF' : '#111827',
            description: 'Prepare for scale by removing bottlenecks early.',
            points: [
                'Log problems as they appear.',
                'Turn each issue into a system upgrade.'
            ],
            tip: 'Test scale with real vacations.'
        }
    };

    const infoCards = isGrowth ? growthInfoCards : revenueInfoCards;

    // Use editData if we are editing the flow, otherwise use data
    const flowData = (editingSection === 'define_flow' && editData) ? editData : data;

    const ccfFlowStages = [
        { key: 'attention', title: 'Attention', icon: Megaphone, items: flowData.ccf?.attention || [], ordered: false },
        { key: 'enquiry', title: 'Enquiry', icon: MessageCircle, items: flowData.ccf?.enquiry || [], ordered: false },
        { key: 'sales', title: 'Sales Process', icon: Briefcase, items: flowData.ccf?.sales || [], ordered: true },
        { key: 'delivery', title: 'Delivery', icon: Package, items: flowData.ccf?.delivery || [], ordered: true },
        { key: 'money', title: 'Money', icon: DollarSign, items: flowData.ccf?.money || [], ordered: false },
        { key: 'loyalty', title: 'Loyalty', icon: Heart, items: flowData.ccf?.loyalty || [], ordered: false }
    ];

    const gfFlowStages = [
        { key: 'finance', title: 'Finance', icon: DollarSign, items: flowData.gf?.finance || [], ordered: false },
        { key: 'people', title: 'People (HR)', icon: Users, items: flowData.gf?.people || [], ordered: false },
        { key: 'management', title: 'Management', icon: Network, items: flowData.gf?.management || [], ordered: false },
        { key: 'operations', title: 'Operations', icon: Box, items: flowData.gf?.operations || [], ordered: false }
    ];

    const flowStages = isGrowth ? gfFlowStages : ccfFlowStages;

    // If editing, show all stages so user can add content. Otherwise filter empty.
    const visibleFlowStages = (editingSection === 'define_flow')
        ? flowStages
        : flowStages.filter(stage => stage.items && stage.items.length > 0);

    const growthDepartments = (data.departments || []).filter(dept => (dept.responsibilities || []).length > 0);
    const totalGrowthSystems = growthDepartments.reduce((sum, dept) => sum + (dept.responsibilities?.length || 0), 0);

    const jumpToPhase = (phaseId) => {
        const refMap = {
            define: defineRef,
            assign: teamRef,
            extract: extractionRef,
            brainstorm: brainstormRef,
            organize: organizeRef,
            integrate: integrateRef,
            optimize: optimizeRef
        };
        const ref = refMap[phaseId];
        if (ref) scrollToRef(ref, { force: true });

        setPhaseSpotlight(phaseId);
        const timer = setTimeout(() => setPhaseSpotlight(null), 2200);
        return () => clearTimeout(timer);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let rafId = null;
        const handleScroll = () => {
            if (!isAutoScrollingRef.current) {
                userScrollLockUntilRef.current = Date.now() + 1200;
            }
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const scrollTop = container.scrollTop;
                const offsets = [
                    { id: 'define', top: defineRef.current?.offsetTop || 0 },
                    { id: 'assign', top: teamRef.current?.offsetTop || Number.MAX_SAFE_INTEGER },
                    { id: 'extract', top: extractionRef.current?.offsetTop || Number.MAX_SAFE_INTEGER },
                    { id: 'organize', top: organizeRef.current?.offsetTop || Number.MAX_SAFE_INTEGER },
                    { id: 'integrate', top: integrateRef.current?.offsetTop || Number.MAX_SAFE_INTEGER },
                    { id: 'optimize', top: optimizeRef.current?.offsetTop || Number.MAX_SAFE_INTEGER }
                ].sort((a, b) => a.top - b.top);

                let current = 'define';
                offsets.forEach((item) => {
                    if (scrollTop + 220 >= item.top) current = item.id;
                });
                setActiveSection(current);
            });
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            container.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToRef = (ref, { force = false, offset = 120, behavior } = {}) => {
        if (!containerRef.current) return;

        // If the ref is null, it might be because the component is still mounting the new section.
        // We retry for a few frames to ensure the element exists before giving up.
        if (!ref || !ref.current) {
            if (force && ref) {
                let attempts = 0;
                const retryScroll = () => {
                    if (ref.current) {
                        scrollToPosition(ref.current.offsetTop - offset, { behavior, force });
                    } else if (attempts < 10) {
                        attempts++;
                        requestAnimationFrame(retryScroll);
                    }
                };
                requestAnimationFrame(retryScroll);
            }
            // If ref is literally null (not just current), we scroll to top only if explicitly intended
            else if (!ref) {
                scrollToPosition(0, { behavior, force });
            }
            return;
        }

        if (!force && isElementInView(ref.current)) return;

        requestAnimationFrame(() => {
            if (ref.current) {
                scrollToPosition(ref.current.offsetTop - offset, { behavior, force });
            }
        });
    };

    // Auto-scroll on user activity (answering questions)
    useEffect(() => {
        if (!lastActivityTs || !containerRef.current) return;

        // Determine which section to highlight based on phase
        if (phase === 'define') setActiveSection('ccf');
        else if (phase === 'assign') setActiveSection('team');
        else if (phase === 'brainstorm') setActiveSection('brainstorm');
        else if (phase === 'extract') setActiveSection('extract');

        // If a row/card highlight is driving scroll, don't override it.
        if (highlightTrigger?.type === 'tableRow' || highlightTrigger?.type === 'teamCard' || highlightTrigger?.type === 'brainstormRow') return;

        const timer = setTimeout(() => {
            if (!containerRef.current) return;

            // Logic for phase-specific scrolling
            if (phase === 'define') {
                // For CCF, we scroll to bottom to see new questions, 
                // BUT only if we aren't about to transition.
                scrollToPosition(containerRef.current.scrollHeight, { force: true });
            }
            /* Removing auto-scroll on phase focus as per user request
            else if (phase === 'assign') {
                // Ensure we scroll to the TOP of the Team section
                scrollToRef(teamRef, { force: true, offset: 80 });
            } else if (phase === 'brainstorm') {
                scrollToRef(brainstormRef, { force: true, offset: 80 });
            } else if (phase === 'extract') {
                // Ensure we scroll to the TOP of the Systems to Extract section
                scrollToRef(extractionRef, { force: true, offset: 80 });
            }
            */
        }, 150);
        return () => clearTimeout(timer);
    }, [lastActivityTs, phase, highlightTrigger]);

    useEffect(() => {
        if (!scrollToSection) return;

        const target = typeof scrollToSection === 'object' ? scrollToSection.phase : scrollToSection;
        const noScroll = typeof scrollToSection === 'object' && scrollToSection.noScroll;

        if (!noScroll) {
            switch (target) {
                case 'define': scrollToRef(defineRef, { force: true }); break;
                case 'assign': scrollToRef(teamRef, { force: true }); break;
                case 'extract': scrollToRef(extractionRef, { force: true }); break;
                case 'brainstorm': scrollToRef(brainstormRef, { force: true }); break;
                case 'diy_extraction': scrollToRef(diyRef, { force: true }); break;
                case 'organize': scrollToRef(organizeRef, { force: true }); break;
                case 'integrate': scrollToRef(integrateRef, { force: true }); break;
                case 'optimize': scrollToRef(optimizeRef, { force: true }); break;
                default: break;
            }
        }

        if (typeof scrollToSection === 'object' && scrollToSection.highlight) {
            setPhaseSpotlight(target);
            const timer = setTimeout(() => setPhaseSpotlight(null), 2200);
            return () => clearTimeout(timer);
        }
    }, [scrollToSection]);

    const headingStyle = {
        fontSize: '24px',
        fontWeight: '700',
        color: isDark ? '#FFFFFF' : '#111',
        letterSpacing: '-0.02em',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    };

    const thStyle = {
        padding: '12px 16px',
        fontSize: '11px',
        fontWeight: '700',
        color: isDark ? '#FFFFFF' : '#444',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: `1px solid ${THEME.border}`,
        textAlign: 'left'
    };

    const tdStyle = {
        padding: '16px',
        fontSize: '14px',
        color: THEME.text,
        borderBottom: `1px solid ${THEME.accentBg}`,
        fontWeight: '450'
    };

    const tableHeaderStyle = {
        padding: '16px 24px',
        fontSize: '11px',
        fontWeight: '700',
        color: isDark ? '#FFFFFF' : '#444',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: `1px solid ${THEME.tableHeader}`
    };

    const tableCellStyle = {
        padding: '20px 24px',
        fontSize: '14px',
        color: THEME.tableText,
        borderBottom: `1px solid ${THEME.tableHeader}`
    };

    const tagStyle = {
        backgroundColor: THEME.accentBg,
        color: THEME.textSecondary,
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        border: `1px solid ${THEME.border}`,
        fontWeight: '500'
    };

    // Reset intro step when phase or intro state changes
    // Initialize reveal states based on phase
    useEffect(() => {
        if (phase === 'integrate' || phase === 'optimize') {
            setIsIntegrateRevealed(true);
        }
        if (phase === 'optimize') {
            setIsOptimizeActivated(true);
        }
    }, [phase]);

    useEffect(() => {
        // We defined IntroView at the bottom of the same file, 
        // but it's part of the same component's closure or a sub-component.
        // Actually IntroView is a sub-component defined at the end.
    }, [phase, showIntro]);

    // Removed automatic scroll on phase transition as per user request
    /*
    useEffect(() => {
        if (phase === 'assign') scrollToRef(teamRef, { force: true, offset: 80 });
        else if (phase === 'extract') scrollToRef(extractionRef, { force: true, offset: 80 });
        else if (phase === 'brainstorm') scrollToRef(brainstormRef, { force: true, offset: 80 });
        else if (phase === 'diy_extraction') scrollToRef(diyRef, { force: true, offset: 80 });
        else if (phase === 'organize') scrollToRef(organizeRef, { force: true, offset: 80 });
        else if (phase === 'integrate') scrollToRef(integrateRef, { force: true, offset: 80 });
        else if (phase === 'optimize') scrollToRef(optimizeRef, { force: true, offset: 80 });
    }, [phase]);
    */

    const handleEditStart = (section, initialData) => {
        setEditingSection(section);
        setEditData(JSON.parse(JSON.stringify(initialData)));
    };

    const handleEditCancel = () => {
        setEditingSection(null);
        setEditData(null);
    };

    const handleEditSave = () => {
        if (onDataUpdate && editData) {
            onDataUpdate(editData);
        }
        setEditingSection(null);
        setEditData(null);
    };

    return (
        <div
            ref={containerRef}
            className="whiteboard-scroll-container"
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            style={{
                backgroundColor: THEME.bg, // Light gray workspace
                borderRadius: '0',
                padding: `120px clamp(40px, 30vw, 520px) 120px ${isSidebarOpen ? '300px' : '112px'}`, // Extra right space to avoid ExpertBox overlap
                width: '100%',
                maxWidth: '100%', // Full width
                margin: '0 auto',
                flex: 1,
                height: '100%', // Parent handles height
                minHeight: '100vh',
                overflowY: 'auto',
                boxShadow: 'none',
                position: 'relative',
                cursor: 'grab', // Default cursor
                userSelect: isDragging ? 'none' : 'auto', // Prevent text selection while dragging
                // Subtle dot grid
                backgroundImage: isDark ? 'radial-gradient(rgba(255,255,255,0.05) 1.5px, transparent 1.5px)' : 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                .active-pulse {
                    animation: pulse-glow 2s ease-in-out;
                    border-radius: 8px;
                }
                @keyframes pulse-glow {
                    0% { background-color: rgba(66, 133, 244, 0.05); }
                    100% { background-color: transparent; }
                }
                .sop-row-highlight {
                    animation: sop-row-highlight 2.6s ease-out;
                    animation-fill-mode: both;
                    position: relative;
                    z-index: 2;
                }
                .sop-cell-highlight {
                    animation: sop-cell-highlight 2.2s ease-out;
                    animation-fill-mode: both;
                }
                @keyframes sop-row-highlight {
                    0% {
                        background-color: rgba(254, 243, 199, 0.2);
                        box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
                    }
                    30% {
                        background-color: rgba(254, 243, 199, 0.9);
                        box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.9),
                            0 8px 24px rgba(251, 191, 36, 0.25);
                    }
                    100% {
                        background-color: rgba(254, 243, 199, 0.6);
                        box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
                    }
                }
                @keyframes sop-cell-highlight {
                    0% { background-color: rgba(66, 133, 244, 0.12); }
                    50% { background-color: rgba(66, 133, 244, 0.2); }
                    100% { background-color: rgba(66, 133, 244, 0.08); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .sop-row-highlight,
                    .sop-cell-highlight {
                        animation: none;
                    }
                }
                .whiteboard-scroll-container::-webkit-scrollbar {
                    width: 6px;
                }
                .whiteboard-scroll-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .whiteboard-scroll-container::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                .whiteboard-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}} />
            <style dangerouslySetInnerHTML={{
                __html: `
                .phase-spotlight {
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.12), 0 20px 50px rgba(0,0,0,0.08);
                    border-radius: 24px;
                    background: linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01));
                    transition: all 0.4s ease;
                    padding: 12px;
                    margin: -12px;
                }
                .aha-banner {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255,255,255,0.7));
                    color: #fff;
                    padding: 18px 22px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                }
                .ccf-flow {
                    display: flex;
                    flex-direction: column;
                }
                .ccf-flow-row {
                    display: grid;
                    grid-template-columns: 72px 1fr;
                    align-items: stretch;
                }
                .ccf-flow-card {
                    transition: box-shadow 0.3s ease, transform 0.3s ease, background 0.3s ease;
                }
                .ccf-flow-highlight {
                    box-shadow: 0 0 0 2px ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}, 0 18px 40px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.06)'};
                    background: ${isDark ? 'linear-gradient(180deg, #ffffffff 0%, #ffffffff 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'};
                    transform: translateY(-2px);
                }
                .section-wrapper {
                    position: relative;
                    width: 100%;
                    margin: 0 auto 60px auto;
                }
                .section-main {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .section-main > * {
                    width: 100%;
                }
                .info-card-float {
                    position: absolute;
                    right: -320px;
                    top: 56px;
                    width: 280px;
                    z-index: 3;
                }
                .info-card {
                    background: ${isDark ? 'linear-gradient(180deg, #ffffffff 0%, #ffffffff 100%)' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'};
                    border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.12)'};
                    border-radius: 20px;
                    padding: 16px 16px 18px;
                    box-shadow: ${isDark ? '0 16px 40px rgba(0, 0, 0, 0.4)' : '0 16px 40px rgba(15, 23, 42, 0.08)'};
                }
                .info-card-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .info-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    background: ${isDark ? '#444' : '#111827'};
                    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2);
                }
                .info-title {
                    font-size: 14px;
                    font-weight: 800;
                    color: ${isDark ? '#FFFFFF' : '#111827'};
                    line-height: 1.2;
                }
                .info-eyebrow {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: ${isDark ? '#9B9A97' : '#6b7280'};
                    margin-top: 2px;
                }
                .info-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    margin-top: 6px;
                    flex-shrink: 0;
                }
                .info-toggle {
                    margin-left: auto;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'};
                    background: ${isDark ? '#333' : '#f9fafb'};
                    color: ${isDark ? '#FFFFFF' : '#111827'};
                    font-size: 11px;
                    font-weight: 700;
                    padding: 6px 10px;
                    border-radius: 999px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .info-toggle:hover {
                    background: ${isDark ? '#444' : '#111827'};
                    border-color: ${isDark ? '#444' : '#111827'};
                    color: #fff;
                }
                .info-desc {
                    font-size: 13px;
                    color: ${isDark ? '#9B9A97' : '#4b5563'};
                    line-height: 1.5;
                    margin-bottom: 10px;
                }
                .info-point {
                    display: flex;
                    gap: 8px;
                    font-size: 12px;
                    color: ${isDark ? '#9ca3af' : '#374151'};
                    line-height: 1.4;
                    margin-top: 6px;
                }
                .info-tip {
                    margin-top: 12px;
                    padding: 10px 12px;
                    border-radius: 14px;
                    background: ${isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'};
                    border: 1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'};
                    font-size: 12px;
                    font-weight: 700;
                    color: ${isDark ? '#FFFFFF' : '#111827'};
                }
                .learn-more-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #fff;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    padding: 8px 14px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    color: #111827;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .learn-more-badge:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 16px 30px rgba(0,0,0,0.14);
                }
                @media (max-width: 900px) {
                    .ccf-flow-row {
                        grid-template-columns: 52px 1fr;
                    }
                }
                @media (max-width: 1200px) {
                    .info-card-float {
                        position: static;
                        width: 100%;
                        max-width: 640px;
                        margin: 16px auto 0;
                    }
                }
                `}} />

            {/* Intros are now handled by Experimental ExpertBox directly */}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    width: '100%',
                    height: 'auto',
                    minHeight: '100%',
                    color: '#37352f',
                    paddingBottom: '40vh' // Space to scroll past ExpertBox
                }}
            >
                {/* Document Header */}
                <AnimatePresence>
                    {((data.ccf.businessName || data.ccf.coreService) && !showIntro) && (
                        <motion.header
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ marginBottom: '60px', paddingLeft: '10px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    {editingSection === 'define_header' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                                            <input
                                                type="text"
                                                value={editData?.ccf?.businessName || ''}
                                                onChange={(e) => setEditData({ ...editData, ccf: { ...editData.ccf, businessName: e.target.value } })}
                                                placeholder="Business Name"
                                                style={{
                                                    fontSize: '32px', fontWeight: '800',
                                                    padding: '8px', borderRadius: '8px',
                                                    backgroundColor: THEME.accentBg, color: THEME.text
                                                }}
                                            />
                                            <input
                                                type="text"
                                                value={editData?.ccf?.coreService || ''}
                                                onChange={(e) => setEditData({ ...editData, ccf: { ...editData.ccf, coreService: e.target.value } })}
                                                placeholder="Core Service (What it is)"
                                                style={{
                                                    fontSize: '16px', fontWeight: '500',
                                                    padding: '8px', borderRadius: '8px',
                                                    border: `1px solid ${THEME.border}`, width: '100%',
                                                    fontFamily: 'inherit', color: THEME.text,
                                                    backgroundColor: THEME.accentBg
                                                }}
                                            />
                                            <input
                                                type="text"
                                                value={editData?.ccf?.targetClient || ''}
                                                onChange={(e) => setEditData({ ...editData, ccf: { ...editData.ccf, targetClient: e.target.value } })}
                                                placeholder="Target Client"
                                                style={{
                                                    fontSize: '16px', fontWeight: '500',
                                                    padding: '8px', borderRadius: '8px',
                                                    border: `1px solid ${THEME.border}`, width: '100%',
                                                    fontFamily: 'inherit', color: THEME.text,
                                                    backgroundColor: THEME.accentBg
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 style={{
                                                fontSize: '42px',
                                                fontWeight: '800',
                                                marginBottom: '10px',
                                                letterSpacing: '-0.03em',
                                                lineHeight: 1.1,
                                                color: THEME.text
                                            }}>
                                                {data.ccf.businessName || data.ccf.coreService}
                                            </h1>

                                            {(data.ccf.coreService || data.ccf.targetClient) && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    style={{ marginTop: '10px', marginBottom: '18px' }}
                                                >
                                                    {data.ccf.coreService && (
                                                        <div style={{
                                                            color: THEME.textSecondary,
                                                            fontSize: '17px',
                                                            fontWeight: '500',
                                                            lineHeight: 1.45,
                                                            marginBottom: data.ccf.targetClient ? '10px' : '0'
                                                        }}>
                                                            <span style={{ color: THEME.text, fontWeight: '700' }}>What it is:</span> {data.ccf.coreService}
                                                        </div>
                                                    )}
                                                    {data.ccf.targetClient && (
                                                        <div style={{
                                                            color: THEME.textSecondary,
                                                            fontSize: '17px',
                                                            fontWeight: '500',
                                                            lineHeight: 1.45
                                                        }}>
                                                            <span style={{ color: THEME.text, fontWeight: '700' }}>Client:</span> {data.ccf.targetClient}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {editingSection === 'define_header' ? (
                                    <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                                        <button onClick={handleEditCancel} style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${THEME.border}`, background: THEME.cardBg, color: THEME.text, cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                                        <button onClick={handleEditSave} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: isDark ? '#fff' : '#111', color: isDark ? '#000' : '#fff', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleEditStart('define_header', { ccf: data.ccf })}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 12px', borderRadius: '8px',
                                            border: '1px solid transparent', background: 'transparent',
                                            color: isDark ? '#9B9A97' : '#9ca3af', fontSize: '13px', fontWeight: '600',
                                            cursor: 'pointer', marginLeft: '20px'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'; e.currentTarget.style.color = isDark ? '#fff' : '#374151'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#9B9A97' : '#9ca3af'; }}
                                    >
                                        <Edit2 size={14} /> Modify
                                    </button>
                                )}
                            </div>
                        </motion.header>
                    )}
                </AnimatePresence>

                {/* Removed redundant Phase Dock */}

                {/* Content Area */}
                <div className="document-content">
                    {(!isPhaseStarted && (phase === 'define' || !data.ccf.businessName)) ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '600px',
                            textAlign: 'center',
                            color: THEME.textSecondary,
                            gap: '20px',
                            padding: '40px'
                        }}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '24px',
                                    backgroundColor: THEME.accentBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '20px'
                                }}
                            >
                                <Target size={40} color={THEME.text} />
                            </motion.div>
                            <h2 style={{ fontSize: '28px', fontWeight: '800', color: THEME.text, margin: 0 }}>
                                {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
                            </h2>
                            <p style={{ fontSize: '18px', maxWidth: '500px', lineHeight: '1.6', margin: 0 }}>
                                {isDark ? "Ready to begin mapping your systems?" : "Prêt à commencer la cartographie de vos systèmes ? Cliquez sur 'Commencer' dans la boîte Expert pour révéler le cadre."}
                            </p>
                            <div style={{
                                marginTop: '20px',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: `1px dashed ${THEME.border}`,
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                {isDark ? "Waiting for action..." : "En attente d'action..."}
                            </div>
                        </div>
                    ) : (
                        <>
                            <AnimatePresence>
                                {!isGrowth && (data.ccf.businessName && data.ccf.coreService && data.ccf.targetClient) && (
                                    <SectionWithInfo
                                        info={infoCards.ccf}
                                        isHidden={hiddenInfoCards.ccf}
                                        onToggle={() => toggleInfoCard('ccf')}
                                        cardStyle={{ top: '60px' }}
                                    >
                                        <motion.div
                                            ref={defineRef}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={activeSection === 'ccf' ? 'active-pulse' : ''}
                                            style={{
                                                background: THEME.cardBg,
                                                borderRadius: '24px',
                                                padding: '32px',
                                                boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px -10px rgba(0,0,0,0.05)',
                                                border: `1px solid ${THEME.border}`,
                                                maxWidth: '800px',
                                                position: 'relative'
                                            }}
                                        >

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                                                <h2 style={{ ...headingStyle, marginBottom: 0 }}>
                                                    {isGrowth ? 'Growth Systems Map' : 'Critical Client Flow'}
                                                </h2>
                                                {editingSection === 'define_flow' ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <button onClick={handleEditCancel} style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${THEME.border}`, background: THEME.cardBg, color: THEME.text, cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                                                        <button onClick={handleEditSave} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: isDark ? '#fff' : '#111', color: isDark ? '#000' : '#fff', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditStart('define_flow', data)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '6px',
                                                            padding: '8px 12px', borderRadius: '8px',
                                                            border: '1px solid transparent', background: 'transparent',
                                                            color: THEME.textSecondary, fontSize: '13px', fontWeight: '600',
                                                            cursor: 'pointer', transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = THEME.tableHeader; e.currentTarget.style.color = THEME.text; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = THEME.textSecondary; }}
                                                    >
                                                        <Edit2 size={14} /> Modify
                                                    </button>
                                                )}
                                            </div>

                                            <div className="ccf-flow">
                                                {visibleFlowStages.map((stage, index) => {
                                                    const Icon = stage.icon;
                                                    const isHighlighted = highlightKey === `ccf.${stage.key}`;
                                                    const isLast = index === visibleFlowStages.length - 1;
                                                    return (
                                                        <div key={stage.key} className="ccf-flow-row">
                                                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: index === 0 ? '26px' : '0',
                                                                    bottom: isLast ? 'auto' : '0',
                                                                    height: isLast ? '26px' : 'auto',
                                                                    width: '2px',
                                                                    backgroundColor: '#e5e7eb'
                                                                }} />
                                                                <div style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: THEME.bg,
                                                                    border: `2px solid ${THEME.text}`,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    fontSize: '12px',
                                                                    fontWeight: '800',
                                                                    color: THEME.text,
                                                                    marginTop: '10px',
                                                                    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                                                                    zIndex: 2, // Ensure circle is above the line
                                                                    position: 'relative' // Needed for z-index
                                                                }}>
                                                                    {index + 1}
                                                                </div>
                                                            </div>
                                                            <div style={{ position: 'relative', paddingBottom: isLast ? 0 : '26px' }}>
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    left: '-40px',
                                                                    top: '26px',
                                                                    width: '40px',
                                                                    height: '2px',
                                                                    backgroundColor: '#e5e7eb'
                                                                }} />
                                                                <motion.div
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{
                                                                        duration: 0.5,
                                                                        delay: index * 0.1,
                                                                        ease: [0.16, 1, 0.3, 1]
                                                                    }}
                                                                    className={`ccf-flow-card ${isHighlighted ? 'ccf-flow-highlight' : ''}`}
                                                                    style={{
                                                                        padding: '16px 18px',
                                                                        borderRadius: '18px',
                                                                        border: `1px solid ${THEME.border}`,
                                                                        backgroundColor: THEME.cardBg,
                                                                        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 24px rgba(0,0,0,0.06)'
                                                                    }}
                                                                >
                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                                        <div style={{
                                                                            width: '30px',
                                                                            height: '30px',
                                                                            borderRadius: '10px',
                                                                            backgroundColor: isHighlighted ? 'rgba(0,0,0,0.05)' : THEME.tableHeader,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            color: isHighlighted ? '#111827' : THEME.text
                                                                        }}>
                                                                            <Icon size={16} />
                                                                        </div>
                                                                        <div style={{ fontSize: '16px', fontWeight: '800', color: isHighlighted ? '#111827' : THEME.text }}>{stage.title}</div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                        {editingSection === 'define_flow' ? (
                                                                            <textarea
                                                                                value={(stage.items || []).join('\n')}
                                                                                onChange={(e) => {
                                                                                    const newVal = e.target.value.split('\n').filter(s => s.trim());
                                                                                    if (isGrowth) {
                                                                                        setEditData({ ...editData, gf: { ...editData.gf, [stage.key]: newVal } });
                                                                                    } else {
                                                                                        setEditData({ ...editData, ccf: { ...editData.ccf, [stage.key]: newVal } });
                                                                                    }
                                                                                }}
                                                                                placeholder="List items (one per line)..."
                                                                                style={{
                                                                                    width: '100%',
                                                                                    minHeight: '80px',
                                                                                    padding: '8px',
                                                                                    borderRadius: '6px',
                                                                                    border: '1px solid #e5e7eb',
                                                                                    fontSize: '13px',
                                                                                    fontFamily: 'inherit',
                                                                                    lineHeight: '1.5'
                                                                                }}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                        ) : (
                                                                            stage.items.map((item, itemIndex) => (
                                                                                <span
                                                                                    key={`${stage.key}-${itemIndex}`}
                                                                                    style={{
                                                                                        padding: '6px 12px',
                                                                                        borderRadius: '999px',
                                                                                        backgroundColor: '#f9fafb',
                                                                                        border: '1px solid #eef2f6',
                                                                                        fontSize: '13px',
                                                                                        fontWeight: '600',
                                                                                        color: '#1f2937'
                                                                                    }}
                                                                                >
                                                                                    {stage.ordered ? `${itemIndex + 1}. ${item}` : item}
                                                                                </span>
                                                                            ))
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    </SectionWithInfo>
                                )}
                            </AnimatePresence>

                            {/* Growth Systems Map */}
                            <AnimatePresence>
                                {isGrowth && growthDepartments.length > 0 && (
                                    <SectionWithInfo
                                        info={infoCards.ccf}
                                        isHidden={hiddenInfoCards.ccf}
                                        onToggle={() => toggleInfoCard('ccf')}
                                        cardStyle={{ top: '60px' }}
                                    >
                                        <motion.div
                                            ref={defineRef}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={activeSection === 'ccf' ? 'active-pulse' : ''}
                                            style={{
                                                background: THEME.cardBg,
                                                borderRadius: '24px',
                                                padding: '32px',
                                                boxShadow: isDark ? '0 1px 12px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px -10px rgba(0,0,0,0.05)',
                                                border: `1px solid ${THEME.border}`,
                                                maxWidth: '900px',
                                                position: 'relative'
                                            }}
                                        >

                                            <h2 style={headingStyle}>
                                                Growth Systems Map
                                            </h2>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '20px'
                                            }}>
                                                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                                    Total systems captured: <strong style={{ color: THEME.text }}>{totalGrowthSystems}</strong>
                                                </div>
                                                <div style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#f8fafc',
                                                    borderRadius: '999px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    color: '#0f172a'
                                                }}>
                                                    Finance / HR / Management
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                                gap: '16px'
                                            }}>
                                                {growthDepartments.map((dept, idx) => (
                                                    <div
                                                        key={`${dept.name}-${idx}`}
                                                        style={{
                                                            borderRadius: '18px',
                                                            border: `1px solid ${THEME.border}`,
                                                            backgroundColor: THEME.cardBg,
                                                            padding: '16px',
                                                            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.2)' : '0 8px 20px rgba(0,0,0,0.04)'
                                                        }}
                                                    >
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            marginBottom: '12px'
                                                        }}>
                                                            <div style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                borderRadius: '10px',
                                                                backgroundColor: isDark ? '#fff' : '#111',
                                                                color: isDark ? '#000' : '#fff',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px',
                                                                fontWeight: '800'
                                                            }}>
                                                                {dept.name?.charAt(0) || '?'}
                                                            </div>
                                                            <div style={{ fontSize: '15px', fontWeight: '800', color: THEME.text }}>{dept.name}</div>
                                                            <div style={{
                                                                marginLeft: 'auto',
                                                                fontSize: '11px',
                                                                fontWeight: '700',
                                                                color: '#64748b'
                                                            }}>
                                                                {(dept.responsibilities || []).length} systems
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                            {(dept.responsibilities || []).map((system, sysIndex) => (
                                                                <span key={`${dept.name}-system-${sysIndex}`} style={tagStyle}>
                                                                    {system}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </SectionWithInfo>
                                )}
                            </AnimatePresence>

                            {/* Team Structure - Persist after Assign phase */}
                            {(phase === 'assign' || (data.departments && data.departments.length > 0 && ['extract', 'brainstorm', 'diy_extraction', 'organize', 'integrate', 'optimize'].includes(phase))) && (
                                <SectionWithInfo
                                    info={infoCards.team}
                                    isHidden={hiddenInfoCards.team}
                                    onToggle={() => toggleInfoCard('team')}
                                    cardStyle={{ top: '80px' }}
                                >
                                    <div ref={teamRef} className={activeSection === 'team' ? 'active-pulse' : ''} style={{
                                        background: THEME.cardBg,
                                        borderRadius: '24px',
                                        padding: '32px',
                                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px -10px rgba(0,0,0,0.05)',
                                        border: `1px solid ${THEME.border}`,
                                        maxWidth: '900px',
                                        position: 'relative'
                                    }}>


                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                            <h2 style={{ ...headingStyle, marginBottom: 0 }}>
                                                Departments, Responsibilities, & Team Chart
                                            </h2>
                                            {editingSection === 'team' ? (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '6px',
                                                            padding: '8px 12px', borderRadius: '8px',
                                                            border: `1px solid ${THEME.border}`, background: THEME.cardBg,
                                                            color: THEME.text, fontSize: '13px', fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleEditSave}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '6px',
                                                            padding: '8px 12px', borderRadius: '8px',
                                                            border: 'none', background: isDark ? '#fff' : '#111',
                                                            color: isDark ? '#000' : '#fff', fontSize: '13px', fontWeight: '600',
                                                            cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <Check size={14} /> Save Changes
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditStart('team', { departments: data.departments })}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        padding: '8px 12px', borderRadius: '8px',
                                                        border: '1px solid transparent', background: 'transparent',
                                                        color: isDark ? '#9B9A97' : '#9ca3af', fontSize: '13px', fontWeight: '600',
                                                        cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'; e.currentTarget.style.color = isDark ? '#fff' : '#374151'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#9B9A97' : '#9ca3af'; }}
                                                >
                                                    <Edit2 size={14} /> Modify
                                                </button>
                                            )}
                                        </div>
                                        <PhaseHero
                                            title="Assign"
                                            isDark={isDark}
                                            description="This chart maps who is responsible for what. Use it to ensure every critical function has a clear owner (Head) and a doer (Key Worker)."
                                            status={phaseStatus.assign}
                                        />
                                        {/* Team Chart Table */}
                                        <div className="table-wrapper" style={{ overflowX: 'auto', width: '100%' }}>
                                            <style dangerouslySetInnerHTML={{
                                                __html: `
                                        @media (max-width: 768px) {
                                            .table-wrapper table {
                                                font-size: 13px;
                                            }
                                            .table-wrapper th,
                                            .table-wrapper td {
                                                padding: 12px !important;
                                            }
                                        }
                                    `
                                            }} />
                                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: `1px solid ${THEME.border}` }}>
                                                        <th style={thStyle}>Department</th>
                                                        <th style={thStyle}>Responsibilities</th>
                                                        <th style={thStyle}>Head</th>
                                                        <th style={thStyle}>Key Worker</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(editingSection === 'team' && editData?.departments ? editData.departments : data.departments).map((dept, i) => {
                                                        const isTeamHighlighted = highlightedTeamIndex === i;
                                                        return (
                                                            <tr
                                                                key={i}
                                                                ref={el => teamCardRefs.current[i] = el}
                                                                className={isTeamHighlighted ? 'sop-row-highlight' : ''}
                                                                style={{
                                                                    borderBottom: `1px solid ${THEME.border}`,
                                                                    backgroundColor: isTeamHighlighted ? (isDark ? 'rgba(255,255,255,0.03)' : undefined) : 'transparent',
                                                                    transition: 'background 0.6s ease, box-shadow 0.6s ease'
                                                                }}>
                                                                <td style={tdStyle}>
                                                                    {editingSection === 'team' ? (
                                                                        <input
                                                                            type="text"
                                                                            value={dept.name}
                                                                            onChange={(e) => {
                                                                                const newDepts = [...editData.departments];
                                                                                newDepts[i].name = e.target.value;
                                                                                setEditData({ ...editData, departments: newDepts });
                                                                            }}
                                                                            style={{
                                                                                width: '100%', padding: '8px', borderRadius: '6px',
                                                                                border: '1px solid #e5e7eb', fontSize: '14px',
                                                                                fontFamily: 'inherit'
                                                                            }}
                                                                        />
                                                                    ) : dept.name}
                                                                </td>
                                                                <td style={tdStyle}>
                                                                    {editingSection === 'team' ? (
                                                                        <textarea
                                                                            value={(dept.responsibilities || []).join(', ')}
                                                                            onChange={(e) => {
                                                                                const newDepts = [...editData.departments];
                                                                                newDepts[i].responsibilities = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                                                setEditData({ ...editData, departments: newDepts });
                                                                            }}
                                                                            style={{
                                                                                width: '100%', padding: '8px', borderRadius: '6px',
                                                                                border: '1px solid #e5e7eb', fontSize: '13px',
                                                                                fontFamily: 'inherit', minHeight: '60px'
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                                            {(Array.isArray(dept.responsibilities) ? dept.responsibilities : []).map((r, ri) => (
                                                                                <span key={ri} style={tagStyle}>{r}</span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td
                                                                    className={highlightKey === `team.${i}.head` ? 'sop-cell-highlight' : ''}
                                                                    style={{ ...tdStyle, transition: 'background-color 0.5s', backgroundColor: highlightKey === `team.${i}.head` ? 'rgba(66, 133, 244, 0.12)' : 'transparent' }}
                                                                >
                                                                    {editingSection === 'team' ? (
                                                                        <input
                                                                            type="text"
                                                                            value={dept.head || ''}
                                                                            placeholder="Name..."
                                                                            onChange={(e) => {
                                                                                const newDepts = [...editData.departments];
                                                                                newDepts[i].head = e.target.value;
                                                                                setEditData({ ...editData, departments: newDepts });
                                                                            }}
                                                                            style={{
                                                                                width: '100%', padding: '8px', borderRadius: '6px',
                                                                                border: '1px solid #e5e7eb', fontSize: '14px',
                                                                                fontFamily: 'inherit'
                                                                            }}
                                                                        />
                                                                    ) : (dept.head || '---')}
                                                                </td>
                                                                <td
                                                                    className={highlightKey === `team.${i}.worker` ? 'sop-cell-highlight' : ''}
                                                                    style={{ ...tdStyle, transition: 'background-color 0.5s', backgroundColor: highlightKey === `team.${i}.worker` ? 'rgba(66, 133, 244, 0.12)' : 'transparent' }}
                                                                >
                                                                    {editingSection === 'team' ? (
                                                                        <input
                                                                            type="text"
                                                                            value={dept.worker || ''}
                                                                            placeholder="Name..."
                                                                            onChange={(e) => {
                                                                                const newDepts = [...editData.departments];
                                                                                newDepts[i].worker = e.target.value;
                                                                                setEditData({ ...editData, departments: newDepts });
                                                                            }}
                                                                            style={{
                                                                                width: '100%', padding: '8px', borderRadius: '6px',
                                                                                border: '1px solid #e5e7eb', fontSize: '14px',
                                                                                fontFamily: 'inherit'
                                                                            }}
                                                                        />
                                                                    ) : (dept.worker || '---')}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </SectionWithInfo>
                            )}

                            {/* Extract Phase Content - Systems to Extract Table */}
                            {(phase === 'extract' || phase === 'brainstorm' || phase === 'diy_extraction' || phase === 'organize' || phase === 'integrate' || phase === 'optimize') && (
                                <SectionWithInfo
                                    info={infoCards.extract}
                                    isHidden={hiddenInfoCards.extract}
                                    onToggle={() => toggleInfoCard('extract')}
                                    cardStyle={{ top: '92px' }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                        <div ref={extractionRef} style={{
                                            background: THEME.cardBg,
                                            borderRadius: '24px',
                                            padding: '32px',
                                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px -10px rgba(0,0,0,0.05)',
                                            border: `1px solid ${THEME.border}`,
                                            maxWidth: '1050px',
                                            position: 'relative'
                                        }}>
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                    <h2 style={{ ...headingStyle, marginBottom: 0 }}>
                                                        Systems to Extract
                                                    </h2>
                                                    {editingSection === 'extract' ? (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                onClick={handleEditCancel}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                                    padding: '8px 12px', borderRadius: '8px',
                                                                    border: `1px solid ${THEME.border}`, background: THEME.cardBg,
                                                                    color: THEME.text, fontSize: '13px', fontWeight: '600',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                <X size={14} /> Cancel
                                                            </button>
                                                            <button
                                                                onClick={handleEditSave}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                                    padding: '8px 12px', borderRadius: '8px',
                                                                    border: 'none', background: '#111',
                                                                    color: '#fff', fontSize: '13px', fontWeight: '600',
                                                                    cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                                }}
                                                            >
                                                                <Check size={14} /> Save Changes
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditStart('extract', { extractionRegistry: data.extractionRegistry })}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                                padding: '8px 12px', borderRadius: '8px',
                                                                border: '1px solid transparent', background: 'transparent',
                                                                color: isDark ? '#9B9A97' : '#9ca3af', fontSize: '13px', fontWeight: '600',
                                                                cursor: 'pointer', transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'; e.currentTarget.style.color = isDark ? '#fff' : '#374151'; }}
                                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDark ? '#9B9A97' : '#9ca3af'; }}
                                                        >
                                                            <Edit2 size={14} /> Modify
                                                        </button>
                                                    )}
                                                </div>
                                                <PhaseHero
                                                    title="Extract"
                                                    isDark={isDark}
                                                    description="This registry lists every system you need to build. Decide the best format (video, text, etc.) to capture it quickly."
                                                    status={phaseStatus.extract}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    bottom: '20px',
                                                    padding: '8px 16px',
                                                    backgroundColor: isDark ? '#fff' : '#000',
                                                    color: isDark ? '#000' : '#fff',
                                                    borderRadius: '20px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    letterSpacing: '0.05em',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {(data.extractionRegistry || []).filter(i => i.method).length} / {(data.extractionRegistry || []).length} Mapped
                                                </div>
                                            </div>

                                            <div style={{
                                                overflow: 'auto',
                                                borderRadius: '24px',
                                                border: `1px solid ${THEME.border}`,
                                                backgroundColor: THEME.cardBg,
                                                boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 40px rgba(0,0,0,0.04)'
                                            }}>
                                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                                    <thead>
                                                        <tr style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#1a1a1a' }}>
                                                            <th style={{ ...tableHeaderStyle, paddingLeft: '32px', color: '#fff' }}>Department</th>
                                                            <th style={{ ...tableHeaderStyle, color: '#fff' }}>Responsibility</th>
                                                            <th style={{ ...tableHeaderStyle, color: '#fff' }}>Sub-activity</th>
                                                            <th style={{ ...tableHeaderStyle, color: '#fff' }}>Knowledge Worker</th>
                                                            <th style={{ ...tableHeaderStyle, color: '#fff' }}>Method</th>
                                                            <th style={{ ...tableHeaderStyle, paddingRight: '32px', color: '#fff' }}>Standard</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {(editingSection === 'extract' && editData?.extractionRegistry ? editData.extractionRegistry : (data.extractionRegistry || [])).length > 0 ? (
                                                            (editingSection === 'extract' && editData?.extractionRegistry ? editData.extractionRegistry : data.extractionRegistry).map((item, i) => {
                                                                const isRowHighlighted = highlightedRowIndex === i;
                                                                return (
                                                                    <tr
                                                                        key={i}
                                                                        ref={el => tableRowRefs.current[i] = el}
                                                                        className={isRowHighlighted ? 'sop-row-highlight' : ''}
                                                                        style={{
                                                                            borderBottom: i === data.extractionRegistry.length - 1 ? 'none' : `1px solid ${THEME.border}`,
                                                                            backgroundColor: isRowHighlighted ? (isDark ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.05)') : THEME.cardBg,
                                                                            transition: 'background 0.6s ease, box-shadow 0.6s ease'
                                                                        }}>
                                                                        <td style={{ ...tableCellStyle, paddingLeft: '32px', fontWeight: '700', fontSize: '13px', color: THEME.text }}>{item.department}</td>
                                                                        <td style={{ ...tableCellStyle, color: THEME.textSecondary }}>{item.responsibility}</td>
                                                                        <td style={{ ...tableCellStyle, color: THEME.text, fontWeight: '600' }}>
                                                                            {editingSection === 'extract' ? (
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.subActivity || ''}
                                                                                    onChange={(e) => {
                                                                                        const newReg = [...editData.extractionRegistry];
                                                                                        newReg[i] = { ...newReg[i], subActivity: e.target.value };
                                                                                        setEditData({ ...editData, extractionRegistry: newReg });
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%', padding: '4px 8px', borderRadius: '6px',
                                                                                        border: '1px solid #e5e7eb', fontSize: '13px',
                                                                                        fontFamily: 'inherit'
                                                                                    }}
                                                                                />
                                                                            ) : item.subActivity}
                                                                        </td>
                                                                        <td style={tableCellStyle}>
                                                                            {editingSection === 'extract' ? (
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.worker || ''}
                                                                                    onChange={(e) => {
                                                                                        const newReg = [...editData.extractionRegistry];
                                                                                        newReg[i] = { ...newReg[i], worker: e.target.value };
                                                                                        setEditData({ ...editData, extractionRegistry: newReg });
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%', padding: '4px 8px', borderRadius: '6px',
                                                                                        border: '1px solid #e5e7eb', fontSize: '13px',
                                                                                        fontFamily: 'inherit'
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                                    <div style={{
                                                                                        width: '26px',
                                                                                        height: '26px',
                                                                                        borderRadius: '50%',
                                                                                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0',
                                                                                        color: THEME.text,
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'center',
                                                                                        fontSize: '11px',
                                                                                        fontWeight: '700',
                                                                                        border: `1px solid ${THEME.border}`
                                                                                    }}>
                                                                                        {item.worker ? item.worker.charAt(0).toUpperCase() : '?'}
                                                                                    </div>
                                                                                    <span style={{ fontSize: '13px', fontWeight: '600', color: THEME.text }}>{item.worker || '---'}</span>
                                                                                </div>
                                                                            )}
                                                                        </td>
                                                                        <td style={{ ...tableCellStyle, paddingRight: '0px' }}>
                                                                            {editingSection === 'extract' ? (
                                                                                <select
                                                                                    value={item.method || ''}
                                                                                    onChange={(e) => {
                                                                                        const newReg = [...editData.extractionRegistry];
                                                                                        newReg[i] = { ...newReg[i], method: e.target.value };
                                                                                        setEditData({ ...editData, extractionRegistry: newReg });
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%', padding: '4px 8px', borderRadius: '6px',
                                                                                        border: '1px solid #e5e7eb', fontSize: '11px', fontWeight: '700',
                                                                                        fontFamily: 'inherit', textTransform: 'uppercase'
                                                                                    }}
                                                                                >
                                                                                    <option value="">Select...</option>
                                                                                    {['Screen Recording', 'Camera/GoPro', 'Audio Notes', 'Role-play', 'Other', 'Text/SOP'].map(opt => (
                                                                                        <option key={opt} value={opt}>{opt}</option>
                                                                                    ))}
                                                                                </select>
                                                                            ) : (
                                                                                item.method ? (
                                                                                    <motion.span
                                                                                        initial={{ scale: 0.9, opacity: 0 }}
                                                                                        animate={{ scale: 1, opacity: 1 }}
                                                                                        style={{
                                                                                            display: 'inline-block',
                                                                                            padding: '4px 12px',
                                                                                            backgroundColor: isDark ? '#fff' : '#000',
                                                                                            color: isDark ? '#000' : '#fff',
                                                                                            borderRadius: '20px',
                                                                                            fontSize: '10px',
                                                                                            fontWeight: '700',
                                                                                            textTransform: 'uppercase',
                                                                                            letterSpacing: '0.05em'
                                                                                        }}>
                                                                                        {item.method}
                                                                                    </motion.span>
                                                                                ) : (
                                                                                    <span style={{ color: THEME.textSecondary, opacity: 0.7, fontSize: '12px', fontStyle: 'italic', fontWeight: '500' }}>Mapping...</span>
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td style={{ ...tableCellStyle, paddingRight: '32px' }}>
                                                                            {editingSection === 'extract' ? (
                                                                                <input
                                                                                    type="text"
                                                                                    value={item.standard || ''}
                                                                                    onChange={(e) => {
                                                                                        const newReg = [...editData.extractionRegistry];
                                                                                        newReg[i] = { ...newReg[i], standard: e.target.value };
                                                                                        setEditData({ ...editData, extractionRegistry: newReg });
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%', padding: '4px 8px', borderRadius: '6px',
                                                                                        border: '1px solid #e5e7eb', fontSize: '13px',
                                                                                        fontFamily: 'inherit'
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                item.standard || <span style={{ color: '#ccc' }}>---</span>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6" style={{ padding: '80px', textAlign: 'center' }}>
                                                                    <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'grayscale(1)', opacity: 0.3 }}>🗺️</div>
                                                                    <div style={{ color: '#999', fontSize: '15px', fontWeight: '500' }}>Your extraction plan will populate here.</div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>

                                        {/* Observation: Per-department Action Plans rendered when mapping is complete in a Grid */}
                                        {data.extractionRegistry &&
                                            data.extractionRegistry.length > 0 &&
                                            data.extractionRegistry.every(item => item.standard) &&
                                            data.departments && (
                                                <div style={{ marginTop: '60px', width: '100%', maxWidth: '1050px' }}>
                                                    <h2 style={{
                                                        fontSize: '32px',
                                                        fontWeight: '800',
                                                        color: THEME.text,
                                                        marginBottom: '8px',
                                                        letterSpacing: '-0.02em',
                                                        lineHeight: '1.2'
                                                    }}>
                                                        System Extraction Checklist
                                                    </h2>
                                                    <p style={{
                                                        color: THEME.textSecondary,
                                                        fontSize: '18px',
                                                        marginBottom: '32px',
                                                        maxWidth: '700px',
                                                        lineHeight: '1.5',
                                                        opacity: 0.9
                                                    }}>
                                                        Work with your team to execute these checklists. The Team's job is to follow the method and capture the system.
                                                    </p>

                                                    <div style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                                                        gap: '24px'
                                                    }}>
                                                        {data.departments?.map((dept, idx) => {
                                                            const deptSystems = data.extractionRegistry.filter(item => item.department === dept.name);
                                                            return (
                                                                <div key={idx} style={{
                                                                    height: 'auto'
                                                                }}>
                                                                    <ActionPlanChecklist
                                                                        department={dept.name}
                                                                        systems={deptSystems}
                                                                        onStartOrganize={onStartOrganize}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </SectionWithInfo>
                            )}

                            {/* Simplified Static Operational Reality Map - No animations, No dynamic calculations */}
                            {phase === 'brainstorm' && (
                                <div id="operational-reality-map-section" ref={brainstormRef} style={{
                                    width: '100%',
                                    maxWidth: '1200px',
                                    margin: '0 auto',
                                    padding: '40px 0',
                                    isolation: 'isolate'
                                }}>
                                    <div style={{
                                        background: THEME.cardBg,
                                        borderRadius: '24px',
                                        padding: '32px',
                                        border: `1px solid ${THEME.border}`,
                                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <h2 style={{
                                                    fontSize: '24px',
                                                    fontWeight: '700',
                                                    color: THEME.text,
                                                    marginBottom: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}>
                                                    <PenTool size={24} /> Systems Brainstorming
                                                </h2>
                                                <p style={{ color: THEME.textSecondary, fontSize: '16px', lineHeight: '1.5', maxWidth: '600px' }}>
                                                    Expose the real work inside each responsibility to find what needs systemizing.
                                                </p>
                                            </div>
                                            {editingSection === 'brainstorm' ? (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={handleEditCancel}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '6px',
                                                            padding: '8px 12px', borderRadius: '8px',
                                                            border: `1px solid ${THEME.border}`, background: THEME.cardBg,
                                                            color: THEME.text, fontSize: '13px', fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <X size={14} /> Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleEditSave}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '6px',
                                                            padding: '8px 12px', borderRadius: '8px',
                                                            border: 'none', background: '#111',
                                                            color: '#fff', fontSize: '13px', fontWeight: '600',
                                                            cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <Check size={14} /> Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditStart('brainstorm', { departments: data.departments })}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        padding: '6px 14px', borderRadius: '12px',
                                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'}`,
                                                        background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                                                        color: THEME.text, fontSize: '13px', fontWeight: '600',
                                                        cursor: 'pointer', transition: 'all 0.2s',
                                                        boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = THEME.tableHeader; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.3)' : '#d0d0d0'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#fff'; e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb'; }}
                                                >
                                                    <Edit2 size={14} /> Modify
                                                </button>
                                            )}
                                        </div>

                                        {data.departments && data.departments.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                                {data.departments?.map((dept, deptIdx) => (
                                                    <div key={deptIdx} style={{
                                                        border: `1px solid ${THEME.border}`,
                                                        borderRadius: '16px',
                                                        padding: '24px',
                                                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                                            <div style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                backgroundColor: isDark ? '#fff' : '#000',
                                                                color: isDark ? '#000' : '#fff',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontWeight: 'bold'
                                                            }}>
                                                                {typeof dept.name === 'string' ? dept.name.charAt(0) : '?'}
                                                            </div>
                                                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{dept.name}</h3>
                                                        </div>

                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            {(Array.isArray(dept.responsibilities) ? dept.responsibilities : []).map((resp, respIdx) => {
                                                                const subs = (dept.subActivities && dept.subActivities[resp]) || [];
                                                                const isHighlighted = highlightedBrainstormRow?.deptIndex === deptIdx && highlightedBrainstormRow?.respIndex === respIdx;
                                                                return (
                                                                    <div
                                                                        key={respIdx}
                                                                        ref={el => {
                                                                            if (!brainstormRowRefs.current) brainstormRowRefs.current = {};
                                                                            brainstormRowRefs.current[`${deptIdx}-${respIdx}`] = el;
                                                                        }}
                                                                        className={isHighlighted ? 'sop-row-highlight' : ''}
                                                                        style={{
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'minmax(120px, 180px) 1fr',
                                                                            gap: '20px',
                                                                            padding: '12px',
                                                                            backgroundColor: isHighlighted
                                                                                ? (isDark ? 'rgba(251, 191, 36, 0.08)' : '#fffbeb')
                                                                                : (isDark ? 'rgba(255, 255, 255, 0.02)' : 'transparent'),
                                                                            borderRadius: '12px',
                                                                            alignItems: 'start',
                                                                            transition: 'all 0.3s ease',
                                                                            border: isHighlighted ? `1px solid ${isDark ? 'rgba(251, 191, 36, 0.4)' : '#fde68a'}` : `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'transparent'}`
                                                                        }}>
                                                                        <div style={{ fontWeight: '600', fontSize: '14px', wordBreak: 'break-word', color: THEME.text }}>{resp}</div>
                                                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                                            {editingSection === 'brainstorm' ? (
                                                                                <textarea
                                                                                    value={(editingSection === 'brainstorm' && editData?.departments ? ((editData.departments[deptIdx].subActivities && editData.departments[deptIdx].subActivities[resp]) || []) : subs).join('\n')}
                                                                                    onChange={(e) => {
                                                                                        const newDepts = [...editData.departments];
                                                                                        if (!newDepts[deptIdx].subActivities) newDepts[deptIdx].subActivities = {};
                                                                                        newDepts[deptIdx].subActivities[resp] = e.target.value.split('\n').filter(s => s.trim());
                                                                                        setEditData({ ...editData, departments: newDepts });
                                                                                    }}
                                                                                    placeholder="List tasks (one per line)..."
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        minHeight: '80px',
                                                                                        padding: '8px',
                                                                                        borderRadius: '6px',
                                                                                        border: `1px solid ${THEME.border}`,
                                                                                        fontSize: '13px',
                                                                                        fontFamily: 'inherit'
                                                                                    }}
                                                                                    onClick={(e) => e.stopPropagation()} // Prevent drag
                                                                                />
                                                                            ) : (
                                                                                Array.isArray(subs) && subs.length > 0 ? subs.map((sub, subIdx) => (
                                                                                    <span key={subIdx} style={{
                                                                                        padding: '4px 12px',
                                                                                        backgroundColor: THEME.accentBg,
                                                                                        border: `1px solid ${THEME.border}`,
                                                                                        borderRadius: '6px',
                                                                                        fontSize: '12px',
                                                                                        color: THEME.text
                                                                                    }}>
                                                                                        {sub}
                                                                                    </span>
                                                                                )) : (
                                                                                    <span style={{ color: THEME.textSecondary, opacity: 0.5, fontSize: '12px', fontStyle: 'italic' }}>No tasks defined</span>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '16px' }}>
                                                No departments found.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Organize Phase */}
                            {(phase === 'organize' || phase === 'integrate' || phase === 'optimize') && (
                                <SectionWithInfo
                                    info={infoCards.organize}
                                    isHidden={hiddenInfoCards.organize}
                                    onToggle={() => toggleInfoCard('organize')}
                                    cardStyle={{ top: '72px' }}
                                >
                                    <div
                                        ref={organizeRef}
                                        className={phaseSpotlight === 'organize' ? 'phase-spotlight' : ''}
                                        style={{
                                            background: THEME.cardBg,
                                            borderRadius: '24px',
                                            padding: '32px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px -10px rgba(0,0,0,0.05)',
                                            border: `1px solid ${THEME.border}`,
                                            maxWidth: '900px',
                                            position: 'relative',
                                            marginBottom: '60px'
                                        }}
                                    >
                                        <h2 style={headingStyle}>
                                            <Box size={24} /> Organize
                                        </h2>
                                        <PhaseHero
                                            title="Organize"
                                            isDark={isDark}
                                            description="Store, structure, and refine every system in one trusted hub."
                                            status={phaseStatus.organize}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            style={{ margin: '0 -20px' }}
                                        >
                                            <OrganizeDashboard
                                                data={data}
                                                onUpdate={onSystemLibraryUpdate}
                                                onStartIntegrate={onStartIntegrate}
                                            />
                                        </motion.div>

                                        {!isIntegrateRevealed && (
                                            <NavigationCTA
                                                label="Continue to Integrate"
                                                isDark={isDark}
                                                onClick={() => {
                                                    setIsIntegrateRevealed(true);
                                                    onStartIntegrate?.();
                                                }}
                                            />
                                        )}
                                    </div>
                                </SectionWithInfo>
                            )}

                            {/* Integrate Phase - Hidden until revealed */}
                            {(isIntegrateRevealed || phase === 'integrate' || phase === 'optimize') && (
                                <SectionWithInfo
                                    info={infoCards.integrate}
                                    isHidden={hiddenInfoCards.integrate}
                                    onToggle={() => toggleInfoCard('integrate')}
                                    cardStyle={{ top: '72px' }}
                                >
                                    <div
                                        ref={integrateRef}
                                        className={phaseSpotlight === 'integrate' ? 'phase-spotlight' : ''}
                                        style={{
                                            background: THEME.cardBg,
                                            borderRadius: '24px',
                                            padding: '32px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px -10px rgba(0,0,0,0.05)',
                                            border: `1px solid ${THEME.border}`,
                                            maxWidth: '900px',
                                            position: 'relative',
                                            marginBottom: '60px'
                                        }}
                                    >
                                        <h2 style={headingStyle}>
                                            <Target size={24} /> Integrate
                                        </h2>
                                        <PhaseHero
                                            title="Integrate"
                                            isDark={isDark}
                                            description="Build adoption so your team follows systems without reminders."
                                            status={phaseStatus.integrate}
                                        />
                                        <IntegrateActionPlan
                                            departments={(data.departments || []).map(d => d.name)}
                                            plan={data.integratePlan || {}}
                                            onPlanChange={onIntegratePlanUpdate}
                                            onComplete={onIntegrateComplete}
                                        />

                                        {!isOptimizeActivated && (
                                            <NavigationCTA
                                                label="Continue to Optimize"
                                                isDark={isDark}
                                                onClick={() => {
                                                    setIsOptimizeActivated(true);
                                                    onIntegrateComplete?.();
                                                }}
                                            />
                                        )}
                                    </div>
                                </SectionWithInfo>
                            )}

                            {/* Optimize Phase - Visible but inactive if not activated */}
                            {(isIntegrateRevealed || phase === 'integrate' || phase === 'optimize') && (
                                <SectionWithInfo
                                    info={infoCards.optimize}
                                    isHidden={hiddenInfoCards.optimize}
                                    onToggle={() => toggleInfoCard('optimize')}
                                    cardStyle={{ top: '72px' }}
                                >
                                    <div
                                        ref={optimizeRef}
                                        className={phaseSpotlight === 'optimize' ? 'phase-spotlight' : ''}
                                        style={{
                                            background: THEME.cardBg,
                                            borderRadius: '24px',
                                            padding: '32px',
                                            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1), 0 10px 40px -10px rgba(0,0,0,0.05)',
                                            border: `1px solid ${THEME.border}`,
                                            maxWidth: '900px',
                                            position: 'relative',
                                            opacity: isOptimizeActivated ? 1 : 0.6,
                                            filter: isOptimizeActivated ? 'none' : 'grayscale(0.8)',
                                            pointerEvents: isOptimizeActivated ? 'auto' : 'none',
                                            transition: 'all 0.5s ease'
                                        }}
                                    >
                                        <h2 style={headingStyle}>
                                            <Zap size={24} /> Optimize
                                        </h2>
                                        <PhaseHero
                                            title="Optimize"
                                            isDark={isDark}
                                            description="Track KPIs, solve bottlenecks, and keep momentum compounding."
                                            status={phaseStatus.optimize}
                                        />
                                        <OptimizeWorkspace
                                            departments={data.departments || []}
                                            data={data.optimize || {}}
                                            onUpdate={onOptimizeUpdate}
                                        />
                                    </div>
                                </SectionWithInfo>
                            )}
                            {!isPhaseStarted && phase !== 'define' && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '600px',
                                    textAlign: 'center',
                                    color: THEME.textSecondary,
                                    gap: '20px',
                                    padding: '40px'
                                }}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '24px',
                                            backgroundColor: THEME.accentBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '20px'
                                        }}
                                    >
                                        <Target size={40} color={THEME.text} />
                                    </motion.div>
                                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: THEME.text, margin: 0 }}>
                                        {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
                                    </h2>
                                    <p style={{ fontSize: '18px', maxWidth: '500px', lineHeight: '1.6', margin: 0 }}>
                                        {isDark ? "Ready to begin mapping your systems? Click 'Begin Work' in the Expert Box to reveal the framework." : "Prêt à commencer la cartographie de vos systèmes ? Cliquez sur 'Commencer' dans la boîte Expert pour révéler le cadre."}
                                    </p>
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '12px 24px',
                                        borderRadius: '12px',
                                        border: `1px dashed ${THEME.border}`,
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}>
                                        {isDark ? "Waiting for action..." : "En attente d'action..."}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div >
        </div >
    );
};

const InfoCard = ({ info, onToggle, style }) => {
    if (!info) return null;
    const Icon = info.icon || Info;
    const accent = info.accent || '#111827';

    return (
        <motion.div
            className="info-card-float"
            style={style}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
        >
            <div className="info-card" style={{ borderColor: `${accent}22` }}>
                <div className="info-card-header">
                    <div className="info-icon" style={{ background: accent }}>
                        <Icon size={16} />
                    </div>
                    <div>
                        <div className="info-title">{info.title}</div>
                        <div className="info-eyebrow">{info.eyebrow}</div>
                    </div>
                    <button type="button" className="info-toggle" onClick={onToggle}>
                        <EyeOff size={14} />
                        Hide
                    </button>
                </div>
                <div className="info-desc">{info.description}</div>
                {(info.points || []).map((point, index) => (
                    <div key={`${info.eyebrow}-${index}`} className="info-point">
                        <span className="info-dot" style={{ background: accent }} />
                        <span>{point}</span>
                    </div>
                ))}
                {info.tip && (
                    <div className="info-tip">Tip: {info.tip}</div>
                )}
            </div>
        </motion.div>
    );
};

const SectionWithInfo = ({ children, info, isHidden, onToggle, cardStyle }) => (
    <div className="section-wrapper">
        <div className="section-main">{children}</div>

        <AnimatePresence>
            {!isHidden && (
                <InfoCard
                    info={info}
                    onToggle={onToggle}
                    style={cardStyle}
                />
            )}
        </AnimatePresence>
    </div>
);

const LearnMoreBadge = ({ onClick, style }) => null;

const Section = ({ title, content, isHighlighted }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: isHighlighted ? 1.01 : 1
            }}
            transition={{ duration: 0.4 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                padding: '4px 0',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isDark ? '#fff' : '#000', opacity: 0.2 }} />
                <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    margin: 0
                }}>
                    {title}:
                </h3>
            </div>
            <div style={{
                fontSize: '16px',
                color: THEME.text,
                minHeight: '24px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.5',
                paddingLeft: '14px'
            }}>
                <TypewriterText content={content} />
            </div>
        </motion.div>
    );
};

const TypewriterText = ({ content }) => {
    return (
        <React.Fragment key={content.length}>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <TypewriterEffect content={content} />
            </motion.span>
        </React.Fragment>
    );
};

const PhaseHero = ({ title, description, status, isDark }) => (
    <div style={{
        marginTop: '0',
        marginBottom: '24px',
        padding: '0 0 20px 0',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#f3f4f6'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
    }}>
        <div>
            <div style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', lineHeight: '1.5' }}>{description}</div>
        </div>
        {status && (
            <div style={{
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#f0fdf4',
                color: isDark ? '#4ade80' : '#16a34a',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.02em',
                flexShrink: 0
            }}>
                ✓ READY
            </div>
        )}
    </div>
);

const TypewriterEffect = ({ content, onComplete, speed = 10 }) => {
    const [displayed, setDisplayed] = useState('');

    useEffect(() => {
        let index = 0;
        setDisplayed('');
        const interval = setInterval(() => {
            if (index < content.length) {
                setDisplayed(prev => prev + content.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);
        return () => clearInterval(interval);
    }, [content, speed]);

    return <>{displayed}</>;
};

const NavigationCTA = ({ label, onClick, isDark, active = true }) => (
    <motion.button
        whileHover={active ? { scale: 1.01, backgroundColor: isDark ? '#fff' : '#111' } : {}}
        whileTap={active ? { scale: 0.99 } : {}}
        onClick={onClick}
        disabled={!active}
        style={{
            width: '100%',
            backgroundColor: active ? (isDark ? '#fff' : '#000') : (isDark ? '#222' : '#f3f4f6'),
            color: active ? (isDark ? '#000' : '#fff') : (isDark ? '#666' : '#9ca3af'),
            border: active ? 'none' : `2px dashed ${isDark ? '#444' : '#d1d5db'}`,
            borderRadius: '16px',
            padding: '24px',
            fontSize: '18px',
            fontWeight: '700',
            marginTop: '40px',
            cursor: active ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
            boxShadow: active ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
            fontFamily: 'inherit'
        }}
    >
        {label}
        {active && <ChevronRight size={22} />}
    </motion.button>
);

const IntroView = ({ onIntroFinish, phase, isDark, THEME }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        setStep(0);
    }, [phase]);

    const contentMap = {
        define: {
            text1: "Whether your business is doing well or struggling depends on how you turn inputs into valuable outputs—your systems.",
            text2: "We’ll start by defining the systems that make you money.",
            bold: "Cash is king. Survival first."
        },
        assign: {
            text1: "A business is only as good as its people. Systems without accountability are just words on a page.",
            text2: "Now, we’ll move from 'What' to 'Who'. Let's assign clear ownership to every department.",
            bold: "Responsibility breeds success."
        },
        extract: {
            text1: "Documentation is the bridge between a chaotic startup and a scalable machine.",
            text2: "It’s time to extract the wisdom from your team and turn it into permanent assets.",
            bold: "Documentation is leverage."
        },
        organize: {
            text1: "Structure breeds freedom. A well-organized system allows the business to run without the founder.",
            text2: "We’ll now organize these systems into a clear architecture that anyone can follow.",
            bold: "Freedom starts here."
        }
    };

    const current = contentMap[phase] || contentMap.define;

    useEffect(() => {
        if (step === 2) {
            if (onIntroFinish) onIntroFinish();
        }
    }, [step]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '800px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                padding: '0 40px',
                zIndex: 2000,
                pointerEvents: 'none',
                color: isDark ? '#fff' : '#000'
            }}
        >
            <div style={{
                width: '100%',
                maxWidth: '900px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                padding: '0 40px'
            }}>
                <h1 style={{
                    fontSize: '36px',
                    fontWeight: '300',
                    color: isDark ? '#fff' : '#000',
                    lineHeight: '1.4',
                    letterSpacing: '-0.01em',
                    margin: 0,
                    opacity: 0.9
                }}>
                    <TypewriterEffect content={current.text1} onComplete={() => setStep(1)} speed={20} />
                </h1>

                {step >= 1 && (
                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '300',
                        color: isDark ? '#fff' : '#000',
                        lineHeight: '1.4',
                        letterSpacing: '-0.01em',
                        margin: 0
                    }}>
                        <TypewriterEffect content={current.text2} onComplete={() => setStep(2)} speed={20} />
                        {step >= 2 && current.bold && (
                            <motion.strong
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'block',
                                    marginTop: '12px',
                                    color: isDark ? '#fff' : '#000',
                                    fontWeight: '700'
                                }}
                            >
                                {current.bold}
                            </motion.strong>
                        )}
                    </h1>
                )}
            </div>
        </motion.div>
    );
};

export default PreviewSpace;
