import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          <Link to="/" style={styles.logoLink}>
            <h1 style={styles.logo}>Meat Market Dynamics</h1>
          </Link>
        </div>
        
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/meat-market" style={styles.navLink}>Meat Market</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
        </div>
        
        <div style={styles.authContainer}>
          <Link to="/admin" style={styles.loginButton}>Admin Login</Link>
        </div>
      </div>
    </nav>
  );
};

const styles = {
    navbar: {
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    },
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    logoContainer: {
      flex: 1,
    },
    logoLink: {
      textDecoration: 'none',
    },
    logo: {
      margin: 0,
      color: '#4f46e5',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #4f46e5 0%, #7b68ee 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    navLinks: {
      display: 'flex',
      justifyContent: 'center',
      flex: 2,
      gap: '2rem',
    },
    navLink: {
      color: '#334155',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '1rem',
      padding: '0.5rem 0',
      transition: 'all 0.3s ease',
      position: 'relative',
      ':hover': {
        color: '#4f46e5',
      },
      '::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '0%',
      height: '2px',
      backgroundColor: '#4f46e5',
      transition: 'width 0.3s ease',
    },
    ':hover::after': {
      width: '100%',
    }
  },
  authContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  loginButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    ':hover': {
      backgroundColor: 'transparent',
      color: '#4f46e5',
      border: '2px solid #4f46e5',
      transform: 'translateY(-2px)',
    }
  }
};

export default Navbar;
