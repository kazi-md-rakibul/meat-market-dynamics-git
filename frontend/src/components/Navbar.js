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