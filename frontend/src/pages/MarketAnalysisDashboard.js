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