import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { clientService } from '../services/api';
import { Client } from '../types';

const ClientListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    },
  });

  const filteredClients = React.useMemo(() => {
    if (!clients) return [];
    if (!searchQuery) return clients;

    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (clientToDelete) {
      deleteMutation.mutate(clientToDelete.id);
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
          Loading clients...
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
          Failed to load clients
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
          Clients
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/clients/new')}
          aria-label="Add new client"
          sx={{
            py: 1.5,
            px: 3,
            fontSize: '0.9375rem',
            fontWeight: 600,
          }}
        >
          New Client
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3, border: '1px solid #F3F4F6' }}>
        <TextField
          fullWidth
          placeholder="Search clients by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
          aria-label="Search clients"
        />
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
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      No clients found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchQuery 
                        ? 'Try adjusting your search' 
                        : 'Create your first client to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    hover
                    sx={{
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: '#F9FAFB',
                      },
                    }}
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email || '-'}</TableCell>
                  <TableCell>{client.phone || '-'}</TableCell>
                  <TableCell>{client.city || '-'}</TableCell>
                  <TableCell>{client.state || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/clients/${client.id}`);
                        }}
                        aria-label={`View client ${client.name}`}
                        sx={{
                          color: '#6B7280',
                          '&:hover': {
                            color: '#000000',
                            backgroundColor: '#F3F4F6',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(client);
                        }}
                        aria-label={`Delete client ${client.name}`}
                        sx={{
                          color: '#DC2626',
                          '&:hover': {
                            backgroundColor: '#FEE2E2',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <DeleteIcon fontSize="small" />
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {clientToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientListPage;

