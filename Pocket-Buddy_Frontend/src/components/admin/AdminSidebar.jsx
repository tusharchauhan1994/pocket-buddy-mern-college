import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Tooltip,
  Avatar,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  Group,
  Store,
  LocalOffer,
  Settings,
  ExitToApp,
  Menu,
  Notifications,
  Assessment,
  Person,
} from "@mui/icons-material";
import axios from "axios";

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userId = localStorage.getItem("id");
        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await axios.get(`/user/user/${userId}`);
        setAdminUser(response.data.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        // Fallback to default values if API fails
        setAdminUser({
          name: "Admin User",
          email: "admin@example.com",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      console.log("Admin logged out");
      alert("You are logged out");
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Dashboard /> },
    { path: "/admin/users", label: "Manage Users", icon: <Group /> },
    { path: "/admin/restaurants", label: "Manage Restaurants", icon: <Store /> },
    { path: "/admin/restaurants2", label: "Manage Restaurants2", icon: <Store /> },
    { path: "/admin/offers", label: "Manage Offers", icon: <LocalOffer /> },
    { path: "/admin/subscription", label: "Subscription", icon: <Assessment /> },
  ];

  if (loading) {
    return (
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? 240 : 60,
          "& .MuiDrawer-paper": { 
            backgroundColor: "#f5f5f5",
            color: "#333",
            borderRight: "none",
            overflowX: "hidden",
          },
        }}
      >
        <div style={{ 
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "64px"
        }}>
          {isOpen && <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>Admin Panel</span>}
          <Button 
            onClick={() => setIsOpen(!isOpen)} 
            size="small"
            sx={{ minWidth: "32px" }}
          >
            <Menu />
          </Button>
        </div>
        <Divider />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: isOpen ? 240 : 60,
        "& .MuiDrawer-paper": { 
          backgroundColor: "#f5f5f5",
          color: "#333",
          borderRight: "none",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header with toggle button */}
      <div style={{ 
        padding: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "64px"
      }}>
        {isOpen && <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>Admin Panel</span>}
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          size="small"
          sx={{ minWidth: "32px" }}
        >
          <Menu />
        </Button>
      </div>
      <Divider />

      {/* User Profile Section */}
      {isOpen ? (
        <div style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px"
        }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64,
              bgcolor: "#1976d2",
              fontSize: "1.5rem",
              marginBottom: "8px"
            }}
          >
            {adminUser?.name?.charAt(0) || "A"}
          </Avatar>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600,
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%"
            }}
          >
            {adminUser?.name || "Admin User"}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: "#666",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%"
            }}
          >
            {adminUser?.email || "admin@example.com"}
          </Typography>
        </div>
      ) : (
        <div style={{
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          marginBottom: "8px"
        }}>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: "#1976d2",
              fontSize: "1rem"
            }}
          >
            {adminUser?.name?.charAt(0) || "A"}
          </Avatar>
        </div>
      )}
      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.path} 
            title={!isOpen ? item.label : ""} 
            placement="right"
            arrow
          >
            <ListItem
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                backgroundColor: isActive(item.path) ? "#1976d2" : "inherit",
                color: isActive(item.path) ? "#fff" : "#333",
                "&:hover": {
                  backgroundColor: isActive(item.path) ? "#1565c0" : "#e3f2fd",
                },
                padding: "8px 16px",
                margin: "4px 8px",
                borderRadius: "4px",
                transition: "background-color 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? "#fff" : "rgba(0, 0, 0, 0.54)",
                minWidth: "40px"
              }}>
                {item.icon}
              </ListItemIcon>
              {isOpen && (
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive(item.path) ? "500" : "400"
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Bottom Section - Settings and Logout */}
      <div>
        <Divider sx={{ margin: "8px 0" }} />
      

        {/* Logout */}
        <Tooltip title={!isOpen ? "Logout" : ""} placement="right" arrow>
          <ListItem
            onClick={handleLogout}
            sx={{
              "&:hover": { 
                backgroundColor: "#ffebee",
                color: "#d32f2f"
              },
              padding: "8px 16px",
              margin: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ 
              color: "inherit",
              minWidth: "40px"
            }}>
              <ExitToApp />
            </ListItemIcon>
            {isOpen && (
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ fontSize: "0.875rem" }}
              />
            )}
          </ListItem>
        </Tooltip>
      </div>
    </Drawer>
  );
};

export default AdminSidebar;