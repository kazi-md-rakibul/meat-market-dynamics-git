import { Table, Tabs, Spin, message, Modal, Button, Form, Input, Select, Tag, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const { TabPane } = Tabs;
const { Option } = Select;

const DirectoriesDashboard = () => {
    const [vendors, setVendors] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('vendors');
    const [isVendorModalVisible, setIsVendorModalVisible] = useState(false);
    const [isFarmerModalVisible, setIsFarmerModalVisible] = useState(false);
    const [isViewFarmerModalVisible, setIsViewFarmerModalVisible] = useState(false);
    const [currentFarmer, setCurrentFarmer] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [vendorForm] = Form.useForm();
    const [farmerForm] = Form.useForm();
    const [currentVendor, setCurrentVendor] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'vendors') {
                const response = await axios.get('http://localhost:5000/api/directory/vendors');
                setVendors(response.data);
            } else {
                const response = await axios.get('http://localhost:5000/api/directory/farmers');
                setFarmers(response.data);
            }
        } catch (error) {
            message.error('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateVendor = async () => {
        try {
            const values = await vendorForm.validateFields();
            setLoading(true);

            const vendorData = {
                vendor_Name: values.vendor_Name,
                address: values.address,
                stock_Quantity: values.stock_Quantity,
                contact_number: values.contact_number,
                business_Type: values.business_Type
            };

            await axios.post('http://localhost:5000/api/directory/vendors', vendorData);
            message.success('Vendor created successfully!');
            setIsVendorModalVisible(false);
            vendorForm.resetFields();
            fetchData();
        } catch (error) {
            handleApiError(error, 'Failed to create vendor');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFarmer = async () => {
        try {
            const values = await farmerForm.validateFields();
            setLoading(true);

            const farmerData = {
                farm_Name: values.farm_Name,
                livestock_Type: values.livestock_Type,
                available_Stock: values.available_Stock,
                address: values.address,
                contact_info: values.contact_info,
                number_of_Livestock: 0
            };

            await axios.post('http://localhost:5000/api/directory/add-farmer', farmerData);
            message.success('Farmer created successfully!');
            setIsFarmerModalVisible(false);
            farmerForm.resetFields();
            fetchData();
        } catch (error) {
            handleApiError(error, 'Failed to create farmer');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateFarmer = async () => {
        try {
            const values = await farmerForm.validateFields();
            setLoading(true);

            const farmerData = {
                farm_Name: values.farm_Name,
                livestock_Type: values.livestock_Type,
                available_Stock: values.available_Stock,
                address: values.address,
                contact_info: values.contact_info
            };

            await axios.post('http://localhost:5000/api/directory/update-farmer', {
                id: currentFarmer.farm_ID,
                farmerData
            });

            message.success('Farmer updated successfully!');
            setIsFarmerModalVisible(false);
            farmerForm.resetFields();
            setCurrentFarmer(null);
            fetchData();
        } catch (error) {
            handleApiError(error, 'Failed to update farmer');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFarmer = async (id) => {
        console.log("Call", id);
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/directory/delete-farmer', { id });
            fetchData();
            message.success('Farmer deleted successfully!');
            fetchData();
        } catch (error) {
            handleApiError(error, 'Failed to delete farmer');
        } finally {
            setLoading(false);
        }

    };

    const handleEditFarmer = (farmer) => {
        setCurrentFarmer(farmer);
        setFormMode('edit');
        farmerForm.setFieldsValue({
            farm_Name: farmer.farm_Name,
            livestock_Type: farmer.livestock_Type,
            available_Stock: farmer.available_Stock,
            address: farmer.address,
            contact_info: farmer.contact_info
        });
        setIsFarmerModalVisible(true);
    };

    const handleApiError = (error, defaultMessage) => {
        if (error.response) {
            message.error(error.response.data.message || defaultMessage);
        } else {
            message.error(defaultMessage);
        }
        console.error('API Error:', error);
    };

    const handleDeleteVendor = async (id) => {
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/directory/delete-vendor', { vendor_ID: id });
            message.success('Vendor deleted successfully!');
            fetchData();
        } catch (error) {
            handleApiError(error, 'Failed to delete vendor');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVendor = async () => {
        try {
            const values = await vendorForm.validateFields();
            setLoading(true);
    
            await axios.post('http://localhost:5000/api/directory/update-vendor', {
                vendor_ID: currentVendor?.vendor_ID,
                vendor_Name: values.vendor_Name,
                address: values.address,
                stock_Quantity: values.stock_Quantity,
                contact_number: values.contact_number,
                business_Type: values.business_Type
            });
    
            message.success('Vendor updated successfully!');
            setIsVendorModalVisible(false);
            vendorForm.resetFields();
            setCurrentVendor(null);
            fetchData();
        } catch (error) {
            handleApiError(error, 'Failed to update vendor');
        } finally {
            setLoading(false);
        }
    };

    const handleEditVendor = (vendor) => {
        setCurrentVendor(vendor);
        setFormMode('edit');
        vendorForm.setFieldsValue({
            vendor_Name: vendor.vendor_Name,
            business_Type: vendor.business_Type,
            contact_number: vendor.contact_number,
            address: vendor.address,
            stock_Quantity: vendor.stock_Quantity
        });
        setIsVendorModalVisible(true);
    };

    const vendorColumns = [
        {
            title: 'Vendor ID',
            dataIndex: 'vendor_ID',
            key: 'vendor_ID',
            sorter: (a, b) => a.vendor_ID - b.vendor_ID,
        },
        {
            title: 'Vendor Name',
            dataIndex: 'vendor_Name',
            key: 'vendor_Name',
            sorter: (a, b) => a.vendor_Name.localeCompare(b.vendor_Name),
        },
        {
            title: 'Type',
            dataIndex: 'vendor_type',
            key: 'vendor_type',
            render: (type) => {
                let color = type === 'Retailer' ? 'green' : type === 'Wholeseller' ? 'blue' : 'orange';
                return <Tag color={color}>{type}</Tag>;
            },
            filters: [
                { text: 'Retailer', value: 'Retailer' },
                { text: 'Wholeseller', value: 'Wholeseller' },
                { text: 'Other', value: 'Other' },
            ],
            onFilter: (value, record) => record.vendor_type === value,
        },
        {
            title: 'Contact',
            dataIndex: 'contact_number',
            key: 'contact_number',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: true,
        },
        {
            title: 'Stock',
            dataIndex: 'stock_Quantity',
            key: 'stock_Quantity',
            sorter: (a, b) => a.stock_Quantity - b.stock_Quantity,
        },
        {
            title: 'Sales Volume',
            dataIndex: 'salesVolume_perMonth',
            key: 'salesVolume_perMonth',
            render: (value) => value ? `$${value}` : 'N/A',
        },
        {
            title: 'Avg Order Value',
            dataIndex: 'average_Order_Value',
            key: 'average_Order_Value',
            render: (value) => value ? `$${value}` : 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEditVendor(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDeleteVendor(record.vendor_ID)}>Delete</Button>
                </Space>
            ),
        },
    ];

    const farmerColumns = [
        {
            title: 'Farm ID',
            dataIndex: 'farm_ID',
            key: 'farm_ID',
        },
        {
            title: 'Farm Name',
            dataIndex: 'farm_Name',
            key: 'farm_Name',
        },
        {
            title: 'Livestock Type',
            dataIndex: 'livestock_Type',
            key: 'livestock_Type',
        },
        {
            title: 'Available Stock',
            dataIndex: 'available_Stock',
            key: 'available_Stock',
        },
        {
            title: 'Total Livestock',
            dataIndex: 'total_livestock',
            key: 'total_livestock',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEditFarmer(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDeleteFarmer(record.farm_ID)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                {activeTab === 'vendors' ? (
                    <Button type="primary" onClick={() => setIsVendorModalVisible(true)}>
                        Add New Vendor
                    </Button>
                ) : (
                    <Button type="primary" onClick={() => {
                        setFormMode('create');
                        setIsFarmerModalVisible(true);
                    }}>
                        Add New Farmer
                    </Button>
                )}
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Vendors" key="vendors">
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Table
                            dataSource={vendors}
                            columns={vendorColumns}
                            rowKey="vendor_ID"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    )}
                </TabPane>
                <TabPane tab="Farmers" key="farmers">
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Table
                            dataSource={farmers}
                            columns={farmerColumns}
                            rowKey="farm_ID"
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: true }}
                        />
                    )}
                </TabPane>
            </Tabs>

            {/* Create Vendor Modal */}
            <Modal
                title={formMode === 'create' ? 'Create New Vendor' : 'Edit Vendor'}
                visible={isVendorModalVisible}
                onOk={formMode === 'create' ? handleCreateVendor : handleUpdateVendor}
                onCancel={() => {
                    setIsVendorModalVisible(false);
                    vendorForm.resetFields();
                    setCurrentVendor(null);
                }}
                confirmLoading={loading}
                width={700}
            >
                <Form form={vendorForm} layout="vertical">
                    <Form.Item
                        name="vendor_Name"
                        label="Vendor Name"
                        rules={[
                            { required: true, message: 'Please input the vendor name!' },
                            { max: 100, message: 'Vendor name must be less than 100 characters' }
                        ]}
                    >
                        <Input placeholder="Enter vendor name" />
                    </Form.Item>
