import React, { useState, useEffect } from 'react';
import { Languages, MessageCircle, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLanguage } = useLanguage();
  const location = useLocation();
  const isApplyPage = location.pathname === '/apply';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '1.25rem 0',
      backgroundColor: scrolled || isApplyPage ? 'rgba(249, 249, 245, 0.95)' : 'transparent',
      backdropFilter: scrolled || isApplyPage ? 'blur(10px)' : 'none',
      zIndex: 1000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderBottom: scrolled || isApplyPage ? '1px solid rgba(0,0,0,0.05)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: '1.5rem',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.03em',
          color: 'var(--color-dark)'
        }}>
          xProject
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Sign-in Button */}
          <Link
            to="/signup"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: '1px solid rgba(0,0,0,0.1)',
              padding: '0.5rem 0.75rem',
              borderRadius: '99px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease',
              backgroundColor: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              color: 'var(--color-dark)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <LogIn size={16} />
            <span>Sign-in</span>
          </Link>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/212702814355"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: '1px solid rgba(0,0,0,0.1)',
              padding: '0.5rem 0.75rem',
              borderRadius: '99px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease',
              backgroundColor: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              color: 'var(--color-dark)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#25D366';
              e.currentTarget.style.borderColor = '#25D366';
              e.currentTarget.style.color = '#FFF';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
              e.currentTarget.style.color = 'var(--color-dark)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </a>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title={lang === 'en' ? "Passer au Français" : "Switch to English"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: '1px solid rgba(0,0,0,0.1)',
              padding: '0.5rem 0.75rem',
              borderRadius: '99px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s ease',
              backgroundColor: 'rgba(255,255,255,0.5)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Languages size={16} />
            <span>{lang === 'en' ? 'FR' : 'EN'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};



export default Header;
