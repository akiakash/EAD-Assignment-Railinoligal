import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DescriptionAlerts from "../../Components/AlertMsg/Alert";
import { useUser } from "../../Components/commonData";

const Login = () => {
  const { setUser } = useUser();

  const navigate = useNavigate();
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const uitheme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isFirstVisit) {
    window.scrollTo(0, 0);
    setIsFirstVisit(false);
  }

  const handleUsername = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    // You can add your login logic here using axios
    axios
      .post("/user/login", {
        email: email,
        password: password,
      })
      .then(function (response) {
        const userType = response.data.userType.toLowerCase();
        const isActive = response.data.isActive;
        if (userType === "user" || userType === "traveler" || !isActive) {
          setSeverity("info");
          setAlertMessage("Sorry! your account has not allowed to login");
          setOpenSnackbar(true);
        } else {
          console.log(response.data);
          setSeverity("success");
          setAlertMessage(`Welcome ${response.data.name}`);
          setOpenSnackbar(true);
          localStorage.setItem("user", JSON.stringify(response.data));

          setUser({
            isAuthenticated: true,
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            nic: response.data.nic,
            phone: response.data.phone,
            userType: response.data.userType,
            isActive: response.data.isActive,
          });
          navigate("/");
        }
      })
      .catch(function (err) {
        console.log(err);
        setSeverity("error");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
      });
  };

  const avatarStyles = {
    width: 90,
    height: 90,
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <DescriptionAlerts
        openSnackbar={openSnackbar}
        handleCloseSnackbar={handleCloseSnackbar}
        severity={severity}
        alertMessage={alertMessage}
      />
      <Box
        sx={{
          width: "30%",
          height: "70%",
          [uitheme.breakpoints.only("xs")]: {
            width: "80%",
            height: "50%",
          },
          borderRadius: "10px",
          border: "2px solid #2F85CE", // Add border styles
          paddingBottom: "40px",
        }}
      >
        <Box>
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              pt: "50px",
            }}
          >
            <Avatar alt="" src="/loginkey.png" sx={avatarStyles} />
          </Box>
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Typography
              variant="h5"
              fontFamily="sans-serif"
              sx={{ fontWeight: 600, paddingTop: "20px" }}
            >
              Hey There....!
            </Typography>
          </Box>
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <TextField
              type="text"
              label="Email"
              variant="outlined"
              onChange={handleUsername}
              sx={{
                mt: "20px",
                width: "80%",
                "& .MuiInputLabel-root": {
                  color: "#2F85CE", // Label text color
                },
                "& .MuiInputLabel-outlined.Mui-focused": {
                  color: "#2F85CE", // Label color when focused
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#2F85CE", // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#2F85CE", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2F85CE", // Border color when focused
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#2F85CE", // Input text color
                },
              }}
            />
          </Box>
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              onChange={handlePassword}
              sx={{
                mt: "15px",
                width: "80%",
                "& .MuiInputLabel-root": {
                  color: "#2F85CE",
                },
                "& .MuiInputLabel-outlined.Mui-focused": {
                  color: "#2F85CE",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#2F85CE",
                  },
                  "&:hover fieldset": {
                    borderColor: "#2F85CE",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2F85CE",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  color: "#007BFF",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            <Button
              sx={{
                width: "80%",
                borderRadius: "20px",

                mt: "30px",
                backgroundColor: "#2F85CE",
                ":hover": {
                  backgroundColor: "#2F85CE",
                },
                color: "white",
              }}
              onClick={handleLogin}
            >
              {" "}
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
