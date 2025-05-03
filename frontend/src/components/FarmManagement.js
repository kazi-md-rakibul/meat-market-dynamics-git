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