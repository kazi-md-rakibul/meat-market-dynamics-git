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
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Add as AddIcon
} from '@mui/icons-material';

const ConsumerManagement = () => {
  const [consumers, setConsumers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    consumer_name: '',
    preferred_Meat_Type: '',
    preferred_Cut: '',
    average_Order_Size: '',
    average_Spending: ''
  });

  // Meat type options
  const meatTypes = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Turkey', 'Veal'];
  
  // Cut type options
  const cutTypes = ['Steak', 'Ground', 'Ribs', 'Chops', 'Roast', 'Breast', 'Thigh', 'Wings', 'Whole'];

  useEffect(() => {
    fetchConsumers();
  }, []);

  const fetchConsumers = async () => {
    try {
      console.log('Fetching consumers from direct API endpoint...');
      const response = await axios.get('http://localhost:5000/api/consumers-direct');
      
      console.log('API response status:', response.status);
      console.log('API response headers:', response.headers);
      console.log('Fetched consumers data:', response.data);
      
      if (Array.isArray(response.data)) {
        console.log(`Successfully fetched ${response.data.length} consumers`);
        setConsumers(response.data);
      } else {
        console.error('API returned non-array data:', response.data);
        setConsumers([]);
        setSnackbar({
          open: true,
          message: 'Invalid data format received from server',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching consumers:', error);
      let errorMessage = 'Failed to fetch consumers';
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        console.error('No response received from server');
        errorMessage = 'No response received from server';
      } else {
        console.error('Error setting up request:', error.message);
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      
      // Set empty array to prevent UI errors
      setConsumers([]);
    }
  };

  const handleOpen = (consumer = null) => {
    if (consumer) {
      setSelectedConsumer(consumer);
      setFormData({
        consumer_name: consumer.consumer_name || `Consumer ${consumer.consumer_ID}`,
        preferred_Meat_Type: consumer.preferred_Meat_Type,
        preferred_Cut: consumer.preferred_Cut,
        average_Order_Size: consumer.average_Order_Size,
        average_Spending: consumer.average_Spending
      });
    } else {
      setSelectedConsumer(null);
      setFormData({
        consumer_name: '',
        preferred_Meat_Type: '',
        preferred_Cut: '',
        average_Order_Size: '',
        average_Spending: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.consumer_name) errors.consumer_name = 'Consumer name is required';
    if (!formData.preferred_Meat_Type) errors.preferred_Meat_Type = 'Meat type is required';
    if (!formData.preferred_Cut) errors.preferred_Cut = 'Cut type is required';
    if (!formData.average_Order_Size) errors.average_Order_Size = 'Average order size is required';
    if (!formData.average_Spending) errors.average_Spending = 'Average spending is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Format the data to ensure proper types
      const consumerData = {
        consumer_name: formData.consumer_name.trim(),
        preferred_Meat_Type: formData.preferred_Meat_Type.trim(),
        preferred_Cut: formData.preferred_Cut.trim(),
        average_Order_Size: parseFloat(formData.average_Order_Size),
        average_Spending: parseFloat(formData.average_Spending)
      };
      
      // Additional validation
      if (isNaN(consumerData.average_Order_Size) || consumerData.average_Order_Size <= 0) {
        throw new Error('Average order size must be a positive number');
      }
      
      if (isNaN(consumerData.average_Spending) || consumerData.average_Spending <= 0) {
        throw new Error('Average spending must be a positive number');
      }
      
      console.log('Submitting consumer data:', JSON.stringify(consumerData));
      
      let response;
      
      if (selectedConsumer) {
        // Update existing consumer
        console.log(`Updating consumer with ID: ${selectedConsumer.consumer_ID}`);
        response = await axios.put(
          `http://localhost:5000/api/consumers-direct/${selectedConsumer.consumer_ID}`, 
          consumerData
        );
        console.log('Update response:', response.data);
        
        setSnackbar({
          open: true,
          message: 'Consumer updated successfully',
          severity: 'success'
        });
      } else {
        // Create new consumer
        console.log('Creating new consumer with data:', JSON.stringify(consumerData));
        response = await axios.post('http://localhost:5000/api/consumers-direct', consumerData);
        console.log('Create response:', response.data);
        
        setSnackbar({
          open: true,
          message: 'Consumer created successfully',
          severity: 'success'
        });
      }
      
      handleClose();
      
      // Wait a moment before fetching updated data
      setTimeout(() => {
        fetchConsumers();
      }, 500);
    } catch (error) {
      console.error('Error saving consumer:', error);
      let errorMessage = 'Failed to save consumer';
      
      if (error.message && !error.response) {
        // Client-side validation error
        errorMessage = error.message;
      } else if (error.response) {
        console.error('Server error response:', error.response.data);
        errorMessage = error.response.data.message || errorMessage;
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consumer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/consumers-direct/${id}`);
        setSnackbar({
          open: true,
          message: 'Consumer deleted successfully',
          severity: 'success'
        });
        fetchConsumers();
      } catch (error) {
        console.error('Error deleting consumer:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete consumer. It may be referenced by orders.',
          severity: 'error'
        });
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Consumer Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Consumer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Preferred Meat Type</TableCell>
              <TableCell>Preferred Cut</TableCell>
              <TableCell>Average Order Size (kg)</TableCell>
              <TableCell>Average Spending ($)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumers.map((consumer) => (
              <TableRow key={consumer.consumer_ID}>
                <TableCell>{consumer.consumer_ID}</TableCell>
                <TableCell>{consumer.consumer_name}</TableCell>
                <TableCell>{consumer.preferred_Meat_Type}</TableCell>
                <TableCell>{consumer.preferred_Cut}</TableCell>
                <TableCell>{Number(consumer.average_Order_Size).toFixed(2)}</TableCell>
                <TableCell>${Number(consumer.average_Spending).toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(consumer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(consumer.consumer_ID)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {consumers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No consumers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedConsumer ? 'Edit Consumer' : 'Add New Consumer'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="consumer_name"
              label="Consumer Name"
              value={formData.consumer_name}
              onChange={handleChange}
              error={!!formErrors.consumer_name}
              helperText={formErrors.consumer_name}
            />
            <FormControl fullWidth error={!!formErrors.preferred_Meat_Type}>
              <InputLabel>Preferred Meat Type</InputLabel>
              <Select
                name="preferred_Meat_Type"
                value={formData.preferred_Meat_Type}
                onChange={handleChange}
                label="Preferred Meat Type"
              >
                {meatTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.preferred_Meat_Type && (
                <Typography color="error" variant="caption">
                  {formErrors.preferred_Meat_Type}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.preferred_Cut}>
              <InputLabel>Preferred Cut</InputLabel>
              <Select
                name="preferred_Cut"
                value={formData.preferred_Cut}
                onChange={handleChange}
                label="Preferred Cut"
              >
                {cutTypes.map((cut) => (
                  <MenuItem key={cut} value={cut}>
                    {cut}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.preferred_Cut && (
                <Typography color="error" variant="caption">
                  {formErrors.preferred_Cut}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              name="average_Order_Size"
              label="Average Order Size (kg)"
              type="number"
              value={formData.average_Order_Size}
              onChange={handleChange}
              error={!!formErrors.average_Order_Size}
              helperText={formErrors.average_Order_Size}
              inputProps={{ step: "0.01" }}
            />

            <TextField
              fullWidth
              name="average_Spending"
              label="Average Spending ($)"
              type="number"
              value={formData.average_Spending}
              onChange={handleChange}
              error={!!formErrors.average_Spending}
              helperText={formErrors.average_Spending}
              inputProps={{ step: "0.01" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : selectedConsumer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ConsumerManagement;
