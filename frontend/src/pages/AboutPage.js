import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <section style={styles.aboutSection}>
          <h1 style={styles.title}>About Meat Market Dynamics</h1>
          
          <div style={styles.content}>
            <p style={styles.paragraph}>
              Meat Market Dynamics is a leading provider of meat market analytics and management solutions. 
              Founded with a vision to revolutionize the meat industry through data-driven insights 
              and efficient supply chain management, we have grown to become a trusted partner for 
              businesses across the meat production and distribution ecosystem.
            </p>
            
            <div style={styles.imageContainer}>
              <div style={styles.aboutImage}></div>
            </div>
            
            <p style={styles.paragraph}>
              Our comprehensive platform offers real-time market analytics, supply chain optimization, 
              and quality management tools that help our clients make informed decisions and stay 
              competitive in a dynamic market environment.
            </p>
            
            <div style={styles.valuesContainer}>
              <h2 style={styles.subtitle}>Our Values</h2>
              
              <div style={styles.valuesList}>
                <div style={styles.valueItem}>
                  <div style={styles.valueIcon}>✓</div>
                  <h3 style={styles.valueTitle}>Quality</h3>
                  <p style={styles.valueDescription}>
                    We are committed to maintaining the highest standards of quality in all our products and services.
                  </p>
                </div>
                
                <div style={styles.valueItem}>
                  <div style={styles.valueIcon}>✓</div>
                  <h3 style={styles.valueTitle}>Innovation</h3>
                  <p style={styles.valueDescription}>
                    We continuously innovate to provide cutting-edge solutions that address the evolving needs of the meat industry.
                  </p>
                </div>
                
                <div style={styles.valueItem}>
                  <div style={styles.valueIcon}>✓</div>
                  <h3 style={styles.valueTitle}>Integrity</h3>
                  <p style={styles.valueDescription}>
                    We conduct our business with the highest level of integrity and transparency.
                  </p>
                </div>
                
                <div style={styles.valueItem}>
                  <div style={styles.valueIcon}>✓</div>
                  <h3 style={styles.valueTitle}>Sustainability</h3>
                  <p style={styles.valueDescription}>
                    We are dedicated to promoting sustainable practices throughout the meat supply chain.
                  </p>
                </div>
              </div>
            </div>
            
            <div style={styles.teamSection}>
              <h2 style={styles.subtitle}>Our Team</h2>
              <p style={styles.paragraph}>
                Our team of experts brings together decades of experience in the meat industry, data analytics, 
                and supply chain management. We are passionate about helping our clients succeed and driving 
                innovation in the meat market.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} Meat Market Dynamics. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  main: {
    flex: 1,
    paddingTop: '80px', // Space for the fixed navbar
  },
  aboutSection: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.5rem',
    color: '#0f172a',
    marginBottom: '2rem',
    textAlign: 'center',
    position: 'relative',
    padding: '0.5rem 0',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  paragraph: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#334155',
    marginBottom: '1.5rem',
  },
  imageContainer: {
    margin: '2rem 0',
    display: 'flex',
    justifyContent: 'center',
  },
  aboutImage: {
    width: '100%',
    maxWidth: '800px',
    height: '300px',
    backgroundImage: 'url("https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '10px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  subtitle: {
    fontSize: '1.8rem',
    color: '#0f172a',
    marginBottom: '1.5rem',
    marginTop: '2rem',
    borderBottom: '2px solid #4f46e5',
    paddingBottom: '0.5rem',
    display: 'inline-block',
  },
  valuesContainer: {
    marginTop: '3rem',
  },
  valuesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  valueItem: {
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    }
  },
  valueIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#4f46e5',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '1.2rem',
  },
  valueTitle: {
    fontSize: '1.3rem',
    color: '#0f172a',
    marginBottom: '0.75rem',
  },
  valueDescription: {
    fontSize: '1rem',
    color: '#475569',
    lineHeight: '1.6',
  },
  teamSection: {
    marginTop: '3rem',
  },
  footer: {
    backgroundColor: '#0f172a',
    color: 'white',
    padding: '1.5rem',
    textAlign: 'center',
  }
};

export default AboutPage;
