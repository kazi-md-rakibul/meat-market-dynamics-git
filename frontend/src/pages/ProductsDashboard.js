import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  message, 
  Tag, 
  Grid,
  Popconfirm,
  Space,
  Card,
  Typography
} from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { useBreakpoint } = Grid;
const { Title } = Typography;

// Add custom CSS for table styling
const tableCSS = `
  .product-table .ant-table-thead > tr > th {
    background-color: #f1f5f9;
    color: #334155;
    font-weight: 600;
  }
  .product-table .ant-table-row:hover > td {
    background-color: #eff6ff !important;
  }
  .product-table .ant-table-row:nth-child(even) {
    background-color: #f8fafc;
  }
`;

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchesId, setBatchesId] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const screens = useBreakpoint();
  
  // Search functionality
  const [searchText, setSearchText] = useState('');
  const [searchCategory, setSearchCategory] = useState('product_name');

// Define base columns (shown on all screens)
    const baseColumns = [
        {
          title: 'ID',
          dataIndex: 'product_ID',
          key: 'product_ID',
          width: 80,
          fixed: screens.md ? 'left' : false,
          render: (id) => (
            <span style={{ fontWeight: 600, color: '#4f46e5' }}>{id}</span>
          ),
        },
        {
          title: 'Product',
          dataIndex: 'product_name',
          key: 'product_name',
          width: 150,
          render: (name, record) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: getMeatTypeColor(record.meat_Type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px'
              }}>
                {name.charAt(0)}
              </div>
              <span style={{ fontWeight: 500 }}>{name}</span>
            </div>
          ),
        },
        {
            title: 'Type',
            dataIndex: 'meat_Type',
            key: 'meat_Type',
            width: 100,
            filters: [
              { text: 'Beef', value: 'Beef' },
              { text: 'Pork', value: 'Pork' },
              { text: 'Chicken', value: 'Chicken' },
              { text: 'Lamb', value: 'Lamb' },
              { text: 'Turkey', value: 'Turkey' },
            ],
            onFilter: (value, record) => record.meat_Type === value,
          },
          {
            title: 'Price',
            dataIndex: 'price_Per_Unit',
            key: 'price_Per_Unit',
            width: 100,
            render: (price) => {
              const priceNum = typeof price === 'string' ? parseFloat(price) : price;
              return (
                <span style={{ 
                  fontWeight: 600, 
                  color: '#047857',
                  backgroundColor: '#ecfdf5',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}>
                  ${!isNaN(priceNum) ? priceNum.toFixed(2) : '0.00'}
                </span>
              );
            },
            sorter: (a, b) => {
              const priceA = typeof a.price_Per_Unit === 'string' ? parseFloat(a.price_Per_Unit) : a.price_Per_Unit;
              const priceB = typeof b.price_Per_Unit === 'string' ? parseFloat(b.price_Per_Unit) : b.price_Per_Unit;
              return (priceA || 0) - (priceB || 0);
            },
          },
          {
            title: 'Stock',
            dataIndex: 'stock_Availability',
            key: 'stock_Availability',
            width: 80,
            sorter: (a, b) => a.stock_Availability - b.stock_Availability,
            render: (stock) => {
              let color = '#000';
              let bgColor = '#f5f5f5';
              
              if (stock <= 5) {
                color = '#b91c1c';
                bgColor = '#fee2e2';
              } else if (stock <= 20) {
                color = '#ca8a04';
                bgColor = '#fef9c3';
              } else {
                color = '#15803d';
                bgColor = '#dcfce7';
              }
              
              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: color
                  }} />
                  <span style={{ 
                    color: color,
                    fontWeight: 600
                  }}>
                    {stock}
                  </span>
                </div>
              );
            },
          },
          {
            title: 'Status',
            dataIndex: 'batch_Status',
            key: 'batch_Status',
            width: 100,
            render: (status) => {
              let color = '';
              let bgColor = '';
              let icon = '';
              
              switch (status?.toLowerCase()) {
                case 'transit': 
                  color = '#1d4ed8'; 
                  bgColor = '#dbeafe';
                  icon = '🚚';
                  break;
                case 'stored': 
                  color = '#15803d'; 
                  bgColor = '#dcfce7';
                  icon = '📦';
                  break;
                case 'sold': 
                  color = '#b91c1c'; 
                  bgColor = '#fee2e2';
                  icon = '💰';
                  break;
                default: 
                  color = '#525252'; 
                  bgColor = '#f5f5f5';
                  icon = '❓';
              }
              
              return (
                <Tag 
                  style={{
                    color: color,
                    backgroundColor: bgColor,
                    border: `1px solid ${color}20`,
                    borderRadius: '4px',
                    padding: '0 8px',
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                >
                  <span style={{ marginRight: '4px' }}>{icon}</span>
                  {status}
                </Tag>
              );
            },
            filters: [
              { text: 'Transit', value: 'transit' },
              { text: 'Stored', value: 'stored' },
              { text: 'Sold', value: 'sold' },
            ],
            onFilter: (value, record) => record.batch_Status?.toLowerCase() === value,
          }
    ];

// Define expanded columns (shown only on larger screens)
const expandedColumns = [
    {
      title: 'Origin',
      dataIndex: 'origin',
      key: 'origin',
      width: 120,
    },
    {
      title: 'Cut',
      dataIndex: 'cut_Type',
      key: 'cut_Type',
      width: 100,
    },
    {
      title: 'Process Date',
      dataIndex: 'processing_Date',
      key: 'processing_Date',
      width: 120,
      render: (date) => moment(date).isValid() ? moment(date).format('MM/DD/YY') : 'N/A',
    },
    {
      title: 'Expiry',
      dataIndex: 'expiration_Date',
      key: 'expiration_Date',
      width: 120,
      render: (date) => moment(date).isValid() ? moment(date).format('MM/DD/YY') : 'N/A',
    },
    {
      title: 'Weight',
      dataIndex: 'weight_Per_Unit',
      key: 'weight_Per_Unit',
      width: 100,
      render: (weight) => `${weight} kg`,
    },
    {
      title: 'Batch',
      dataIndex: 'batch_ID',
      key: 'batch_ID',
      width: 80,
    },
    {
      title: 'Facility',
      dataIndex: 'processing_facility',
      key: 'processing_facility',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse_location',
      key: 'warehouse_location',
      width: 150,
      ellipsis: true,
    }
  ];
// Action column
const actionColumn = {
    title: 'Actions',
    key: 'actions',
    width: screens.xs ? 120 : 150,
    fixed: screens.md ? 'right' : false,
    render: (_, record) => (
      <Space size="small">
        <Button 
          type="primary" 
          size="small" 
          onClick={() => handleEdit(record)}
          style={{
            backgroundColor: '#4f46e5',
            borderColor: '#4f46e5',
            borderRadius: '4px',
            fontWeight: 500
          }}
          icon={<span role="img" aria-label="edit">✏️</span>}
        >
          Edit
        </Button>
        <Popconfirm
          title="Are you sure to delete this product?"
          onConfirm={() => handleDelete(record.product_ID)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="primary" 
            danger 
            size="small"
            style={{
              borderRadius: '4px',
              fontWeight: 500
            }}
            icon={<span role="img" aria-label="delete">🗑️</span>}
          >
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  };
  // Combine columns based on screen size
  const columns = screens.md 
    ? [...baseColumns, ...expandedColumns, actionColumn] 
    : [...baseColumns, actionColumn];

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/production/batches');
      const batchIdsOnly = response.data.map(batch => batch.batch_ID);
      setBatchesId(batchIdsOnly);
    } catch (error) {
      console.error('Error fetching batches:', error);
      message.error('Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setEditingProduct(null);
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const productData = {
        ...values,
        processing_Date: values.processing_Date.format('YYYY-MM-DD'),
        expiration_Date: values.expiration_Date.format('YYYY-MM-DD'),
        batch_ID: values.batch_ID ? Number(values.batch_ID) : null
      };

      const response = await axios.post('http://localhost:5000/api/createProducts', productData);
      message.success(response.data.message || 'Product added successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        'Failed to add product';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    editForm.setFieldsValue({
      ...product,
      processing_Date: moment(product.processing_Date),
      expiration_Date: moment(product.expiration_Date)
    });
    setIsEditModalVisible(true);
  };
  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      const productData = {
        ...values,
        processing_Date: values.processing_Date.format('YYYY-MM-DD'),
        expiration_Date: values.expiration_Date.format('YYYY-MM-DD'),
        batch_ID: values.batch_ID ? Number(values.batch_ID) : null
      };

      await axios.post(`http://localhost:5000/api/edit-product`, {productData,productId:editingProduct.product_ID});
      message.success('Product updated successfully');
      setIsEditModalVisible(false);
      editForm.resetFields();
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.sqlMessage ||
        'Failed to update product';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (productId) => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/delete-product`,{product_ID:productId});
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchBatches();
  }, []);

  // Helper function to get color based on meat type
  const getMeatTypeColor = (meatType) => {
    switch(meatType?.toLowerCase()) {
      case 'beef': return '#dc2626'; // red-600
      case 'pork': return '#ea580c'; // orange-600
      case 'chicken': return '#ca8a04'; // yellow-600
      case 'lamb': return '#65a30d'; // lime-600
      case 'turkey': return '#0891b2'; // cyan-600
      default: return '#6366f1'; // indigo-500
    }
  };
  
  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!searchText) return true;
    
    const searchValue = product[searchCategory];
    if (searchValue === undefined || searchValue === null) return false;
    
    return String(searchValue).toLowerCase().includes(searchText.toLowerCase());
  });


  return (
    <Layout>
      <style>{tableCSS}</style>
      <div style={{
        padding: screens.xs ? '16px' : '24px',
        maxWidth: '100%',
        overflowX: 'auto',
        backgroundColor: '#f8fafc'
      }}>
        <Card 
          style={{ 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '24px'
          }}
        >
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: screens.xs ? 'column' : 'row',
            gap: screens.xs ? '16px' : 0,
            alignItems: screens.xs ? 'flex-start' : 'center',
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '16px'
          }}>
            <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="catalog">📋</span> Product Catalog
            </Title>
            <Button 
              type="primary" 
              onClick={showModal} 
              style={{ 
                width: screens.xs ? '100%' : 'auto',
                height: '38px',
                borderRadius: '6px',
                fontWeight: 500,
                boxShadow: '0 2px 0 rgba(0,0,0,0.02)',
                backgroundColor: '#4f46e5',
                borderColor: '#4f46e5'
              }}
              icon={<span role="img" aria-label="add">➕</span>}
            >
              Add Product
            </Button>
          </div>
          
          <div style={{
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <Input.Group compact style={{ display: 'flex', width: screens.xs ? '100%' : '400px' }}>
              <Select 
                defaultValue="product_name" 
                style={{ width: '40%' }}
                onChange={value => setSearchCategory(value)}
                value={searchCategory}
              >
                <Option value="product_name">Product Name</Option>
                <Option value="meat_Type">Meat Type</Option>
                <Option value="origin">Origin</Option>
                <Option value="batch_Status">Status</Option>
              </Select>
              <Input.Search 
                placeholder="Search products..." 
                style={{ width: '60%' }} 
                allowClear
                onSearch={value => setSearchText(value)}
                onChange={e => setSearchText(e.target.value)}
                value={searchText}
              />
            </Input.Group>
          </div>

          <Table
            className="product-table"
            columns={columns}
            dataSource={filteredProducts}
            rowKey="product_ID"
            loading={loading}
            scroll={{ x: true }}
            size={screens.xs ? 'small' : 'middle'}
            pagination={{
              pageSize: screens.xs ? 5 : 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} products`,
              responsive: true,
              style: { marginTop: '16px' }
            }}
            onRow={(record) => ({
              style: {
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              },
              onClick: () => handleEdit(record),
            })}
          />
        </Card>
  {/* Add Product Modal */}
        <Modal
          title="Add New Product"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={screens.xs ? '90%' : '60%'}
          bodyStyle={{
            height: screens.xs ? '60vh' : '70vh',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
            <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="product_name"
              label="Product Name"
              rules={[{ required: true, message: 'Please input the product name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="meat_Type"
              label="Meat Type"
              rules={[{ required: true, message: 'Please select the meat type!' }]}
            >
              <Select>
                <Option value="Beef">Beef</Option>
                <Option value="Pork">Pork</Option>
                <Option value="Chicken">Chicken</Option>
                <Option value="Lamb">Lamb</Option>
                <Option value="Turkey">Turkey</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="origin"
              label="Origin"
              rules={[{ required: true, message: 'Please input the origin!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="cut_Type"
              label="Cut Type"
              rules={[{ required: true, message: 'Please input the cut type!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="seasonality"
              label="Seasonality"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="processing_Date"
              label="Processing Date"
              rules={[{ required: true, message: 'Please select the processing date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="expiration_Date"
              label="Expiration Date"
              rules={[{ required: true, message: 'Please select the expiration date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="weight_Per_Unit"
              label="Weight Per Unit (kg)"
              rules={[{ required: true, message: 'Please input the weight!' }]}
            >
              <Input type="number" step="0.01" />
            </Form.Item>

            <Form.Item
              name="price_Per_Unit"
              label="Price Per Unit ($)"
              rules={[{ required: true, message: 'Please input the price!' }]}
            >
              <Input type="number" step="0.01" />
            </Form.Item>

            <Form.Item
              name="stock_Availability"
              label="Stock Availability"
              rules={[{ required: true, message: 'Please input the stock quantity!' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="batch_ID"
              label="Batch ID"
              rules={[{ required: true, message: 'Please select a batch!' }]}
            >
              <Select placeholder="Select a batch">
                {batchesId.map(id => (
                  <Option key={id} value={id}>
                    {`Batch ${id}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading} 
                block={screens.xs}
                style={{ marginTop: '16px' }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        </div>
        </Layout>
  );
};