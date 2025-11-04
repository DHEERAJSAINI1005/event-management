import { Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function TopBar({ onLogout }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      p={2}
      sx={{
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Button
        variant="outlined"
        startIcon={<LogoutIcon />}
        onClick={onLogout}
        sx={{
          color: "#333",
          borderColor: "#333",
          fontWeight: 500,
          textTransform: "none",
          borderRadius: 2,
          "&:hover": {
            backgroundColor: "#333",
            color: "#fff",
            borderColor: "#333",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
