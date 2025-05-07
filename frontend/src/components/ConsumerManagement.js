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
  Alert,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Tooltip,
  TableSortLabel,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'consumer_ID', direction: 'asc' });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    meatType: '',
    cutType: '',
    minOrderSize: '',
    maxOrderSize: '',
    minSpending: '',
    maxSpending: ''
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

  const calculateSummaryStats = () => {
    if (!consumers.length) return {
      totalConsumers: 0,
      avgOrderSize: 0,
      avgSpending: 0,
      totalSpending: 0
    };

    const totalSpending = consumers.reduce((sum, consumer) => sum + parseFloat(consumer.average_Spending), 0);
    const avgOrderSize = consumers.reduce((sum, consumer) => sum + parseFloat(consumer.average_Order_Size), 0) / consumers.length;
    const avgSpending = totalSpending / consumers.length;

    return {
      totalConsumers: consumers.length,
      avgOrderSize: avgOrderSize.toFixed(2),
      avgSpending: avgSpending.toFixed(2),
      totalSpending: totalSpending.toFixed(2)
    };
  };

  const prepareChartData = () => {
    const meatTypeData = {};
    const cutTypeData = {};

    consumers.forEach(consumer => {
      meatTypeData[consumer.preferred_Meat_Type] = (meatTypeData[consumer.preferred_Meat_Type] || 0) + 1;
      cutTypeData[consumer.preferred_Cut] = (cutTypeData[consumer.preferred_Cut] || 0) + 1;
    });

    return {
      meatTypeData: Object.entries(meatTypeData).map(([name, value]) => ({ name, value })),
      cutTypeData: Object.entries(cutTypeData).map(([name, value]) => ({ name, value }))
    };
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilters(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const applyFilters = (data) => {
    return data.filter(consumer => {
      const matchesSearch = consumer.consumer_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMeatType = !filters.meatType || consumer.preferred_Meat_Type === filters.meatType;
      const matchesCutType = !filters.cutType || consumer.preferred_Cut === filters.cutType;
      const matchesOrderSize = (!filters.minOrderSize || parseFloat(consumer.average_Order_Size) >= parseFloat(filters.minOrderSize)) &&
                             (!filters.maxOrderSize || parseFloat(consumer.average_Order_Size) <= parseFloat(filters.maxOrderSize));
      const matchesSpending = (!filters.minSpending || parseFloat(consumer.average_Spending) >= parseFloat(filters.minSpending)) &&
                            (!filters.maxSpending || parseFloat(consumer.average_Spending) <= parseFloat(filters.maxSpending));

      return matchesSearch && matchesMeatType && matchesCutType && matchesOrderSize && matchesSpending;
    });
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc'
        ? parseFloat(aValue) - parseFloat(bValue)
        : parseFloat(bValue) - parseFloat(aValue);
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Preferred Meat Type', 'Preferred Cut', 'Average Order Size', 'Average Spending'];
    const csvData = consumers.map(consumer => [
      consumer.consumer_ID,
      consumer.consumer_name,
      consumer.preferred_Meat_Type,
      consumer.preferred_Cut,
      consumer.average_Order_Size,
      consumer.average_Spending
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'consumers.csv';
    link.click();
  };

  const stats = calculateSummaryStats();
  const chartData = prepareChartData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Consumer Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDialogOpen(true)}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={exportToCSV}
          >
            Export
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Consumer
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Consumers
              </Typography>
              <Typography variant="h4">
                {stats.totalConsumers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Order Size
              </Typography>
              <Typography variant="h4">
                {stats.avgOrderSize} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Spending
              </Typography>
              <Typography variant="h4">
                ${stats.avgSpending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Spending
              </Typography>
              <Typography variant="h4">
                ${stats.totalSpending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Preferred Meat Types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.meatTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.meatTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => [`${value} consumers`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Preferred Cut Types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData.cutTypeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="value" name="Number of Consumers" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search consumers..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Consumer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'consumer_ID'}
                  direction={sortConfig.key === 'consumer_ID' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('consumer_ID')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'consumer_name'}
                  direction={sortConfig.key === 'consumer_name' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('consumer_name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'preferred_Meat_Type'}
                  direction={sortConfig.key === 'preferred_Meat_Type' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('preferred_Meat_Type')}
                >
                  Preferred Meat Type
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'preferred_Cut'}
                  direction={sortConfig.key === 'preferred_Cut' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('preferred_Cut')}
                >
                  Preferred Cut
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'average_Order_Size'}
                  direction={sortConfig.key === 'average_Order_Size' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('average_Order_Size')}
                >
                  Average Order Size (kg)
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'average_Spending'}
                  direction={sortConfig.key === 'average_Spending' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('average_Spending')}
                >
                  Average Spending ($)
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(applyFilters(consumers)).map((consumer) => (
              <TableRow key={consumer.consumer_ID}>
                <TableCell>{consumer.consumer_ID}</TableCell>
                <TableCell>{consumer.consumer_name}</TableCell>
                <TableCell>
                  <Chip
                    label={consumer.preferred_Meat_Type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={consumer.preferred_Cut}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{Number(consumer.average_Order_Size).toFixed(2)}</TableCell>
                <TableCell>${Number(consumer.average_Spending).toFixed(2)}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleOpen(consumer)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(consumer.consumer_ID)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {consumers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No consumers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)}>
        <DialogTitle>Filter Consumers</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Meat Type</InputLabel>
              <Select
                name="meatType"
                value={filters.meatType}
                onChange={handleFilterChange}
                label="Meat Type"
              >
                <MenuItem value="">All</MenuItem>
                {meatTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Cut Type</InputLabel>
              <Select
                name="cutType"
                value={filters.cutType}
                onChange={handleFilterChange}
                label="Cut Type"
              >
                <MenuItem value="">All</MenuItem>
                {cutTypes.map((cut) => (
                  <MenuItem key={cut} value={cut}>{cut}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              name="minOrderSize"
              label="Min Order Size (kg)"
              type="number"
              value={filters.minOrderSize}
              onChange={handleFilterChange}
              inputProps={{ step: "0.01" }}
            />

            <TextField
              fullWidth
              name="maxOrderSize"
              label="Max Order Size (kg)"
              type="number"
              value={filters.maxOrderSize}
              onChange={handleFilterChange}
              inputProps={{ step: "0.01" }}
            />

            <TextField
              fullWidth
              name="minSpending"
              label="Min Spending ($)"
              type="number"
              value={filters.minSpending}
              onChange={handleFilterChange}
              inputProps={{ step: "0.01" }}
            />

            <TextField
              fullWidth
              name="maxSpending"
              label="Max Spending ($)"
              type="number"
              value={filters.maxSpending}
              onChange={handleFilterChange}
              inputProps={{ step: "0.01" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setFilters({
              meatType: '',
              cutType: '',
              minOrderSize: '',
              maxOrderSize: '',
              minSpending: '',
              maxSpending: ''
            });
          }}>
            Clear Filters
          </Button>
          <Button onClick={() => setFilterDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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
