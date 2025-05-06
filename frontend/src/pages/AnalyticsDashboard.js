import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Row, Col, Spin, DatePicker, Select, InputNumber, Button, message } from 'antd';
import Layout from '../components/Layout';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AnalyticsDashboard = () => {
  const [gapData, setGapData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    meatType: 'all',
    dateRange: [],
    forecastFactor: 1.1
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const gapResponse = await axios.get('http://localhost:5000/api/analytics/gap');
      setGapData(gapResponse.data);

      const params = {
        forecastFactor: filters.forecastFactor
      };

      if (filters.meatType !== 'all') params.meatType = filters.meatType;
      if (filters.dateRange.length === 2) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const forecastResponse = await axios.get('http://localhost:5000/api/analytics/forecast', { params });
      setForecastData(forecastResponse.data.forecast || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      message.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  const gapColumns = [
    {
      title: 'Meat Type',
      dataIndex: 'meat_Type',
      key: 'meat_Type',
    },
    {
      title: 'Current Supply',
      dataIndex: 'current_supply',
      key: 'current_supply',
      render: (value) => `${value} kg`,
    },
    {
      title: 'Current Demand',
      dataIndex: 'current_demand',
      key: 'current_demand',
      render: (value) => `${value} kg`,
    },
    {
      title: 'Gap (Supply - Demand)',
      dataIndex: 'gap',
      key: 'gap',
      render: (value) => (
        <Text style={{ color: value >= 0 ? 'green' : 'red' }}>
          {value} kg
        </Text>
      ),
    },
  ];

  const forecastColumns = [
    {
      title: 'Meat Type',
      dataIndex: 'meat_Type',
      key: 'meat_Type',
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },