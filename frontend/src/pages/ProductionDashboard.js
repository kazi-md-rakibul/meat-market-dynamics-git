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

    


};