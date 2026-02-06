import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";

const AdminSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const getAllSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the correct API endpoint that matches your routes
      const res = await axios.get("http://localhost:3000/subscription/all");

      console.log("API Response:", res.data);

      // Handle both possible response structures based on your controller
      const subscriptionsData = res.data.data || res.data;

      if (Array.isArray(subscriptionsData)) {
        const formattedSubscriptions = subscriptionsData.map(
          (subscription) => ({
            _id: subscription._id,
            userId: subscription.userId?._id || subscription.userId || "N/A",
            userName: subscription.userId?.name || "N/A",
            email: subscription.userId?.email || "N/A",
            planName: subscription.planName || subscription.plan?.name || "N/A",
            amount: subscription.amount || subscription.plan?.amount || 0,
            status: subscription.status || "Unknown",
            startDate: formatDate(subscription.startDate),
            endDate: formatDate(subscription.endDate),
            createdAt: formatDate(subscription.createdAt),
          })
        );

        setSubscriptions([...formattedSubscriptions]);
      } else {
        console.error("Unexpected API Response:", res.data);
        setError(
          "Invalid response from server. Expected an array of subscriptions."
        );
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);

      // More detailed error message
      let errorMessage = "Failed to fetch subscriptions. ";

      if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage += `Server responded with status ${error.response.status}. `;
        if (error.response.data && error.response.data.error) {
          errorMessage += error.response.data.error;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage +=
          "No response received from server. Please check your server connection.";
      } else {
        // Something happened in setting up the request
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSubscriptions();
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteSubscription = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3000/subscription/${id}`);

      setSubscriptions(subscriptions.filter((sub) => sub._id !== id));

      if (
        openDialog &&
        selectedSubscription &&
        selectedSubscription._id === id
      ) {
        setOpenDialog(false);
      }

      toast.success("Subscription deleted successfully ✅");
    } catch (error) {
      console.error("Error deleting subscription:", error);

      let errorMessage = "Failed to delete subscription.";
      if (error.response?.data?.error) {
        errorMessage += " " + error.response.data.error;
      } else if (error.message) {
        errorMessage += " " + error.message;
      }

      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "#4caf50";
      case "expired":
        return "#9e9e9e";
      case "pending":
        return "#ff9800";
      default:
        return "#9e9e9e";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return new Date(dateString).toLocaleDateString("en-GB", options); // ✅ dd/mm/yyyy
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  const columns = [
    { field: "userName", headerName: "User Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "planName", headerName: "Plan", width: 150 },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => `₹${params.value}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          style={{
            backgroundColor: `${getStatusColor(params.value)}20`,
            color: getStatusColor(params.value),
            fontWeight: "bold",
          }}
        />
      ),
    },
    { field: "startDate", headerName: "Start Date", width: 120 },
    { field: "endDate", headerName: "End Date", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleViewDetails(params.row)}
            size="small"
            sx={{ mr: 1 }}
          >
            <VisibilityIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteSubscription(params.row._id)}
            size="small"
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f9f9f9",
          minHeight: "100%",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" fontWeight="600">
              Manage Subscriptions
            </Typography>
            <Box>
              <Chip
                label={`Total: ${subscriptions.length}`}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <CircularProgress size={50} />
            </Box>
          )}

          {error && typeof error === "string" && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {error && typeof error === "object" && error.type === "success" && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error.message}
            </Alert>
          )}

          {!loading &&
            (!error ||
              (typeof error === "object" && error.type === "success")) &&
            subscriptions.length > 0 && (
              <DataGrid
                rows={subscriptions}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25]}
                checkboxSelection
                disableSelectionOnClick
                autoHeight
                sx={{
                  border: "none",
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f0f0f0",
                  },
                }}
                getRowId={(row) =>
                  row._id || Math.random().toString(36).substr(2, 9)
                }
              />
            )}

          {!loading &&
            (!error ||
              (typeof error === "object" && error.type === "success")) &&
            subscriptions.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                  flexDirection: "column",
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No subscriptions found
                </Typography>
                <Typography variant="body2">
                  Try refreshing the page or check your connection
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRefresh}
                  sx={{ mt: 2 }}
                >
                  Refresh
                </Button>
              </Box>
            )}
        </Paper>
      </Box>

      {/* Subscription Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Subscription Details</DialogTitle>
        <DialogContent dividers>
          {selectedSubscription && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
                  >
                    User Information
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedSubscription.userName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedSubscription.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>User ID:</strong> {selectedSubscription.userId}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
                  >
                    Subscription Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Plan:</strong> {selectedSubscription.planName}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Amount:</strong> ₹{selectedSubscription.amount}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={selectedSubscription.status}
                      size="small"
                      style={{
                        backgroundColor: `${getStatusColor(
                          selectedSubscription.status
                        )}20`,
                        color: getStatusColor(selectedSubscription.status),
                        fontWeight: "bold",
                      }}
                    />
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
                  >
                    Timeline
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Start Date
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(selectedSubscription.startDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        End Date
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(selectedSubscription.endDate)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(selectedSubscription.createdAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDeleteSubscription(selectedSubscription._id)}
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSubscription;
