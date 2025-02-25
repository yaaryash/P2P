import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Button,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import { ReactComponent as LogoWithChat } from "../assests/logoWithChat.svg";
import { ReactComponent as SearchIcon } from "../assests/SearchIcon.svg";
import { ReactComponent as CloseIcon } from "../assests/CloseIcon.svg";
import { ReactComponent as SendIcon } from "../assests/SendIcon.svg";
import API from "../api";
const theme = {
  light: {
    primary: "#ffffff",
    secondary: "#f5f5f5",
    text: "#000000",
    border: "#ddd",
    messageBg: "#e3f2fd",
    hover: "rgba(0, 0, 0, 0.05)",
  },
  dark: {
    primary: "#1a1a1a",
    secondary: "#2d2d2d",
    text: "#ffffff",
    border: "#404040",
    messageBg: "#3d3d3d",
    hover: "rgba(255, 255, 255, 0.1)",
  },
};

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function ChatPage({ user }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Select a user to start chatting"
  );
  const [darkMode, setDarkMode] = useState(false);
  const welcomeMessages = [
    "Select a user to start chatting",
    "Connect with your teammates",
    "Start a conversation",
    "Ready to collaborate?",
    "Message your colleagues",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWelcomeMessage((prevMessage) => {
        const currentIndex = welcomeMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % welcomeMessages.length;
        return welcomeMessages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const filteredUsers = (users) => {
    return users.filter((user) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm))
      );
    });
  };

  const fetchMessages = async (selectedUser) => {
    setLoading(true);
    try {
      const existingMessages = [selectedUser.messages[0].text] || [];
      const allMessages = [selectedUser.lastMessage, existingMessages].filter(
        Boolean
      );
      setMessages(allMessages);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
    setLoading(false);
  };
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      text: newMessage,
      sender: user.name,
      timestamp: new Date(),
    };

    try {
      const res = await API.post(`/messages/${selectedUser._id}`, messageData);
      setSelectedUser((prevUser) => ({
        ...prevUser,
        messages: [...prevUser.messages, messageData],
        lastMessage: messageData.text,
        timestamp: new Date(),
      }));
      setNewMessage("");
      const messageContainer = document.querySelector(".message-container");
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    return date.toLocaleDateString();
  };

  return (
    <Grid
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: darkMode ? theme.dark.primary : theme.light.primary,
        color: darkMode ? theme.dark.text : theme.light.text,
        transition: "all 0.3s ease",
      }}
    >
      <Box
        sx={{
          width: 420,
          borderRight: "1px solid #ddd",
          p: 2,
          bgcolor: darkMode ? theme.dark.secondary : theme.light.primary,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            mb: 2,
          }}
        >
          <LogoWithChat />
          <FormControlLabel
            control={
              <IOSSwitch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
          />
        </Box>
        <TextField
          fullWidth
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              height: "40px",
            },
          }}
        />
        <List>
          {filteredUsers(users)?.map((u) => (
            <ListItem
              button
              key={u.id}
              onClick={() => handleUserClick(u)}
              sx={{
                display: "flex",
                py: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar sx={{ width: 50, height: 50, mr: 2 }}>
                  {u.name[0]}
                </Avatar>
                {u.isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 10,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "#44b700",
                      border: "2px solid #fff",
                      boxShadow: "0 0 0 2px #fff",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {u.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(u.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {u.messages?.length > 0
                    ? u.messages[u.messages.length - 1].text
                    : "No messages yet"}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: selectedUser ? "#f5f5f5" : "white",
          pb: 2,
          width: showUserDetails ? "calc(100% - 450px)" : "100%",
        }}
      >
        {selectedUser ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pb: 2,
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fff",
                gap: 2,
              }}
            >
              <Avatar sx={{ width: 40, height: 40, ml: 2, mt: 2 }}>
                {selectedUser.name[0]}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500, mt: 2 }}>
                  {selectedUser.name}
                </Typography>
              </Box>
            </Box>
            <Box
              className="message-container"
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                display: "flex",
                flexDirection: "column-reverse",
                mr: 10,
                ml: 10,
              }}
            >
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  {selectedUser.messages
                    .slice()
                    .reverse()
                    .map((msg, index, array) => (
                      <Box key={index}>
                        {index === array.length - 1 &&
                          formatMessageDate(messages[index - 1]?.timestamp) !==
                            formatMessageDate(msg.timestamp) && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mb: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  bgcolor: "rgba(0, 0, 0, 0.04)",
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: 5,
                                  fontSize: "0.8rem",
                                  color: "text.secondary",
                                }}
                              >
                                Today
                              </Typography>
                            </Box>
                          )}
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent:
                              msg.sender === user.name
                                ? "flex-end"
                                : "flex-start",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              bgcolor:
                                msg.sender === user.name ? "#DEE9FF" : "white",
                              color: "black",
                              p: 1.5,
                              borderRadius: "8px",
                              minWidth: "60px",
                              position: "relative",
                              paddingBottom: "20px",
                            }}
                          >
                            <Typography>{msg.text}</Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                position: "absolute",
                                right: 8,
                                bottom: 4,
                                fontSize: "0.7rem",
                                opacity: 0.7,
                              }}
                            >
                              {new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                </>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1, mr: 12, ml: 12, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={sendMessage}
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                          },
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    "& fieldset": { border: "none" },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(0, 0, 0, 0.6)",
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "90vh",
              gap: 3,
            }}
          >
            <LogoWithChat
              sx={{
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-20px)" },
                  "100%": { transform: "translateY(0px)" },
                },
              }}
            />
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                color: "primary.main",
                fontWeight: 500,
                transition: "opacity 0.5s ease-in-out",
                animation: "fadeInOut 2s infinite",
                "@keyframes fadeInOut": {
                  "0%": { opacity: 0.3 },
                  "50%": { opacity: 1 },
                  "100%": { opacity: 0.3 },
                },
              }}
            >
              {welcomeMessage}
            </Typography>
          </Box>
        )}
      </Box>
      {selectedUser && (
        <Box
          sx={{
            width: showUserDetails ? 400 : 0,
            borderLeft: "1px solid #ddd",
            transition: "width 0.3s ease",
            overflow: "hidden",
          }}
        >
          {showUserDetails && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton onClick={() => setShowUserDetails(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    mb: 2,
                  }}
                >
                  {selectedUser.name[0]}
                </Avatar>
                <Typography variant="h6">{selectedUser.name}</Typography>
                <Typography color="text.secondary">
                  {selectedUser.email}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Grid>
  );
}
