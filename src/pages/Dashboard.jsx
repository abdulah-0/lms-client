import { Link } from 'react-router-dom';
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';

const drawerWidth = 240;

function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#1976d2', color: 'white' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        <List>
            <ListItem button component={Link} to="/attendance">
                <ListItemText primary="Attendance" />
            </ListItem>
            <ListItem button component={Link} to="/marks">
                <ListItemText primary="Marks" />
            </ListItem>
            <ListItem button component={Link} to="/studymaterials">
                <ListItemText primary="Study Materials" />
            </ListItem>
            <ListItem button onClick={() => {
                      localStorage.removeItem('isLoggedIn');
                      window.location.href = '/';
                      }}>
            <ListItemText primary="Logout" />
            </ListItem>

        </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Topbar */}
        <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              LMS Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Welcome to the Dashboard!
          </Typography>
          <Typography>
            Select an option from the sidebar to view your attendance, marks, or study materials.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
