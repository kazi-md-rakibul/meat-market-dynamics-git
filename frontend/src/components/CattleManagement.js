import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Divider,
  LinearProgress,
  Tooltip,
  TablePagination,
  tableCellClasses,
  styled,
  useTheme
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Pets as PetsIcon,
  Scale as ScaleIcon
} from '@mui/icons-material';

// Styled components for enhanced table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
    padding: '16px',
    whiteSpace: 'nowrap'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '12px 16px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.action.hover 
      : 'rgba(0, 0, 0, 0.02)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.action.selected 
      : 'rgba(16, 185, 129, 0.08)',
    cursor: 'pointer',
  },
}));

const CattleManagement = () => {
  const theme = useTheme();
  const [cattle, setCattle] = useState([]);
  const [farms, setFarms] = useState([]);
  const [processingUnits, setProcessingUnits] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCattle, setSelectedCattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    animal_Type: '',
    breed: '',
    quantity: '',
    average_Weight: '',
    farm_ID: '',
    unit_ID: ''
  });

  useEffect(() => {
    fetchCattle();
    fetchFarms();
    fetchProcessingUnits();
  }, []);

  const fetchCattle = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/cattle');
      setCattle(response.data);
      setPage(0); // Reset to first page
    } catch (error) {
      console.error('Error fetching cattle:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load cattle. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/directory/farmers');
      setFarms(response.data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  const fetchProcessingUnits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/processing-unit');
      setProcessingUnits(response.data);
    } catch (error) {
      console.error('Error fetching processing units:', error);
    }
  };

  const handleOpenDialog = (cattleData = null) => {
    if (cattleData) {
      setSelectedCattle(cattleData);
      setFormData({
        animal_Type: cattleData.animal_Type,
        breed: cattleData.breed,
        quantity: cattleData.quantity,
        average_Weight: cattleData.average_Weight,
        farm_ID: cattleData.farm_ID,
        unit_ID: cattleData.unit_ID
      });
    } else {
      setSelectedCattle(null);
      setFormData({
        animal_Type: '',
        breed: '',
        quantity: '',
        average_Weight: '',
        farm_ID: '',
        unit_ID: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCattle(null);
    setFormData({
      animal_Type: '',
      breed: '',
      quantity: '',
      average_Weight: '',
      farm_ID: '',
      unit_ID: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.animal_Type) errors.animal_Type = 'Animal type is required';
    if (!formData.breed) errors.breed = 'Breed is required';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
    if (!formData.average_Weight || formData.average_Weight <= 0) errors.average_Weight = 'Average weight must be greater than 0';
    if (!formData.farm_ID) errors.farm_ID = 'Farm is required';
    if (!formData.unit_ID) errors.unit_ID = 'Processing unit is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (selectedCattle) {
        await axios.put(`http://localhost:5000/api/cattle/${selectedCattle.cattle_ID}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/cattle', formData);
      }
      await fetchCattle();
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: `Cattle ${selectedCattle ? 'updated' : 'created'} successfully!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving cattle:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save cattle. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cattleId) => {
    if (window.confirm('Are you sure you want to delete this cattle record?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/cattle/${cattleId}`);
        await fetchCattle();
        setSnackbar({
          open: true,
          message: 'Cattle deleted successfully!',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting cattle:', error);
        setSnackbar({
          open: true,
          message: 'Failed to delete cattle. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  // Filter cattle based on search query
  const filteredCattle = cattle.filter(item => 
    item.animal_Type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.farm_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.processing_facility?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get animal icon based on type
  const getAnimalIcon = (animalType) => {
    return <PetsIcon fontSize="small" />;
  };

  return (
    <Paper
      sx={{ 
        p: 3, 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {loading && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            zIndex: 9999,
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }} 
          color="secondary"
        />
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            display: 'flex', 
            alignItems: 'center'
          }}
        >
          <PetsIcon 
            sx={{ 
              mr: 1.5, 
              color: '#10b981',
              fontSize: 28 
            }} 
          />
          Cattle Management
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            placeholder="Search cattle..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ 
              width: { xs: '100%', sm: '200px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          
          <Tooltip title="Refresh Data">
            <IconButton 
              color="secondary" 
              onClick={fetchCattle}
              sx={{ 
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(16, 185, 129, 0.3)',
              }
            }}
          >
            Add New Cattle
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mt: 1, mb: 3, borderColor: 'rgba(0, 0, 0, 0.08)' }} />
      
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          mb: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Animal Type</StyledTableCell>
              <StyledTableCell>Breed</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Average Weight</StyledTableCell>
              <StyledTableCell>Farm</StyledTableCell>
              <StyledTableCell>Processing Unit</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && cattle.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">
                    Loading cattle...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredCattle.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 3
                  }}>
                    <PetsIcon 
                      sx={{ 
                        fontSize: 48, 
                        mb: 2, 
                        color: 'rgba(0, 0, 0, 0.2)' 
                      }} 
                    />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchQuery ? 'No cattle match your search' : 'No cattle available'}
                    </Typography>
                    
                    {searchQuery ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSearchQuery('')}
                        sx={{ mt: 1, borderRadius: '8px', textTransform: 'none' }}
                      >
                        Clear Search
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Add your first cattle record to get started
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredCattle
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <StyledTableRow key={item.cattle_ID} onClick={() => handleOpenDialog(item)}>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          icon={getAnimalIcon(item.animal_Type)}
                          label={item.animal_Type}
                          color="secondary"
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: '6px' }}
                        />
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.breed}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip
                        label={item.quantity}
                        color="primary"
                        size="small"
                        sx={{ borderRadius: '6px', minWidth: '60px' }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ScaleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {item.average_Weight} kg
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {item.farm_Name}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2">
                        {item.processing_facility}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit Cattle">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(item);
                            }}
                            sx={{ 
                              backgroundColor: 'rgba(16, 185, 129, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Cattle">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.cattle_ID);
                            }}
                            sx={{ 
                              backgroundColor: 'rgba(239, 68, 68, 0.08)',
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCattle.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-select': {
            borderRadius: '8px',
          },
          '.MuiTablePagination-selectIcon': {
            color: theme.palette.secondary.main,
          }
        }}
      />

      <Dialog 
        open={openDialog} 
        onClose={loading ? undefined : handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#10b981', 
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PetsIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6">
              {selectedCattle ? 'Edit Cattle' : 'Add New Cattle'}
            </Typography>
          </Box>
        </DialogTitle>
        
        {loading && (
          <LinearProgress color="secondary" sx={{ height: 2 }} />
        )}
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Animal Type"
                name="animal_Type"
                value={formData.animal_Type}
                onChange={handleInputChange}
                error={!!formErrors.animal_Type}
                helperText={formErrors.animal_Type}
                required
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                error={!!formErrors.breed}
                helperText={formErrors.breed}
                required
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
                required
                inputProps={{ min: 1 }}
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Average Weight (kg)"
                name="average_Weight"
                type="number"
                value={formData.average_Weight}
                onChange={handleInputChange}
                error={!!formErrors.average_Weight}
                helperText={formErrors.average_Weight}
                required
                inputProps={{ min: 0.1, step: 0.1 }}
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.farm_ID} required>
                <InputLabel>Farm</InputLabel>
                <Select
                  label="Farm"
                  name="farm_ID"
                  value={formData.farm_ID}
                  onChange={handleInputChange}
                  sx={{ borderRadius: '10px' }}
                >
                  {farms.map((farm) => (
                    <MenuItem key={farm.farm_ID} value={farm.farm_ID}>
                      {farm.farm_Name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.farm_ID && (
                  <FormHelperText>{formErrors.farm_ID}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.unit_ID} required>
                <InputLabel>Processing Unit</InputLabel>
                <Select
                  label="Processing Unit"
                  name="unit_ID"
                  value={formData.unit_ID}
                  onChange={handleInputChange}
                  sx={{ borderRadius: '10px' }}
                >
                  {processingUnits.map((unit) => (
                    <MenuItem key={unit.unit_ID} value={unit.unit_ID}>
                      {unit.facility_Name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.unit_ID && (
                  <FormHelperText>{formErrors.unit_ID}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            disabled={loading}
            variant="outlined"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none' 
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="secondary"
            disabled={loading}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3
            }}
          >
            {loading ? 'Saving...' : selectedCattle ? 'Update Cattle' : 'Add Cattle'}
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
          variant="filled"
          sx={{ borderRadius: '10px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CattleManagement;
