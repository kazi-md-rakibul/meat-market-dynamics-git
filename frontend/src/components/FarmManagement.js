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
    }, []);}
  
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
  

  

 
