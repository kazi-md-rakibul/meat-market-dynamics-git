import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeItem, setActiveItem] = useState(0); // Track active nav item
    const location = useLocation();
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
        if (window.innerWidth > 768) {
          setSidebarOpen(true);
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
      };
      const handleLogout = () => {
        // Clear admin token from localStorage
        localStorage.removeItem('adminToken');
        // Redirect to landing page
        navigate('/');
      };
    
      return (
        <div style={styles.container}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div style={{
              ...styles.sidebar,
              width: sidebarOpen ? '240px' : '72px',
              boxShadow: '2px 0 10px rgba(0,0,0,0.08)',
            }}>
              <div style={styles.sidebarHeader}>
                {sidebarOpen && <h2 style={styles.logo}>Dashboard</h2>}
                <button
                  onClick={toggleSidebar}
                  style={styles.toggleButton}
                  aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                  {sidebarOpen ? (
                    <span style={styles.toggleIcon}>‹</span>
                  ) : (
                    <span style={styles.toggleIcon}>›</span>
                  )}
                </button>
              </div>
              <nav style={styles.nav}>
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.link;
    
                  return (
                    <a
                      key={index}
                      href={item.link}
                      style={{
                        ...styles.navLink,
                        ...(isActive && styles.activeNavLink),
                        justifyContent: sidebarOpen ? 'flex-start' : 'center',
                      }}
                    >
                      {sidebarOpen ? (
                        <span style={{
                          ...styles.navText,
                          ...(isActive && styles.activeNavText),
                        }}>
                          {item.text}
                        </span>
                      ) : (
                        <span style={styles.collapsedText}>
                          {item.text.charAt(0)}
                        </span>
                      )}
                    </a>
                  );
                })}


</nav>
          {sidebarOpen && (
            <div style={styles.sidebarFooter}>
              <div style={styles.sidebarFooterContent}>
                <p style={styles.footerText}>v1.0.0</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        ...styles.mainContentWrapper,
        marginLeft: !isMobile ? (sidebarOpen ? '240px' : '72px') : '0',
      }}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                style={styles.menuButton}
                aria-label="Toggle menu"
              >
                <span style={styles.menuIcon}>☰</span>
              </button>
            )}
            <div style={styles.headerLeft}>
              <h2 style={styles.pageTitle}>Meat Market Dynamics</h2>
            </div>
            <div style={styles.headerRight}>
              <div style={styles.userProfile}>
                <div style={styles.userAvatar}>KD</div>
                {!isMobile && (
                  <div style={styles.userInfo}>
                    <span style={styles.userName}>Kasem Dawood</span>
                    <span style={styles.userRole}>Administrator</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  style={styles.logoutButton}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={styles.content}>
          <div style={styles.contentInner}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div style={styles.mobileOverlay} onClick={() => setSidebarOpen(false)}>
          <div
            style={styles.mobileSidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.sidebarHeader}>
              <h2 style={styles.logo}>Dashboard</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                style={styles.closeButton}
                aria-label="Close menu"
              >
                <span style={styles.closeIcon}>×</span>
              </button>
            </div>
            <nav style={styles.nav}>
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  style={{
                    ...styles.navLink,
                    ...(activeItem === index && styles.activeNavLink),
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(index);
                    setSidebarOpen(false);
                    navigate(item.link);
                  }}
                >
                  <span style={{
                    ...styles.navText,
                    ...(activeItem === index && styles.activeNavText),
                  }}>
                    {item.text}
                  </span>
                </a>
              ))}
            </nav>
            <div style={styles.sidebarFooter}>
              <div style={styles.sidebarFooterContent}>
                <p style={styles.footerText}>v1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Professional Color Scheme
const colors = {
    primary: '#4f46e5',       // Indigo-600
    primaryDark: '#4338ca',   // Indigo-700
    primaryLight: '#6366f1',  // Indigo-500
    background: '#f8fafc',    // Slate-50
    sidebarBg: '#ffffff',     // White
    sidebarHover: '#f1f5f9',  // Slate-100
    activeItem: '#e0e7ff',    // Indigo-100
    headerBg: '#ffffff',      // White
    headerBorder: '#e2e8f0',  // Gray-200
    textPrimary: '#0f172a',   // Slate-900
    textSecondary: '#64748b', // Slate-500
    white: '#ffffff',
    sidebarText: '#334155',   // Slate-700
    sidebarActiveText: '#1e40af', // Indigo-800
    border: '#e2e8f0',        // Gray-200
  };

  // Enhanced Professional Styles
const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: colors.background,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflowX: 'hidden',
    },
    sidebar: {
      position: 'fixed',
      height: '100vh',
      backgroundColor: colors.sidebarBg,
      color: colors.sidebarText,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      overflow: 'hidden',
      borderRight: `1px solid ${colors.border}`,
    },
    mobileSidebar: {
      width: '280px',
      height: '100vh',
      backgroundColor: colors.sidebarBg,
      color: colors.sidebarText,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${colors.border}`,
    },
    mobileOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      backdropFilter: 'blur(4px)',
    },
    sidebarHeader: {
      padding: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.border}`,
      minHeight: '64px',
    },
    logo: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
      color: colors.textPrimary,
      letterSpacing: '0.5px',
    },
    toggleButton: {
      background: 'transparent',
      border: 'none',
      color: colors.textSecondary,
      cursor: 'pointer',
      fontSize: '1.25rem',
      padding: '0.25rem',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      ':hover': {
        backgroundColor: colors.sidebarHover,
      },
    },
    toggleIcon: {
      display: 'inline-block',
      transition: 'transform 0.2s ease',
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      color: colors.textSecondary,
      cursor: 'pointer',
      fontSize: '1.5rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: colors.sidebarHover,
      },
    },
    closeIcon: {
      display: 'inline-block',
      lineHeight: 1,
    },
    nav: {
      flex: 1,
      padding: '1rem 0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      color: colors.sidebarText,
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      margin: '0.125rem 0.5rem',
      borderRadius: '6px',
      fontSize: '0.9375rem',
      fontWeight: 500,
      ':hover': {
        backgroundColor: colors.sidebarHover,
        color: colors.textPrimary,
      },
    },
    activeNavLink: {
      backgroundColor: colors.activeItem,
      color: colors.sidebarActiveText,
      fontWeight: 600,
    },
    navText: {
      transition: 'opacity 0.2s ease',
    },
    activeNavText: {
      fontWeight: 600,
    },
    collapsedText: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    sidebarFooter: {
      padding: '1rem 1.5rem',
      borderTop: `1px solid ${colors.border}`,
    },
    sidebarFooterContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    },
    footerText: {
      margin: 0,
      fontSize: '0.75rem',
      color: colors.textSecondary,
    },
    mainContentWrapper: {
      flex: 1,
      transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      width: '100%',
      backgroundColor: colors.headerBg,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      borderBottom: `1px solid ${colors.headerBorder}`,
      position: 'sticky',
      top: 0,
      zIndex: 90,
    },
    headerContent: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: '0 1.5rem',
      height: '4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    menuButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: colors.textPrimary,
      padding: '0.5rem',
      marginRight: '1rem',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.05)',
      },
    },
    menuIcon: {
      display: 'inline-block',
      lineHeight: 1,
    },
    pageTitle: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
    },
    userProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      padding: '0.25rem 0.5rem',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: 'rgba(0,0,0,0.05)',
      },
    },
    userAvatar: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '50%',
      backgroundColor: colors.primary,
      color: colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      fontSize: '0.875rem',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
    },
    userRole: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
    },
    logoutButton: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      borderRadius: '5px',
      padding: '0.5rem 1rem',
      marginLeft: '1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: colors.primaryDark,
      }
    },
    content: {
      flex: 1,
      padding: '1.5rem',
      backgroundColor: colors.background,
    },
    contentInner: {
      maxWidth: '100%',
      margin: '0 auto',
      backgroundColor: colors.white,
      borderRadius: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      padding: '1.5rem',
      minHeight: 'calc(100% - 3rem)',
      border: `1px solid ${colors.border}`,
    },
  };
  
  const navItems = [
    {
      link: "/home/dashboard",
      text: 'Dashboard',
    },
    {
      link: "/processing-units/dashboard",
      text: 'Processing Plants',
      backendPath: '/processing-unit'
    },
    {
      link: "/products/dashboard",
      text: 'Product Catalog',
      backendPath: '/products'
    },
    {
      link: "/production/dashboard",
      text: 'Production batches',
      backendPath: '/production'
    },
    {
      link: "/demand/dashboard",
      text: 'Consumer Demand',
      backendPath: '/demand'
    },
    {
      link: "/supply/dashboard",
      text: 'Supply & Warehouse',
      backendPath: '/supply'
    },
    {
      link: "/market-analysis/dashboard",
      text: 'Price Analytics',
      backendPath: '/market'
    },
    {
      link: "/analytics/dashboard",
      text: 'Reports & Trends',
      backendPath: '/analytics'
    },
    {
      link: "/directories/dashboard",
      text: 'Vendor Directory',
      backendPath: '/directory'
    },
    {
      link: "/contact/dashboard",
      text: 'Support & Help',
    }
  ];
  
  export default Layout;
    

    