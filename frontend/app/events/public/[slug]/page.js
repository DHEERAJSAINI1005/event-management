"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";

const BASE_URL = "http://localhost:5000/api/events";

export default function PublicEventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (slug) {
      axios.get(`${BASE_URL}/public/${slug}`)
        .then(res => setEvent(res.data))
        .catch(() => setMessage("Event not found"));
    }
  }, [slug]);

  const handleRegister = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/public/${slug}/register`, form);
      setMessage(data.message);
      setForm({ name: "", email: "" });
    } catch {
      setMessage("Registration failed. Try again.");
    }
  };

  if (!event) return <Typography align="center" mt={5}>{message || "Loading..."}</Typography>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" mb={2}>{event.title}</Typography>
        <Typography variant="body1" mb={1}>{event.description}</Typography>
        <Typography variant="body2" mb={1}>
           {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
        </Typography>

        <Typography variant="h6" mb={2}>Register Now</Typography>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          margin="dense"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          margin="dense"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleRegister}>
          Register
        </Button>

        {message && (
          <Typography align="center" mt={2} color="primary">
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
