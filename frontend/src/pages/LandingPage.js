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
        
        <section style={styles.statsSection}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>85%</span>
            <p style={styles.statDescription}>Supply Chain Optimization</p>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>24/7</span>
            <p style={styles.statDescription}>Real-time Market Data</p>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>100+</span>
            <p style={styles.statDescription}>Industry Partners</p>
          </div>
        </section>

        {/* New Section for Bangladesh Data */}
        <section style={styles.bangladeshDataSection}>
          <h2 style={styles.sectionTitle}>Bangladesh Insights (2025 Projections)</h2>
          <div style={styles.dataCardContainer} className="data-card-container">
            {/* GDP Card */}
            <div style={styles.dataCard}>
              <h3 style={styles.dataCardTitle}>GDP & Consumption</h3>
              <div style={styles.cardContent}>
                <div style={styles.dataTextContent}>
                  <ul style={styles.dataList}>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Year:</strong> 2025</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Population:</strong> ~175 Million</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Meat & Fish Consumption:</strong> ~215 g/capita/day</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>GDP:</strong> ~$510 Billion</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Source:</strong> Projected from HIES/BBS Data</li>
                  </ul>
                </div>
                <div style={styles.chartContainer}>
                  <Bar 
                    data={{
                      labels: ['2021', '2022', '2023', '2024', '2025'],
                      datasets: [
                        {
                          label: 'GDP (Billion USD)',
                          data: [415, 460, 480, 495, 510],
                          backgroundColor: 'rgba(79, 70, 229, 0.6)',
                          borderColor: 'rgba(79, 70, 229, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Bangladesh GDP Projection',
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Nutrition Value Card */}
            <div style={styles.dataCard}>
              <h3 style={styles.dataCardTitle}>Average Nutrition</h3>
              <div style={styles.cardContent}>
                <div style={styles.dataTextContent}>
                  <ul style={styles.dataList}>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Daily Protein Intake:</strong> ~72 g/capita</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Gender:</strong> All</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Age Group:</strong> All Ages</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Primary Sources:</strong> Rice, Fish, Meat, Pulses</li>
                    <li style={styles.dataListItem}><strong style={styles.dataListStrong}>Source:</strong> Projected from HIES/BBS Data</li>
                  </ul>
                </div>
                <div style={styles.chartContainer}>
                  <Pie
                    data={{
                      labels: ['Rice', 'Fish', 'Meat', 'Pulses', 'Others'],
                      datasets: [
                        {
                          data: [32, 27, 22, 13, 6],
                          backgroundColor: [
                            'rgba(79, 70, 229, 0.8)',
                            'rgba(129, 140, 248, 0.8)',
                            'rgba(165, 180, 252, 0.8)',
                            'rgba(196, 181, 253, 0.8)',
                            'rgba(224, 231, 255, 0.8)'
                          ],
                          borderColor: [
                            'rgba(79, 70, 229, 1)',
                            'rgba(129, 140, 248, 1)',
                            'rgba(165, 180, 252, 1)',
                            'rgba(196, 181, 253, 1)',
                            'rgba(224, 231, 255, 1)'
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Protein Sources (%)',
                          font: {
                            size: 14,
                            weight: 'bold'
                          }
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>