"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { API_BASE_URL } from "./constants/constant";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#3f51b5",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={1} color="primary">
            Event Management System
          </Typography>

          <TextField
            label="Email"
            type="email"
            fullWidth
            size="small"
            variant="outlined"
            margin="normal"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            size="small"
            variant="outlined"
            margin="normal"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {error && (
            <Typography color="error" variant="body2" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            size="small"
            sx={{ mt: 3, py: 1.2, fontWeight: 600, borderRadius: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
