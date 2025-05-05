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
        
        <section style={styles.features}>
          <h2 style={styles.sectionTitle}>Our Services</h2>
          <div style={styles.featureContainer} className="feature-container">
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Market Analytics</h3>
              <p style={styles.featureDescription}>
                Comprehensive insights into meat market trends, pricing strategies, and consumer behaviors to make data-driven decisions.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🥩</div>
              <h3 style={styles.featureTitle}>Quality Management</h3>
              <p style={styles.featureDescription}>
                Advanced tracking systems for premium meat products, ensuring quality control throughout the supply chain.
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔄</div>
              <h3 style={styles.featureTitle}>Supply Chain Optimization</h3>
              <p style={styles.featureDescription}>
                End-to-end supply chain management solutions to streamline operations, reduce waste, and maximize efficiency.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.testimonials}>
          <h2 style={styles.sectionTitle}>What Our Users Say</h2>
          <div style={styles.testimonialContainer}>
            <div style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "Meat Market Dynamics has revolutionized how we manage our meat production and distribution processes."
              </p>
              <div style={styles.testimonialAuthor}>
                <strong>John Carter</strong> - Farm Manager
              </div>
            </div>
            <div style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "The analytics capabilities have given us unprecedented insights into consumer trends and market opportunities."
              </p>
              <div style={styles.testimonialAuthor}>
                <strong>Sarah Miller</strong> - Supply Chain Director
              </div>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Ready to Transform Your Meat Business?</h2>
          <p style={styles.ctaDescription}>
            Join the platform that's helping meat industry leaders make smarter decisions.
          </p>
          <Link to="/admin" style={styles.ctaButton}>
            Get Started Now
          </Link>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerBrand}>
            <h3 style={styles.footerLogo}>Meat Market Dynamics</h3>
            <p style={styles.footerTagline}>Revolutionizing the meat industry</p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerLinkColumn}>
              <h4 style={styles.footerLinkTitle}>Platform</h4>
              <Link to="/meat-market" style={styles.footerLink}>Meat Market</Link>
              <Link to="/about" style={styles.footerLink}>About</Link>
              <Link to="/admin" style={styles.footerLink}>Admin</Link>
            </div>
            <div style={styles.footerLinkColumn}>
              <h4 style={styles.footerLinkTitle}>Resources</h4>
              <a href="/docs" style={styles.footerLink}>Documentation</a>
              <a href="/api" style={styles.footerLink}>API</a>
              <a href="/faq" style={styles.footerLink}>FAQ</a>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Meat Market Dynamics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};