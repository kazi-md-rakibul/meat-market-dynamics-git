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
  const handleSubmitWarehouse = async (values) => {
    try {
      // Debug form values
      console.log('Form values received:', values);
      
      // Check if all required fields are present
      if (!values.address || values.current_stock === undefined || values.capacity === undefined || !values.storage_condition) {
        console.error('Missing required fields:', values);
        message.error('Please fill in all required fields');
        return;
      }
      
      // Add a delay to ensure we can see the console logs
      console.log('Starting warehouse creation process...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const url = 'http://localhost:5000/api/create-warehouse';
      console.log('Making request to:', url);
      
      // Prepare request body with exact field names expected by backend
      // Looking at the backend controller, it expects lowercase field names
      const requestBody = {
        address: values.address,
        current_stock: parseInt(values.current_stock),
        capacity: parseInt(values.capacity),
        storage_condition: values.storage_condition
      };
      console.log('Request body prepared:', requestBody);

      // Make the API request
      console.log('Sending fetch request with body:', JSON.stringify(requestBody));
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        
        console.log('Response received. Status:', response.status);
        console.log('Response OK?', response.ok);

        // Parse response data
        let responseData;
        try {
          responseData = await response.json();
          console.log('Response data parsed:', responseData);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          responseData = { message: 'Could not parse server response' };
        }
      
        if (response.ok) {
          console.log('Request successful, closing modal and refreshing data');
          message.success('Warehouse created successfully');
          setIsModalVisible(false);
          form.resetFields();
          fetchWarehouses();
        } else {
          console.error('Request failed with status:', response.status, responseData);
          message.error(responseData.message || 'Failed to create warehouse');
        }
      } catch (networkError) {
        console.error('Network error during fetch:', networkError);
        message.error('Network error: ' + networkError.message);
      }
    } catch (error) {
      console.error('Exception in handleSubmitWarehouse:', error);
      message.error('Error creating warehouse: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
    form.setFieldsValue({
      address: warehouse.address,
      current_stock: warehouse.current_Stock,
      capacity: warehouse.capacity,
      storage_condition: warehouse.storage_Condition
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateWarehouse = async (values) => {
    try {
      const warehouseId = editingWarehouse.warehouse_ID;
      console.log('Updating warehouse:', { warehouseId, values });
      
      const url = `http://localhost:5000/api/update-warehouse/${warehouseId}`;
      // Make sure the field names exactly match what the backend expects
      // The backend controller expects lowercase field names
      const requestBody = {
        address: values.address,
        current_stock: parseInt(values.current_stock),  // Convert to integer
        capacity: parseInt(values.capacity),  // Convert to integer
        storage_condition: values.storage_condition
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        message.success('Warehouse updated successfully');
        setIsEditModalVisible(false);
        form.resetFields();
        setEditingWarehouse(null);
        fetchWarehouses();
      } else {
        message.error(responseData.message || 'Failed to update warehouse');
      }
    } catch (error) {
      console.error('Error updating warehouse:', error);
      message.error('Error updating warehouse');
    }
  };

  const handleDeleteWarehouse = async (id) => {
    try {
      console.log('Deleting warehouse with ID:', id);
      
      // Show confirmation dialog before deleting
      Modal.confirm({
        title: 'Are you sure you want to delete this warehouse?',
        content: 'This action cannot be undone.',
        okText: 'Yes, Delete',
        okType: 'danger',
        cancelText: 'Cancel',
        onOk: async () => {
          const response = await fetch(`http://localhost:5000/api/delete-warehouse/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          console.log('Delete response status:', response.status);
          const result = await response.json();
          console.log('Delete response data:', result);
          
          if (response.ok) {
            message.success('Warehouse deleted successfully');
            fetchWarehouses();
          } else {
            message.error(result.message || 'Failed to delete warehouse');
          }
        }
      });
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      message.error('Error deleting warehouse');
    }
  };

  // Prepare data for charts
  const prepareChartData = (warehouseData) => {
    // Prepare storage condition distribution data
    const storageConditionMap = {};
    warehouseData.forEach(warehouse => {
      const condition = warehouse.storage_Condition;
      storageConditionMap[condition] = (storageConditionMap[condition] || 0) + 1;
    });
    
    const storageConditionChartData = Object.keys(storageConditionMap).map(condition => ({
      name: condition,
      value: storageConditionMap[condition]
    }));
    
    setStorageConditionData(storageConditionChartData);
    
    // Prepare warehouse utilization data
    const utilizationChartData = warehouseData.map(warehouse => ({
      name: warehouse.address.substring(0, 15) + (warehouse.address.length > 15 ? '...' : ''),
      utilization: Math.round((warehouse.current_Stock / warehouse.capacity) * 100)
    }));
    
    setUtilizationData(utilizationChartData);
  };












}

