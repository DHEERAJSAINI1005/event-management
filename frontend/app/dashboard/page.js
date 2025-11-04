"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  TextField,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import CommonModal from "../components/CommonModal";
import TopBar from "../components/TopBar";
import AppLogo from "../components/AppLogo";
import Loader from "../components/Loader";
import { API_BASE_URL } from "../constants/constant"; 
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [openRegistrationsModal, setOpenRegistrationsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [openEventModal, setOpenEventModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    durationHours: 0,
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    if (!t) {
      window.location.href = "/";
      return;
    }
    setToken(t);
    setRole(r);
    fetchEvents(t);
  }, []);

  const fetchEvents = async (token) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveEvent = async () => {
    try {
      if (!form.title || !form.startDate || !form.endDate) {
        alert("Please provide title, start date and end date");
        return;
      }
      setLoading(true);
      if (editEvent) {
        await axios.put(`${API_BASE_URL}/events/${editEvent._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Event updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/events`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Event created successfully");
      }
      setOpenEventModal(false);
      setEditEvent(null);
      setForm({ title: "", startDate: "", endDate: "", durationHours: 0, description: "" });
      fetchEvents(token);
    } catch (err) {
      console.error("Failed to save event:", err);
      alert(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ev) => {
    setEditEvent(ev);
    setForm({
      title: ev.title,
      startDate: ev.startDate.split("T")[0],
      endDate: ev.endDate.split("T")[0],
      durationHours: ev.durationHours,
      description: ev.description || "",
    });
    setOpenEventModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this event?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event deleted");
      fetchEvents(token);
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (ev) => {
    return `${window.location.origin}/events/public/${ev.slug}`;
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (searchDate) params.date = searchDate; // backend handles date filtering
      const { data } = await axios.get(`${API_BASE_URL}/events/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setEvents(data);
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const viewRegistrations = async (eventId) => {
  try {
    setLoading(true);
    const { data } = await axios.get(`${API_BASE_URL}/events/${eventId}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelectedRegistrations(data);
    setOpenRegistrationsModal(true);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    alert("Failed to load registrations");
  } finally {
    setLoading(false);
  }
};

  return (
    <Box p={3} bgcolor="#f9fafc" minHeight="100vh">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <AppLogo />
        <TopBar onLogout={handleLogout} />
      </Stack>

      <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpenEventModal(true)}>
                Create Event
              </Button>
            <Button variant="outlined" onClick={() => fetchEvents(token)}><RefreshIcon/></Button>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={performSearch}><SearchIcon /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <Button variant="contained" onClick={performSearch}>Search</Button>
          </Stack>
        </Stack>
      </Card>

      {loading ? <Loader /> : (
        <Card sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="h6" mb={2}>Events</Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell>Title</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  {/* <TableCell>Duration (hours)</TableCell> */}
                  <TableCell>Public URL</TableCell>
                  {/* {role === "admin" && <TableCell align="center">Actions</TableCell>} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((ev) => (
                  <TableRow key={ev._id}>
                    <TableCell>{ev.title}</TableCell>
                    <TableCell>{new Date(ev.startDate).toLocaleString()}</TableCell>
                    <TableCell>{new Date(ev.endDate).toLocaleString()}</TableCell>
                    {/* <TableCell>{ev.durationHours}</TableCell> */}
                    <TableCell>
                      <a href={getPublicUrl(ev)} target="_blank" rel="noreferrer">
                        <IconButton size="small"><OpenInNewIcon /></IconButton>
                      </a>
                      <IconButton size="small" onClick={() => viewRegistrations(ev._id)}>
                        <VisibilityIcon /> 
                      </IconButton>
                    </TableCell>
                    {/* {role === "admin" && (
                      <TableCell align="center">
                        <IconButton onClick={() => handleEdit(ev)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(ev._id)}><DeleteIcon /></IconButton>
                      </TableCell>
                    )} */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <CommonModal
        open={openEventModal}
        onClose={() => { setOpenEventModal(false); setEditEvent(null); setForm({ title: "", startDate: "", endDate: "", durationHours: 0, description: "" }); }}
        title={editEvent ? "Edit Event" : "Create Event"}
        onSubmit={saveEvent}
        submitLabel={editEvent ? "Update" : "Create"}
      >
        <Grid container spacing={1}>
          <Grid item size={12}>
            <TextField label="Title" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Grid>
          <Grid item size={12}><TextField label="Start Date" type="datetime-local" fullWidth value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item size={12}><TextField label="End Date" type="datetime-local" fullWidth value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item size={12}><TextField label="Duration Hours" type="number" fullWidth value={form.durationHours} onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })} /></Grid>
          <Grid item size={12}><TextField label="Description" fullWidth multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
        </Grid>
      </CommonModal>

      <CommonModal
  open={openRegistrationsModal}
  onClose={() => setOpenRegistrationsModal(false)}
  title="Registered Users"
>
  {selectedRegistrations.length === 0 ? (
    <Typography>No users have registered yet.</Typography>
  ) : (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Registered At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedRegistrations.map((user, i) => (
            <TableRow key={i}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{new Date(user.registeredAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )}
      </CommonModal>

    </Box>
  );
}
