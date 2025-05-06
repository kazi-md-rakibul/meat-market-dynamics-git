import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import DemandDashboardComponent from '../components/DemandDashboard';

const DemandDashboard = () => {

  // Fetch all data on component mount
  useEffect(() => {
    // fetchConsumptionPatterns();
    // fetchPriceElasticity();
  }, []);

  return (
    <Layout>
      <DemandDashboardComponent />
    </Layout>
  );
};

export default DemandDashboard;