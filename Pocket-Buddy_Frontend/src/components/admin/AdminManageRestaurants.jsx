import { Box, Typography, CircularProgress, Alert, IconButton, Button, Paper, Avatar, Chip, Collapse } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import AdminSidebar from "./AdminSidebar";

export const ManageRestaurants = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [refreshCount, setRefreshCount] = useState(0);

  const getAllRestaurantOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3000/admin/restaurants");

      if (res.data.data && Array.isArray(res.data.data)) {
        setOwners(res.data.data);
      } else {
        setError("Invalid response from server.");
      }
    } catch (error) {
      console.error("Error fetching restaurant owners:", error);
      setError(error.response?.data?.message || "Failed to fetch restaurant owners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllRestaurantOwners();
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const toggleExpand = (ownerId) => {
    setExpandedRows(prev => ({
      ...prev,
      [ownerId]: !prev[ownerId]
    }));
  };

  const getStatusChip = (status) => {
    const colorMap = {
      Active: 'success',
      Inactive: 'error',
      Pending: 'warning',
      Banned: 'error'
    };
    return (
      <Chip
        label={status}
        color={colorMap[status] || 'default'}
        size="small"
        variant="outlined"
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9f9f9' }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'white' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" fontWeight="600">
              Manage Restaurants
            </Typography>
            <Box>
              <Chip 
                label={`${owners.length} Owners`}
                color="primary" 
                variant="outlined"
                icon={<PersonIcon fontSize="small" />}
                sx={{ mr: 1 }}
              />
              <IconButton onClick={handleRefresh} color="primary" disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <CircularProgress size={50} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {!loading && !error && owners.length > 0 && (
            <DataGrid
              rows={owners.map(owner => ({
                ...owner,
                fullName: `${owner.firstName || ''} ${owner.lastName || ''}`,
                id: owner._id
              }))}
              columns={[
                {
                  field: "fullName",
                  headerName: "Owner Name",
                  flex: 1,
                  renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                        {params.row.firstName?.charAt(0) || 'U'}
                      </Avatar>
                      {params.value}
                    </Box>
                  ),
                },
                { 
                  field: "email", 
                  headerName: "Email", 
                  flex: 1,
                  renderCell: (params) => (
                    <Typography variant="body2" color="text.secondary">
                      {params.value}
                    </Typography>
                  )
                },
                {
                  field: "actions",
                  headerName: "Actions",
                  width: 200,
                  sortable: false,
                  filterable: false,
                  renderCell: (params) => (
                    <Box>
                      <IconButton
                        onClick={() => toggleExpand(params.row._id)}
                        size="small"
                        color={expandedRows[params.row._id] ? "primary" : "default"}
                      >
                        <ExpandMoreIcon 
                          sx={{ 
                            transform: expandedRows[params.row._id] ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s'
                          }} 
                        />
                      </IconButton>
                      {/*<IconButton size="small" color="info">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                       <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton> */}
                    </Box>
                  ),
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
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
              disableSelectionOnClick
              autoHeight
            />
          )}

          {!loading && !error && owners.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 200,
              flexDirection: 'column',
              color: 'text.secondary'
            }}>
              <RestaurantIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No restaurant owners found
              </Typography>
              <Typography variant="body2">
                Try refreshing the page or check your connection
              </Typography>
            </Box>
          )}
        </Paper>

        {owners.map((owner) => (
          <Collapse 
            in={expandedRows[owner._id] || false} 
            key={owner._id} 
            sx={{ mb: 3 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6" fontWeight="bold">
                  <RestaurantIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  {owner.firstName} {owner.lastName}'s Restaurants
                </Typography>
                <Chip 
                  label={`${owner.restaurants?.length || 0} Restaurants`} 
                  color="secondary" 
                  size="small"
                />
              </Box>

              {owner.restaurants && owner.restaurants.length > 0 ? (
                <DataGrid
                  rows={owner.restaurants.map(rest => ({ ...rest, id: rest._id }))}
                  columns={[
                    { 
                      field: "title", 
                      headerName: "Name", 
                      flex: 1,
                      renderCell: (params) => (
                        <Typography fontWeight="500">
                          {params.value}
                        </Typography>
                      )
                    },
                    { 
                      field: "contactNumber", 
                      headerName: "Contact", 
                      flex: 1,
                      renderCell: (params) => (
                        <Typography variant="body2">
                          {params.value || 'N/A'}
                        </Typography>
                      )
                    },
                    { 
                      field: "address", 
                      headerName: "Address", 
                      flex: 1.5,
                      renderCell: (params) => (
                        <Typography variant="body2" noWrap>
                          {params.value || 'N/A'}
                        </Typography>
                      )
                    },
                    // { 
                    //   field: "status", 
                    //   headerName: "Status", 
                    //   flex: 0.8,
                    //   renderCell: (params) => getStatusChip(params.value)
                    // },
                    {
                      field: "imageURL",
                      headerName: "Image",
                      flex: 0.8,
                      renderCell: (params) => (
                        params.value ? (
                          <Avatar
                            src={params.value}
                            alt="Restaurant"
                            sx={{ width: 40, height: 40 }}
                            variant="rounded"
                          />
                        ) : (
                          <Avatar sx={{ width: 40, height: 40 }} variant="rounded">
                            <RestaurantIcon />
                          </Avatar>
                        )
                      ),
                    },
                    // {
                    //   field: "actions",
                    //   headerName: "Actions",
                    //   flex: 1.5,
                    //   renderCell: () => (
                    //     <Box>
                    //       {/* <Button 
                    //         variant="outlined" 
                    //         size="small" 
                    //         startIcon={<VisibilityIcon fontSize="small" />}
                    //         sx={{ mr: 1 }}
                    //       >
                    //         View
                    //       </Button>
                    //       <Button
                    //         variant="outlined"
                    //         size="small"
                    //         color="primary"
                    //         startIcon={<EditIcon fontSize="small" />}
                    //         sx={{ mr: 1 }}
                    //       >
                    //         Edit
                    //       </Button>
                    //       <Button
                    //         variant="outlined"
                    //         size="small"
                    //         color="error"
                    //         startIcon={<DeleteIcon fontSize="small" />}
                    //       >
                    //         Delete
                    //       </Button> */}
                    //     </Box>
                    //   ),
                    // },
                  ]}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  sx={{ 
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  disableSelectionOnClick
                  autoHeight
                />
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: 100,
                  flexDirection: 'column',
                  color: 'text.secondary'
                }}>
                  <RestaurantIcon sx={{ fontSize: 40, mb: 1 }} />
                  <Typography>No restaurants found for this owner</Typography>
                </Box>
              )}
            </Paper>
          </Collapse>
        ))}
      </Box>
    </Box>
  );
};

export default ManageRestaurants;