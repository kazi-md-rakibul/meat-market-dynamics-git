import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Table, Form, Input, Button, Select, DatePicker, Card, Statistic, Row, Col, message, Modal, Space } from 'antd';
import moment from 'moment';
import axios from 'axios';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProductionDashboard = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [units, setUnits] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [editingBatch, setEditingBatch] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [form] = Form.useForm();
    const [stats, setStats] = useState({
        totalBatches: 0,
        totalWeight: 0,
        inTransit: 0,
        inStorage: 0,
        sold: 0
    });

    useEffect(() => {
        fetchUnits();
        fetchWarehouses();
        fetchBatches();
    }, []);

    const fetchUnits = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/processing-unit');
            const data = Array.isArray(response.data) ? response.data : [];
            setUnits(data);
        } catch (error) {
            console.error('Error fetching units:', error);
            message.error('Failed to fetch processing units');
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/get-warehouse');
            const data = Array.isArray(response.data) ? response.data : [];
            setWarehouses(data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
            message.error('Failed to fetch warehouses');
        }
    };
    const fetchBatches = async () => {
        try {
            console.log('Fetching batches from API...');
            setLoading(true);
            
            const response = await axios.get('http://localhost:5000/api/production/batches');
            console.log('Received batches response:', response);
            
            const data = Array.isArray(response.data) ? response.data : [];
            console.log(`Fetched ${data.length} batches`);
            
            setBatches(data);

            const totalWeight = data.reduce((sum, batch) => sum + (parseFloat(batch.total_Weight) || 0), 0);
            const statusCounts = data.reduce((acc, batch) => {
                if (batch.batch_Status) {
                    acc[batch.batch_Status] = (acc[batch.batch_Status] || 0) + 1;
                }
                return acc;
            }, {});

            console.log('Calculated batch statistics:', { 
                totalBatches: data.length,
                totalWeight,
                statusCounts
            });
            
            setStats({
                totalBatches: data.length,
                totalWeight,
                inTransit: statusCounts.transit || 0,
                inStorage: statusCounts.stored || 0,
                sold: statusCounts.sold || 0
            });
        } catch (error) {
            console.error('Error fetching batches:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                message.error(`Failed to fetch batches: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                message.error('Failed to fetch batches: No response from server');
            } else {
                message.error(`Failed to fetch batches: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        try {
            console.log('Submitting batch with values:', values);
            
            // Validate required fields on the frontend
            if (!values.unit_ID) {
                message.error('Processing unit is required');
                return;
            }
            if (!values.total_Weight) {
                message.error('Total weight is required');
                return;
            }
            if (!values.batch_Status) {
                message.error('Batch status is required');
                return;
            }
            if (!values.dateRange || !Array.isArray(values.dateRange) || values.dateRange.length !== 2) {
                message.error('Valid date range is required');
                return;
            }
            
            const requestData = {
                unit_ID: values.unit_ID,
                warehouse_ID: values.warehouse_ID,
                total_Weight: values.total_Weight,
                batch_Status: values.batch_Status,
                dateRange: [
                    values.dateRange[0].format('YYYY-MM-DD'),
                    values.dateRange[1].format('YYYY-MM-DD')
                ]
            };
            
            console.log('Sending request with data:', requestData);
            
            const response = await fetch('http://localhost:5000/api/create-production/batches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const responseData = await response.json();
            
            if (response.ok) {
                console.log('Batch created successfully:', responseData);
                message.success('Batch created successfully');
                form.resetFields();
                // Add a slight delay before fetching batches to ensure the database has updated
                setTimeout(() => {
                    fetchBatches();
                }, 500);
            } else {
                console.error('Server returned error:', responseData);
                message.error(responseData.message || 'Failed to create batch');
            }
        } catch (error) {
            console.error('Error creating batch:', error);
            message.error('Error creating batch: ' + (error.message || 'Unknown error'));
        }
    };
    const handleEdit = (batch) => {
        setEditingBatch(batch);
        form.setFieldsValue({
            unit_ID: batch.unit_ID,
            warehouse_ID: batch.warehouse_ID,
            total_Weight: batch.total_Weight,
            batch_Status: batch.batch_Status,
            dateRange: [
                moment(batch.production_Date),
                moment(batch.expiration_Date)
            ]
        });
        setIsModalVisible(true);
    };


};