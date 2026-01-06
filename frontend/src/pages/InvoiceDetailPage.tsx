import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  GetApp as GetAppIcon,
} from '@mui/icons-material';
import { invoiceService } from '../services/api';
import { Invoice } from '../types';
import { format, parseISO } from 'date-fns';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'draft':
      return 'default';
    case 'sent':
      return 'info';
    case 'viewed':
      return 'primary';
    case 'paid':
      return 'success';
    case 'overdue':
      return 'error';
    default:
      return 'default';
  }
};

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: invoice, isLoading, error } = useQuery<Invoice>({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getById(id!),
    enabled: !!id,
  });

  const handleGeneratePDF = async () => {
    if (invoice) {
      await generateInvoicePDF(invoice);
    }
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
          Loading invoice...
        </Typography>
      </Box>
    );
  }

  if (error || !invoice) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
        }}
        action={
          <Button color="inherit" size="small" onClick={() => navigate('/invoices')}>
            Back to Invoices
          </Button>
        }
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Failed to load invoice
        </Typography>
        <Typography variant="body2">
          The invoice could not be found or an error occurred.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/invoices')}
            sx={{ mb: 2 }}
          >
            Back to Invoices
          </Button>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              fontSize: { xs: '1.75rem', sm: '2rem' },
              letterSpacing: '-0.02em',
              mb: 1,
              color: '#111827',
            }}
          >
            Invoice {invoice.invoice_number}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={invoice.status}
              color={getStatusColor(invoice.status)}
              sx={{ fontWeight: 500 }}
            />
            <Typography variant="body2" color="text.secondary">
              Created: {format(parseISO(invoice.created_at), 'MMM d, yyyy')}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={handleGeneratePDF}
            sx={{
              borderColor: '#E5E7EB',
            }}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
          >
            Edit Invoice
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 3, sm: 4 }, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                fontSize: '1.125rem',
                letterSpacing: '-0.01em',
              }}
            >
              Invoice Details
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8125rem' }}>
                  Client
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {invoice.client?.name || 'Unknown Client'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8125rem' }}>
                  Invoice Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {invoice.invoice_number}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8125rem' }}>
                  Issue Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {format(parseISO(invoice.issue_date), 'MMM d, yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8125rem' }}>
                  Due Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {format(parseISO(invoice.due_date), 'MMM d, yyyy')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.8125rem' }}>
                  Payment Terms
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {invoice.payment_terms}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                fontWeight: 600, 
                fontSize: '1rem',
              }}
            >
              Line Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>Rate</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#374151' }}>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice.line_items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell align="right">{Number(item.quantity).toFixed(2)}</TableCell>
                      <TableCell align="right">${Number(item.rate).toFixed(2)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>
                        ${(Number(item.quantity) * Number(item.rate)).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 3, sm: 4 }, border: '1px solid #E5E7EB', borderRadius: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, 
                fontWeight: 600, 
                fontSize: '1.125rem',
                letterSpacing: '-0.01em',
              }}
            >
              Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ${Number(invoice.subtotal).toFixed(2)}
                </Typography>
              </Box>
              {Number(invoice.discount_amount) > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Discount</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#10B981' }}>
                    -${Number(invoice.discount_amount).toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Tax ({invoice.tax_rate}%)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ${Number(invoice.tax_amount).toFixed(2)}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ${Number(invoice.total).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {invoice.notes && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 1, fontSize: '0.8125rem' }}
                  >
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {invoice.notes}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceDetailPage;

