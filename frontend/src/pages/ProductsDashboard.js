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

  

};