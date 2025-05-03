import React, { useState, useEffect } from 'react';
import { 
  Table, Card, Button, Modal, Form, Input, InputNumber, Select, Divider, Progress, message, Row, Col 
} from 'antd';
import Layout from '../components/Layout';
import moment from 'moment';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const { Option } = Select;

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
