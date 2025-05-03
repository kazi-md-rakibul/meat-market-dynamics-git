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
    const handleUpdate = async (values) => {
        try {
            const response = await fetch(`http://localhost:5000/api/edit-batches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    batchId: editingBatch.batch_ID,
                    unit_ID: values.unit_ID,
                    warehouse_ID: values.warehouse_ID,
                    total_Weight: values.total_Weight,
                    batch_Status: values.batch_Status,
                    dateRange: [
                        values.dateRange[0].format('YYYY-MM-DD'),
                        values.dateRange[1].format('YYYY-MM-DD')
                    ]
                }),
            });

            if (response.ok) {
                message.success('Batch updated successfully');
                form.resetFields();
                setIsModalVisible(false);
                fetchBatches();
            } else {
                message.error('Failed to update batch');
            }
        } catch (error) {
            console.error('Error updating batch:', error);
            message.error('Error updating batch');
        }
    };
    const handleDelete = async (batchId) => {

        try {
            const response = await axios.post('http://localhost:5000/api/delete-batches', {
                batchId: batchId
            });

            if (response.status === 200) {
                message.success('Batch deleted successfully');
                fetchBatches();
            } else {
                message.error(response.data.message || 'Failed to delete batch');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                message.error(error.response.data.message);
            } else {
                console.error('Error deleting batch:', error);
                message.error('Error deleting batch');
            }
        }

    };
    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([fetchUnits(), fetchWarehouses(), fetchBatches()]);
            } catch (error) {
                console.error('Error loading data:', error);
                message.error('Failed to load some data');
            }
        };
        fetchData();
    }, []);
    const columns = [
        {
            title: 'Batch ID',
            dataIndex: 'batch_ID',
            key: 'batch_ID',
            sorter: (a, b) => a.batch_ID - b.batch_ID,
        },
        {
            title: 'Production Date',
            dataIndex: 'production_Date',
            key: 'production_Date',
            render: (date) => moment(date).format('YYYY-MM-DD'),
            sorter: (a, b) => new Date(a.production_Date) - new Date(b.production_Date),
        },
        {
            title: 'Expiration Date',
            dataIndex: 'expiration_Date',
            key: 'expiration_Date',
            render: (date) => moment(date).format('YYYY-MM-DD'),
            sorter: (a, b) => new Date(a.expiration_Date) - new Date(b.expiration_Date),
        },
        {
            title: 'Total Weight (kg)',
            dataIndex: 'total_Weight',
            key: 'total_Weight',
            render: (weight) => Number(weight).toFixed(2),
            sorter: (a, b) => a.total_Weight - b.total_Weight,
        },
        {
            title: 'Status',
            dataIndex: 'batch_Status',
            key: 'batch_Status',
            render: (status) => (
                <span style={{
                    color: status === 'stored' ? 'green' :
                        status === 'transit' ? 'orange' :
                            status === 'sold' ? 'blue' : 'black',
                    fontWeight: '500'
                }}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            ),
            filters: [
                { text: 'In Transit', value: 'transit' },
                { text: 'In Storage', value: 'stored' },
                { text: 'Sold', value: 'sold' },
            ],
            onFilter: (value, record) => record.batch_Status === value,
        },
        {
            title: 'Processing Facility',
            dataIndex: 'processing_Facility',
            key: 'processing_Facility',
            render: (facility) => facility || 'N/A',
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouse_Address',
            key: 'warehouse_Address',
            render: (address) => address || 'N/A',
        },
        {
            title: 'Storage Condition',
            dataIndex: 'warehouse_Storage_Condition',
            key: 'warehouse_Storage_Condition',
            render: (condition) => condition || 'N/A',
        },
        {
            title: 'Meat Types',
            dataIndex: 'meat_Types',
            key: 'meat_Types',
            render: (types) => (
                types && types.length > 0 ?
                    types.join(', ') :
                    'N/A'
            ),
        },
        {
            title: 'Cut Types',
            dataIndex: 'cut_Types',
            key: 'cut_Types',
            render: (cuts) => (
                cuts && cuts.length > 0 ?
                    cuts.join(', ') :
                    'N/A'
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.batch_ID)}>Delete</Button>
                </Space>
            ),
        },
    ];
    return (
        <Layout>
            <div>
                <h1>Production Batches</h1>

                <Row gutter={16} style={{ marginBottom: '24px' }}>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Batches"
                                value={stats.totalBatches}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Weight (kg)"
                                value={stats.totalWeight.toFixed(2)}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="In Transit"
                                value={stats.inTransit}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="In Storage"
                                value={stats.inStorage}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                </Row>
                <Card title="Add New Meat Batch" style={{ marginBottom: '24px' }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="unit_ID"
                                    label="Processing Unit"
                                    rules={[{ required: true, message: 'Please select processing unit' }]}
                                >
                                    <Select placeholder="Select Processing Unit">
                                        {units.map((unit) => (
                                            <Option key={unit.unit_ID} value={unit.unit_ID}>
                                                {`${unit.unit_ID} - ${unit.facility_Name}`}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="warehouse_ID"
                                    label="Warehouse"
                                >
                                    <Select placeholder="Select Warehouse">
                                        {warehouses.map((warehouse) => (
                                            <Option key={warehouse.warehouse_ID} value={warehouse.warehouse_ID}>
                                                {`#${warehouse.warehouse_ID} - ${warehouse.address} (${warehouse.storage_Condition})`}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="total_Weight"
                                    label="Total Weight (kg)"
                                    rules={[{ required: true, message: 'Please input total weight' }]}
                                >
                                    <Input type="number" step="0.01" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="dateRange"
                                    label="Production & Expiration Dates"
                                    rules={[{ required: true, message: 'Please select date range' }]}
                                >
                                    <RangePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="batch_Status"
                                    label="Batch Status"
                                    rules={[{ required: true, message: 'Please select status' }]}
                                >
                                    <Select>
                                        <Option value="transit">In Transit</Option>
                                        <Option value="stored">In Storage</Option>
                                        <Option value="sold">Sold</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create Batch
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                


                </div>
                </Layout>
    );


};