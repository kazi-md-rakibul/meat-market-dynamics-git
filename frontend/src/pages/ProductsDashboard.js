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

  

};