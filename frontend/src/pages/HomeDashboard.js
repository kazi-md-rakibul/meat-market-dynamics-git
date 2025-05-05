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