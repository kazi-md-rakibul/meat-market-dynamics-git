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

};