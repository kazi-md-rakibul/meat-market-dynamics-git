import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Input, Card, Typography, Badge, 
         Tooltip, Tag, Empty, Statistic, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, 
         ReloadOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';

const { Title, Text } = Typography;
const { Search } = Input;

const ProcessingUnitList = () => {
    const [units, setUnits] = useState([]);
    const [filteredUnits, setFilteredUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [sortedInfo, setSortedInfo] = useState({});

    const fetchUnits = async () => {
        setLoading(true);
        setRefreshing(true);
        try {
            const response = await fetch('http://localhost:5000/api/processing-unit');
            const data = await response.json();
            const unitsData = Array.isArray(data) ? data : [];
            setUnits(unitsData);
            setFilteredUnits(unitsData);
        } catch (error) {
            message.error('Failed to fetch processing units');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };
    const handleDelete = async (unit_ID) => {
        try {
            const response = await fetch('http://localhost:5000/api/delete-processing-unit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: unit_ID })
            });

            const result = await response.json();

            if (response.ok) {
                message.success(result.message || 'Processing unit deleted successfully');
                setUnits(prev => prev.filter(unit => unit.unit_ID !== unit_ID));
                setFilteredUnits(prev => prev.filter(unit => unit.unit_ID !== unit_ID));
            } else {
                if (result.message === "Processing unit not found") {
                    message.error('Processing unit not found');
                    setUnits(prev => prev.filter(unit => unit.unit_ID !== unit_ID));
                    setFilteredUnits(prev => prev.filter(unit => unit.unit_ID !== unit_ID));
                } else if (result.message.includes('referenced by meat batches')) {
                    message.error('Cannot delete - this unit is referenced by meat batches');
                } else {
                    message.error(result.message || 'Failed to delete processing unit');
                }
            }
        } catch (error) {
            message.error('Failed to delete processing unit');
            console.error('Delete error:', error);
        }
    };

};