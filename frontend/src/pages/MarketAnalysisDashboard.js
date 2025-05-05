import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Statistic,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  message,
  Form,
  Input,
  Modal,
  Divider
} from 'antd';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Layout from '../components/Layout';
import axios from 'axios';
import moment from 'moment';

Chart.register(...registerables);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Item } = Form;

const MarketAnalysisDashboard = () => {
  const [priceTrends, setPriceTrends] = useState([]);
  const [regionalPrices, setRegionalPrices] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState({
    trends: false,
    regional: false,
    products: false,
    recording: false
  });
  const [filters, setFilters] = useState({
    meatType: null,
    cutType: null,
    region: null,
    dateRange: [moment().subtract(1, 'month'), moment()]
  });
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchPriceTrends = async () => {
    setLoading(prev => ({ ...prev, trends: true }));
    try {
      const params = {
        meatType: filters.meatType,
        cutType: filters.cutType,
        startDate: filters.dateRange[0].format('YYYY-MM-DD'),
        endDate: filters.dateRange[1].format('YYYY-MM-DD')
      };
      const response = await axios.get('http://localhost:5000/api/market/trends', { params });
      setPriceTrends(response.data);
    } catch (error) {
      message.error('Failed to fetch price trends');
    } finally {
      setLoading(prev => ({ ...prev, trends: false }));
    }
  };

  const fetchRegionalPrices = async () => {
    setLoading(prev => ({ ...prev, regional: true }));
    try {
      const response = await axios.get('http://localhost:5000/api/market/regional');
      setRegionalPrices(response.data);
    } catch (error) {
      message.error('Failed to fetch regional prices');
    } finally {
      setLoading(prev => ({ ...prev, regional: false }));
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      console.log("response", response);

      const transformedProducts = response.data.map(product => ({
        product_ID: product.product_ID,
        product_name: product.product_name,
        meat_Type: product.meat_Type,
        origin: product.origin,
        cut_Type: product.cut_Type,
        seasonality: product.seasonality,
        processing_Date: product.processing_Date,
        expiration_Date: product.expiration_Date,
        weight_Per_Unit: product.weight_Per_Unit,
        price_Per_Unit: product.price_Per_Unit,
        stock_Availability: product.stock_Availability,
        batch_ID: product.batch_ID,
        production_Date: product.production_Date,
        total_Weight: product.total_Weight,
        batch_Status: product.batch_Status,
        processing_facility: product.processing_facility,
        warehouse_location: product.warehouse_location
      }));

      setProducts(transformedProducts);
      setLoading(false);
    } catch (error) {
      message.error('Failed to fetch products');
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchPriceTrends();
  };

  const recordPrice = async (values) => {
    setLoading(prev => ({ ...prev, recording: true }));
    try {
      await axios.post('http://localhost:5000/api/market/prices', {
        product_ID: values.productId,
        price_date: values.date.format('YYYY-MM-DD'),
        price: values.price,
        region: values.region
      });
      message.success('Price recorded successfully');
      setRecordModalVisible(false);
      form.resetFields();
      fetchPriceTrends();
    } catch (error) {
      message.error('Failed to record price');
    } finally {
      setLoading(prev => ({ ...prev, recording: false }));
    }
  };
  
  useEffect(() => {
    fetchPriceTrends();
    fetchRegionalPrices();
    fetchProducts();
  }, []);

  const trendsChartData = {
    labels: priceTrends.map(item => moment(item.price_date).format('MMM DD')),
    datasets: [
      {
        label: 'Price Trends',
        data: priceTrends.map(item => Number(item.price)),  // Convert to number
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }
    ]
  };

  const regionalChartData = {
    labels: regionalPrices.map(item => item.region),
    datasets: [
      {
        label: 'Average Price',
        data: regionalPrices.map(item => Number(item.avg_price)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }
    ]
  };

  const trendColumns = [
    {
      title: 'Date',
      dataIndex: 'price_date',
      key: 'date',
      render: date => moment(date).format('LL'),
      sorter: (a, b) => new Date(a.price_date) - new Date(b.price_date)
    },
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product',
      sorter: (a, b) => a.product_name.localeCompare(b.product_name)
    },
    {
      title: 'Meat Type',
      dataIndex: 'meat_Type',
      key: 'meatType',
      filters: [
        { text: 'Beef', value: 'Beef' },
        { text: 'Pork', value: 'Pork' },
        { text: 'Chicken', value: 'Chicken' },
        { text: 'Lamb', value: 'Lamb' }
      ],
      onFilter: (value, record) => record.meat_Type === value,
      sorter: (a, b) => a.meat_Type.localeCompare(b.meat_Type)
    },
    {
      title: 'Cut Type',
      dataIndex: 'cut_Type',
      key: 'cutType',
      filters: [
        { text: 'Loin', value: 'Loin' },
        { text: 'Rib', value: 'Rib' },
        { text: 'Shoulder', value: 'Shoulder' },
        { text: 'Leg', value: 'Leg' }
      ],
      onFilter: (value, record) => record.cut_Type === value,
      sorter: (a, b) => a.cut_Type.localeCompare(b.cut_Type)
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${Number(price).toFixed(2)}`,
      sorter: (a, b) => Number(a.price) - Number(b.price)
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      render: region => <Tag color="blue">{region}</Tag>,
      filters: [
        { text: 'North', value: 'North' },
        { text: 'South', value: 'South' },
        { text: 'East', value: 'East' },
        { text: 'West', value: 'West' }
      ],
      onFilter: (value, record) => record.region === value,
      sorter: (a, b) => a.region.localeCompare(b.region)
    }
  ];

  return (
    <Layout>
      <div className="market-analysis-dashboard" style={{ padding: '24px' }}>
        <h1>Historical Price Analysis</h1>

        <Card
          title="Filters"
          style={{ marginBottom: 24 }}
          extra={
            <Button
              type="primary"
              onClick={() => setRecordModalVisible(true)}
            >
              Record New Price
            </Button>
          }
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Select Meat Type"
                style={{ width: '100%' }}
                onChange={value => handleFilterChange('meatType', value)}
                allowClear
              >
                <Option value="Beef">Beef</Option>
                <Option value="Pork">Pork</Option>
                <Option value="Chicken">Chicken</Option>
                <Option value="Lamb">Lamb</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Select Cut Type"
                style={{ width: '100%' }}
                onChange={value => handleFilterChange('cutType', value)}
                allowClear
              >
                <Option value="Loin">Loin</Option>
                <Option value="Rib">Rib</Option>
                <Option value="Shoulder">Shoulder</Option>
                <Option value="Leg">Leg</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                value={filters.dateRange}
                onChange={dates => handleFilterChange('dateRange', dates)}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button type="primary" onClick={applyFilters} block>
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card>
        
        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Average Price"
                value={
                  priceTrends.length > 0
                    ? priceTrends.reduce((acc, curr) => acc + Number(curr.price), 0) / priceTrends.length
                    : 0
                }
                precision={2}
                prefix="$"
              />

            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Highest Price"
                value={priceTrends.length > 0 ?
                  Math.max(...priceTrends.map(item => Number(item.price))) : 0}
                precision={2}
                prefix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Lowest Price"
                value={priceTrends.length > 0 ?
                  Math.min(...priceTrends.map(item => Number(item.price))) : 0}
                precision={2}
                prefix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Data Points"
                value={priceTrends.length}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts Section */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="Price Trends Over Time" loading={loading.trends}>
              <Line
                data={trendsChartData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.parsed.y.toFixed(2)}`
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => `$${value}`
                      }
                    }
                  }
                }}
                height={300}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Regional Price Comparison" loading={loading.regional}>
              <Bar
                data={regionalChartData}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.parsed.y.toFixed(2)}`
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => `$${value}`
                      }
                    }
                  }
                }}
                height={300}
              />
            </Card>
          </Col>
        </Row>
        
        {/* Data Tables Section */}
        <Row gutter={16}>
          <Col xs={24}>
            <Card
              title="Price Trends Data"
              loading={loading.trends}
              extra={
                <Space>
                  <Button
                    type="default"
                    onClick={fetchPriceTrends}
                    loading={loading.trends}
                  >
                    Refresh
                  </Button>
                </Space>
              }
            >
              <Table
                columns={trendColumns}
                dataSource={priceTrends}
                rowKey="record_ID"
                scroll={{ x: true }}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Record Price Modal */}
        <Modal
          title="Record New Market Price"
          visible={recordModalVisible}
          onCancel={() => setRecordModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={recordPrice}
          >
            <Item
              name="productId"
              label="Product"
              rules={[{ required: true, message: 'Please select a product' }]}
            >
              <Select
                placeholder="Select Product"
                loading={loading.products}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {products.map(product => (
                  <Option key={product.product_ID} value={product.product_ID}>
                    {product.product_name} ({product.meat_Type} - {product.cut_Type})
                  </Option>
                ))}
              </Select>
            </Item>
            <Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Item>
            <Item
              name="price"
              label="Price ($)"
              rules={[
                { required: true, message: 'Please enter the price' },
                { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid price' }
              ]}
            >
              <Input prefix="$" type="number" step="0.01" />
            </Item>
            <Item
              name="region"
              label="Region"
              rules={[{ required: true, message: 'Please select a region' }]}
            >
              <Select placeholder="Select Region">
                <Option value="North">North</Option>
                <Option value="South">South</Option>
                <Option value="East">East</Option>
                <Option value="West">West</Option>
              </Select>
            </Item>
            <Divider />
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading.recording}
              >
                Record Price
              </Button>
            </Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default MarketAnalysisDashboard;