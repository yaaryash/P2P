import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { ReactComponent as LogoWithChat } from "../assests/logoWithChat.svg";
import API from "../api";

export default function LoginPage({ setUser }) {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password, phone });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <AppProvider theme={theme}>
      <Container
        maxWidth="xs"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(-5%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 8,
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: "background.paper",
          }}
        >
          <Box>
            <LogoWithChat />
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Phone"
            type="phone"
            variant="outlined"
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#6E80A4",
              "&:hover": {
                bgcolor: "#5A6A8E",
              },
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>
      </Container>
    </AppProvider>
  );
}
