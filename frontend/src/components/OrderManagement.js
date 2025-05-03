import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Tooltip,
  TablePagination,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  LocalShipping as ShippingIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [consumers, setConsumers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [formData, setFormData] = useState({
    order_date: new Date().toISOString().split('T')[0],
    consumer_ID: '',
    delivery_ID: null,
  });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    orderId: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'order_ID',
    direction: 'desc'
  });

   // New state variables for enhanced features
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [exporting, setExporting] = useState(false);
   const [statusFilter, setStatusFilter] = useState('all');
   const [refreshing, setRefreshing] = useState(false);
 
   useEffect(() => {
     initializeData();
   }, []);
 
   const initializeData = async () => {
     try {
       setTableLoading(true);
       await Promise.all([
         fetchOrders(),
         fetchConsumers(),
         fetchProducts()
       ]);
     } catch (error) {
       console.error('Error initializing data:', error);
       setSnackbar({
         open: true,
         message: 'Failed to load initial data. Please refresh the page.',
         severity: 'error'
       });
     } finally {
       setTableLoading(false);
     }
   };
 
   const fetchOrders = async () => {
     try {
       setRefreshing(true);
       const response = await axios.get('http://localhost:5000/api/orders');
       setOrders(response.data);
     } catch (error) {
       console.error('Error fetching orders:', error);
       setSnackbar({
         open: true,
         message: 'Failed to fetch orders',
         severity: 'error'
       });
       setOrders([]);
     } finally {
       setRefreshing(false);
     }
   };
 
   const fetchConsumers = async () => {
     try {
       const response = await axios.get('http://localhost:5000/api/consumers');
       setConsumers(response.data);
     } catch (error) {
       console.error('Error fetching consumers:', error);
     }
   };
 
   const fetchProducts = async () => {
     try {
       const response = await axios.get('http://localhost:5000/api/products');
       setProducts(response.data);
     } catch (error) {
       console.error('Error fetching products:', error);
     }
   };
 
   const handleOpen = (order = null) => {
     if (order) {
       setSelectedOrder(order);
       setFormData({
         order_date: order.order_date.split('T')[0],
         consumer_ID: order.consumer_ID,
         delivery_ID: order.delivery_ID,
       });
       // Fetch order products
       fetchOrderProducts(order.order_ID);
     } else {
       setSelectedOrder(null);
       setFormData({
         order_date: new Date().toISOString().split('T')[0],
         consumer_ID: '',
         delivery_ID: null,
       });
       setSelectedProducts([]);
     }
     setOpen(true);
   };
 
   const fetchOrderProducts = async (orderId) => {
     try {
       const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/products`);
       setSelectedProducts(response.data);
     } catch (error) {
       console.error('Error fetching order products:', error);
     }
   };
 
   const handleClose = () => {
     setOpen(false);
     setSelectedOrder(null);
     setSelectedProducts([]);
   };
 
   const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value });
   };
 
   const handleProductQuantityChange = (productId, change) => {
     setSelectedProducts(prevProducts => {
       const existing = prevProducts.find(p => p.product_ID === productId);
       if (existing) {
         const newQuantity = existing.quantity + change;
         if (newQuantity <= 0) {
           return prevProducts.filter(p => p.product_ID !== productId);
         }
         return prevProducts.map(p =>
           p.product_ID === productId ? { ...p, quantity: newQuantity } : p
         );
       }
       if (change > 0) {
         const product = products.find(p => p.product_ID === productId);
         return [...prevProducts, { ...product, quantity: 1 }];
       }
       return prevProducts;
     });
   };
 
   const calculateTotal = () => {
     return selectedProducts.reduce((total, product) => 
       total + (product.price_Per_Unit * product.quantity), 0
     );
   };
 
   const validateForm = () => {
     const errors = {};

      // Validate consumer
    if (!formData.consumer_ID) {
        errors.consumer_ID = 'Consumer is required';
      }
      
      // Validate order date
      if (!formData.order_date) {
        errors.order_date = 'Order date is required';
      } else {
        const orderDate = new Date(formData.order_date);
        const today = new Date();
        if (orderDate > today) {
          errors.order_date = 'Order date cannot be in the future';
        }
      }
      
      // Validate products
      if (selectedProducts.length === 0) {
        errors.products = 'At least one product is required';
      }

       // Set form errors and return validation result
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const orderData = {
        ...formData,
        total_price: calculateTotal(),
        quantity: selectedProducts.reduce((sum, p) => sum + p.quantity, 0),
        products: selectedProducts.map(p => ({
          product_ID: p.product_ID,
          quantity: p.quantity
        }))
      };

      console.log('Submitting order data:', orderData);

      let response;
      if (selectedOrder) {
        response = await axios.put(
          `http://localhost:5000/api/orders/${selectedOrder.order_ID}`,
          orderData
        );
        console.log('Update response:', response.data);
      } else {
        response = await axios.post('http://localhost:5000/api/orders', orderData);
        console.log('Create response:', response.data);
      }
      
      await fetchOrders();
      handleClose();
      setSnackbar({
        open: true,
        message: `Order ${selectedOrder ? 'updated' : 'created'} successfully!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      let errorMessage = 'Failed to save order. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = (id) => {
    setConfirmDelete({
      open: true,
      orderId: id
    });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({
      open: false,
      orderId: null
    });
  };

  const handleDelete = async () => {
    if (!confirmDelete.orderId) return;
    
    setTableLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/orders/${confirmDelete.orderId}`);
      await fetchOrders();
      setSnackbar({
        open: true,
        message: 'Order deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete order. Please try again.',
        severity: 'error'
      });
    } finally {
      setTableLoading(false);
      handleDeleteCancel();
    }
  };

  // Sort function for table data
  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...orders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [orders, sortConfig]);

  // Enhanced filter function for search with status filter
  const filteredOrders = React.useMemo(() => {
    let filtered = sortedOrders;

     // Apply search filter
     if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(order => {
          const consumerName = consumers.find(c => c.consumer_ID === order.consumer_ID)?.preferred_Meat_Type || '';
          const orderDate = new Date(order.order_date).toLocaleDateString();
          
          return (
            order.order_ID.toString().includes(searchLower) ||
            orderDate.toLowerCase().includes(searchLower) ||
            consumerName.toLowerCase().includes(searchLower) ||
            order.total_price.toString().includes(searchLower)
          );
        });
      }

      // Apply status filter
    if (statusFilter !== 'all') {
        if (statusFilter === 'pending') {
          filtered = filtered.filter(order => !order.delivery_ID);
        } else if (statusFilter === 'scheduled') {
          filtered = filtered.filter(order => order.delivery_ID);
        }
      }
      
      return filtered;
    }, [sortedOrders, searchTerm, consumers, statusFilter]);
  
    // Get paginated orders
    const paginatedOrders = React.useMemo(() => {
      return filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredOrders, page, rowsPerPage]);
  
    // Handler for column sort
    const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    // Enhanced export function
    const handleExport = async () => {
      try {
        setExporting(true);
        
        // Format data for export
        const ordersToExport = filteredOrders.map(order => ({
          'Order ID': order.order_ID,
          'Date': new Date(order.order_date).toLocaleDateString(),
          'Consumer': consumers.find(c => c.consumer_ID === order.consumer_ID)?.preferred_Meat_Type || 'N/A',
          'Total Price': `$${parseFloat(order.total_price).toFixed(2)}`,
          'Quantity': order.quantity,
          'Status': order.delivery_ID ? 'Scheduled' : 'Pending'
        }));
        
        // Create CSV content
        let csvContent = Object.keys(ordersToExport[0]).join(',') + '\n';
        ordersToExport.forEach(order => {
          csvContent += Object.values(order).map(value => `"${value}"`).join(',') + '\n';
        });
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setSnackbar({
          open: true,
          message: 'Orders exported successfully!',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error exporting orders:', error);
        setSnackbar({
          open: true,
          message: 'Failed to export orders',
          severity: 'error'
        });
      } finally {
        setExporting(false);
      }
    };
  
    // Handler for pagination change
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    // Handler for status filter
    const handleStatusFilterChange = (event) => {
      setStatusFilter(event.target.value);
      setPage(0);
    };
  
    return (
      <Box>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
              Order Management
              <Badge
                badgeContent={orders.length}
                color="primary"
                sx={{ ml: 2 }}
              >
                <Box />
              </Badge>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={fetchOrders}
                startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                disabled={refreshing}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleExport}
                startIcon={exporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
                disabled={exporting || filteredOrders.length === 0}
              >
                Export
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpen()}
                startIcon={<AddIcon />}
              >
                Create New Order
              </Button>
            </Box>
          </Box>
  
      

       