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
    useEffect(() => {
        fetchUnits();
    }, []);

    const handleSearch = (value) => {
        setSearchText(value);
        if (!value) {
            setFilteredUnits(units);
            return;
        }
        
        const searchLower = value.toLowerCase();
        const filtered = units.filter(unit => 
            unit.unit_ID?.toString().includes(searchLower) ||
            unit.facility_Name?.toLowerCase().includes(searchLower) ||
            unit.processing_Capacity?.toString().includes(searchLower)
        );
        setFilteredUnits(filtered);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };
    const renderCapacityBar = (capacity) => {
        // Determine color based on capacity
        let color = '#52c41a'; // Green by default
        if (capacity < 500) color = '#ff4d4f'; // Red for low capacity
        else if (capacity < 1000) color = '#faad14'; // Yellow for medium capacity
        
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                    width: '80px', 
                    height: '8px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '4px', 
                    overflow: 'hidden',
                    marginRight: '8px'
                }}>
                    <div style={{ 
                        width: `${Math.min(capacity / 20, 100)}%`, 
                        height: '100%', 
                        backgroundColor: color,
                        borderRadius: '4px'
                    }} />
                </div>
                <span>{capacity} kg</span>
            </div>
        );
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'unit_ID',
            key: 'unit_ID',
            sorter: (a, b) => a.unit_ID - b.unit_ID,
            sortOrder: sortedInfo.columnKey === 'unit_ID' && sortedInfo.order,
            render: id => <Tag color="blue">{id}</Tag>
        },
        {
            title: 'Facility Name',
            dataIndex: 'facility_Name',
            key: 'facility_Name',
            sorter: (a, b) => a.facility_Name.localeCompare(b.facility_Name),
            sortOrder: sortedInfo.columnKey === 'facility_Name' && sortedInfo.order,
            render: name => <Text strong>{name}</Text>
        },
        {
            title: 'Capacity (kg)',
            dataIndex: 'processing_Capacity',
            key: 'processing_Capacity',
            sorter: (a, b) => a.processing_Capacity - b.processing_Capacity,
            sortOrder: sortedInfo.columnKey === 'processing_Capacity' && sortedInfo.order,
            render: capacity => renderCapacityBar(capacity)
        },
        {
            title: 'Processing Date',
            dataIndex: 'processing_Date',
            key: 'processing_Date',
            sorter: (a, b) => new Date(a.processing_Date) - new Date(b.processing_Date),
            sortOrder: sortedInfo.columnKey === 'processing_Date' && sortedInfo.order,
            render: date => {
                if (!date) return <Tag color="error">N/A</Tag>;
                
                const processDate = new Date(date);
                const today = new Date();
                const isPast = processDate < today;
                const isFuture = processDate > today;
                const isToday = processDate.toDateString() === today.toDateString();
                
                let color = 'default';
                if (isPast) color = 'success';
                if (isToday) color = 'processing';
                if (isFuture) color = 'warning';
                
                return <Tag color={color}>{new Date(date).toLocaleDateString()}</Tag>;
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit Unit">
                        <Link to={`/processing-units/edit/${record.unit_ID}`}>
                            <Button type="primary" icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Delete Unit">
                        <Popconfirm
                            title="Are you sure you want to delete this processing unit?"
                            description="This action cannot be undone."
                            onConfirm={() => handleDelete(record.unit_ID)}
                            okText="Yes"
                            cancelText="No"
                            placement="left"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];
};