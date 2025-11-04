"use client";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function Loader({ message = "Loading..." }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="60vh"
      width="100%"
    >
      <CircularProgress
        size={48}
        thickness={4.5}
        sx={{ color: "#1976d2", mb: 2 }}
      />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
