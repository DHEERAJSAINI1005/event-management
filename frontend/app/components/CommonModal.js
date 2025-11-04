"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
} from "@mui/material";

export default function CommonModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow:
            "0px 8px 20px rgba(0, 0, 0, 0.15), 0px 2px 6px rgba(0, 0, 0, 0.05)",
          bgcolor: "#fff",
        },
      }}
    >
      <DialogTitle sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          color="text.primary"
          sx={{ letterSpacing: 0.3 }}
        >
          {title}
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          px: 3,
          py: 2,
          bgcolor: "#fafafa",
          borderTop: "none",
          borderBottom: "none",
        }}
      >
        <Box>{children}</Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 500,
            borderColor: "#bdbdbd",
            "&:hover": {
              backgroundColor: "#f2f2f2",
              borderColor: "#9e9e9e",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
