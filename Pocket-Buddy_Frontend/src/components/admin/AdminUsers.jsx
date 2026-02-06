import { Box, Typography, CircularProgress, Alert, Paper, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { columns } from "./UserColumns.jsx";
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton } from "@mui/material";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const getAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3000/user/all");

      console.log("API Response:", res.data);

      if (res.data.data && Array.isArray(res.data.data)) {
        const formattedUsers = res.data.data.map((user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          status: user.status === "Active",
          createdAt: new Date(user.createdAt).toLocaleDateString(),
        }));

        setUsers([...formattedUsers]);
      } else {
        console.error("Unexpected API Response:", res.data);
        setError("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f9f9f9',
          minHeight: '100%'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: 'white',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" fontWeight="600">
              Manage Users
            </Typography>
            <Box>
              <Chip 
                label={`Total: ${users.length}`} 
                color="primary" 
                variant="outlined"
                sx={{ mr: 1 }}
              />
              <IconButton 
                onClick={handleRefresh}
                color="primary"
                disabled={loading}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          {loading && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 300 
            }}>
              <CircularProgress size={50} />
            </Box>
          )}

          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {!loading && !error && users.length > 0 && (
            <DataGrid
              rows={users}
              columns={columns(getAllUsers, setUsers)}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              checkboxSelection
              disableSelectionOnClick
              autoHeight
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f0f0f0',
                },
              }}
              getRowId={(row) => row._id || Math.random().toString(36).substr(2, 9)}
            />
          )}

          {!loading && !error && users.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 200,
              flexDirection: 'column',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                No users found
              </Typography>
              <Typography variant="body2">
                Try refreshing the page or check your connection
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminUsers;