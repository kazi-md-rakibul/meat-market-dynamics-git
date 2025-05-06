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
    {
        title: 'Total Demand',
        dataIndex: 'total_demand',
        key: 'total_demand',
        render: (value) => `${Number(value).toFixed(2)} kg`,
      },
      {
        title: 'Average Demand',
        dataIndex: 'avg_demand',
        key: 'avg_demand',
        render: (value) => `${Number(value).toFixed(2)} kg`,
      },
      {
        title: 'Next Period Forecast',
        dataIndex: 'forecast_next_period',
        key: 'forecast_next_period',
        render: (value) => (
          <Text strong style={{ color: '#1890ff' }}>
            {Number(value).toFixed(2)} kg
          </Text>
        ),
      },
      {
        title: 'Data Points',
        dataIndex: 'data_points',
        key: 'data_points',
      },
    ];
  
    return (
      <Layout>
        <div style={{ padding: '24px' }}>
          <Title level={2}>Analytics Dashboard</Title>
  
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Filter by Meat Type"
                value={filters.meatType}
                onChange={(value) => handleFilterChange('meatType', value)}
              >
                <Option value="all">All Meat Types</Option>
                <Option value="Beef">Beef</Option>
                <Option value="Pork">Pork</Option>
                <Option value="Chicken">Chicken</Option>
                <Option value="Lamb">Lamb</Option>
              </Select>
            </Col>
            <Col span={8}>
              <RangePicker
                style={{ width: '100%' }}
                value={filters.dateRange}
                onChange={(dates) => handleFilterChange('dateRange', dates)}
              />
            </Col>
            <Col span={6}>
              <InputNumber
                style={{ width: '100%' }}
                min={0.5}
                max={2}
                step={0.1}
                value={filters.forecastFactor}
                onChange={(value) => handleFilterChange('forecastFactor', value)}
                addonBefore="Forecast Factor"
              />
            </Col>
            <Col span={2}>
              <Button
                type="primary"
                onClick={handleRefresh}
                loading={loading}
              >
                Refresh
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                title="Supply-Demand Gap Analysis"
                bordered={false}
                extra={
                  <Text strong>Last Updated: {new Date().toLocaleString()}</Text>
                }
              >
                <Table
                  columns={gapColumns}
                  dataSource={gapData}
                  rowKey="meat_Type"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col span={24}>
              <Card
                title="Demand Forecasting"
                bordered={false}
                extra={
                  <Text>
                    Forecast Factor: <Text strong>{filters.forecastFactor}</Text>
                  </Text>
                }
              >
                <Table
                  columns={forecastColumns}
                  dataSource={forecastData}
                  rowKey={(record) => `${record.meat_Type}-${record.period}`}
                  pagination={{ pageSize: 5 }}
                />
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    </Layout>
  );
};

export default AnalyticsDashboard;
  