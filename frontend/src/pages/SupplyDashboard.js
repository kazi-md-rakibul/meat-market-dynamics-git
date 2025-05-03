import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Modal, Form, Input, InputNumber, Select, Divider, Progress, message, Row, Col 
} from 'antd';
import Layout from '../components/Layout';
import moment from 'moment';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const { Option } = Select;

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

const SupplyDashboard = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState({
      warehouses: false,
    });

    // Data for storage condition distribution chart
  const [storageConditionData, setStorageConditionData] = useState([]);
  // Data for warehouse utilization chart
  const [utilizationData, setUtilizationData] = useState([]);
  
  // State for edit mode
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  const fetchWarehouses = async () => {
    setLoading(prev => ({ ...prev, warehouses: true }));
    try {
      const response = await fetch('http://localhost:5000/api/get-warehouse');
      const data = await response.json();
      console.log("Warehouse Data", response);
      setWarehouses(data);
      
      // Prepare data for charts
      prepareChartData(data);
      
    } catch (error) {
      message.error('Failed to fetch warehouses');
    } finally {
      setLoading(prev => ({ ...prev, warehouses: false }));
    }
  };
}
