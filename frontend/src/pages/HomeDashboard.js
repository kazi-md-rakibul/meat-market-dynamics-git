import React, { useState, useEffect, Component } from 'react';
import Layout from '../components/Layout';
import CattleManagement from '../components/CattleManagement';
import DeliveryManagement from '../components/DeliveryManagement';
import OrderManagement from '../components/OrderManagement';
import FarmManagement from '../components/FarmManagement';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
// Error Boundary component to prevent the entire dashboard from crashing
class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error('Component Error:', error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return this.props.fallback || <div>Something went wrong.</div>;
      }
  
      return this.props.children;
    }
  }
  
  const StatCard = ({ title, value, icon, color }) => (
    <Card 
      sx={{ 
        height: '100%', 
        borderRadius: '16px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.03)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        background: 'white',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.08), 0 10px 10px rgba(0, 0, 0, 0.05)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '5px',
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3 
        }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: '#333',
              fontSize: '1.1rem'
            }}
          >
            {title}
          </Typography>
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              width: '52px',
              height: '52px',
              background: `linear-gradient(135deg, ${color}22, ${color}44)`,
            }}
          >
            {React.createElement(icon, { 
              sx: { 
                color: color, 
                fontSize: 28,
                filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))'
              } 
            })}
          </Box>
        </Box>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            mt: 1
          }}
          >
          {value}
          <Box 
            component="span" 
            sx={{ 
              fontSize: '0.9rem', 
              fontWeight: 500, 
              color: '#666', 
              ml: 1, 
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: color,
                mr: 0.5
              }}
            />
          </Box>
        </Typography>
      </CardContent>
    </Card>
  );
  
  const HomeDashboard = () => {
    const [stats, setStats] = useState({
      totalCattle: 0,
      totalProducts: 0,
      activeDeliveries: 0,
      processingUnits: 0,
    });
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetchStats();
    }, []);
  
    const fetchStats = async () => {
      try {
        // Use individual try/catch blocks for each API call to prevent one failure from breaking everything
        let cattleCount = 0;
        let productsCount = 0;
        let activeDeliveriesCount = 0;
        let processingUnitsCount = 0;
        
        try {
          const cattleRes = await axios.get('http://localhost:5000/api/cattle');
          if (cattleRes.data && Array.isArray(cattleRes.data)) {
            cattleCount = cattleRes.data.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
          }
        } catch (err) {
          console.error('Error fetching cattle:', err);
        }
        
        try {
          const productsRes = await axios.get('http://localhost:5000/api/products');
          if (productsRes.data && Array.isArray(productsRes.data)) {
            productsCount = productsRes.data.length;
          }
        } catch (err) {
          console.error('Error fetching products:', err);
        }
        
        try {
          const deliveriesRes = await axios.get('http://localhost:5000/api/deliveries');
          if (deliveriesRes.data && Array.isArray(deliveriesRes.data)) {
            activeDeliveriesCount = deliveriesRes.data.filter(d => d.delivery_Status === 'transit').length;
          }
        } catch (err) {
          console.error('Error fetching deliveries:', err);
        }
        
        try {
          const unitsRes = await axios.get('http://localhost:5000/api/processing-unit');
          if (unitsRes.data && Array.isArray(unitsRes.data)) {
            processingUnitsCount = unitsRes.data.length;
          }
        } catch (err) {
          console.error('Error fetching processing units:', err);
        }
  
        setStats({
          totalCattle: cattleCount,
          totalProducts: productsCount,
          activeDeliveries: activeDeliveriesCount,
          processingUnits: processingUnitsCount
        });
      } catch (error) {
        console.error('Error in fetchStats:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) {
      return (
        <Layout>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 'calc(100vh - 64px)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)'
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4} 
              sx={{ 
                color: '#4f46e5',
                boxShadow: '0 0 15px rgba(79, 70, 229, 0.1)'
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                mt: 3, 
                fontWeight: 600, 
                color: '#333',
                letterSpacing: '0.5px'
              }}
            >
              Loading Dashboard...
            </Typography>
          </Box>
        </Layout>
      );
    }
    return (
        <Layout>
          <Box 
            sx={{ 
              p: 4,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                mb: 5 
              }}
            >
              <Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a1a1a',
                    position: 'relative',
                    display: 'inline-block',
                    mb: 1
                  }}
                >
                  Meat Market Dashboard
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      bottom: '-8px',
                      left: '0',
                      width: '40%',
                      height: '4px',
                      background: 'linear-gradient(90deg, #4f46e5, rgba(79, 70, 229, 0.2))',
                      borderRadius: '4px'
                    }}
                  />
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#666',
                    fontWeight: 400,
                    mt: 1
                  }}
                >
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
              </Box>
            </Box>
    
            <Grid container spacing={3} sx={{ mb: 5 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Cattle"
                  value={stats.totalCattle}
                  icon={PetsIcon}
                  color="#4f46e5"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon={InventoryIcon}
                  color="#10b981"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Active Deliveries"
                  value={stats.activeDeliveries}
                  icon={LocalShippingIcon}
                  color="#f59e0b"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Processing Units"
                  value={stats.processingUnits}
                  icon={StoreIcon}
                  color="#ef4444"
                />
              </Grid>
            </Grid>
                    {/* Management components are wrapped in error boundaries to prevent crashes */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {/* Farm Management */}
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Box sx={{ 
                width: '4px', 
                height: '24px', 
                borderRadius: '4px', 
                bgcolor: '#4f46e5', 
                mr: 2 
              }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1a1a1a'
                }}
              >
                Farm Management
              </Typography>
            </Box>
            <ErrorBoundary fallback={
              <Card sx={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center' 
              }}>
                <CardContent>
                  <Typography sx={{ color: '#666' }}>Farm Management unavailable</Typography>
                </CardContent>
              </Card>
            }>
              <FarmManagement />
            </ErrorBoundary>
          </Box>
          
          {/* Cattle Management */}
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Box sx={{ 
                width: '4px', 
                height: '24px', 
                borderRadius: '4px', 
                bgcolor: '#10b981', 
                mr: 2 
              }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1a1a1a'
                }}
              >
                Cattle Management
              </Typography>
            </Box>
            <ErrorBoundary fallback={
              <Card sx={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center' 
              }}>
                <CardContent>
                  <Typography sx={{ color: '#666' }}>Cattle Management unavailable</Typography>
                </CardContent>
              </Card>
            }>
              <CattleManagement />
            </ErrorBoundary>
          </Box>
          
          {/* Order Management */}
          <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Box sx={{ 
                width: '4px', 
                height: '24px', 
                borderRadius: '4px', 
                bgcolor: '#f59e0b', 
                mr: 2 
              }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1a1a1a'
                }}
              >
                Order Management
              </Typography>
            </Box>
            <ErrorBoundary fallback={
              <Card sx={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center' 
              }}>
                <CardContent>
                  <Typography sx={{ color: '#666' }}>Order Management unavailable</Typography>
                </CardContent>
              </Card>
            }>
              <OrderManagement />
            </ErrorBoundary>
          </Box>
                    {/* Delivery Management */}
                    <Box>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2 
            }}>
              <Box sx={{ 
                width: '4px', 
                height: '24px', 
                borderRadius: '4px', 
                bgcolor: '#ef4444', 
                mr: 2 
              }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1a1a1a'
                }}
              >
                Delivery Management
              </Typography>
            </Box>
            <ErrorBoundary fallback={
              <Card sx={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center' 
              }}>
                <CardContent>
                  <Typography sx={{ color: '#666' }}>Delivery Management unavailable</Typography>
                </CardContent>
              </Card>
            }>
              <DeliveryManagement />
            </ErrorBoundary>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default HomeDashboard;