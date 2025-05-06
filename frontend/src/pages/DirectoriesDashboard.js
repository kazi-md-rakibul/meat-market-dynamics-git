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
