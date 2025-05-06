import React from 'react';
import Navbar from '../components/Navbar';

const MeatMarketPage = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        <section style={styles.marketSection}>
          <h1 style={styles.title}>Meat Market</h1>
          
          <div style={styles.marketOverview}>
            <p style={styles.description}>
              Welcome to the Meat Market Dynamics platform - your comprehensive resource for 
              meat market analytics, trends, and insights. Our platform provides real-time 
              data on meat prices, supply and demand dynamics, and market forecasts to help you 
              make informed business decisions.
            </p>
          </div>
          
          <div style={styles.marketCategories}>
            <div style={styles.categoryCard}>
              <div style={styles.categoryIcon}>🐄</div>
              <h3 style={styles.categoryTitle}>Beef</h3>
              <p style={styles.categoryDescription}>
                Premium beef products from trusted farms and suppliers
              </p>
              <div style={styles.marketMetrics}>
                <div style={styles.metric}>
                  <span style={styles.metricLabel}>Avg. Price:</span>
                  <span style={styles.metricValue}>$5.99/lb</span>
                </div>
                <div style={styles.metric}>
                  <span style={styles.metricLabel}>Trend:</span>
                  <span style={styles.metricTrendUp}>↗ 2.3%</span>
                </div>
              </div>
            </div>
            
            <div style={styles.categoryCard}>
              <div style={styles.categoryIcon}>🐖</div>
              <h3 style={styles.categoryTitle}>Pork</h3>
              <p style={styles.categoryDescription}>
                High-quality pork cuts from selected producers
              </p>
              <div style={styles.marketMetrics}>
                <div style={styles.metric}>
                  <span style={styles.metricLabel}>Avg. Price:</span>
                  <span style={styles.metricValue}>$4.50/lb</span>
                </div>
                <div style={styles.metric}>
                  <span style={styles.metricLabel}>Trend:</span>
                  <span style={styles.metricTrendDown}>↘ 1.5%</span>
                </div>
              </div>
            </div>
            
            <div style={styles.categoryCard}>
              <div style={styles.categoryIcon}>🐔</div>
              <h3 style={styles.categoryTitle}>Poultry</h3>
              <p style={styles.categoryDescription}>
                Fresh poultry from organic and free-range farms
              </p>
              <div style={styles.marketMetrics}>
                <div style={styles.metric}>
                  <span style={styles.metricLabel}>Avg. Price:</span>
                  <span style={styles.metricValue}>$3.29/lb</span>
                </div>
                <div style={styles.metric}>
                  <span style={styles.metricLabel}>Trend:</span>
                  <span style={styles.metricTrendStable}>→ 0.2%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.marketInsights}>
            <h2 style={styles.insightsTitle}>Market Insights</h2>
            <div style={styles.insightCards}>
              <div style={styles.insightCard}>
                <h4 style={styles.insightCardTitle}>Supply Chain Updates</h4>
                <p style={styles.insightCardContent}>
                  Recent improvements in logistics have reduced delivery times by 15%, 
                  resulting in fresher products and lower costs.
                </p>
              </div>
              
              <div style={styles.insightCard}>
                <h4 style={styles.insightCardTitle}>Consumer Trends</h4>
                <p style={styles.insightCardContent}>
                  Demand for organic and grass-fed meat products has increased by 22% 
                  in the last quarter, reflecting changing consumer preferences.
                </p>
              </div>
              
              <div style={styles.insightCard}>
                <h4 style={styles.insightCardTitle}>Price Forecast</h4>
                <p style={styles.insightCardContent}>
                  Analysts predict stable prices for the next month with potential 
                  increases in beef prices due to seasonal demand.
                </p>
              </div>
            </div>
          </div>
          
          <div style={styles.marketActions}>
            <h2 style={styles.actionsTitle}>Tools & Resources</h2>
            <div style={styles.actionsContainer}>
              <div style={styles.actionCard}>
                <div style={styles.actionIcon}>📊</div>
                <h3 style={styles.actionTitle}>Analytics Dashboard</h3>
                <p style={styles.actionDescription}>
                  Access detailed market analytics and visualizations
                </p>
                <button style={styles.actionButton}>View Dashboard</button>
              </div>
              
              <div style={styles.actionCard}>
                <div style={styles.actionIcon}>📈</div>
                <h3 style={styles.actionTitle}>Price Reports</h3>
                <p style={styles.actionDescription}>
                  Download comprehensive price reports and forecasts
                </p>
                <button style={styles.actionButton}>Get Reports</button>
              </div>
              
              <div style={styles.actionCard}>
                <div style={styles.actionIcon}>📱</div>
                <h3 style={styles.actionTitle}>Mobile Alerts</h3>
                <p style={styles.actionDescription}>
                  Set up notifications for price changes and market events
                </p>
                <button style={styles.actionButton}>Configure Alerts</button>
              </div>
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
    marketSection: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      fontSize: '2.5rem',
      color: '#0f172a',
      marginBottom: '2rem',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    marketOverview: {
      backgroundColor: '#f8fafc',
      padding: '2rem',
      borderRadius: '15px',
      marginBottom: '3rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      borderLeft: '4px solid #4f46e5',
    },
    description: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#334155',
    },
    marketCategories: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    categoryCard: {
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: '1px solid #e2e8f0',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      }
    },
    categoryIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    categoryTitle: {
      fontSize: '1.5rem',
      color: '#0f172a',
      marginBottom: '0.75rem',
      fontWeight: '600',
    },
    categoryDescription: {
      color: '#64748b',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
    },
    marketMetrics: {
      backgroundColor: '#f8fafc',
      padding: '1rem',
      borderRadius: '8px',
    },
    metric: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    metricLabel: {
      color: '#64748b',
      fontWeight: '500',
    },
    metricValue: {
      color: '#0f172a',
      fontWeight: '600',
    },
    metricTrendUp: {
      color: '#10b981',
      fontWeight: '600',
    },
    metricTrendDown: {
      color: '#ef4444',
      fontWeight: '600',
    },
    metricTrendStable: {
      color: '#f59e0b',
      fontWeight: '600',
    },
    marketInsights: {
      marginBottom: '3rem',
    },
    insightsTitle: {
      fontSize: '1.8rem',
      color: '#0f172a',
      marginBottom: '1.5rem',
      fontWeight: '600',
      borderBottom: '2px solid #4f46e5',
      paddingBottom: '0.5rem',
      display: 'inline-block',
    },
    insightCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    insightCard: {
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
    },
    insightCardTitle: {
      fontSize: '1.25rem',
      color: '#0f172a',
      marginBottom: '0.75rem',
      fontWeight: '600',
    },
    insightCardContent: {
      color: '#475569',
      lineHeight: '1.6',
    },
    marketActions: {
      marginBottom: '3rem',
    },
    actionsTitle: {
      fontSize: '1.8rem',
      color: '#0f172a',
      marginBottom: '1.5rem',
      fontWeight: '600',
      borderBottom: '2px solid #4f46e5',
      paddingBottom: '0.5rem',
      display: 'inline-block',
    },
    actionsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '2rem',
    },
    actionCard: {
      backgroundColor: '#f8fafc',
      padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      textAlign: 'center',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'translateY(-5px)',
      },
    },
    actionIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    actionTitle: {
      fontSize: '1.3rem',
      color: '#0f172a',
      marginBottom: '0.75rem',
      fontWeight: '600',
    },
    actionDescription: {
      color: '#475569',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
    },
    actionButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#4338ca',
      }
    },
    footer: {
      backgroundColor: '#0f172a',
      color: 'white',
      padding: '1.5rem',
      textAlign: 'center',
    }
  };
  
  export default MeatMarketPage;