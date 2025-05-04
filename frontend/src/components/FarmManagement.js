import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Snackbar, 
  Alert,
  useTheme,
  LinearProgress,
  Tooltip
} from '@mui/material';
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
  TablePagination,
  Paper,
  IconButton,
  Typography,
  Chip,
  Grid,
  Divider,
  tableCellClasses,
  styled
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Agriculture as AgricultureIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  WarningAmber as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
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
        : 'rgba(79, 70, 229, 0.08)',
      cursor: 'pointer',
    },
  }));
 const FarmManagement = () => {
  const theme = useTheme();
  const [farms, setFarms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
      farm_Name: '',
      livestock_Type: '',
      available_Stock: 0,
      address: '',
      number_of_Livestock: 0,
      contact_info: '',
    });
  
    useEffect(() => {
      fetchFarms();
    }, []);
  
    const fetchFarms = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/farms');
        setFarms(Array.isArray(response.data) ? response.data : []);
        setPage(0); // Reset to first page
      } catch (error) {
        console.error('Error fetching farms:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load farms. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    const handleOpen = (farm = null) => {
      if (farm) {
        setSelectedFarm(farm);
        setFormData({
          farm_Name: farm.farm_Name,
          livestock_Type: farm.livestock_Type,
          available_Stock: farm.available_Stock,
          address: farm.address,
          number_of_Livestock: farm.number_of_Livestock,
          contact_info: farm.contact_info,
        });
      } else {
        setSelectedFarm(null);
        setFormData({
          farm_Name: '',
          livestock_Type: '',
          available_Stock: 0,
          address: '',
          number_of_Livestock: 0,
          contact_info: '',
        });
      }
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
      setSelectedFarm(null);
    };
  
    const handleChange = (e) => {
      const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        if (selectedFarm) {
          await axios.put(
            `http://localhost:5000/api/farms/${selectedFarm.farm_ID}`,
            formData
          );
        } else {
          await axios.post('http://localhost:5000/api/farms', formData);
        }
        await fetchFarms();
        handleClose();
        setSnackbar({
          open: true,
          message: `Farm ${selectedFarm ? 'updated' : 'created'} successfully!`,
          severity: 'success'
        });
      } catch (error) {
        console.error('Error saving farm:', error);
        setSnackbar({
          open: true,
          message: 'Failed to save farm. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
  
    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this farm?')) {
        try {
          setLoading(true);
          await axios.delete(`http://localhost:5000/api/farms/${id}`);
          await fetchFarms();
          setSnackbar({
            open: true,
            message: 'Farm deleted successfully!',
            severity: 'success'
          });
        } catch (error) {
          console.error('Error deleting farm:', error);
          setSnackbar({
            open: true,
            message: 'Failed to delete farm. Please try again.',
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

     // Filter farms based on search query
  const filteredFarms = farms.filter(farm => 
    farm.farm_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.livestock_Type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.contact_info.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Get stock status based on available vs total
  const getStockStatus = (available, total) => {
    const ratio = available / total;
    if (ratio >= 0.75) return { color: 'success', label: 'High', icon: <CheckCircleIcon fontSize="small" /> };
    if (ratio >= 0.35) return { color: 'warning', label: 'Medium', icon: <InfoIcon fontSize="small" /> };
    return { color: 'error', label: 'Low', icon: <WarningIcon fontSize="small" /> };
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
          <AgricultureIcon 
            sx={{ 
              mr: 1.5, 
              color: '#4f46e5',
              fontSize: 28 
            }} 
          />
          Farm Management
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <TextField
            placeholder="Search farms..."
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
              color="primary" 
              onClick={fetchFarms}
              sx={{ 
                backgroundColor: 'rgba(79, 70, 229, 0.08)',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: 'rgba(79, 70, 229, 0.12)',
                }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(79, 70, 229, 0.3)',
              }
            }}
          >
            Add New Farm
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
        <Table aria-label="farms table" stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Farm Name</StyledTableCell>
              <StyledTableCell>Livestock Type</StyledTableCell>
              <StyledTableCell>Stock Status</StyledTableCell>
              <StyledTableCell>Available Stock</StyledTableCell>
              <StyledTableCell>Total Livestock</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Contact Info</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && farms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">
                    Loading farms...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredFarms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 3
                  }}>
                    <AgricultureIcon 
                      sx={{ 
                        fontSize: 48, 
                        mb: 2, 
                        color: 'rgba(0, 0, 0, 0.2)' 
                      }} 
                    />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchQuery ? 'No farms match your search' : 'No farms available'}
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
                        Add your first farm to get started
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              filteredFarms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((farm) => {
                  const stockStatus = getStockStatus(farm.available_Stock, farm.number_of_Livestock);
                  
                  return (
                    <StyledTableRow key={farm.farm_ID} onClick={() => handleOpen(farm)}>
                      <StyledTableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {farm.farm_Name}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          label={farm.livestock_Type}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ borderRadius: '6px' }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Chip
                          icon={stockStatus.icon}
                          label={stockStatus.label}
                          color={stockStatus.color}
                          size="small"
                          sx={{ borderRadius: '6px' }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {farm.available_Stock}
                      </StyledTableCell>
                      <StyledTableCell>
                        {farm.number_of_Livestock}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            maxWidth: '220px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          >
                              {farm.address}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        {farm.contact_info}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title="Edit Farm">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpen(farm);
                              }}
                              sx={{ 
                                backgroundColor: 'rgba(79, 70, 229, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(79, 70, 229, 0.12)',
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Farm">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(farm.farm_ID);
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
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredFarms.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '.MuiTablePagination-select': {
            borderRadius: '8px',
          },
          '.MuiTablePagination-selectIcon': {
            color: theme.palette.primary.main,
          }
        }}
      />

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

      <Dialog 
        open={open} 
        onClose={loading ? undefined : handleClose} 
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
          bgcolor: '#4f46e5', 
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AgricultureIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6">
              {selectedFarm ? 'Edit Farm' : 'Add New Farm'}
            </Typography>
          </Box>
        </DialogTitle>
        
        {loading && (
          <LinearProgress sx={{ height: 2 }} />
        )}
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="farm_Name"
                label="Farm Name"
                value={formData.farm_Name}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="livestock_Type"
                label="Livestock Type"
                value={formData.livestock_Type}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
               </Grid>
               <Grid item xs={12} sm={6}>
              <TextField
                name="available_Stock"
                label="Available Stock"
                type="number"
                value={formData.available_Stock}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="number_of_Livestock"
                label="Total Livestock"
                type="number"
                value={formData.number_of_Livestock}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={2}
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contact_info"
                label="Contact Information"
                value={formData.contact_info}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  sx: { borderRadius: '10px' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleClose} 
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
            color="primary"
            disabled={loading}
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              px: 3
            }}
          >
            {loading ? 'Saving...' : selectedFarm ? 'Update Farm' : 'Create Farm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FarmManagement;



  

  

 
