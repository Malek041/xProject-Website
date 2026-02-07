import React, { useState, useEffect } from 'react';
import ExpertBox from '../components/sop/ExpertBox';
import PreviewSpace from '../components/sop/PreviewSpace';
import PhaseProgress from '../components/sop/PhaseProgress';
import HiroorModal from '../components/sop/HiroorModal';
import AppSidebar from '../components/sop/AppSidebar';
import FloatingProgressBar from '../components/sop/FloatingProgressBar';
import GoalSelection from '../components/sop/GoalSelection';
import PhaseVideoDemo from '../components/sop/PhaseVideoDemo';
import FeedbackModal from '../components/sop/FeedbackModal';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { db } from '../services/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { aiService } from '../services/aiService';

const getTaskExamples = (responsibility = '', t) => {
    const res = responsibility.toLowerCase();
    if (res.includes('marketing') || res.includes('attention')) return t({ en: "Facebook Post, Email Blast, SEO Audit", fr: "Publication Facebook, Campagne e-mail, Audit SEO" });
    if (res.includes('sales')) return t({ en: "Lead Qualification, Demo Call, Proposal Writing", fr: "Qualification de prospects, Appels de démo, Rédaction de propositions" });
    if (res.includes('delivery')) return t({ en: "Order Processing, Quality Check, Shipping", fr: "Traitement des commandes, Contrôle qualité, Expédition" });
    if (res.includes('finance') || res.includes('money')) return t({ en: "Invoicing, Expense Tracking, Bank Recon", fr: "Facturation, Suivi des dépenses, Rapprochement bancaire" });
    return t({ en: "Task 1, Task 2, Task 3", fr: "Tâche 1, Tâche 2, Tâche 3" });
};

const initialDocumentData = {
    ccf: {},
    gf: {},
    departments: [],
    responsibilities: {},
    team: {},
    extractionRegistry: [],
    systems: [],
    activeSystem: null,
    extractionActionPlan: {
        record: false,
        review: false,
        approve: false
    },
    systemLibrary: [],
    integratePlan: {},
    optimize: {
        kpis: [],
        problems: []
    },
    shownVideos: [] // Track which phase videos have been shown
};

const SOPBuilder = () => {
    const { t } = useLanguage();
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Mobile detection
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-collapse sidebar on mobile
    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [isMobile]);

    // Layout State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem('hiro_projects');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentProjectId, setCurrentProjectId] = useState(null);

    // Core State
    const [systemTrack, setSystemTrack] = useState('revenue'); // revenue | growth
    const [phase, setPhase] = useState('define'); // define, assign, extract, organize, integrate, optimize
    const [isGoalSelected, setIsGoalSelected] = useState(false); // Start false to show mission selection
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [showIntro, setShowIntro] = useState(false); // Start false to prevent overriding mission selection
    const [introFinished, setIntroFinished] = useState(false);
    const [hasAnsweredFirstQuestion, setHasAnsweredFirstQuestion] = useState(false);
    const [navTarget, setNavTarget] = useState(null);
    const [lastActivityTs, setLastActivityTs] = useState(0);
    const [highlightKey, setHighlightKey] = useState(null);
    const [showHiroorModal, setShowHiroorModal] = useState(false); // hiroor marketplace
    const [documentData, setDocumentData] = useState(initialDocumentData);
    const [highlightTrigger, setHighlightTrigger] = useState(null); // { type: 'tableRow'|'teamCard', index, timestamp }
    const [showPhaseVideo, setShowPhaseVideo] = useState(false); // Control phase demo video visibility
    const [currentPhaseForVideo, setCurrentPhaseForVideo] = useState(null); // Track which phase video to show
    const [isPhaseStarted, setIsPhaseStarted] = useState(false); // Controls framework visibility until "Begin Work"
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const resetToGoalSelection = () => {
        setCurrentProjectId(null);
        setSelectedGoal(null);
        setIsGoalSelected(false);
        setHasAnsweredFirstQuestion(false);
        setIntroFinished(false);
        setShowIntro(false);
        setSystemTrack('revenue');
        setPhase('define');
        setIsPhaseStarted(false);
        setDocumentData(initialDocumentData);
        setExpertState({
            isOpen: true,
            message: t({ en: "Welcome! What's the goal today?", fr: "Bienvenue ! Quel est l'objectif aujourd'hui ?" }),
            inputType: 'goal-selection',
            inputAction: 'select_goal',
            options: [],
            isTyping: false,
            isThinking: false,
            history: [],
            mode: 'default',
            teachingPhase: null,
            teachingStep: 0,
            teachingContextPhase: null
        });
    };

    const teachingGuides = {
        define: [
            t({ en: "Identify your primary target client — who are you serving?", fr: "Identifiez votre client cible principal — qui servez-vous ?" }),
            t({ en: "Map the Critical Client Flow: Attention → Enquiry → Sales → Money → Delivery → Loyalty.", fr: "Cartographiez le Flux Client Critique : Attention → Demande → Vente → Paiement → Livraison → Fidélisation." }),
            t({ en: "Document what is actually happening today, not what you wish was happening.", fr: "Documentez ce qui se passe réellement aujourd'hui, pas ce que vous souhaiteriez qu'il se passe." }),
            t({ en: "Keep it simple. Focus on the 7-12 critical steps that drive your business.", fr: "Restez simple. Concentrez-vous sur les 7 à 12 étapes critiques qui font tourner votre entreprise." })
        ],
        assign: [
            t({ en: "Assign a Department Head for each key area of your business.", fr: "Assignez un responsable de département pour chaque domaine clé de votre entreprise." }),
            t({ en: "Identify the 'Knowledgeable Worker' — the person who performs the task best.", fr: "Identifiez le 'Collaborateur Expert' — la personne qui effectue le mieux la tâche." }),
            t({ en: "Create your DRTC (Departments, Responsibilities & Team Chart).", fr: "Créez votre DRTC (Départements, Responsabilités et Organigramme)." }),
            t({ en: "Model the best performers to set a high baseline for documentation.", fr: "Modélisez les meilleurs éléments pour établir une base de référence élevée pour la documentation." })
        ],
        extract: [
            t({ en: "Use the two-person method: one person does the work, another captures it.", fr: "Utilisez la méthode à deux personnes : une personne fait le travail, une autre le capture." }),
            t({ en: "Record the process live (video, audio, or screen capture).", fr: "Enregistrez le processus en direct (vidéo, audio ou capture d'écran)." }),
            t({ en: "Break the recording down into a simple, ambiguity-free checklist.", fr: "Décomposez l'enregistrement en une liste de contrôle simple et sans ambiguïté." }),
            t({ en: "Review the system with the team to ensure accuracy and buy-in.", fr: "Révisez le système avec l'équipe pour garantir l'exactitude et l'adhésion." })
        ],
        organize: [
            t({ en: "Create a clean system library by department. Use the Organize dashboard to add or edit systems.", fr: "Créez une bibliothèque de systèmes propre par département. Utilisez le tableau de bord Organiser pour ajouter ou modifier des systèmes." }),
            t({ en: "Open a system and define the goal, trigger, inputs, and steps. Keep it concise and repeatable.", fr: "Ouvrez un système et définissez l'objectif, le déclencheur, les entrées et les étapes. Restez concis et reproductible." }),
            t({ en: "Attach tools, media, and resources so everything lives in one place.", fr: "Attachez des outils, des médias et des ressources pour que tout soit centralisé." }),
            t({ en: "Assign an owner and quality standard so there’s accountability.", fr: "Assignez un responsable et une norme de qualité pour assurer la responsabilité." }),
            t({ en: "Save changes and keep systems updated as the team evolves.", fr: "Enregistrez les modifications et maintenez les systèmes à jour à mesure que l'équipe évolue." })
        ],
        integrate: [
            t({ en: "Assign a leader to drive SYSTEMology adoption in this department.", fr: "Assignez un leader pour piloter l'adoption de SYSTEMology dans ce département." }),
            t({ en: "Share the benefits in terms the team cares about (less chaos, faster onboarding, fewer errors).", fr: "Partagez les bénéfices qui comptent pour l'équipe (moins de chaos, intégration plus rapide, moins d'erreurs)." }),
            t({ en: "Walk the team through the CCF and Growth Systems Map so they see the big picture.", fr: "Présentez le CCF et la Carte des Systèmes de Croissance à l'équipe pour qu'elle ait une vision d'ensemble." }),
            t({ en: "Kick off extraction with a two-person capture process.", fr: "Lancez l'extraction avec un processus de capture à deux personnes." }),
            t({ en: "Link every task to its system in project management software.", fr: "Liez chaque tâche à son système dans votre logiciel de gestion de projet." }),
            t({ en: "Manage via systems — insist on checking the system first.", fr: "Gérez via les systèmes — insistez pour consulter le système en premier." }),
            t({ en: "Address resistance directly with clarity and accountability.", fr: "Traitez les résistances directement avec clarté et responsabilité." }),
            t({ en: "Reinforce systems-thinking in hiring, onboarding, and reviews.", fr: "Renforcez la pensée systémique lors du recrutement, de l'intégration et des évaluations." })
        ],
        optimize: [
            t({ en: "Define a small set of KPIs that reflect system health.", fr: "Définissez un petit ensemble d'indicateurs (KPI) qui reflètent la santé du système." }),
            t({ en: "Track current vs target metrics in the KPI dashboard.", fr: "Suivez les métriques actuelles par rapport aux cibles dans le tableau de bord des KPI." }),
            t({ en: "Log real-world problems in the workboard by department and responsibility.", fr: "Enregistrez les problèmes réels dans le tableau de travail par département et responsabilité." }),
            t({ en: "Break each problem into actionable steps with owners.", fr: "Décomposez chaque problème en étapes exploitables avec des responsables." }),
            t({ en: "Execute the optimization action plan and review improvements regularly.", fr: "Exécutez le plan d'action d'optimisation et révisez régulièrement les améliorations." })
        ]
    };


    // Expert State
    const [expertState, setExpertState] = useState({
        isOpen: true,
        message: t({ en: "Welcome! What's the goal today?", fr: "Bienvenue ! Quel est l'objectif aujourd'hui ?" }),
        inputType: 'goal-selection',
        inputAction: 'select_goal',
        isTyping: false,
        isThinking: false,
        history: [],
        mode: 'default',
        teachingPhase: null,
        teachingStep: 0,
        teachingContextPhase: null
    });

    // Helper to trigger thinking state before typing
    const updateExpertWithThinking = (newState, thinkingDuration = 3000) => {
        setExpertState(prev => ({
            ...prev,
            isThinking: true,
            isTyping: false,
            isOpen: true // Ensure it's open while thinking
        }));

        setTimeout(() => {
            setExpertState({
                ...newState,
                isThinking: false,
                isTyping: true
            });
        }, thinkingDuration);
    };

    // Handle switching between Revenue, Growth, and Other tracks
    const handleSystemTrackChange = (newTrack) => {
        if (newTrack === systemTrack) return;
        if (!currentProjectId) {
            setSystemTrack(newTrack);
            return;
        }

        const project = projects.find(p => String(p.id) === String(currentProjectId));
        if (!project) return;

        // 1. Capture current state to save
        const currentTrackData = {
            phase,
            documentData,
            expertState
        };

        // 2. Prepare the updated tracks object
        // We merge existing tracks with the current session data
        const currentTracks = project.tracks || {};
        const updatedTracks = {
            ...currentTracks,
            [systemTrack]: currentTrackData
        };

        // 3. Update the global projects state immediately to prevent data loss
        // This ensures that even if we switch states below, the 'projects' ref is up to date
        // with the work we just left.
        const updatedProject = {
            ...project,
            tracks: updatedTracks
        };

        setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));

        // 4. Retrieve or Initialize data for the NEW track
        const targetData = updatedTracks[newTrack];

        if (targetData) {
            // Restore existing work
            setDocumentData(targetData.documentData);
            setPhase(targetData.phase);
            setIsPhaseStarted(false);
            setExpertState(targetData.expertState);
        } else {
            // Initialize new track
            // We carry over CCF from the current session appropriately, but reset others
            const newDocData = {
                ...initialDocumentData,
                ccf: documentData.ccf || {}, // Carry over context
                departments: newTrack === 'growth' ? [] : (initialDocumentData.departments || []),
            };

            setDocumentData(newDocData);
            setPhase('define'); // Always start at define for a fresh track
            setIsPhaseStarted(false);
            setExpertState({
                isOpen: true,
                message: t({
                    en: `Switched to **${newTrack === 'growth' ? 'Systems for Growth' : 'Other Systems'}**.\n\nReady to begin?`,
                    fr: `Passé à **${newTrack === 'growth' ? 'Systèmes pour la Croissance' : 'Autres Systèmes'}**.\n\nPrêt à commencer ?`
                }),
                inputType: null,
                inputAction: null,
                options: newTrack === 'growth'
                    ? [{ label: t({ en: "Start Growth Definition", fr: "Démarrer la définition de croissance" }), action: 'define_growth_start' }]
                    : [],
                isTyping: false,
                history: [],
                mode: 'default'
            });
        }

        setSystemTrack(newTrack);
    };

    // Sync with Firestore (if logged in) or LocalStorage (if guest)
    useEffect(() => {
        if (!currentUser) return;

        // Listen for remote changes
        const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.projects) {
                    setProjects(prev => {
                        // Prevent infinite loop by checking equality
                        if (JSON.stringify(prev) !== JSON.stringify(data.projects)) {
                            return data.projects;
                        }
                        return prev;
                    });
                }
            } else {
                // If it's a new user with no data, we might want to upload existing local projects?
                // For now, we just start fresh or keep what's in state (which came from localStorage init)
                if (projects.length > 0) {
                    setDoc(doc(db, 'users', currentUser.uid), { projects }, { merge: true });
                }
            }
        });
        return () => unsub();
    }, [currentUser]);

    // Persist changes
    useEffect(() => {
        if (currentUser) {
            if (projects.length > 0) {
                // Debounce could be added here if needed
                setDoc(doc(db, 'users', currentUser.uid), { projects }, { merge: true });
            }
        } else {
            localStorage.setItem('hiro_projects', JSON.stringify(projects));
        }
    }, [projects, currentUser]);

    // Auto-save current project state whenever relevant state changes
    useEffect(() => {
        if (!currentProjectId) return;

        setProjects(prev => {
            const index = prev.findIndex(p => String(p.id) === String(currentProjectId));
            if (index === -1) return prev; // Project was likely deleted

            const currentTrackData = {
                phase,
                documentData,
                expertState
            };

            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                data: {
                    phase,
                    documentData,
                    expertState,
                    systemTrack
                },
                tracks: {
                    ...(updated[index].tracks || {}),
                    [systemTrack]: currentTrackData
                }
            };
            return updated;
        });
    }, [phase, documentData, expertState, systemTrack, currentProjectId]);

    // Initialize
    useEffect(() => {
        // Initialization logic if needed
    }, []);

    const handleIntroStart = () => {
        setShowIntro(false);
        setHasAnsweredFirstQuestion(true);
        setExpertState(prev => ({ ...prev, isOpen: true }));

        // Trigger logic based on the phase we just saw the intro for
        if (phase === 'define') startDefinePhase();
        else if (phase === 'assign') startAssignPhase();
        else if (phase === 'extract') startExtractPhase();
        else if (phase === 'organize') {
            startTeachingMenu('organize');
        }
    };

    // Auto-transition logic


    // Clear highlight after 3 seconds
    useEffect(() => {
        if (highlightKey) {
            const timer = setTimeout(() => setHighlightKey(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [highlightKey]);

    useEffect(() => {
        if (['organize', 'integrate', 'optimize'].includes(phase)) {
            startTeachingMenu(phase);
        }
    }, [phase]);



    const handleNewProject = () => {
        const newProject = {
            id: Date.now().toString(),
            name: 'New Project',
            createdAt: new Date().toISOString(),
            data: {
                phase: 'define',
                systemTrack: 'revenue',
                documentData: {
                    ccf: {},
                    departments: [],
                    responsibilities: {},
                    team: {},
                    systems: [],
                    activeExtractionPlan: {
                        targetSystem: null,
                        knowledgeableWorker: null,
                        captureMethod: null,
                        timeline: null,
                        status: 'planning'
                    },
                    activeSystem: null,
                    extractionRegistry: [],
                    systemLibrary: [],
                    integratePlan: {},
                    optimize: { kpis: [], problems: [] }
                }
            }
        };

        setProjects(prev => [newProject, ...prev]);
        setCurrentProjectId(newProject.id);

        // Reset states for new project flow
        setIsGoalSelected(false);
        setHasAnsweredFirstQuestion(false);
        setIntroFinished(false);
        setIntroFinished(false);
        setShowIntro(false); // Don't show intro immediately, let user pick goal first
        setSystemTrack('revenue');
        setPhase('define');
        setDocumentData(newProject.data.documentData);
        setExpertState({
            isOpen: true,
            message: t({ en: "Welcome to hiro. What's your Goal today?", fr: "Bienvenue sur hiro. Quel est votre objectif aujourd'hui ?" }),
            inputType: 'goal-selection',
            inputAction: 'select_goal',
            options: [],
            isTyping: false,
            isThinking: false,
            history: [],
            mode: 'default',
            teachingPhase: null,
            teachingStep: 0,
            teachingContextPhase: null
        });
    };

    const handleSelectProject = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        setCurrentProjectId(projectId);

        // Restore state from project data
        // If it's an old project that doesn't have the full data structure yet, 
        // fallback to defaults
        const data = project.data || {};
        const restoredPhase = data.phase || 'define';
        const restoredSystemTrack = data.systemTrack || 'revenue';

        // CRITICAL FIX: Normalize documentData against initial schema
        // Merging prevents "undefined" errors if saved data is partial
        const restoredDocData = {
            ...initialDocumentData,
            ...(data.documentData || {}),
            departments: (data.documentData?.departments || []),
            extractionRegistry: (data.documentData?.extractionRegistry || [])
        };

        setSystemTrack(restoredSystemTrack);
        setPhase(restoredPhase);
        setDocumentData(restoredDocData);
        setIsGoalSelected(true);
        setHasAnsweredFirstQuestion(true);
        setIntroFinished(true);
        setShowIntro(false);

        setExpertState(prev => ({
            ...prev,
            isOpen: true, // Force open to be safe
            ...(data.expertState || {}),
            options: data.expertState?.options || [], // Ensure array
        }));

        // Since it's an existing project, we skip the goal selection and intro
        setIsGoalSelected(true);
        setHasAnsweredFirstQuestion(true);
        setIsPhaseStarted(true);
        setIntroFinished(true);
        setShowIntro(false);
    };

    const handleRemoveProject = (projectId) => {
        console.log('Removing project:', projectId);
        setProjects(prev => {
            const filtered = prev.filter(p => String(p.id) !== String(projectId));
            console.log('Remaining projects:', filtered.length);
            return filtered;
        });

        if (String(currentProjectId) === String(projectId)) {
            resetToGoalSelection();
        }
    };

    const handleClearProjects = () => {
        if (!confirm('Clear all projects? This cannot be undone.')) return;
        setProjects([]);
        try {
            localStorage.removeItem('hiro_projects');
        } catch (err) {
            console.warn('Failed to clear projects from localStorage:', err);
        }
        resetToGoalSelection();
    };

    const handleRenameProject = (projectId, newName) => {
        setProjects(prev => prev.map(p =>
            String(p.id) === String(projectId) ? { ...p, name: newName } : p
        ));
    };

    const deriveSystems = (ccfData) => {
        // Simple logic to suggest systems based on CCF inputs
        const systems = [];
        if (ccfData.sales) systems.push({ name: "Sales Process", status: "To Do" });
        if (ccfData.delivery) systems.push({ name: "Delivery Workflow", status: "To Do" });
        if (ccfData.attention) systems.push({ name: "Lead Generation", status: "To Do" });
        return systems;
    };

    const startBrainstorm = () => {
        setPhase('brainstorm');
        setIsPhaseStarted(false);

        // Check if we have departments with responsibilities
        const depts = documentData.departments;
        if (!depts || depts.length === 0) {
            // No departments, skip
            return;
        }

        // Initialize subActivities if not present
        const deptsWithSubActivities = depts.map(dept => ({
            ...dept,
            subActivities: dept.subActivities || {}
        }));
        setDocumentData(prev => ({ ...prev, departments: deptsWithSubActivities }));

        // Set phase for video demo (Extract phase has multiple videos)
        setCurrentPhaseForVideo('brainstorm');
        setShowPhaseVideo(false);

        // Show Extract phase introduction
        updateExpertWithThinking({
            ...expertState,
            isOpen: true,
            isTyping: true,
            message: t({
                en: "**Phase: Extract**\n\nTime to capture how work is actually done. We'll model your best performers to build your system library.",
                fr: "**Phase : Extraction**\n\nIl est temps de capturer comment le travail est réellement effectué. Nous allons modéliser vos meilleurs éléments pour bâtir votre bibliothèque."
            }),
            inputType: null,
            options: [
                { label: t({ en: 'Learn more', fr: 'En savoir plus' }), action: 'extract_learn_more' },
                { label: t({ en: '🚀 Begin Work', fr: '🚀 Commencer' }), action: 'extract_ready' }
            ],
            inputAction: null
        });
    };

    const askSubActivities = (deptIndex, respIndex) => {
        const dept = documentData.departments[deptIndex];
        if (!dept) {
            console.error('Department not found at index:', deptIndex);
            return;
        }

        const responsibilities = Array.isArray(dept.responsibilities) ? dept.responsibilities : [];
        if (!responsibilities || responsibilities.length === 0) {
            console.error('No responsibilities found for department:', dept.name);
            return;
        }

        if (respIndex >= responsibilities.length) {
            // Move to next department
            if (deptIndex + 1 < documentData.departments.length) {
                askSubActivities(deptIndex + 1, 0);
            } else {
                // All done, start assigning extraction methods
                startExtractionMethodAssignment();
            }
            return;
        }

        const responsibility = responsibilities[respIndex];
        const isFirst = deptIndex === 0 && respIndex === 0;

        let messageBody;
        if (isFirst) {
            messageBody = t({
                en: `Let's list the tasks. For **${responsibility}**, what are the specific steps? (e.g. ${getTaskExamples(responsibility, t)})`,
                fr: `Listons les tâches. Pour **${responsibility}**, quelles sont les étapes spécifiques ? (ex. : ${getTaskExamples(responsibility, t)})`
            });
        } else {
            const variations = [
                t({ en: `Got it. Now for **${dept.name}** → **${responsibility}**?`, fr: `Compris. Maintenant pour **${dept.name}** → **${responsibility}** ?` }),
                t({ en: `How about **${dept.name}** → **${responsibility}**?`, fr: `Et pour **${dept.name}** → **${responsibility}** ?` }),
                t({ en: `Next: **${dept.name}** → **${responsibility}**?`, fr: `Suivant : **${dept.name}** → **${responsibility}** ?` }),
                t({ en: `And **${dept.name}** → **${responsibility}**?`, fr: `Et **${dept.name}** → **${responsibility}** ?` })
            ];
            messageBody = variations[respIndex % variations.length];
        }

        updateExpertWithThinking({
            ...expertState,
            message: messageBody,
            inputType: 'dynamic-steps',
            inputAction: `add_subactivities_${deptIndex}_${respIndex}`,
            placeholderType: 'sub-activity',
            options: [],
            initialSteps: dept.subActivities[responsibility] || []
        });
    };

    const startExtractionMethodAssignment = () => {
        // Flatten all sub-activities into a registry list
        const registry = [];
        documentData.departments.forEach(dept => {
            Object.keys(dept.subActivities || {}).forEach(resp => {
                const head = dept.head || 'To be assigned';
                const worker = dept.worker || 'To be assigned';
                const subs = Array.isArray(dept.subActivities?.[resp]) ? dept.subActivities[resp] : [];
                subs.forEach(sub => {
                    registry.push({
                        department: dept.name,
                        responsibility: resp,
                        subActivity: sub,
                        worker: worker,
                        method: null
                    });
                });
            });
        });

        if (registry.length === 0) {
            setPhase('extract');
            setExpertState(prev => ({ ...prev, message: t({ en: "No tasks found. Let's go back and add some.", fr: "Aucune tâche trouvée. Revenons en arrière pour en ajouter." }) }));
            return;
        }

        setDocumentData(prev => ({ ...prev, extractionRegistry: registry }));
        setPhase('extract');
        setExpertState(prev => ({ ...prev, isOpen: true }));
        askExtractionMethod(0, registry);
    };

    const askStandard = (index, currentRegistry) => {
        const registry = currentRegistry || documentData.extractionRegistry;
        if (index < registry.length) {
            const item = registry[index];
            const isFirst = index === 0;

            let message;
            if (isFirst) {
                message = t({
                    en: `What counts as "Done Right" for **${item.subActivity}**? (e.g. "HD quality", "By 5pm")`,
                    fr: `Qu'est-ce qui définit "bien fait" pour **${item.subActivity}** ? (ex. : "Qualité HD", "Avant 17h")`
                });
            } else {
                message = t({
                    en: `**${item.subActivity}** Standard?`,
                    fr: `Le standard pour **${item.subActivity}** ?`
                });
            }

            updateExpertWithThinking({
                ...expertState,
                isOpen: true,
                message,
                inputType: 'text',
                inputAction: `set_standard_${index}`,
                options: []
            });
        } else {
            // All standards defined -> Use updateExpertWithThinking to avoid "stuck" state and enrich message
            updateExpertWithThinking({
                ...expertState,
                isOpen: true,
                message: t({
                    en: "**Action Plan Ready!**\n\nI’ve listed what to record for each team below. This library will make your business run without you.\n\nReady?",
                    fr: "**Plan d'action de prêt !**\n\nJ'ai listé ce qu'il faut enregistrer pour chaque équipe. Cette bibliothèque fera tourner votre entreprise sans vous.\n\nPrêt ?"
                }),
                inputType: null,
                options: [
                    { label: t({ en: "I'll do it myself (DIY)", fr: "Je le fais moi-même (DIY)" }), action: 'start_diy_extraction', value: 'DIY' },
                    { label: t({ en: "Hire hiroor", fr: "Recruter un hiroor" }), action: 'hire_hiroor', value: 'Hire' }
                ]
            });
        }
    };

    const askExtractionMethod = (index, currentRegistry) => {
        const list = currentRegistry || documentData.extractionRegistry;
        if (index >= list.length) {
            // All methods assigned -> Move to Standards
            askStandard(0, list);
            return;
        }

        const item = list[index];
        const isFirst = index === 0;

        let message;
        if (isFirst) {
            message = t({
                en: `How will you record **${item.subActivity}**? Pick the easiest way:`,
                fr: `Comment devrions-nous enregistrer **${item.subActivity}** ? Choisissez le plus simple :`
            });
        } else {
            message = t({
                en: `And for **${item.subActivity}**?`,
                fr: `Et pour **${item.subActivity}** ?`
            });
        }

        updateExpertWithThinking({
            ...expertState,
            isOpen: true,
            message,
            inputType: null,
            options: [
                { label: '🖥️ Screen Recording', action: 'set_extraction_method', value: { index, method: 'Screen Recording' } },
                { label: '📷 Camera/GoPro', action: 'set_extraction_method', value: { index, method: 'Camera/GoPro' } },
                { label: '🎤 Audio Notes', action: 'set_extraction_method', value: { index, method: 'Audio Notes' } },
                { label: '🎭 Role-play', action: 'set_extraction_method', value: { index, method: 'Role-play' } },
                { label: '❓ Other', action: 'set_extraction_method', value: { index, method: 'Other' } }
            ]
        });
    };
    const deriveDepartments = (ccfData, gfData, track) => {
        const depts = [];

        if (track === 'revenue') {
            // Marketing
            if ((ccfData.attention && ccfData.attention.length > 0) || (ccfData.enquiry && ccfData.enquiry.length > 0)) {
                depts.push({
                    id: 'marketing',
                    name: 'Marketing',
                    responsibilities: [...(ccfData.attention || []), ...(ccfData.enquiry || [])]
                });
            }

            // Sales
            if (ccfData.sales && ccfData.sales.length > 0) {
                depts.push({
                    id: 'sales',
                    name: 'Sales',
                    responsibilities: [...(ccfData.sales || [])]
                });
            }

            // Operations
            if (ccfData.delivery && ccfData.delivery.length > 0) {
                depts.push({
                    id: 'operations',
                    name: 'Operations',
                    responsibilities: [...(ccfData.delivery || [])]
                });
            }

            // Finance
            if (ccfData.money && ccfData.money.length > 0) {
                depts.push({
                    id: 'finance',
                    name: 'Finance',
                    responsibilities: [...(ccfData.money || [])]
                });
            }
        } else {
            // Growth Track
            if (gfData.finance && gfData.finance.length > 0) {
                depts.push({ id: 'finance', name: 'Finance', responsibilities: [...(gfData.finance || [])] });
            }
            if (gfData.people && gfData.people.length > 0) {
                depts.push({ id: 'hr', name: 'Human Resources', responsibilities: [...(gfData.people || [])] });
            }
            if (gfData.management && gfData.management.length > 0) {
                depts.push({ id: 'management', name: 'Management', responsibilities: [...(gfData.management || [])] });
            }
            if (gfData.operations && gfData.operations.length > 0) {
                depts.push({ id: 'operations', name: 'Operations', responsibilities: [...(gfData.operations || [])] });
            }
        }

        return depts;
    };

    const startDefinePhase = (trackOverride) => {
        const activeTrack = trackOverride || systemTrack;

        // Set phase for video demo
        console.log('SOPBuilder: Preparing video demo for Define phase');
        setCurrentPhaseForVideo('define');
        setShowPhaseVideo(false);
        setIsPhaseStarted(false);

        updateExpertWithThinking({
            ...expertState,
            isOpen: true,
            isTyping: true,
            message: activeTrack === 'growth'
                ? `**Define Phase**\n\nIf you want powerful systems to achieve your goals and vision, you must first define the systems you already run.\nYour startup is already operating on systems—even if you don’t see them.\nThe Define phase makes those systems visible and isolates the few that actually matter.\nInstead of hundreds, we focus on the critical 10–15 that drive your core operations and growth.\n\n**Goal:** Map your Growth Systems across Finance, People, and Management to eliminate single-person dependency.\n\n**Key Principle:** The 80/20 rule — a small number of systems create most of the results.\n\nI’ll help you do that.`
                : `**Define Phase**\n\nYou can’t build better systems without defining the ones you already use.\nYour business already works a certain way—intentional or not.\nThe Define phase reduces overwhelm by capturing the reality of how work is done today and narrowing it down to the few systems that actually drive revenue.\n\n**Goal:** Map your Critical Client Flow — the 7–12 real steps through which value is delivered.\n\n**Key Principle:** Keep it honest. Document what *is*, not what *should be*.\n\nI’ll help you do that.`,
            inputType: null,
            options: [
                { label: t({ en: 'Learn more', fr: 'En savoir plus' }), action: 'define_learn_more' },
                { label: t({ en: '🚀 Begin Work', fr: '🚀 Commencer' }), action: 'define_ready' }
            ],
            inputAction: null
        });
    };

    const startAssignPhase = (latestData) => {
        const dataToUse = latestData || documentData;
        const depts = deriveDepartments(dataToUse.ccf, dataToUse.gf, systemTrack);
        setDocumentData(prev => ({ ...prev, departments: depts }));

        // Set phase for video demo
        setCurrentPhaseForVideo('assign');
        setShowPhaseVideo(false);
        setIsPhaseStarted(false);
        setPhase('assign');

        if (depts.length > 0) {
            updateExpertWithThinking({
                ...expertState,
                isOpen: true,
                isTyping: true,
                message: t({
                    en: `**Phase: Assign**\n\Here are your defined departments. Is anyone missing?\n\n${depts.map(d => `- **${d.name}**`).join('\n')}`,
                    fr: `**Phase : Attribution**\n\Here are your defined departments. Is anyone missing?\n\n${depts.map(d => `- **${d.name}**`).join('\n')}`
                }),
                inputType: 'brainstorm-departments',
                data: { departments: depts },
                options: [
                    { label: t({ en: 'Learn more', fr: 'En savoir plus' }), action: 'assign_learn_more' },
                    { label: t({ en: '🚀 Begin Work', fr: '🚀 Commencer' }), action: 'assign_ready' }
                ],
                inputAction: null
            });
        } else {
            setExpertState(prev => ({
                ...prev,
                message: "No departments detected. Let's move on.",
                options: [{ label: "Extract", action: 'start_extract' }]
            }));
        }
    };

    const startExtractPhase = () => {
        // Automatic transition to brainstorming
        startBrainstorm();
    };

    const askDepartmentQuestions = (dept, index) => {
        const isFirst = index === 0;
        let message;
        if (isFirst) {
            message = t({
                en: `Who is the head of **${dept.name}**?`,
                fr: `Qui dirige le pôle **${dept.name}** ?`
            });
        } else {
            message = t({
                en: `And for **${dept.name}**, who's the head?`,
                fr: `Et pour **${dept.name}**, qui est le chef?`
            });
        }

        updateExpertWithThinking({
            ...expertState,
            isOpen: true,
            message,
            inputType: 'text',
            inputAction: `assign_head_${index}`,
            options: [] // Clear options
        });
    };



    const updateStandardData = (action, value) => {
        let updatedData = { ...documentData };

        switch (action) {
            case 'define_business_name':
                updatedData.ccf.businessName = value;
                updatedData.gf.businessName = value;

                // Update projects list
                if (currentProjectId) {
                    setProjects(prev => prev.map(p =>
                        p.id === currentProjectId ? { ...p, name: value || 'New Project' } : p
                    ));
                } else {
                    const newId = Date.now().toString();
                    setProjects(prev => [{
                        id: newId,
                        name: value || 'New Project',
                        createdAt: new Date().toISOString()
                    }, ...prev]);
                    setCurrentProjectId(newId);
                }
                break;
            case 'define_business_description':
                updatedData.ccf.coreService = value;
                break;
            case 'define_target_client':
                updatedData.ccf.targetClient = value;
                break;
            case 'define_attention':
                updatedData.ccf.attention = value;
                break;
            case 'define_enquiry':
                updatedData.ccf.enquiry = value;
                break;
            case 'define_sales':
                updatedData.ccf.sales = value;
                break;
            case 'define_delivery':
                updatedData.ccf.delivery = value;
                break;
            case 'define_money':
                updatedData.ccf.money = value;
                break;
            case 'define_loyalty':
                updatedData.ccf.loyalty = value;
                break;
        }

        setDocumentData(updatedData);
        return updatedData;
    };

    const handleInputSubmit = async (value, action) => {
        setLastActivityTs(Date.now());

        // Handle Goal Selection
        if (action === 'select_goal') {
            handleGoalSelect(value);
            return;
        }

        if (action && action.startsWith('set_custom_extraction_method_')) {
            const index = parseInt(action.split('_').pop());
            setDocumentData(prev => {
                const updatedRegistry = [...prev.extractionRegistry];
                updatedRegistry[index] = { ...updatedRegistry[index], method: value };
                return { ...prev, extractionRegistry: updatedRegistry };
            });
            setHighlightTrigger({ type: 'tableRow', index, timestamp: Date.now() });
            askExtractionMethod(index + 1);
            return;
        }

        if (systemTrack === 'revenue' && action && action.startsWith('define_')) {
            setHighlightKey(action.replace('define_', 'ccf.'));
        }
        if (!hasAnsweredFirstQuestion) {
            setHasAnsweredFirstQuestion(true);
        }

        // --- NEW: PHASE 1 - Standard Data update ---
        // Always save the data locally first so preview/sidebar stay in sync
        const latestData = updateStandardData(action, value);

        // --- NEW: PHASE 2 - AI INTENT & NEXT STEP ---
        setExpertState(prev => ({ ...prev, isThinking: true, isTyping: false, isOpen: true }));

        const startTime = Date.now();
        const aiResponse = await aiService.processInput({
            phase,
            systemTrack,
            documentData: latestData, // Use the data we just saved
            currentProjectId
        }, value);

        if (aiResponse) {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 2000 - elapsedTime);

            setTimeout(() => {
                setExpertState(prev => ({
                    ...prev,
                    message: aiResponse.message,
                    inputType: aiResponse.inputType || 'text',
                    options: aiResponse.options || [],
                    inputAction: aiResponse.inputAction || action,
                    isThinking: false,
                    isTyping: true,
                    messageTyped: false
                }));

                if (aiResponse.dataUpdate) {
                    setDocumentData(prev => ({ ...prev, ...aiResponse.dataUpdate }));
                }
                if (aiResponse.trackUpdate) setSystemTrack(aiResponse.trackUpdate);
                if (aiResponse.phaseUpdate) setPhase(aiResponse.phaseUpdate);
            }, remainingTime);

            return;
        }
        // --- END AI INTEGRATION ---

        // FALLBACK TO STATIC LOGIC (if AI service is unavailable or returns null)
        // DEFINE PHASE (Growth)


        if (action === 'define_business_name') {
            // Navigation logic only (Data saving moved to updateStandardData)
            if (systemTrack === 'growth') {
                updateExpertWithThinking({
                    ...expertState,
                    message: t({
                        en: "**1/4: Finance**\n\nHow do you handle money? (e.g. Invoicing, Payroll)",
                        fr: "**1/4 : Finance**\n\nComment gérez-vous l'argent ? (ex : Facturation, Paie)"
                    }),
                    inputType: 'dynamic-steps',
                    inputAction: 'define_gf_finance',
                    placeholderType: 'step',
                    options: []
                });
            } else {
                updateExpertWithThinking({
                    ...expertState,
                    message: t({
                        en: `What do you offer? (e.g. "A Super App", "Web Design", "Pizza", "SaaS")`,
                        fr: `Que vendez-vous ? (ex. : "Une Super App", "Design Web", "Pizza", "SaaS")`
                    }),
                    inputType: 'text',
                    options: [],
                    inputAction: 'define_business_description'
                });
            }
            return;
        }

        // GROWTH FLOW (GF)
        if (systemTrack === 'growth') {
            if (action === 'define_gf_finance') {
                setHighlightKey('ccf.finance');
                setDocumentData(prev => ({ ...prev, gf: { ...prev.gf, finance: value } }));
                updateExpertWithThinking({
                    ...expertState,
                    message: "**2/4: Team**\n\nHow do you manage people? (e.g. Hiring, Syncs)",
                    inputType: 'dynamic-steps',
                    inputAction: 'define_gf_people',
                    placeholderType: 'step',
                    options: []
                });
                return;
            }
            if (action === 'define_gf_people') {
                setHighlightKey('ccf.people');
                setDocumentData(prev => ({ ...prev, gf: { ...prev.gf, people: value } }));
                updateExpertWithThinking({
                    ...expertState,
                    message: t({
                        en: "**3/4: Leadership**\n\nHow do you run the ship? (e.g. Goal setting, Meetings)",
                        fr: "**3/4 : Leadership**\n\nComment dirigez-vous le navire ? (ex : Objectifs, Réunions)"
                    }),
                    inputType: 'dynamic-steps',
                    inputAction: 'define_gf_management',
                    placeholderType: 'step',
                    options: []
                });
                return;
            }
            if (action === 'define_gf_management') {
                setHighlightKey('ccf.management');
                setDocumentData(prev => ({ ...prev, gf: { ...prev.gf, management: value } }));
                updateExpertWithThinking({
                    ...expertState,
                    message: t({
                        en: "**4/4: Operations**\n\nWhat keeps the lights on? (e.g. IT, Legal)",
                        fr: "**4/4 : Opérations**\n\nQu'est-ce qui maintient l'activité ? (ex : IT, Juridique)"
                    }),
                    inputType: 'dynamic-steps',
                    inputAction: 'define_gf_operations',
                    placeholderType: 'step',
                    options: []
                });
                return;
            }
            if (action === 'define_gf_operations') {
                setHighlightKey('ccf.operations');
                setDocumentData(prev => ({ ...prev, gf: { ...prev.gf, operations: value } }));
                startAssignPhase();
                return;
            }
        } else if (action === 'define_business_description') {
            setHighlightKey('ccf.coreService');
            // Navigation logic only (Data saving moved to updateStandardData)
            const businessName = documentData.ccf?.businessName;
            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: `Who's your dream client? (e.g. "Startup founders", "Real estate agents")`,
                    fr: `Qui est votre client idéal ? (ex. : "Fondateurs de startups", "Agents immobiliers")`
                }),
                inputType: 'text',
                options: [],
                inputAction: 'define_target_client'
            });
        } else if (action === 'define_target_client') {
            // Navigation logic only (Data saving moved to updateStandardData)
            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: "**How do people discover your business?**\n\nSelect all the ways you currently attract potential customers:",
                    fr: "**Comment les gens découvrent-ils votre entreprise ?**\n\nSélectionnez tous les moyens que vous utilisez actuellement pour attirer des clients potentiels :"
                }),
                inputType: 'multi-select',
                options: ["LinkedIn", "Meta Ads", "Google Ads", "SEO", t({ en: "Referrals", fr: "Parrainages" }), t({ en: "Cold Email", fr: "E-mailing à froid" }), t({ en: "Content Marketing", fr: "Marketing de contenu" })],
                inputAction: 'define_attention'
            });
        } else if (action === 'define_attention') {
            setHighlightKey('ccf.attention');
            // Navigation logic only (Data saving moved to updateStandardData)
            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: "**Where do interested people go to learn/ask more about your business?**\n\nSelect all the ways customers can reach out or place orders:",
                    fr: "**Où les personnes intéressées vont-elles trouver plus d'informations sur votre entreprise ?**\n\nSélectionnez tous les moyens par lesquels les clients peuvent vous joindre ou passer commande :"
                }),
                inputType: 'multi-select',
                options: [t({ en: "Website Form", fr: "Formulaire site web" }), t({ en: "Phone Call", fr: "Appel téléphonique" }), "WhatsApp", t({ en: "Email", fr: "E-mail" }), "Instagram DM", t({ en: "Live Chat", fr: "Chat en direct" })],
                inputAction: 'define_enquiry'
            });
        } else if (action === 'define_enquiry') {
            setHighlightKey('ccf.enquiry');
            // Navigation logic only (Data saving moved to updateStandardData)
            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: "Client Steps from purchase decision to order submission? (e.g. download App -> login -> pickup -> submit order)",
                    fr: "Les étapes du client de la décision d'achat à la soumission de la commande ? (ex : Appel -> Devis -> Paiement)"
                }),
                inputType: 'dynamic-steps',
                placeholderType: 'step',
                options: [],
                inputAction: 'define_sales'
            });
        } else if (action === 'define_sales') {
            setHighlightKey('ccf.sales');
            // Navigation logic only (Data saving moved to updateStandardData)
            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: "Steps to deliver the Order/Work for the client?",
                    fr: "Les étapes de livraison du travail ?"
                }),
                inputType: 'dynamic-steps',
                placeholderType: 'step',
                options: [],
                initialSteps: [], // Reset steps
                inputAction: 'define_delivery'
            });
        } else if (action === 'define_delivery') {
            setHighlightKey('ccf.delivery');
            // Navigation logic only (Data saving moved to updateStandardData)
            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: "How do you collect payment?",
                    fr: "Comment collectez-vous les paiements ?"
                }),
                inputType: 'multi-select',
                options: [t({ en: "Online Payment (Stripe/PayPal)", fr: "Paiement en ligne (Stripe/PayPal)" }), t({ en: "Bank Transfer", fr: "Virement bancaire" }), t({ en: "Cash", fr: "Espèces" }), t({ en: "Check", fr: "Chèque" })],
                inputAction: 'define_money'
            });
        } else if (action === 'define_money') {
            setHighlightKey('ccf.money');
            // Navigation logic only (Data saving moved to updateStandardData)
            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: "How do you encourage clients to return or send referrals?",
                    fr: "Comment encouragez-vous les clients à revenir ou à vous recommander ?"
                }),
                inputType: 'multi-select',
                options: [t({ en: "Referral Program", fr: "Programme de parrainage" }), t({ en: "Loyalty Discount", fr: "Remise fidélité" }), t({ en: "Follow-up Calls", fr: "Appels de suivi" }), "Newsletter"],
                inputAction: 'define_loyalty'
            });
        } else if (action === 'define_loyalty') {
            setHighlightKey('ccf.loyalty');
            // Navigation logic only (Data saving moved to updateStandardData)
            // End of Define Phase
            // End of Define Phase -> Direct to Assign
            startAssignPhase(latestData);

            // Trigger feedback modal "in the middle" of experience
            setTimeout(() => {
                setShowFeedbackModal(true);
            }, 1000);
        } else if (action === 'submit_modified_departments') {
            const newNames = value;
            const existingDepts = documentData.departments || [];

            const updatedDepts = newNames.map(name => {
                const existing = existingDepts.find(d => d.name === name);
                if (existing) return existing;
                return {
                    id: name.toLowerCase().replace(/\s+/g, '-'),
                    name,
                    responsibilities: []
                };
            });

            setDocumentData(prev => ({ ...prev, departments: updatedDepts }));

            updateExpertWithThinking({
                ...expertState,
                message: t({
                    en: "Areas updated. Ready to assign?",
                    fr: "Zones mises à jour. Prêt à assigner ?"
                }),
                inputType: 'brainstorm-departments',
                data: { departments: updatedDepts },
                options: [
                    { label: t({ en: '🚀 Begin Work', fr: '🚀 Commencer' }), action: 'assign_ready' }
                ],
                inputAction: null
            });
            return;
        } else if (action && action.startsWith('assign_head_')) {
            const index = parseInt(action.split('_')[2]);
            setHighlightKey(`team.${index}.head`);
            const depts = [...documentData.departments];
            depts[index].head = value;
            setDocumentData(prev => ({ ...prev, departments: depts }));

            // Trigger highlight for team card
            setHighlightTrigger({ type: 'teamCard', index, timestamp: Date.now() });

            const isFirst = index === 0;
            let workerMessage;
            if (isFirst) {
                workerMessage = t({
                    en: `Beside Department head, Who's the expert in **${depts[index].name}**? (The person who actually does the work).`,
                    fr: `Qui est l'expert dans le pôle **${depts[index].name}** ? (La personne qui fait réellement le travail).`
                });
            } else {
                workerMessage = t({
                    en: `Who's the expert worker for **${depts[index].name}**?`,
                    fr: `Qui est le collaborateur expert pour **${depts[index].name}** ?`
                });
            }

            updateExpertWithThinking({
                ...expertState,
                message: workerMessage,
                inputType: 'text',
                inputAction: `assign_worker_${index}`
            });
        } else if (action && action.startsWith('assign_worker_')) {
            const index = parseInt(action.split('_')[2]);
            setHighlightKey(`team.${index}.worker`);
            const depts = [...documentData.departments];
            depts[index].worker = value;
            setDocumentData(prev => ({ ...prev, departments: depts }));

            // Trigger highlight for team card
            setHighlightTrigger({ type: 'teamCard', index, timestamp: Date.now() });

            if (index + 1 < depts.length) {
                askDepartmentQuestions(depts[index + 1], index + 1);
            } else {
                // Direct to Extract
                startExtractPhase();
            }
        } else if (action && action.startsWith('add_subactivities_')) {
            const parts = action.split('_');
            const deptIndex = parseInt(parts[2]);
            const respIndex = parseInt(parts[3]);

            const dept = documentData.departments[deptIndex];
            const responsibility = dept?.responsibilities?.[respIndex];
            if (!dept || !responsibility) {
                console.error('Invalid department/responsibility for sub-activities.');
                return;
            }

            // Update sub-activities for this responsibility
            const updatedDepts = [...documentData.departments];
            updatedDepts[deptIndex] = {
                ...dept,
                subActivities: {
                    ...dept.subActivities,
                    [responsibility]: value // value is array from dynamic-steps
                }
            };
            setDocumentData(prev => ({ ...prev, departments: updatedDepts }));

            // Trigger highlight for Operational Reality Map row
            setHighlightTrigger({ type: 'brainstormRow', deptIndex, respIndex, timestamp: Date.now() });

            // Move to next responsibility
            askSubActivities(deptIndex, respIndex + 1);
        } else if (action && action.startsWith('set_standard_')) {
            const index = parseInt(action.split('_')[2]);
            setDocumentData(prev => {
                const updatedRegistry = [...prev.extractionRegistry];
                updatedRegistry[index] = { ...updatedRegistry[index], standard: value };
                return { ...prev, extractionRegistry: updatedRegistry };
            });
            // Trigger highlight for table row
            setHighlightTrigger({ type: 'tableRow', index, timestamp: Date.now() });
            askStandard(index + 1); // Ask for next item
        }

    };

    /* 
    const handleActionPlanUpdate = (key, value) => {
        setDocumentData(prev => {
            const updatedPlan = { ...prev.extractionActionPlan, [key]: value };
            const newData = { ...prev, extractionActionPlan: updatedPlan };
     
            // Check for completion
            const allComplete = Object.values(updatedPlan).every(v => v === true);
     
            if (allComplete) {
                // Trigger Expert completion
                setExpertState(prevExpert => ({
                    ...prevExpert,
                    message: "Extraction Action Plan complete. Using these systems, your business can now run with less friction.\n\nReady to organize everything into a scalable architecture?",
                    inputType: null,
                    specialEffect: 'completion',
                    options: [
                        { label: "Start Organize Phase", action: 'start_organize' }
                    ]
                }));
            }
     
            return newData;
        });
    };
    */

    const calculateProgress = () => {
        if (phase === 'define') return 25;
        if (phase === 'assign') return 50;
        if (phase === 'extract' || phase === 'diy_extraction' || phase === 'brainstorm') return 75;
        if (phase === 'organize') return 85;
        if (phase === 'integrate') return 92;
        if (phase === 'optimize') return 100;
        return 0;
    };

    const seedSystemLibrary = () => {
        setDocumentData(prev => {
            if (prev.systemLibrary && prev.systemLibrary.length > 0) return prev;
            const now = new Date().toISOString();
            const library = (prev.extractionRegistry || []).map((item) => {
                const extracted = prev.systems?.find(s => s.name === item.subActivity);
                const extractedData = extracted?.data || {};
                return {
                    id: `${item.department}-${item.responsibility}-${item.subActivity}`.replace(/\s+/g, '-').toLowerCase(),
                    title: item.subActivity,
                    department: item.department,
                    responsibility: item.responsibility,
                    subActivity: item.subActivity,
                    owner: item.worker || '',
                    method: item.method || '',
                    standard: item.standard || '',
                    status: extracted ? 'Active' : 'Draft',
                    updatedAt: now,
                    overview: extractedData.goal || '',
                    goal: extractedData.goal || '',
                    trigger: extractedData.trigger || '',
                    inputs: extractedData.inputs || [],
                    steps: extractedData.steps || [],
                    tools: extractedData.tools || [],
                    media: [],
                    resources: []
                };
            });
            return { ...prev, systemLibrary: library };
        });
    };

    const startTeachingMenu = (contextPhase) => {
        updateExpertWithThinking({
            ...expertState,
            isOpen: true,
            mode: 'teaching',
            teachingPhase: null,
            teachingStep: 0,
            teachingContextPhase: contextPhase || expertState.teachingContextPhase,
            message: t({
                en: "Want to learn how to use each phase? Pick a phase and I'll walk you through it.",
                fr: "Vous voulez apprendre comment utiliser chaque phase ? Choisissez une phase et je vous guiderai."
            }),
            inputType: null,
            inputAction: null,
            options: [
                { label: t({ en: 'Define', fr: 'Définir' }), action: 'teach_phase', value: 'define' },
                { label: t({ en: 'Assign', fr: 'Assigner' }), action: 'teach_phase', value: 'assign' },
                { label: t({ en: 'Extract', fr: 'Extraction' }), action: 'teach_phase', value: 'extract' },
                { label: t({ en: 'Organize', fr: 'Organiser' }), action: 'teach_phase', value: 'organize' },
                { label: t({ en: 'Integrate', fr: 'Intégrer' }), action: 'teach_phase', value: 'integrate' },
                { label: t({ en: 'Optimize', fr: 'Optimiser' }), action: 'teach_phase', value: 'optimize' }
            ]
        });
    };

    const startTeachingPhase = (phaseId, stepIndex = 0) => {
        const steps = teachingGuides[phaseId] || [];
        if (steps.length === 0) {
            startTeachingMenu(phaseId);
            return;
        }
        const clampedIndex = Math.min(Math.max(stepIndex, 0), steps.length - 1);
        const translatedPhaseNames = {
            define: t({ en: 'Define', fr: 'Définir' }),
            assign: t({ en: 'Assign', fr: 'Assigner' }),
            extract: t({ en: 'Extract', fr: 'Extraction' }),
            organize: t({ en: 'Organize', fr: 'Organiser' }),
            integrate: t({ en: 'Integrate', fr: 'Intégrer' }),
            optimize: t({ en: 'Optimize', fr: 'Optimiser' }),
            brainstorm: t({ en: 'Brainstorm', fr: 'Remue-méninges' })
        };
        const title = translatedPhaseNames[phaseId] || (phaseId.charAt(0).toUpperCase() + phaseId.slice(1));
        const message = `**${title} • ${t({ en: 'Step', fr: 'Étape' })} ${clampedIndex + 1}/${steps.length}**\n\n${steps[clampedIndex]}`;
        const isLast = clampedIndex === steps.length - 1;

        updateExpertWithThinking({
            ...expertState,
            isOpen: true,
            mode: 'teaching',
            teachingPhase: phaseId,
            teachingStep: clampedIndex,
            teachingContextPhase: phaseId,
            message,
            inputType: null,
            inputAction: null,
            options: [
                ...(isLast
                    ? [{ label: t({ en: 'Restart steps', fr: 'Recommencer les étapes' }), action: 'teach_restart' }]
                    : [{ label: t({ en: 'Next step', fr: 'Étape suivante' }), action: 'teach_next' }]
                ),
                { label: t({ en: 'Back to phase menu', fr: 'Retour au menu' }), action: 'teach_menu' }
            ]
        });
        setNavTarget({ phase: phaseId, ts: Date.now(), highlight: true, noScroll: phaseId === (['brainstorm', 'diy_extraction'].includes(phase) ? 'extract' : phase) });
    };

    const handleStartOrganize = () => {
        seedSystemLibrary();
        setPhase('organize');
        setIsPhaseStarted(false);

        // Set phase for video demo
        setCurrentPhaseForVideo('organize');
        setShowPhaseVideo(false);
        startTeachingMenu('organize');
    };

    const handleStartIntegrate = () => {
        setPhase('integrate');
        setIsPhaseStarted(false);

        // Set phase for video demo
        setCurrentPhaseForVideo('integrate');
        setShowPhaseVideo(false);
        startTeachingMenu('integrate');
    };

    const handleIntegrateComplete = () => {
        setPhase('optimize');
        setIsPhaseStarted(false);
        startTeachingMenu('optimize');
    };

    const handlePhaseNavigate = (targetPhase) => {
        // Just scroll to the section
        setNavTarget({ phase: targetPhase, ts: Date.now() });

        // If we were showing intro, hide it to let user see the navigation result
        if (showIntro) {
            setShowIntro(false);
            setIntroFinished(true);
            setHasAnsweredFirstQuestion(true); // Ensure document is visible
        }
    };

    const handleSystemLibraryUpdate = (library) => {
        setDocumentData(prev => ({ ...prev, systemLibrary: library }));
    };

    const handleIntegratePlanUpdate = (department, steps) => {
        setDocumentData(prev => ({
            ...prev,
            integratePlan: {
                ...prev.integratePlan,
                [department]: { steps }
            }
        }));
    };

    const handleOptimizeUpdate = (updates) => {
        setDocumentData(prev => ({
            ...prev,
            optimize: {
                ...prev.optimize,
                ...updates
            }
        }));
    };

    const isOptimizeComplete = (data) => {
        const kpis = data.optimize?.kpis || [];
        const problems = data.optimize?.problems || [];
        return kpis.length > 0 && problems.length > 0;
    };

    const transitionToGrowth = () => {
        const preservedCCF = documentData.ccf || {};
        setSystemTrack('growth');
        setPhase('define');
        setHighlightKey(null);
        setDocumentData({
            ...initialDocumentData,
            ccf: preservedCCF
        });
        updateExpertWithThinking({
            ...expertState,
            isOpen: true,
            isTyping: true,
            message: t({
                en: "Revenue systems complete -- great work.\n\nNext milestone: **Systems for Growth**.\nWe'll document the systems that let you scale without bottlenecks.\n\nReady to begin?",
                fr: "Systèmes de revenus terminés — excellent travail.\n\nProchaine étape : **Systèmes pour la Croissance**.\nNous documenterons les systèmes qui vous permettent de passer à l'échelle sans goulots d'étranglement.\n\nPrêt à commencer ?"
            }),
            inputType: null,
            inputAction: null,
            specialEffect: 'completion',
            options: [
                { label: t({ en: "Start Growth Systems", fr: "Démarrer les systèmes de croissance" }), action: 'define_ready' }
            ]
        });
    };

    useEffect(() => {
        if (systemTrack !== 'revenue') return;
        if (!isOptimizeComplete(documentData)) return;
        transitionToGrowth();
    }, [systemTrack, documentData.optimize]);

    const handleGoalSelect = (goalId) => {
        setSelectedGoal(goalId);
        setIsGoalSelected(true);
        setSystemTrack('revenue');
        setPhase('define');
        setShowIntro(false);
        setIntroFinished(true);
        setHasAnsweredFirstQuestion(true);
        startDefinePhase('revenue');
    };

    const handleExpertAction = async (action, value) => {
        setLastActivityTs(Date.now());
        switch (action) {
            case 'close':
                setExpertState(prev => ({ ...prev, isOpen: false }));
                break;
            case 'teach_phase':
                startTeachingPhase(value, 0);
                break;
            case 'teach_next': {
                const currentPhase = expertState.teachingPhase;
                if (!currentPhase) {
                    startTeachingMenu(phase);
                    break;
                }
                const steps = teachingGuides[currentPhase] || [];
                const nextStep = Math.min((expertState.teachingStep || 0) + 1, steps.length - 1);
                startTeachingPhase(currentPhase, nextStep);
                break;
            }
            case 'teach_restart':
                if (expertState.teachingPhase) {
                    startTeachingPhase(expertState.teachingPhase, 0);
                } else {
                    startTeachingMenu(phase);
                }
                break;
            case 'teach_menu': {
                const currentTeachingPhase = expertState.teachingPhase || expertState.teachingContextPhase;
                if (currentTeachingPhase === 'define') {
                    startDefinePhase(systemTrack);
                } else if (currentTeachingPhase === 'assign') {
                    startAssignPhase();
                } else if (currentTeachingPhase === 'extract' || currentTeachingPhase === 'brainstorm') {
                    startBrainstorm();
                } else {
                    startTeachingMenu(currentTeachingPhase || phase);
                }
                break;
            }
            case 'define_learn_more':
                updateExpertWithThinking({
                    ...expertState,
                    isTyping: true,
                    message: systemTrack === 'growth'
                        ? t({
                            en: "**About the Define Phase**\n\nThis phase identifies the critical systems in Finance, People, and Management needed to scale without single-person dependency.\n\n**What You'll Do:**\n• List 5-8 repeatable systems per department\n• Focus on what you do now (except HR hiring/onboarding)\n• Keep it simple—capture current reality\n\n**Why It Matters:**\nThe 80/20 rule applies here. Just 20% of your systems provide 80% of efficiency wins. We focus on the critical few that make scaling possible.\n\nLet's get started.",
                            fr: "**À propos de la phase Définir**\n\nCette phase identifie les systèmes critiques en finance, personnel et gestion nécessaires pour passer à l'échelle sans dépendre d'une seule personne.\n\n**Ce que vous ferez :**\n• Listez 5 à 8 systèmes répétables par département\n• Concentrez-vous sur ce que vous faites actuellement (sauf le recrutement/intégration RH)\n• Restez simple — capturez la réalité actuelle\n\n**Pourquoi c'est important :**\nLa règle du 80/20 s'applique ici. Seulement 20 % de vos systèmes apportent 80 % des gains d'efficacité. Nous nous concentrons sur les quelques éléments critiques qui rendent la croissance possible.\n\nCommençons."
                        })
                        : t({
                            en: "**About the Define Phase**\n\nThis phase maps your Critical Client Flow (CCF)—the path a client takes from discovery to delivery.\n\n**What You'll Do:**\n• Identify ONE primary target client\n• Map 7-12 steps across: Attention → Enquiry → Sales → Money → Delivery → Loyalty\n• Capture what you're actually doing today\n\n**Why It Matters:**\nCreating the CCF reveals holes in your business (poor invoicing, weak onboarding) and provides a proven blueprint for moving from survival to scale.\n\nLet's get started.",
                            fr: "**À propos de la phase Définir**\n\nCette phase cartographie votre Flux Client Critique (CCF) — le chemin qu'un client emprunte de la découverte à la livraison.\n\n**Ce que vous ferez :**\n• Identifiez UN client cible principal\n• Cartographiez 7 à 12 étapes à travers : Attention → Demande → Vente → Paiement → Livraison → Fidélisation\n• Capturez ce que vous faites réellement aujourd'hui\n\n**Pourquoi c'est important :**\nLa création du CCF révèle des lacunes dans votre entreprise (facturation médiocre, intégration faible) et fournit un plan éprouvé pour passer de la survie à la croissance.\n\nCommençons."
                        }),
                    inputType: null,
                    options: [
                        { label: t({ en: '📖 Interactive Guide', fr: '📖 Guide interactif' }), action: 'teach_phase', value: 'define' },
                        { label: t({ en: '🚀 Begin Work', fr: '🚀 Commencer' }), action: 'define_ready' }
                    ]
                });
                break;
            case 'assign_learn_more':
                updateExpertWithThinking({
                    ...expertState,
                    isTyping: true,
                    message: t({
                        en: "**About the Assign Phase**\n\nThis phase creates your Departments, Responsibilities & Team Chart (DRTC) to map where knowledge exists.\n\n**What You'll Do:**\n• Assign a Department Head for each area\n• Identify the most knowledgeable worker\n• Model the Best—find top performers\n\n**Why It Matters:**\nThe business owner is often the worst person to document systems (always important, never urgent). By assigning responsibility to those who know the work best, you remove key person dependency and avoid micromanagement.\n\nLet's get started.",
                        fr: "**À propos de la phase Assigner**\n\nCette phase crée votre organigramme Départements, Responsabilités et Équipe (DRTC) pour cartographier où se trouvent les connaissances.\n\n**Ce que vous ferez :**\n• Assignez un responsable pour chaque département\n• Identifiez le collaborateur le plus expert\n• Modélisez le meilleur — trouvez les éléments les plus performants\n\n**Pourquoi c'est important :**\nLe chef d'entreprise est souvent la pire personne pour documenter les systèmes (c'est toujours important, mais jamais urgent). En confiant la responsabilité à ceux qui connaissent le mieux le travail, vous supprimez la dépendance envers les personnes clés et évitez le micromanagement.\n\nCommençons."
                    }),
                    inputType: null,
                    options: [
                        { label: t({ en: '📖 Interactive Guide', fr: '📖 Guide interactif' }), action: 'teach_phase', value: 'assign' },
                        { label: t({ en: '🚀 Begin Work', fr: '🚀 Commencer' }), action: 'assign_ready' }
                    ]
                });
                break;
            case 'extract_learn_more':
                updateExpertWithThinking({
                    ...expertState,
                    isTyping: true,
                    message: t({
                        en: "**About the Extract Phase**\n\nThis phase uses an 8-step process to capture knowledge efficiently without complex flowcharts.\n\n**The Two-Person Method:**\n• Knowledgeable Worker: Performs the task\n• Systems Champion: Handles documentation\n\n**What You'll Do:**\n• Record tasks live (screen recording, camera, audio)\n• Create step-by-step documentation\n• Review and cross-train the team\n\n**Why It Matters:**\nBy extracting what top performers already do, you create an immediate baseline. Focus on the 80/20—document critical systems first, not every minor task.\n\nLet's get started.",
                        fr: "**À propos de la phase Extraction**\n\nCette phase utilise un processus en 8 étapes pour capturer les connaissances efficacement sans organigrammes complexes.\n\n**La méthode à deux personnes :**\n• Collaborateur expert : Effectue la tâche\n• Champion des systèmes : S'occupe de la documentation\n\n**Ce que vous ferez :**\n• Enregistrez les tâches en direct (capture d'écran, caméra, audio)\n• Créez une documentation étape par étape\n• Révisez et formez l'équipe de manière croisée\n\n**Pourquoi c'est important :**\nEn extrayant ce que les collaborateurs les plus performants font déjà, vous créez une base de référence immédiate. Concentrez-vous sur le 80/20 — documentez d'abord les systèmes critiques, pas chaque tâche mineure.\n\nCommençons."
                    }),
                    inputType: null,
                    options: [
                        { label: t({ en: '📖 Interactive Guide', fr: '📖 Guide interactif' }), action: 'teach_phase', value: 'extract' },
                        { label: t({ en: '🚀 Begin Work', fr: '🚀 Commencer' }), action: 'extract_ready' }
                    ]
                });
                break;
            case 'assign_ready':
                // Start asking department questions
                setIsPhaseStarted(true);
                const depts = documentData.departments;
                if (depts && depts.length > 0) {
                    askDepartmentQuestions(depts[0], 0);
                } else {
                    updateExpertWithThinking({
                        ...expertState,
                        message: t({ en: "No departments detected. Let's move on.", fr: "Aucun département détecté. Continuons." }),
                        options: [{ label: t({ en: "Extract", fr: "Extraction" }), action: 'start_extract' }]
                    });
                }
                break;
            case 'extract_ready':
                // Start asking sub-activities
                setIsPhaseStarted(true);
                const deptsWithSubActivities = documentData.departments.map(dept => ({
                    ...dept,
                    subActivities: dept.subActivities || {}
                }));
                setDocumentData(prev => ({ ...prev, departments: deptsWithSubActivities }));

                const firstDept = deptsWithSubActivities[0];
                const firstResp = firstDept?.responsibilities?.[0];
                if (!firstResp) {
                    updateExpertWithThinking({
                        ...expertState,
                        message: t({
                            en: "We need at least one responsibility before we can map sub-activities.",
                            fr: "Nous avons besoin d'au moins une responsabilité avant de pouvoir cartographier les sous-activités."
                        }),
                        inputType: null,
                        options: [{ label: t({ en: "Back to Define", fr: "Retour à Définir" }), action: 'define_ready' }]
                    });
                } else {
                    updateExpertWithThinking({
                        ...expertState,
                        message: t({
                            en: `For **${firstDept.name}** → **${firstResp}**, what are the specific sub-activities or tasks involved?\n\nList them one by one (e.g., ${getTaskExamples(firstResp, t)}).`,
                            fr: `Pour **${firstDept.name}** → **${firstResp}**, quelles sont les sous-activités ou tâches spécifiques impliquées ?\n\nListez-les une par une (ex. : ${getTaskExamples(firstResp, t)}).`
                        }),
                        inputType: 'dynamic-steps',
                        inputAction: `add_subactivities_0_0`,
                        placeholderType: 'sub-activity',
                        options: [],
                        initialSteps: firstDept.subActivities[firstResp] || []
                    });
                }
                break;
            case 'define_growth_start':
            case 'define_ready':
                setIsPhaseStarted(true);
                if (documentData.ccf?.businessName || documentData.gf?.businessName) {
                    // If we have a business name, go straight to the first track-specific question
                    if (systemTrack === 'growth') {
                        updateExpertWithThinking({
                            ...expertState,
                            message: t({
                                en: "Step 1/4 - **Finance**\n\nHow does money flow into and out of the business? (e.g., Invoicing, Payroll, Expense tracking, Bank reconciliation).",
                                fr: "Étape 1/4 - **Finance**\n\nComment l'argent entre-t-il et sort-il de l'entreprise ? (ex. : Facturation, Paie, Suivi des dépenses, Rapprochement bancaire)."
                            }),
                            inputType: 'dynamic-steps',
                            inputAction: 'define_gf_finance',
                            placeholderType: 'step',
                            options: []
                        });
                    } else {
                        // Revenue track
                        const name = documentData.ccf?.businessName || documentData.gf?.businessName;
                        updateExpertWithThinking({
                            ...expertState,
                            message: t({
                                en: `Describe what **${name}** is offering (i.e. service, product, app, etc).`,
                                fr: `Décrivez ce que **${name}** propose (ex. : service, produit, application, etc.).`
                            }),
                            inputType: 'text',
                            options: [],
                            inputAction: 'define_business_description'
                        });
                    }
                } else {
                    updateExpertWithThinking({
                        ...expertState,
                        message: t({ en: "What's your Brand called?", fr: "Comment s'appelle votre marque ?" }),
                        inputType: 'text',
                        inputAction: 'define_business_name',
                        options: []
                    });
                }
                break;
            case 'start_assign':
                startAssignPhase();
                break;
            case 'start_extract':
                startExtractPhase();
                break;
            case 'start_brainstorm':
                startExtractPhase();
                break;
            case 'set_extraction_method': {
                const { index, method } = value;
                if (method === 'Other') {
                    updateExpertWithThinking({
                        ...expertState,
                        message: t({
                            en: "What's the other capture method?",
                            fr: "Quelle est l'autre méthode de capture ?"
                        }),
                        inputType: 'text',
                        inputAction: `set_custom_extraction_method_${index}`,
                        options: []
                    });
                } else {
                    setDocumentData(prev => {
                        const updatedRegistry = [...prev.extractionRegistry];
                        updatedRegistry[index] = { ...updatedRegistry[index], method };
                        return { ...prev, extractionRegistry: updatedRegistry };
                    });
                    // Trigger highlight for table row
                    setHighlightTrigger({ type: 'tableRow', index, timestamp: Date.now() });
                    askExtractionMethod(index + 1); // Ask for next item
                }
                break;
            }

            case 'start_diy_extraction':
                setPhase('diy_extraction');
                updateExpertWithThinking({
                    ...expertState,
                    isOpen: true,
                    message: t({
                        en: "Welcome to your **System Extraction Checklist**.\n\nWork with your team to follow the capture method for each sub-activity. Mark them as recorded, reviewed, and approved once finished.\n\nYou can also hire a **hiro** to handle the heavy lifting of recording and documentation for you.",
                        fr: "Bienvenue dans votre **liste de contrôle d'extraction de systèmes**.\n\nTravaillez avec votre équipe pour suivre la méthode de capture pour chaque sous-activité. Marquez-les comme enregistrées, révisées et approuvées une fois terminées.\n\nVous pouvez également recruter un **hiroor** pour s'occuper du gros du travail d'enregistrement et de documentation pour vous."
                    }),
                    inputType: null,
                    inputAction: null,
                    options: [
                        { label: t({ en: "Move to organize phase", fr: "Passer à la phase Organiser" }), action: 'start_organize' }
                    ],
                    mode: 'default'
                });
                break;
            case 'placeholder_extract':
                startExtractPhase();
                break;
            case 'hire_hiroor':
                setShowHiroorModal(true);
                setExpertState(prev => ({ ...prev, isOpen: false })); // Close expert box when modal opens
                break;
            case 'organize_learn_more':
                startTeachingMenu('organize');
                break;
            case 'organize_ready':
                setIsPhaseStarted(true);
                startTeachingMenu('organize');
                break;
            case 'integrate_learn_more':
                startTeachingMenu('integrate');
                break;
            case 'integrate_ready':
                setIsPhaseStarted(true);
                startTeachingMenu('integrate');
                break;
            case 'optimize_learn_more':
                startTeachingMenu('optimize');
                break;
            case 'modify_departments':
                updateExpertWithThinking({
                    ...expertState,
                    message: t({
                        en: "No problem. Adjust the department list below. You can add new ones or remove those that don't apply.",
                        fr: "Pas de problème. Ajustez la liste des départements ci-dessous. Vous pouvez en ajouter de nouveaux ou supprimer ceux qui ne s'appliquent pas."
                    }),
                    inputType: 'dynamic-steps',
                    inputAction: 'submit_modified_departments',
                    placeholderType: 'department',
                    initialSteps: Array.isArray(value) ? value.map(d => typeof d === 'string' ? d : d.name) : [],
                    options: []
                });
                break;
            case 'optimize_ready':
                setIsPhaseStarted(true);
                startTeachingMenu('optimize');
                break;
            case 'start_organize':
                handleStartOrganize();
                break;
            case 'create_new_project':
                const newId = Date.now().toString();
                const newProject = {
                    id: newId,
                    name: 'New Project',
                    createdAt: new Date().toISOString()
                };
                setProjects(prev => [newProject, ...prev]);
                setCurrentProjectId(newId);
                setDocumentData(initialDocumentData); // Reset document data for new project
                setSystemTrack('revenue');
                setSelectedGoal(newId); // Use project ID as goal ID
                setIsGoalSelected(true);
                setPhase('define');
                setShowIntro(false);
                setIntroFinished(true);
                startDefinePhase('revenue');
                break;
            case 'select_existing_project':
                updateExpertWithThinking({
                    ...expertState,
                    message: t({ en: "Which project would you like to continue?", fr: "Quel projet souhaitez-vous continuer ?" }),
                    inputType: 'select',
                    options: projects.map(p => ({ label: p.name, value: p.id })),
                    inputAction: 'select_goal' // Re-use select_goal for project selection
                });
                break;
            case 'generate_framework_draft':
                updateExpertWithThinking({
                    ...expertState,
                    isThinking: true,
                    isTyping: false,
                    isOpen: true
                });
                try {
                    const draft = await aiService.generateFramework({ documentData, phase });
                    if (draft) {
                        setDocumentData(prev => ({
                            ...prev,
                            systemLibrary: [...(prev.systemLibrary || []), {
                                ...draft,
                                id: draft.id || Date.now().toString(),
                                updatedAt: new Date().toISOString()
                            }]
                        }));
                        updateExpertWithThinking({
                            ...expertState,
                            message: t({
                                en: "🚀 **Draft Generated!** I've created a custom system framework based on your business context. You can find it in the **Organize** section for final review.",
                                fr: "🚀 **Brouillon généré !** J'ai créé un cadre de système personnalisé basé sur votre contexte commercial. Vous pouvez le trouver dans la section **Organiser** pour révision finale."
                            }),
                            isTyping: true,
                            inputType: null,
                            options: [
                                { label: t({ en: "View System Library", fr: "Voir la bibliothèque" }), action: 'start_organize' }
                            ]
                        });
                    }
                } catch (err) {
                    updateExpertWithThinking({
                        ...expertState,
                        isThinking: false,
                        isTyping: false,
                        message: t({
                            en: "Sorry, I couldn't generate the draft right now.",
                            fr: "Désolé, je n'ai pas pu générer le brouillon pour le moment."
                        })
                    });
                }
                break;
            default:
                console.warn('Unknown action:', action);
        }
    };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', backgroundColor: isDark ? '#191919' : '#fff', overflow: 'hidden' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: isSidebarOpen ? '260px' : '72px',
                zIndex: 1001,
                backgroundColor: 'transparent',
                transition: 'width 0.3s ease'
            }}>
                <AppSidebar
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                    projects={projects}
                    currentProjectId={currentProjectId}
                    onNewProject={handleNewProject}
                    onSelectProject={handleSelectProject}
                    onRenameProject={handleRenameProject}
                    onRemoveProject={handleRemoveProject}
                    onClearProjects={handleClearProjects}
                    phase={phase}
                    systemTrack={systemTrack}
                    onSystemTrackChange={handleSystemTrackChange}
                    onPhaseClick={handlePhaseNavigate}
                    progress={calculateProgress()}
                />
            </div>

            {/* Floating Menu Toggle when Sidebar is Closed */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    style={{
                        position: 'fixed',
                        top: '12px',
                        left: '12px',
                        zIndex: 1000,
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(55, 53, 47, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = isDark ? '#FFFFFF' : '#37352F'}
                    onMouseOut={(e) => e.currentTarget.style.color = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(55, 53, 47, 0.5)'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 3v18" />
                    </svg>
                </button>
            )}

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                marginLeft: 0, // No margin, let PreviewSpace extend under the sidebar
                transition: 'margin-left 0.3s ease',
                height: '100vh',
                overflow: 'hidden'
            }}>
                <FeedbackModal
                    isOpen={showFeedbackModal}
                    onClose={() => setShowFeedbackModal(false)}
                />

                {/* Middle Column: Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    height: '100%',
                    backgroundColor: isDark ? '#191919' : '#fff' // Ensure background
                }}>
                    <PreviewSpace
                        data={documentData}
                        phase={phase}
                        isPhaseStarted={isPhaseStarted}
                        systemTrack={systemTrack}
                        showIntro={showIntro}
                        isSidebarOpen={isSidebarOpen} // Pass sidebar state
                        hasAnsweredFirstQuestion={hasAnsweredFirstQuestion}
                        scrollToSection={navTarget}
                        onIntroFinish={handleIntroStart}
                        onDataUpdate={(newData) => setDocumentData(prev => ({ ...prev, ...newData }))}
                        // onActionPlanUpdate={handleActionPlanUpdate}
                        onStartOrganize={handleStartOrganize}
                        onStartIntegrate={handleStartIntegrate}
                        onIntegrateComplete={handleIntegrateComplete}
                        onSystemLibraryUpdate={handleSystemLibraryUpdate}
                        onIntegratePlanUpdate={handleIntegratePlanUpdate}
                        onOptimizeUpdate={handleOptimizeUpdate}
                        lastActivityTs={lastActivityTs}
                        highlightKey={highlightKey}
                        highlightTrigger={highlightTrigger}
                    />
                </div>

                {/* Expert Box - Floating Overlay */}
                {expertState.isOpen && (
                    <ExpertBox
                        state={expertState}
                        onAction={handleExpertAction}
                        onSubmit={handleInputSubmit}
                        phase={phase}
                        projects={projects}
                        onSelectProject={handleSelectProject}
                        onRemoveProject={handleRemoveProject}
                        onTypingComplete={() => {
                            // Only show if not already shown for this project
                            const alreadyShown = documentData.shownVideos?.includes(currentPhaseForVideo);

                            if (currentPhaseForVideo && !alreadyShown) {
                                console.log('SOPBuilder: Expert typing complete, showing video demo for:', currentPhaseForVideo);
                                setShowPhaseVideo(true);

                                // Mark as shown in documentData
                                setDocumentData(prev => ({
                                    ...prev,
                                    shownVideos: [...(prev.shownVideos || []), currentPhaseForVideo]
                                }));
                            } else {
                                console.log('SOPBuilder: Video already shown or no phase set. Skipping.');
                            }
                        }}
                        docked={false} // Floating mode
                    />
                )}

                {/* Phase Video Demo - Shows beside Expert Box */}
                <PhaseVideoDemo
                    phase={currentPhaseForVideo}
                    isShowing={showPhaseVideo}
                    onComplete={() => setShowPhaseVideo(false)}
                />

                {/* hiroor Marketplace Modal */}
                <HiroorModal
                    isOpen={showHiroorModal}
                    onClose={() => setShowHiroorModal(false)}
                    extractionPlan={documentData.activeExtractionPlan}
                />
            </div>
        </div>
    );
};

export default SOPBuilder;
