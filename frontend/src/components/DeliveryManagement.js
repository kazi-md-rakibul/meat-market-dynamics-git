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
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as LocalShippingIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'delivery_ID',
    direction: 'desc'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    deliveryId: null
  });
  const [formData, setFormData] = useState({
    delivery_Type: '',
    date: '',
    delivery_Status: '',
    order_ID: '',
    vendor_ID: '',
    batch_ID: '',
    warehouse_ID: '',
  });

  useEffect(() => {
    const initializeData = async () => {
      setTableLoading(true);
      try {
        await Promise.all([
          fetchDeliveries(),
          fetchOrders(),
          fetchVendors(),
          fetchBatches(),
          fetchWarehouses()
        ]);
      } catch (error) {
        console.error('Error initializing data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load data. Please refresh the page.',
          severity: 'error'
        });
      } finally {
        setTableLoading(false);
      }
    };
    
    initializeData();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setTableLoading(true);
      const response = await axios.get('http://localhost:5000/api/deliveries');
      if (response.data && Array.isArray(response.data)) {
        setDeliveries(response.data);
      } else {
        console.error('Invalid delivery data format:', response.data);
        setDeliveries([]);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch deliveries. Please try again.',
        severity: 'error'
      });
      setDeliveries([]);
    } finally {
      setTableLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        console.error('Invalid order data format:', response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/directory/vendors');
      if (response.data && Array.isArray(response.data)) {
        setVendors(response.data);
      } else {
        console.error('Invalid vendor data format:', response.data);
        setVendors([]);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/batches');
      if (response.data && Array.isArray(response.data)) {
        setBatches(response.data);
      } else {
        console.error('Invalid batch data format:', response.data);
        setBatches([]);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-warehouse');
      if (response.data && Array.isArray(response.data)) {
        setWarehouses(response.data);
      } else {
        console.error('Invalid warehouse data format:', response.data);
        setWarehouses([]);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setWarehouses([]);
    }
  };

  const handleOpen = (delivery = null) => {
    setFormErrors({});
    if (delivery) {
      setSelectedDelivery(delivery);
      setFormData({
        delivery_Type: delivery.delivery_Type || '',
        date: delivery.date ? delivery.date.split('T')[0] : '',
        delivery_Status: delivery.delivery_Status || '',
        order_ID: delivery.order_ID || '',
        vendor_ID: delivery.vendor_ID || '',
        batch_ID: delivery.batch_ID || '',
        warehouse_ID: delivery.warehouse_ID || '',
      });
    } else {
      setSelectedDelivery(null);
      setFormData({
        delivery_Type: '',
        date: new Date().toISOString().split('T')[0],
        delivery_Status: 'pending',
        order_ID: '',
        vendor_ID: '',
        batch_ID: '',
        warehouse_ID: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDelivery(null);
    setFormErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user changes it
    if (formErrors[e.target.name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[e.target.name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate delivery type
    if (!formData.delivery_Type) {
      errors.delivery_Type = 'Delivery type is required';
    }
    
    // Validate date
    if (!formData.date) {
      errors.date = 'Delivery date is required';
    }
    
    // Validate status
    if (!formData.delivery_Status) {
      errors.delivery_Status = 'Status is required';
    }
    
    // Validate batch
    if (!formData.batch_ID) {
      errors.batch_ID = 'Batch is required';
    }
    
    // Validate warehouse
    if (!formData.warehouse_ID) {
      errors.warehouse_ID = 'Warehouse is required';
    }
    
    // Set form errors and return validation result
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      let response;
      if (selectedDelivery) {
        response = await axios.put(
          `http://localhost:5000/api/deliveries/${selectedDelivery.delivery_ID}`,
          formData
        );
        console.log('Update response:', response.data);
      } else {
        response = await axios.post('http://localhost:5000/api/deliveries', formData);
        console.log('Create response:', response.data);
      }
      
      await fetchDeliveries();
      handleClose();
      setSnackbar({
        open: true,
        message: `Delivery ${selectedDelivery ? 'updated' : 'created'} successfully!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving delivery:', error);
      let errorMessage = 'Failed to save delivery. Please try again.';
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
      deliveryId: id
    });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete({
      open: false,
      deliveryId: null
    });
  };

  const handleDelete = async () => {
    if (!confirmDelete.deliveryId) return;
    
    setTableLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/deliveries/${confirmDelete.deliveryId}`);
      await fetchDeliveries();
      setSnackbar({
        open: true,
        message: 'Delivery deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting delivery:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete delivery. Please try again.',
        severity: 'error'
      });
    } finally {
      setTableLoading(false);
      handleDeleteCancel();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'transit':
        return 'warning';
      case 'delivered':
        return 'success';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  // Sort function for table data
  const sortedDeliveries = React.useMemo(() => {
    let sortableDeliveries = [...deliveries];
    if (sortConfig.key) {
      sortableDeliveries.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDeliveries;
  }, [deliveries, sortConfig]);

  // Filter function for search
  const filteredDeliveries = React.useMemo(() => {
    if (!searchTerm) return sortedDeliveries;
    
    return sortedDeliveries.filter(delivery => {
      const vendorName = vendors.find(v => v.vendor_ID === delivery.vendor_ID)?.vendor_Name || '';
      const warehouseAddress = warehouses.find(w => w.warehouse_ID === delivery.warehouse_ID)?.address || '';
      const deliveryDate = new Date(delivery.date).toLocaleDateString();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        delivery.delivery_ID?.toString().includes(searchLower) ||
        delivery.delivery_Type?.toLowerCase().includes(searchLower) ||
        deliveryDate.toLowerCase().includes(searchLower) ||
        delivery.delivery_Status?.toLowerCase().includes(searchLower) ||
        delivery.order_ID?.toString().includes(searchLower) ||
        vendorName.toLowerCase().includes(searchLower) ||
        delivery.batch_ID?.toString().includes(searchLower) ||
        warehouseAddress.toLowerCase().includes(searchLower)
      );
    });
  }, [sortedDeliveries, searchTerm, vendors, warehouses]);

  // Handle column sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" component="h2">
          <LocalShippingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Delivery Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddIcon />}
          >
            Add New Delivery
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                onClick={() => requestSort('delivery_ID')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                ID
                {sortConfig.key === 'delivery_ID' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </TableCell>
              <TableCell 
                onClick={() => requestSort('delivery_Type')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Type
                {sortConfig.key === 'delivery_Type' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </TableCell>
              <TableCell 
                onClick={() => requestSort('date')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Date
                {sortConfig.key === 'date' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </TableCell>
              <TableCell 
                onClick={() => requestSort('delivery_Status')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Status
                {sortConfig.key === 'delivery_Status' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </TableCell>
              <TableCell 
                onClick={() => requestSort('order_ID')}
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                Order ID
                {sortConfig.key === 'order_ID' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 1 }}>Loading deliveries...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredDeliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1">No deliveries found</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {searchTerm ? 'Try a different search term' : 'Create a new delivery to get started'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredDeliveries.map((delivery) => (
                <TableRow key={delivery.delivery_ID} hover>
                  <TableCell>{delivery.delivery_ID}</TableCell>
                  <TableCell>{delivery.delivery_Type}</TableCell>
                  <TableCell>
                    {delivery.date ? new Date(delivery.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={delivery.delivery_Status || 'Unknown'}
                      color={getStatusColor(delivery.delivery_Status)}
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell>{delivery.order_ID || 'N/A'}</TableCell>
                  <TableCell>
                    {vendors.find(v => v.vendor_ID === delivery.vendor_ID)?.vendor_Name || 'N/A'}
                  </TableCell>
                  <TableCell>{delivery.batch_ID || 'N/A'}</TableCell>
                  <TableCell>
                    {warehouses.find(w => w.warehouse_ID === delivery.warehouse_ID)?.address || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(delivery)}
                        size="small"
                        title="Edit Delivery"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteConfirm(delivery.delivery_ID)}
                        size="small"
                        title="Delete Delivery"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ pb: 1, fontSize: 24, fontWeight: 500 }}>
          {selectedDelivery ? 'Edit Delivery' : 'Add New Delivery'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 4, pb: 5 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Please fill in the delivery information below
            </Typography>
          </Box>
          
          <Box sx={{ display: 'grid', gap: 4 }}>
            {/* First Section - Basic Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 500 }}>
                Basic Information
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="delivery-type" sx={{ fontWeight: 500 }}>
                      Delivery Type *
                    </Typography>
                  </Box>
                  <FormControl 
                    fullWidth 
                    error={!!formErrors.delivery_Type} 
                    variant="outlined"
                  >
                    <Select
                      id="delivery-type"
                      name="delivery_Type"
                      value={formData.delivery_Type}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: 56, fontSize: '1rem' }}
                    >
                      <MenuItem disabled value="">
                        <em>Select delivery type</em>
                      </MenuItem>
                      <MenuItem value="Standard">Standard</MenuItem>
                      <MenuItem value="Express">Express</MenuItem>
                      <MenuItem value="Bulk">Bulk</MenuItem>
                    </Select>
                    {formErrors.delivery_Type && (
                      <FormHelperText error>{formErrors.delivery_Type}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="delivery-date" sx={{ fontWeight: 500 }}>
                      Delivery Date *
                    </Typography>
                  </Box>
                  <TextField
                    id="delivery-date"
                    fullWidth
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      sx: { height: 56 }
                    }}
                    error={!!formErrors.date}
                    helperText={formErrors.date}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="delivery-status" sx={{ fontWeight: 500 }}>
                      Status *
                    </Typography>
                  </Box>
                  <FormControl 
                    fullWidth 
                    error={!!formErrors.delivery_Status} 
                    variant="outlined"
                  >
                    <Select
                      id="delivery-status"
                      name="delivery_Status"
                      value={formData.delivery_Status}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: 56, fontSize: '1rem' }}
                    >
                      <MenuItem disabled value="">
                        <em>Select status</em>
                      </MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="transit">In Transit</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                    {formErrors.delivery_Status && (
                      <FormHelperText error>{formErrors.delivery_Status}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="order-select" sx={{ fontWeight: 500 }}>
                      Order
                    </Typography>
                  </Box>
                  <FormControl 
                    fullWidth
                    variant="outlined"
                  >
                    <Select
                      id="order-select"
                      name="order_ID"
                      value={formData.order_ID}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: 56, fontSize: '1rem' }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {orders.map((order) => (
                        <MenuItem key={order.order_ID} value={order.order_ID}>
                          Order #{order.order_ID} - ${parseFloat(order.total_price).toFixed(2)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Second Section - Location & Source */}
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 500 }}>
                Location & Source Information
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="vendor-select" sx={{ fontWeight: 500 }}>
                      Vendor
                    </Typography>
                  </Box>
                  <FormControl 
                    fullWidth
                    variant="outlined"
                  >
                    <Select
                      id="vendor-select"
                      name="vendor_ID"
                      value={formData.vendor_ID}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: 56, fontSize: '1rem' }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor.vendor_ID} value={vendor.vendor_ID}>
                          {vendor.vendor_Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="batch-select" sx={{ fontWeight: 500 }}>
                      Batch *
                    </Typography>
                  </Box>
                  <FormControl 
                    fullWidth 
                    error={!!formErrors.batch_ID} 
                    variant="outlined"
                  >
                    <Select
                      id="batch-select"
                      name="batch_ID"
                      value={formData.batch_ID}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: 56, fontSize: '1rem' }}
                    >
                      <MenuItem disabled value="">
                        <em>Select batch</em>
                      </MenuItem>
                      {batches.map((batch) => (
                        <MenuItem key={batch.batch_ID} value={batch.batch_ID}>
                          Batch #{batch.batch_ID} - {batch.batch_Status}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.batch_ID && (
                      <FormHelperText error>{formErrors.batch_ID}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="warehouse-select" sx={{ fontWeight: 500 }}>
                      Warehouse *
                    </Typography>
                  </Box>
                  <FormControl 
                    fullWidth 
                    error={!!formErrors.warehouse_ID} 
                    variant="outlined"
                  >
                    <Select
                      id="warehouse-select"
                      name="warehouse_ID"
                      value={formData.warehouse_ID}
                      onChange={handleChange}
                      displayEmpty
                      sx={{ height: 56, fontSize: '1rem' }}
                    >
                      <MenuItem disabled value="">
                        <em>Select warehouse</em>
                      </MenuItem>
                      {warehouses.map((warehouse) => (
                        <MenuItem key={warehouse.warehouse_ID} value={warehouse.warehouse_ID}>
                          {warehouse.address}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.warehouse_ID && (
                      <FormHelperText error>{formErrors.warehouse_ID}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
            sx={{ px: 3 }}
          >
            {loading ? 'Saving...' : selectedDelivery ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this delivery? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeliveryManagement;
