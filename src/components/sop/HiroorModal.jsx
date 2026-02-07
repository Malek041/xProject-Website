import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Calendar, Star, MapPin, DollarSign } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HiroorModal = ({ isOpen, onClose, extractionPlan }) => {
    const { t } = useLanguage();
    const [selectedHiroor, setSelectedHiroor] = useState(null);

    // Mock hiroor data (InDrive-style)
    const hiroors = [
        {
            id: 1,
            name: 'Sarah Chen',
            rating: 4.9,
            reviews: 127,
            specialization: t({ en: 'Process Documentation', fr: 'Documentation de processus' }),
            location: t({ en: 'Remote (GMT+8)', fr: 'À distance (GMT+8)' }),
            availability: t({ en: 'Available now', fr: 'Disponible maintenant' }),
            pricing: '$45-65/hr',
            bio: t({
                en: 'Expert in capturing operational workflows. 5+ years documenting systems for startups.',
                fr: "Experte dans la capture de flux opérationnels. Plus de 5 ans à documenter des systèmes pour des startups."
            }),
            avatar: '👩‍💼'
        },
        {
            id: 2,
            name: 'Marcus Johnson',
            rating: 4.8,
            reviews: 89,
            specialization: t({ en: 'Screen Recording & Training', fr: "Enregistrement d'écran et formation" }),
            location: t({ en: 'Remote (EST)', fr: 'À distance (EST)' }),
            availability: t({ en: 'Available tomorrow', fr: 'Disponible demain' }),
            pricing: '$40-55/hr',
            bio: t({
                en: 'Specialized in tech systems. Former operations manager turned systems champion.',
                fr: "Spécialisé dans les systèmes tech. Ancien responsable des opérations devenu champion des systèmes."
            }),
            avatar: '👨‍💻'
        },
        {
            id: 3,
            name: 'Priya Sharma',
            rating: 5.0,
            reviews: 203,
            specialization: t({ en: 'Sales & Service Systems', fr: 'Systèmes de vente et service' }),
            location: t({ en: 'Remote (IST)', fr: 'À distance (IST)' }),
            availability: t({ en: 'Available in 2 days', fr: 'Disponible dans 2 jours' }),
            pricing: '$50-70/hr',
            bio: t({
                en: 'Top-rated. Specializes in customer-facing processes and sales workflows.',
                fr: "Très bien notée. Spécialisée dans les processus client et les workflows de vente."
            }),
            avatar: '👩‍🎓'
        }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        maxWidth: '900px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '24px',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                                {t({ en: 'Find an hiroor', fr: 'Trouver un hiroor' })}
                            </h2>
                            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
                                {extractionPlan?.targetSystem || t({ en: 'System Extraction', fr: 'Extraction du système' })}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* hiroor List */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {hiroors.map((xp) => (
                                <div
                                    key={xp.id}
                                    style={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        backgroundColor: selectedHiroor?.id === xp.id ? '#f9f9f9' : '#fff'
                                    }}
                                    onClick={() => setSelectedHiroor(xp)}
                                >
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        {/* Avatar */}
                                        <div style={{
                                            fontSize: '48px',
                                            width: '64px',
                                            height: '64px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '50%'
                                        }}>
                                            {xp.avatar}
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                                                        {xp.name}
                                                    </h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                                                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{xp.rating}</span>
                                                            <span style={{ fontSize: '13px', color: '#666' }}>
                                                                ({xp.reviews} {t({ en: 'reviews', fr: 'avis' })})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: '#000' }}>
                                                    {xp.pricing}
                                                </div>
                                            </div>

                                            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
                                                {xp.bio}
                                            </p>

                                            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
                                                    <MapPin size={14} />
                                                    {xp.location}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666' }}>
                                                    <Calendar size={14} />
                                                    {xp.availability}
                                                </div>
                                                <div style={{
                                                    padding: '4px 8px',
                                                    backgroundColor: '#f0f0f0',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '500'
                                                }}>
                                                    {xp.specialization}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                                <button style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s'
                                                }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                                >
                                                    <MessageCircle size={16} />
                                                    {t({ en: 'Chat', fr: 'Discuter' })}
                                                </button>
                                                <button style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#000',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                                                >
                                                    {t({ en: 'Hire Now', fr: 'Engager maintenant' })}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default HiroorModal;
