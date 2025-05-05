import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Add custom CSS to fix grid layout issues
const addCustomCSS = () => {
  const style = document.createElement('style');
  style.textContent = `
    .data-card-container {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    @media (max-width: 992px) {
      .data-card-container {
        grid-template-columns: 1fr;
      }
    }
    
    .feature-container {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 2.5rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    @media (max-width: 992px) {
      .feature-container {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 768px) {
      .feature-container {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
};


const LandingPage = () => {
  useEffect(() => {
    addCustomCSS();
  }, []);

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroOverlay}></div>
          <div style={styles.heroDots}></div>
          {/* Floating particles for enhanced visual effect */}
          <div style={{...styles.heroParticle, top: '20%', left: '10%', animationDelay: '0s'}}></div>
          <div style={{...styles.heroParticle, top: '15%', left: '25%', animationDelay: '0.8s'}}></div>
          <div style={{...styles.heroParticle, top: '70%', left: '15%', animationDelay: '1.2s'}}></div>
          <div style={{...styles.heroParticle, top: '40%', left: '80%', animationDelay: '0.5s'}}></div>
          <div style={{...styles.heroParticle, top: '60%', left: '75%', animationDelay: '1.5s'}}></div>
          <div style={{...styles.heroParticle, top: '30%', left: '60%', animationDelay: '0.3s'}}></div>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Welcome to <span style={styles.brandHighlight}>Meat Market Dynamics</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Your comprehensive platform for meat market analytics, supply chain management, and industry insights
            </p>
            <div style={styles.ctaContainer}>
              <Link to="/meat-market" style={styles.primaryButton}>
                <span style={styles.buttonIcon}>🔍</span> Explore Meat Market
              </Link>
              <Link to="/about" style={styles.secondaryButton}>
                <span style={styles.buttonIcon}>ℹ️</span> Learn More
              </Link>
            </div>
            <div style={styles.heroStats}>
              <div style={styles.heroStatItem}>
                <span style={styles.heroStatNumber}>170M+</span>
                <span style={styles.heroStatLabel}>Population Served</span>
              </div>
              <div style={styles.heroStatItem}>
                <span style={styles.heroStatNumber}>200g+</span>
                <span style={styles.heroStatLabel}>Daily Meat Consumption</span>
              </div>
              <div style={styles.heroStatItem}>
                <span style={styles.heroStatNumber}>68g</span>
                <span style={styles.heroStatLabel}>Protein Intake</span>
              </div>
            </div>
          </div>
          <div style={styles.heroImageContainer}>
            <div style={styles.heroImageInner}></div>
          </div>
        </section>