import React, { useState, useEffect } from 'react';
import { Languages, MessageCircle, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const isApplyPage = location.pathname === '/application';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
      padding: '0.75rem 0',
      backgroundColor: 'var(--color-bg-translucent)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      transition: 'var(--transition-smooth)',
      borderBottom: scrolled ? 'var(--border-notion)' : '1px solid transparent'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '1.2rem',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-main)',
            letterSpacing: '-0.02em'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="/images/Avatar Photos/Logo Avatar.jpg"
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            hiro
          </Link>

          {/* Optional Desktop Nav links could go here like Notion */}
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/signup"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: 'var(--color-text-main)',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hover-overlay)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {t({ en: "Log in", fr: "Connexion" })}
          </Link>

          <Link
            to="/signup"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              backgroundColor: 'var(--color-notion-blue)',
              color: 'var(--color-bg-base)',
              borderRadius: '4px',
              textDecoration: 'none',
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {t({ en: "Get hiro free", fr: "Obtenir hiro gratuitement" })}
          </Link>

          <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--color-border-default)', margin: '0 4px' }} />

          <button
            onClick={toggleLanguage}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.4rem',
              cursor: 'pointer',
              color: 'var(--color-grey-500)',
              borderRadius: '4px',
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hover-overlay)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Languages size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
};



export default Header;
