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
    

    