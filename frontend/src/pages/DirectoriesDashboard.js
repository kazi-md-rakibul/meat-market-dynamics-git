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