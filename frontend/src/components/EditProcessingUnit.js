import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message, Spin,Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import moment from 'moment';

const EditProcessingUnit = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/processing-unit/${id}`);
                const data = await response.json();
                
                if (response.ok) {
                    form.setFieldsValue({
                        facility_Name: data.facility_Name,
                        processing_Capacity: data.processing_Capacity,
                        processing_Date: moment(data.processing_Date)
                    });
                } else {
                    message.error(data.message || 'Failed to fetch processing unit');
                    navigate('/processing-units/dashboard');
                }
            } catch (error) {
                message.error('Failed to fetch processing unit');
                console.error('Fetch error:', error);
                navigate('/processing-units/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchUnit();
    }, [id, form, navigate]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            const response = await fetch(`http://localhost:5000/api/processing-unit/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    facility_Name: values.facility_Name,
                    processing_Capacity: values.processing_Capacity,
                    processing_Date: values.processing_Date.format('YYYY-MM-DD')
                })
            });

            const result = await response.json();

            if (response.ok) {
                message.success(result.message || 'Processing unit updated successfully');
                navigate('/processing-units/dashboard');
            } else {
                if (response.status === 404) {
                    message.error('Processing unit not found');
                    navigate('/processing-units/dashboard');
                } else {
                    message.error(result.message || 'Failed to update processing unit');
                }
            }
        } catch (error) {
            message.error('Failed to update processing unit');
            console.error('Update error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                    <Spin size="large" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
                <h2 style={{ marginBottom: '24px' }}>Edit Processing Unit</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="facility_Name"
                        label="Facility Name"
                        rules={[
                            { required: true, message: 'Please input the facility name!' },
                            { max: 100, message: 'Facility name cannot exceed 100 characters' }
                        ]}
                    >
                        <Input placeholder="Enter facility name" />
                    </Form.Item>

                    <Form.Item
                        name="processing_Capacity"
                        label="Processing Capacity (kg)"
                        rules={[
                            { required: true, message: 'Please input the processing capacity!' },
                            { type: 'number', min: 0, message: 'Capacity must be a positive number' }
                        ]}
                    >
                        <InputNumber 
                            min={0}
                            step={0.1}
                            style={{ width: '100%' }} 
                            placeholder="Enter capacity in kg" 
                        />
                    </Form.Item>

                    <Form.Item
                        name="processing_Date"
                        label="Processing Date"
                        rules={[{ required: true, message: 'Please select the processing date!' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            disabledDate={(current) => current && current > moment().endOf('day')}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={submitting}
                                disabled={submitting}
                            >
                                Update
                            </Button>
                            <Button 
                                onClick={() => navigate('/processing-units/dashboard')}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </Layout>
    );
};

export default EditProcessingUnit;