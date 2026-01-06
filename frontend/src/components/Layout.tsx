import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Invoices', icon: <ReceiptIcon />, path: '/invoices' },
  { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
];

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      <Toolbar 
        sx={{ 
          minHeight: '80px !important', 
          borderBottom: '1px solid #E5E7EB',
          px: 3,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '1.5rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #000000 0%, #374151 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          InvoiceFlow
        </Typography>
      </Toolbar>
      <Box sx={{ flex: 1, py: 2, overflowY: 'auto' }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={item.text} placement="right" arrow>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleNavigation(item.path)}
                    aria-label={`Navigate to ${item.text}`}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      px: 2,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&.Mui-selected': {
                        backgroundColor: '#F3F4F6',
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#E5E7EB',
                        },
                        '& .MuiListItemIcon-root': {
                          color: '#000000',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 24,
                          backgroundColor: '#000000',
                          borderRadius: '0 2px 2px 0',
                        },
                      },
                      '&:hover': {
                        backgroundColor: '#F9FAFB',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 44, 
                        color: isSelected ? '#000000' : '#6B7280',
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontSize: '0.9375rem',
                        fontWeight: isSelected ? 600 : 500,
                        letterSpacing: '-0.01em',
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
          <Box sx={{ mt: 2, px: 2 }}>
            <ListItemButton
              onClick={() => handleNavigation('/invoices/new')}
              aria-label="Create new invoice"
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                backgroundColor: '#000000',
                color: '#ffffff',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#1F2937',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '& .MuiListItemIcon-root': {
                  color: '#ffffff',
                },
              }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText 
                primary="New Invoice" 
                primaryTypographyProps={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          </Box>
        </List>
      </Box>
      <Box sx={{ borderTop: '1px solid #E5E7EB', p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout} 
            aria-label="Logout"
            sx={{
              borderRadius: 2,
              py: 1.5,
              px: 2,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                '& .MuiListItemIcon-root': {
                  color: '#DC2626',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: '#6B7280', transition: 'color 0.2s' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'inherit',
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#FFFFFF',
          color: '#111827',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', px: { xs: 2, sm: 3 }, justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 600, 
              fontSize: '1.125rem',
              color: '#111827',
              letterSpacing: '-0.01em',
            }}
          >
            {menuItems.find(item => location.pathname.startsWith(item.path))?.text || 'Dashboard'}
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6B7280',
                  fontSize: '0.875rem',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {user.name}
              </Typography>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  backgroundColor: '#000000',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#F9FAFB',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

