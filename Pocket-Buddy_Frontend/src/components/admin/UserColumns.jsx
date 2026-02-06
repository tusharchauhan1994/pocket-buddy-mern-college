import { IconButton, Tooltip, Select, MenuItem, Switch } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";

// Handle Edit
const handleEdit = (id) => {
  console.log("Edit User ID:", id);
  alert(`Edit user with ID: ${id}`);
};

// Handle Delete
const handleDelete = async (id, getAllUsers) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    try {
      await axios.delete(`http://localhost:3000/user/delete/${id}`);

      toast.success("✅ User deleted successfully!", { position: "top-right", autoClose: 2000 });
      getAllUsers(); // ✅ Refresh user list

    } catch (error) {
      toast.error("❌ Failed to delete user!", { position: "top-right", autoClose: 2000 });
      console.error("❌ Error deleting user:", error);
    }
  }
};

// Handle Role Change
const handleRoleChange = async (id, newRole, getAllUsers) => {
  try {
    await axios.put(`http://localhost:3000/user/update-role/${id}`, {
      role: newRole.toLowerCase(),
    }); // ✅ Convert to lowercase
    alert("User role updated successfully!");
    getAllUsers();
  } catch (error) {
    alert("Failed to update role.");
    console.error("Error updating role:", error);
  }
};

// Handle Status Change
const handleStatusChange = async (id, currentStatus, getAllUsers, setUsers) => {
  try {
    console.log("User ID:", id, "Current Status:", currentStatus);

    const newStatus = !Boolean(currentStatus); // ✅ Ensure correct Boolean toggle

    const response = await axios.put(
      `http://localhost:3000/user/update-status/${id}`,
      {
        status: newStatus,
      }
    );

    console.log("Response Data:", response.data); // ✅ Debugging

    if (response.status === 200) {
      alert("User status updated successfully!");

      // ✅ Immediately update the UI before fetching updated data
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );

      getAllUsers(); // ✅ Fetch latest user data
    } else {
      alert("Failed to update status.");
    }
  } catch (error) {
    console.error(
      "❌ Error updating status:",
      error.response?.data || error.message
    );
    alert("Failed to update status.");
  }
};

// ✅ Ensure `columns` function receives `setUsers` from `AdminUsers.jsx`
export const columns = (getAllUsers, setUsers) => [
  { field: "_id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "email", headerName: "Email", width: 220 },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    renderCell: (params) => (
      <Select
        value={params.row.role}
        onChange={(e) =>
          handleRoleChange(params.row._id, e.target.value, getAllUsers)
        }
        size="small"
      >
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="restaurant">Restaurant</MenuItem>
      </Select>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <Switch
        checked={params.row.status === true} // ✅ Ensures proper Boolean check
        onChange={() =>
          handleStatusChange(
            params.row._id,
            params.row.status,
            getAllUsers,
            setUsers
          )
        }
        color="success"
      />
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <>
        {/* <Tooltip title="Edit">
          <IconButton
            onClick={() => handleEdit(params.row._id)}
            color="primary"
          >
            <Edit />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Delete">
          <IconButton
            onClick={() => handleDelete(params.row._id, getAllUsers)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];
