import React, { useState, useEffect, Component } from 'react';
import Layout from '../components/Layout';
import CattleManagement from '../components/CattleManagement';
import DeliveryManagement from '../components/DeliveryManagement';
import OrderManagement from '../components/OrderManagement';
import FarmManagement from '../components/FarmManagement';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';