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