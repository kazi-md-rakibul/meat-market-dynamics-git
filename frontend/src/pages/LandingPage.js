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

const styles = {
    '@keyframes float': {
      '0%': {
        transform: 'perspective(1000px) rotateY(-15deg) translateY(0px)',
      },
      '50%': {
        transform: 'perspective(1000px) rotateY(-10deg) translateY(-15px)',
      },
      '100%': {
        transform: 'perspective(1000px) rotateY(-15deg) translateY(0px)',
      },
    },
    '@keyframes fadeInUp': {
      '0%': {
        opacity: 0,
        transform: 'translateY(30px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
        opacity: 0.8,
      },
      '50%': {
        transform: 'scale(1.08)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 0.8,
      },
    },
    '@keyframes floatParticle': {
      '0%': {
        transform: 'translateY(0) translateX(0)',
        opacity: 0,
      },
      '50%': {
        opacity: 0.9,
      },
      '100%': {
        transform: 'translateY(-120px) translateX(20px)',
        opacity: 0,
      },
    },
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: 'hidden',
      maxWidth: '100vw',
    },
    main: {
      flex: 1,
      paddingTop: '80px', // Space for the fixed navbar
    },
    hero: {
      backgroundImage: 'linear-gradient(135deg, #0a0f1e 0%, #111827 100%)',
      padding: '6rem 2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      minHeight: '700px',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100%',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundImage: 'radial-gradient(circle at 20% 25%, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)',
        zIndex: 1,
      },
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 30% 50%, rgba(79, 70, 229, 0.15) 0%, rgba(0, 0, 0, 0) 70%), radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.1) 0%, rgba(0, 0, 0, 0) 60%)',
      zIndex: 1,
      backdropFilter: 'blur(80px)',
    },
    heroDots: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      opacity: 0.3,
      zIndex: 1,
    },
    heroParticle: {
      position: 'absolute',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(129, 140, 248, 0.4))',
      boxShadow: '0 0 10px 2px rgba(79, 70, 229, 0.3)',
      animation: 'floatParticle 6s ease-in-out infinite, pulse 3s ease-in-out infinite',
      zIndex: 1,
      opacity: 0.6,
    },
    heroImageContainer: {
      position: 'relative',
      zIndex: 2,
      width: '45%',
      maxWidth: '45%',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingRight: '3rem',
      '@media (max-width: 1024px)': {
        width: '40%',
        maxWidth: '40%',
      },
      '@media (max-width: 768px)': {
        display: 'none',
      },
    },
    heroImageInner: {
      width: '100%',
      height: '450px',
      backgroundImage: 'url(https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      animation: 'float 6s ease-in-out infinite',
      transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
      maxWidth: '90%',
      objectFit: 'contain',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(0, 0, 0, 0) 50%)',
        borderRadius: '24px',
        zIndex: 1,
      },
    },
    heroContent: {
      width: '45%',
      zIndex: 2,
      animation: 'fadeInUp 0.8s ease-out',
      paddingLeft: '2rem',
      '@media (max-width: 1024px)': {
        width: '50%',
      },
      '@media (max-width: 768px)': {
        width: '100%',
        textAlign: 'center',
        marginBottom: '3rem',
        paddingLeft: '0',
      },
    },
    heroTitle: {
      fontSize: '4.5rem',
      fontWeight: '800',
      marginBottom: '1.5rem',
      color: 'white',
      lineHeight: 1.1,
      animation: 'fadeInUp 0.8s ease-out',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      letterSpacing: '-0.02em',
      '@media (max-width: 768px)': {
        fontSize: '2.8rem',
      },
    },
    heroSubtitle: {
      fontSize: '1.4rem',
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: '2.8rem',
      lineHeight: 1.7,
      animation: 'fadeInUp 0.8s ease-out 0.2s both',
      maxWidth: '600px',
      fontWeight: '400',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
      '@media (max-width: 768px)': {
        margin: '0 auto 2.5rem auto',
        fontSize: '1.25rem',
      },
    },
    heroStatNumber: {
      fontSize: '2.8rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
      color: 'white',
      background: 'linear-gradient(to right, #fff, #cbd5e1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      letterSpacing: '-0.02em',
      lineHeight: '1.2',
    },
    heroStatLabel: {
      fontSize: '1rem',
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '500',
      letterSpacing: '0.02em',
      marginTop: '0.5rem',
    },
    brandHighlight: {
      color: '#4f46e5',
      background: 'linear-gradient(to right, #4f46e5, #818cf8, #a78bfa)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      position: 'relative',
      display: 'inline-block',
      padding: '0 0.2em',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        width: '100%',
        height: '2px',
        background: 'linear-gradient(to right, #4f46e5, #818cf8, rgba(129, 140, 248, 0))',
      },
    },
    ctaContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '3rem',
      animation: 'fadeInUp 0.8s ease-out 0.4s both',
      '@media (max-width: 768px)': {
        justifyContent: 'center',
        flexWrap: 'wrap',
      },
    },
    heroStats: {
      display: 'flex',
      gap: '2rem',
      animation: 'fadeInUp 0.8s ease-out 0.6s both',
      '@media (max-width: 768px)': {
        justifyContent: 'center',
        flexWrap: 'wrap',
      },
    },
    heroStatItem: {
      textAlign: 'center',
      flex: '1 1 250px',
      maxWidth: '300px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: 'translateY(0)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
      padding: '1.5rem 1rem',
      '&:hover': {
        transform: 'translateY(-10px) scale(1.03)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.08)',
      }
    },
    statNumber: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '1rem',
      background: 'linear-gradient(to right, #fff, #cbd5e1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    statDescription: {
      fontSize: '1.2rem',
      opacity: 0.9,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: '3.5rem',
      position: 'relative',
      display: 'inline-block',
      left: '50%',
      transform: 'translateX(-50%)',
      paddingBottom: '1rem',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '25%',
        width: '50%',
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #4f46e5, transparent)',
        borderRadius: '4px',
      }
    },
    features: {
      padding: '7rem 2rem',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box',
    },
    featureContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '2.5rem',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2,
      '@media (max-width: 992px)': {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    featureCard: {
      backgroundColor: '#ffffff',
      padding: '3.5rem',
      borderRadius: '24px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
      width: '100%',
      maxWidth: '100%',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      border: '1px solid #f1f5f9',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 25px 30px -12px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: '#4f46e5',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '8px',
        background: 'linear-gradient(90deg, #4f46e5, #6366f1)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.4s ease',
      },
      '&:hover::before': {
        transform: 'scaleX(1)',
      }
    },
    featureIcon: {
      fontSize: '3.5rem',
      marginBottom: '2rem',
      display: 'inline-block',
      position: 'relative',
      zIndex: 1,
      background: 'linear-gradient(135deg, #4f46e5, #818cf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '-20%',
        left: '-30%',
        width: '150%',
        height: '150%',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        zIndex: -1,
        borderRadius: '50%',
      }
    },