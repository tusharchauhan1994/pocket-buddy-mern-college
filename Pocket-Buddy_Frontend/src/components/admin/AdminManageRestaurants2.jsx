import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Chip, 
  MenuItem, 
  Select, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  TextField,
  Avatar,
  IconButton,
  Divider,
  Badge,
  Collapse
} from "@mui/material";
import { 
  Sort as SortIcon,
  GridView as GridViewIcon,
  TableRows as TableRowsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("name-asc");
  const [expanded, setExpanded] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState({});
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    fetchRestaurants();
  }, [refreshCount]);
  
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:3000/admin/restaurants");
      if (res.data.data && Array.isArray(res.data.data)) {
        const allRestaurants = res.data.data.flatMap(owner =>
          owner.restaurants.map(restaurant => ({ 
            ...restaurant, 
            ownerName: owner.name,
            id: restaurant._id
          }))
        );
        setRestaurants(allRestaurants);
      } else {
        setError("Invalid response from server.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/location/deleteRestaurant/${id}`);
      toast.success("Restaurant deleted successfully!", { position: "top-right", autoClose: 2000 });
      setRefreshCount(prev => prev + 1);
    } catch (error) {
      toast.error("Failed to delete restaurant!", { position: "top-right", autoClose: 2000 });
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleEdit = (id, field, value) => {
    setEditingId(id);
    setEditField({ field, value });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3000/location/updateRestaurant/${id}`, { 
        [editField.field]: editField.value 
      });
      toast.success("Updated successfully!", { position: "top-right", autoClose: 2000 });
      setEditingId(null);
      setRefreshCount(prev => prev + 1);
    } catch (error) {
      toast.error("Update failed!", { position: "top-right", autoClose: 2000 });
      console.error("Error updating:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const filteredRestaurants = restaurants.filter((res) => 
    res.title.toLowerCase().includes(search.toLowerCase())
  );
  
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortType) {
      case "name-asc": return a.title.localeCompare(b.title);
      case "name-desc": return b.title.localeCompare(a.title);
      case "category": return a.category.localeCompare(b.category);
      case "active": return b.active - a.active;
      default: return 0;
    }
  });

  const getStatusChip = (status) => (
    <Chip 
      label={status ? "Active" : "Inactive"} 
      color={status ? "success" : "error"} 
      size="small" 
      variant="outlined"
    />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f9f9f9' }}>
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'white' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h5" fontWeight="bold">
              Manage Restaurants
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField 
                placeholder="Search restaurants..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                size="small"
                sx={{ width: 250 }}
              />
              <Select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                size="small"
                IconComponent={SortIcon}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="name-asc">Name (A-Z)</MenuItem>
                <MenuItem value="name-desc">Name (Z-A)</MenuItem>
                <MenuItem value="category">Category</MenuItem>
                <MenuItem value="active">Status (Active First)</MenuItem>
              </Select>
              <IconButton 
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                color="primary"
              >
                {viewMode === "grid" ? <TableRowsIcon /> : <GridViewIcon />}
              </IconButton>
              <IconButton 
                onClick={() => setRefreshCount(prev => prev + 1)}
                color="primary"
              >
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

          {!loading && !error && (
            viewMode === "grid" ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 3 
              }}>
                {sortedRestaurants.map((res) => (
                  <motion.div 
                    key={res.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ position: 'relative', height: 160 }}>
                        <Avatar
                          src={res.imageURL || "https://placehold.co/300x200"}
                          alt={res.title}
                          variant="rounded"
                          sx={{ width: '100%', height: '100%' }}
                        />
                        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                          {getStatusChip(res.active)}
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {res.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CategoryIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
                          <Typography variant="body2" color="text.secondary">
                            {res.category || "No category"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
                          <Typography variant="body2" color="text.secondary">
                            {res.ownerName || "Unknown"}
                          </Typography>
                        </Box>
                      </CardContent>
                      <Box sx={{ p: 2 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          endIcon={<ExpandMoreIcon sx={{ 
                            transform: expanded === res.id ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s'
                          }} />}
                          onClick={() => setExpanded(expanded === res.id ? null : res.id)}
                        >
                          {expanded === res.id ? "Hide Details" : "Show More"}
                        </Button>
                        <Collapse in={expanded === res.id}>
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                            <DetailItem icon={<PhoneIcon />} text={res.contactNumber || "N/A"} />
                            <DetailItem icon={<ScheduleIcon />} text={res.timings || "No timings"} />
                            <DetailItem icon={<LocationIcon />} text={res.address || "No address"} />
                            {/* <DetailItem icon={<OfferIcon />} text={res.offers?.length ? res.offers.join(", ") : "No offers"} />
                            <DetailItem 
                              icon={<StarIcon />} 
                              text={res.reviews?.length ? `${res.reviews.length} reviews` : "No reviews"} 
                            /> */}
                          </Box>
                        </Collapse>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>

                          <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            size="small"
                            onClick={() => handleDelete(res.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Restaurant</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRestaurants.map((res) => (
                      <TableRow key={res.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={res.imageURL || "https://placehold.co/40"} 
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            {editingId === res.id && editField.field === "title" ? (
                              <TextField
                                value={editField.value}
                                onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                                size="small"
                                fullWidth
                                autoFocus
                                InputProps={{
                                  endAdornment: (
                                    <>
                                      <IconButton size="small" onClick={() => handleUpdate(res.id)}>
                                        <CheckIcon fontSize="small" color="success" />
                                      </IconButton>
                                      <IconButton size="small" onClick={handleCancelEdit}>
                                        <CloseIcon fontSize="small" color="error" />
                                      </IconButton>
                                    </>
                                  )
                                }}
                              />
                            ) : (
                              <Typography 
                                onClick={() => handleEdit(res.id, "title", res.title)}
                                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                              >
                                {res.title}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell onClick={() => handleEdit(res.id, "category", res.category)}>
                          {editingId === res.id && editField.field === "category" ? (
                            <TextField
                              value={editField.value}
                              onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                              size="small"
                              fullWidth
                              autoFocus
                              InputProps={{
                                endAdornment: (
                                  <>
                                    <IconButton size="small" onClick={() => handleUpdate(res.id)}>
                                      <CheckIcon fontSize="small" color="success" />
                                    </IconButton>
                                    <IconButton size="small" onClick={handleCancelEdit}>
                                      <CloseIcon fontSize="small" color="error" />
                                    </IconButton>
                                  </>
                                )
                              }}
                            />
                          ) : (
                            <Typography sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                              {res.category}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{res.ownerName}</TableCell>
                        <TableCell onClick={() => handleEdit(res.id, "contactNumber", res.contactNumber)}>
                          {editingId === res.id && editField.field === "contactNumber" ? (
                            <TextField
                              value={editField.value}
                              onChange={(e) => setEditField({ ...editField, value: e.target.value })}
                              size="small"
                              fullWidth
                              autoFocus
                              InputProps={{
                                endAdornment: (
                                  <>
                                    <IconButton size="small" onClick={() => handleUpdate(res.id)}>
                                      <CheckIcon fontSize="small" color="success" />
                                    </IconButton>
                                    <IconButton size="small" onClick={handleCancelEdit}>
                                      <CloseIcon fontSize="small" color="error" />
                                    </IconButton>
                                  </>
                                )
                              }}
                            />
                          ) : (
                            <Typography sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                              {res.contactNumber || "N/A"}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusChip(res.active)}
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(res.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}

          {!loading && !error && restaurants.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 200,
              flexDirection: 'column',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                No restaurants found
              </Typography>
              <Typography variant="body2">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

function DetailItem({ icon, text }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box sx={{ mr: 1, color: 'text.secondary' }}>
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}