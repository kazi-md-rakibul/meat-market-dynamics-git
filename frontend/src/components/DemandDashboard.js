import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  FormHelperText
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DemandDashboard = () => {
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meatTypeStats, setMeatTypeStats] = useState([]);
  const [cutTypeStats, setCutTypeStats] = useState([]);
  
  // CRUD state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'delete'
  const [currentConsumer, setCurrentConsumer] = useState(null);
  const [formData, setFormData] = useState({
    consumer_name: '',
    preferred_Meat_Type: '',
    preferred_Cut: '',
    average_Order_Size: '',
    average_Spending: '',
    region: '',
    season: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch consumers
      const consumersResponse = await axios.get('http://localhost:5000/api/consumers');
      setConsumers(consumersResponse.data);
      
      // Process data for charts
      processChartData(consumersResponse.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch demand data. Please try again later.');
      setLoading(false);
    }
  };

  const processChartData = (consumerData) => {
    // Process meat type statistics
    const meatTypeMap = new Map();
    const cutTypeMap = new Map();
    
    consumerData.forEach(consumer => {
      // Count meat types
      const meatType = consumer.preferred_Meat_Type;
      meatTypeMap.set(meatType, (meatTypeMap.get(meatType) || 0) + 1);
      
      // Count cut types
      const cutType = consumer.preferred_Cut;
      cutTypeMap.set(cutType, (cutTypeMap.get(cutType) || 0) + 1);
    });
    
    // Convert to array format for charts
    const meatTypeData = Array.from(meatTypeMap, ([name, value]) => ({ name, value }));
    const cutTypeData = Array.from(cutTypeMap, ([name, value]) => ({ name, value }));
    
    setMeatTypeStats(meatTypeData);
    setCutTypeStats(cutTypeData);
  };

  // Calculate average spending by meat type
  const calculateAverageSpending = () => {
    const meatTypeSpending = new Map();
    const meatTypeCount = new Map();
    
    consumers.forEach(consumer => {
      const meatType = consumer.preferred_Meat_Type;
      const spending = parseFloat(consumer.average_Spending);
      
      meatTypeSpending.set(meatType, (meatTypeSpending.get(meatType) || 0) + spending);
      meatTypeCount.set(meatType, (meatTypeCount.get(meatType) || 0) + 1);
    });
    
    return Array.from(meatTypeSpending, ([name, totalSpending]) => ({
      name,
      value: totalSpending / meatTypeCount.get(name)
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Demand Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Consumers
              </Typography>
              <Typography variant="h3">
                {consumers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Order Size
              </Typography>
              <Typography variant="h3">
                {consumers.length > 0 
                  ? (consumers.reduce((sum, consumer) => sum + parseFloat(consumer.average_Order_Size), 0) / consumers.length).toFixed(2)
                  : 0} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Spending
              </Typography>
              <Typography variant="h3">
                ${consumers.length > 0 
                  ? (consumers.reduce((sum, consumer) => sum + parseFloat(consumer.average_Spending), 0) / consumers.length).toFixed(2)
                  : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Preferred Meat Types
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={meatTypeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {meatTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} consumers`, 'Count']} />
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
              <PieChart>
                <Pie
                  data={cutTypeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cutTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} consumers`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Average Spending by Meat Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={calculateAverageSpending()}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Average Spending ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Average Spending']} />
                <Legend />
                <Bar dataKey="value" name="Average Spending" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Consumer Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Consumer Data
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('create')}
              >
                Add Consumer
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Preferred Meat Type</TableCell>
                    <TableCell>Preferred Cut</TableCell>
                    <TableCell>Average Order Size (kg)</TableCell>
                    <TableCell>Average Spending ($)</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Season</TableCell>
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
                      <TableCell>{parseFloat(consumer.average_Order_Size).toFixed(2)}</TableCell>
                      <TableCell>${parseFloat(consumer.average_Spending).toFixed(2)}</TableCell>
                      <TableCell>{consumer.region}</TableCell>
                      <TableCell>{consumer.season}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDialog('edit', consumer)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDialog('delete', consumer)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {consumers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography variant="body1">No consumer data available</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Click 'Add Consumer' to create a new consumer record
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Consumer Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Add New Consumer' : 
           dialogMode === 'edit' ? 'Edit Consumer' : 'Delete Consumer'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'delete' ? (
            <DialogContentText>
              Are you sure you want to delete consumer "{currentConsumer?.consumer_name}"? This action cannot be undone.
            </DialogContentText>
          ) : (
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="consumer-name" sx={{ fontWeight: 500 }}>
                      Consumer Name *
                    </Typography>
                  </Box>
                  <TextField
                    id="consumer-name"
                    name="consumer_name"
                    value={formData.consumer_name}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    error={!!formErrors.consumer_name}
                    helperText={formErrors.consumer_name}
                    inputProps={{
                      sx: { height: 20 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="preferred-meat-type" sx={{ fontWeight: 500 }}>
                      Preferred Meat Type *
                    </Typography>
                  </Box>
                  <FormControl fullWidth error={!!formErrors.preferred_Meat_Type}>
                    <Select
                      id="preferred-meat-type"
                      name="preferred_Meat_Type"
                      value={formData.preferred_Meat_Type}
                      onChange={handleInputChange}
                      displayEmpty
                      sx={{ height: 56 }}
                    >
                      <MenuItem value="" disabled><em>Select meat type</em></MenuItem>
                      <MenuItem value="Beef">Beef</MenuItem>
                      <MenuItem value="Chicken">Chicken</MenuItem>
                      <MenuItem value="Pork">Pork</MenuItem>
                      <MenuItem value="Lamb">Lamb</MenuItem>
                      <MenuItem value="Turkey">Turkey</MenuItem>
                      <MenuItem value="Goat">Goat</MenuItem>
                    </Select>
                    {formErrors.preferred_Meat_Type && (
                      <FormHelperText>{formErrors.preferred_Meat_Type}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="preferred-cut" sx={{ fontWeight: 500 }}>
                      Preferred Cut *
                    </Typography>
                  </Box>
                  <FormControl fullWidth error={!!formErrors.preferred_Cut}>
                    <Select
                      id="preferred-cut"
                      name="preferred_Cut"
                      value={formData.preferred_Cut}
                      onChange={handleInputChange}
                      displayEmpty
                      sx={{ height: 56 }}
                    >
                      <MenuItem value="" disabled><em>Select cut type</em></MenuItem>
                      <MenuItem value="Ribeye">Ribeye</MenuItem>
                      <MenuItem value="Sirloin">Sirloin</MenuItem>
                      <MenuItem value="T-Bone">T-Bone</MenuItem>
                      <MenuItem value="Filet Mignon">Filet Mignon</MenuItem>
                      <MenuItem value="Brisket">Brisket</MenuItem>
                      <MenuItem value="Breast">Breast</MenuItem>
                      <MenuItem value="Thigh">Thigh</MenuItem>
                      <MenuItem value="Wing">Wing</MenuItem>
                      <MenuItem value="Leg">Leg</MenuItem>
                      <MenuItem value="Bacon">Bacon</MenuItem>
                      <MenuItem value="Chop">Chop</MenuItem>
                      <MenuItem value="Shoulder">Shoulder</MenuItem>
                    </Select>
                    {formErrors.preferred_Cut && (
                      <FormHelperText>{formErrors.preferred_Cut}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="average-order-size" sx={{ fontWeight: 500 }}>
                      Average Order Size (kg) *
                    </Typography>
                  </Box>
                  <TextField
                    id="average-order-size"
                    name="average_Order_Size"
                    value={formData.average_Order_Size}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    type="number"
                    inputProps={{
                      min: 0,
                      step: 0.1,
                      sx: { height: 20 }
                    }}
                    error={!!formErrors.average_Order_Size}
                    helperText={formErrors.average_Order_Size}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="average-spending" sx={{ fontWeight: 500 }}>
                      Average Spending ($) *
                    </Typography>
                  </Box>
                  <TextField
                    id="average-spending"
                    name="average_Spending"
                    value={formData.average_Spending}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                    type="number"
                    inputProps={{
                      min: 0,
                      step: 0.01,
                      sx: { height: 20 }
                    }}
                    error={!!formErrors.average_Spending}
                    helperText={formErrors.average_Spending}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="region" sx={{ fontWeight: 500 }}>
                      Region *
                    </Typography>
                  </Box>
                  <FormControl fullWidth error={!!formErrors.region}>
                    <Select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      displayEmpty
                      sx={{ height: 56 }}
                    >
                      <MenuItem value="" disabled><em>Select region</em></MenuItem>
                      <MenuItem value="National">National</MenuItem>
                      <MenuItem value="Northeast">Northeast</MenuItem>
                      <MenuItem value="Southeast">Southeast</MenuItem>
                      <MenuItem value="Midwest">Midwest</MenuItem>
                      <MenuItem value="Southwest">Southwest</MenuItem>
                      <MenuItem value="West">West</MenuItem>
                      <MenuItem value="International">International</MenuItem>
                    </Select>
                    {formErrors.region && (
                      <FormHelperText>{formErrors.region}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" component="label" htmlFor="season" sx={{ fontWeight: 500 }}>
                      Season *
                    </Typography>
                  </Box>
                  <FormControl fullWidth error={!!formErrors.season}>
                    <Select
                      id="season"
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      displayEmpty
                      sx={{ height: 56 }}
                    >
                      <MenuItem value="" disabled><em>Select season</em></MenuItem>
                      <MenuItem value="All Year">All Year</MenuItem>
                      <MenuItem value="Spring">Spring</MenuItem>
                      <MenuItem value="Summer">Summer</MenuItem>
                      <MenuItem value="Fall">Fall</MenuItem>
                      <MenuItem value="Winter">Winter</MenuItem>
                      <MenuItem value="Holiday">Holiday</MenuItem>
                    </Select>
                    {formErrors.season && (
                      <FormHelperText>{formErrors.season}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogMode === 'delete' ? (
            <Button onClick={handleDeleteConsumer} color="error" variant="contained">
              Delete
            </Button>
          ) : (
            <Button onClick={handleSaveConsumer} color="primary" variant="contained">
              {dialogMode === 'create' ? 'Add' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
  
  // CRUD Operation Handlers
  function handleOpenDialog(mode, consumer = null) {
    setDialogMode(mode);
    setFormErrors({});
    
    if (mode === 'create') {
      setFormData({
        consumer_name: '',
        preferred_Meat_Type: '',
        preferred_Cut: '',
        average_Order_Size: '',
        average_Spending: '',
        region: 'National',
        season: 'All Year'
      });
    } else {
      setCurrentConsumer(consumer);
      if (mode === 'edit') {
        setFormData({
          consumer_name: consumer.consumer_name,
          preferred_Meat_Type: consumer.preferred_Meat_Type,
          preferred_Cut: consumer.preferred_Cut,
          average_Order_Size: consumer.average_Order_Size,
          average_Spending: consumer.average_Spending,
          region: consumer.region,
          season: consumer.season
        });
      }
    }
    
    setOpenDialog(true);
  }
  
  function handleCloseDialog() {
    setOpenDialog(false);
    setCurrentConsumer(null);
  }
  
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }
  
  function validateForm() {
    const errors = {};
    const requiredFields = [
      { field: 'consumer_name', label: 'Consumer Name' },
      { field: 'preferred_Meat_Type', label: 'Preferred Meat Type' },
      { field: 'preferred_Cut', label: 'Preferred Cut' },
      { field: 'average_Order_Size', label: 'Average Order Size' },
      { field: 'average_Spending', label: 'Average Spending' },
      { field: 'region', label: 'Region' },
      { field: 'season', label: 'Season' }
    ];
    
    requiredFields.forEach(({ field, label }) => {
      if (!formData[field]) {
        errors[field] = `${label} is required`;
      }
    });
    
    if (formData.average_Order_Size && isNaN(parseFloat(formData.average_Order_Size))) {
      errors.average_Order_Size = 'Must be a valid number';
    }
    
    if (formData.average_Spending && isNaN(parseFloat(formData.average_Spending))) {
      errors.average_Spending = 'Must be a valid number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }
  
  async function handleSaveConsumer() {
    if (!validateForm()) return;
    
    try {
      // Add current date for record_date field
      const today = new Date().toISOString().split('T')[0];
      const consumerData = {
        ...formData,
        record_date: today,
        consumption_amount: formData.average_Order_Size, // Set consumption amount equal to order size for simplicity
        consumer_name: formData.consumer_name || 'Consumer', // Ensure consumer_name is always set
        region: formData.region || 'National',
        season: formData.season || 'All Year'
      };
      
      // Ensure all numeric fields are properly formatted
      consumerData.average_Order_Size = parseFloat(consumerData.average_Order_Size);
      consumerData.average_Spending = parseFloat(consumerData.average_Spending);
      consumerData.consumption_amount = parseFloat(consumerData.consumption_amount);
      
      console.log('Saving consumer with data:', consumerData);
      
      if (dialogMode === 'create') {
        await axios.post('http://localhost:5000/api/consumers', consumerData);
        setSnackbar({
          open: true,
          message: 'Consumer added successfully',
          severity: 'success'
        });
      } else {
        await axios.put(`http://localhost:5000/api/consumers/${currentConsumer.consumer_ID}`, consumerData);
        setSnackbar({
          open: true,
          message: 'Consumer updated successfully',
          severity: 'success'
        });
      }
      
      // Refresh data
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving consumer:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode === 'create' ? 'add' : 'update'} consumer. ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  }
  
  async function handleDeleteConsumer() {
    try {
      await axios.delete(`http://localhost:5000/api/consumers/${currentConsumer.consumer_ID}`);
      
      setSnackbar({
        open: true,
        message: 'Consumer deleted successfully',
        severity: 'success'
      });
      
      // Refresh data
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting consumer:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete consumer. ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
  }
};

export default DemandDashboard;
