import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, message, Spin, Card, Row, Col, Typography } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Layout from './Layout';

const { Title } = Typography;

const ProcessingUnitForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            const fetchUnit = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`http://localhost:5000/api/processing-unit/${id}`);
                    const data = await response.json();

                    if (response.ok) {
                        form.setFieldsValue({
                            ...data,
                            processing_Date: moment(data.processing_Date)
                        });
                    } else {
                        message.error(data.message);
                        navigate('/processing-units/dashboard');
                    }
                } catch (error) {
                    message.error('Failed to fetch processing unit');
                    navigate('/processing-units/dashboard');
                } finally {
                    setLoading(false);
                }
            };

            fetchUnit();
        }
    }, [id, form, isEditMode, navigate]);

    const onFinish = async (values) => {
        console.log('Form values:', values);
        console.log('Is edit mode:', isEditMode);
        console.log('Unit ID:', id);
        setLoading(true);
        try {
            const url = isEditMode
                ? `http://localhost:5000/api/update-processing-unit/${id}`
                : 'http://localhost:5000/api/create-processing-unit';

            console.log('Making request to:', url);
            const formData = {
                ...values,
                processing_Date: values.processing_Date.format('YYYY-MM-DD')
            };
            console.log('Request data:', formData);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);

            if (response.ok) {
                message.success(
                    isEditMode
                        ? 'Processing unit updated successfully'
                        : 'Processing unit created successfully'
                );
                navigate('/processing-units/dashboard');
            } else {
                throw new Error(result.message || 'Failed to process request');
            }
        } catch (error) {
            message.error(
                isEditMode
                    ? 'Failed to update processing unit'
                    : 'Failed to create processing unit'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Spin spinning={loading}>
                <Row justify="center" style={{ marginTop: 20 }}>
                    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                        <Card 
                            bordered={false}
                            style={{ 
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                padding: '24px'
                            }}
                        >
                            <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                                {isEditMode ? 'Edit Processing Unit' : 'Create New Processing Unit'}
                            </Title>
                            
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    name="facility_Name"
                                    label="Facility Name"
                                    rules={[
                                        { required: true, message: 'Please input facility name' },
                                        { max: 100, message: 'Facility name must be less than 100 characters' }
                                    ]}
                                >
                                    <Input 
                                        size="large" 
                                        placeholder="Enter facility name" 
                                        style={{ borderRadius: 4 }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="processing_Capacity"
                                    label="Processing Capacity (kg)"
                                    rules={[
                                        { required: true, message: 'Please input processing capacity' },
                                        { type: 'number', transform: Number, min: 1, message: 'Capacity must be a positive number' }
                                    ]}
                                >
                                    <Input 
                                        type="number" 
                                        size="large" 
                                        placeholder="Enter amount in kilograms" 
                                        style={{ borderRadius: 4 }}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="processing_Date"
                                    label="Processing Date"
                                    rules={[
                                        { required: true, message: 'Please select processing date' }
                                    ]}
                                >
                                    <DatePicker 
                                        style={{ width: '100%' }} 
                                        size="large" 
                                        format="YYYY-MM-DD"
                                    />
                                </Form.Item>

                                <Form.Item style={{ marginTop: 32 }}>
                                    <Row gutter={16} justify="end">
                                        <Col>
                                            <Button 
                                                size="large"
                                                onClick={() => navigate('/processing-units/dashboard')}
                                                style={{ width: 120 }}
                                            >
                                                Cancel
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit" 
                                                loading={loading}
                                                size="large"
                                                style={{ width: 120 }}
                                            >
                                                {isEditMode ? 'Update' : 'Create'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </Layout>
    );
};

export default ProcessingUnitForm;