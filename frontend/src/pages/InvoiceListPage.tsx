import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Button,
  Chip,
  IconButton,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { invoiceService } from '../services/api';
import { Invoice, InvoiceStatus } from '../types';
import { format, parseISO } from 'date-fns';

type Order = 'asc' | 'desc';
type OrderBy = keyof Invoice;

const InvoiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState<OrderBy>('created_at');
  const [order, setOrder] = useState<Order>('desc');

  const { data: invoices, isLoading, error } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => invoiceService.getAll(),
  });

  const handleSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredInvoices = React.useMemo(() => {
    if (!invoices) return [];

    let filtered = [...invoices];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(query) ||
          inv.client?.name?.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if ((aValue instanceof Date || typeof aValue === 'string') && (bValue instanceof Date || typeof bValue === 'string')) {
        const aDate = typeof aValue === 'string' ? parseISO(aValue) : aValue;
        const bDate = typeof bValue === 'string' ? parseISO(bValue) : bValue;
        if (aDate && bDate) {
          return order === 'asc'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }
      }

      return 0;
    });

    return filtered;
  }, [invoices, statusFilter, searchQuery, orderBy, order]);

  const getStatusColor = (status: InvoiceStatus) => {
    const colors: {
      [key in InvoiceStatus]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    } = {
      draft: 'default',
      sent: 'info',
      viewed: 'warning',
      paid: 'success',
      overdue: 'error',
    };
    return colors[status] || 'default';
  };

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        gap={2}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          Loading invoices...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Failed to load invoices
        </Typography>
        <Typography variant="body2">
          Please try refreshing the page or contact support if the problem persists.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, fontSize: '2rem' }}>
          Invoices
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/invoices/new')}
          aria-label="Create new invoice"
          sx={{
            py: 1.5,
            px: 3,
            fontSize: '0.9375rem',
            fontWeight: 600,
          }}
        >
          New Invoice
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3, border: '1px solid #F3F4F6' }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="viewed">Viewed</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </TextField>
          <TextField
            placeholder="Search by invoice number or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
            size="small"
            aria-label="Search invoices"
          />
        </Box>
      </Paper>

      <Paper 
        sx={{ 
          border: '1px solid #E5E7EB', 
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                <TableSortLabel
                  active={orderBy === 'invoice_number'}
                  direction={orderBy === 'invoice_number' ? order : 'asc'}
                  onClick={() => handleSort('invoice_number')}
                  sx={{ fontWeight: 600 }}
                >
                  Invoice Number
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                <TableSortLabel
                  active={orderBy === 'client_id'}
                  direction={orderBy === 'client_id' ? order : 'asc'}
                  onClick={() => handleSort('client_id')}
                  sx={{ fontWeight: 600 }}
                >
                  Client
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                <TableSortLabel
                  active={orderBy === 'issue_date'}
                  direction={orderBy === 'issue_date' ? order : 'asc'}
                  onClick={() => handleSort('issue_date')}
                  sx={{ fontWeight: 600 }}
                >
                  Issue Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                <TableSortLabel
                  active={orderBy === 'due_date'}
                  direction={orderBy === 'due_date' ? order : 'asc'}
                  onClick={() => handleSort('due_date')}
                  sx={{ fontWeight: 600 }}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                <TableSortLabel
                  active={orderBy === 'total'}
                  direction={orderBy === 'total' ? order : 'asc'}
                  onClick={() => handleSort('total')}
                  sx={{ fontWeight: 600 }}
                >
                  Total
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                  sx={{ fontWeight: 600 }}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      No invoices found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery || statusFilter !== 'all' 
                        ? 'Try adjusting your filters' 
                        : 'Create your first invoice to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow 
                    key={invoice.id} 
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#F9FAFB',
                      },
                    }}
                    onClick={() => navigate(`/invoices/${invoice.id}`)}
                  >
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.client?.name || 'Unknown'}</TableCell>
                  <TableCell>{format(parseISO(invoice.issue_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(parseISO(invoice.due_date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>${Number(invoice.total).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status}
                      size="small"
                      color={getStatusColor(invoice.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/invoices/${invoice.id}`);
                        }}
                        aria-label={`View invoice ${invoice.invoice_number}`}
                        sx={{ 
                          color: '#6B7280',
                          '&:hover': { 
                            color: '#000000',
                            backgroundColor: '#F3F4F6',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/invoices/${invoice.id}/edit`);
                        }}
                        aria-label={`Edit invoice ${invoice.invoice_number}`}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#F3F4F6',
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </Box>
  );
};

export default InvoiceListPage;

