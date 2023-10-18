import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Box,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DescriptionAlerts from "../../Components/AlertMsg/Alert";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const UserManagement = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`/user`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setSeverity("error");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
      });
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const editButtonClicked = (user) => {
    setSelectedUser(user);
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewType("");
    setSelectedUser([]);
  };

  const handleOpenDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId("");
  };

  const deleteButtonClicked = (id) => {
    setDeleteId(id);
  };

  useEffect(() => {
    if (deleteId) {
      handleOpenDelete();
    }
  }, [deleteId]);

  const handleType = (e) => {
    setNewType(e.target.value);
  };

  const handleUpdate = () => {
    axios
      .put(`/user/${selectedUser.id}`, {
        id: selectedUser.id,
        name: selectedUser.name,
        password: selectedUser.password,
        email: selectedUser.email,
        nic: selectedUser.nic,
        phone: selectedUser.phone,
        userType: newType,
        isActive: selectedUser.isActive,
      })
      .then((response) => {
        console.log(response);
        setNewType("");
        setSelectedUser([]);
        handleClose();
        setSeverity("success");
        setAlertMessage("User Type has been changed successfully");
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        setSeverity("error");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
        if (err.response.status === 401) {
          navigate("/");
        }
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/user/${deleteId}`)
      .then((response) => {
        setDeleteId(false);
        handleCloseDelete();
        setSeverity("success");
        setAlertMessage("Deleted sucessfully");
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        setSeverity("error");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
        if (err.response.status === 401) {
          navigate("/");
        }
      });
  };

  const editUserStatus = (user) => {
    user.isActive = !user.isActive;
    console.log(user);
    axios
      .put(`/user/${user.id}`, {
        id: user.id,
        name: user.name,
        password: user.password,
        email: user.email,
        nic: user.nic,
        phone: user.phone,
        userType: user.userType,
        isActive: user.isActive,
      })
      .then((res) => {
        setSeverity("success");
        setAlertMessage(
          `Account has been ${
            user.isActive ? "activated" : "deacivated"
          } successfully`
        );
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        user.isActive = !user.isActive;
        setSeverity("error");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
      });
  };

  return (
    <Box>
      <DescriptionAlerts
        openSnackbar={openSnackbar}
        handleCloseSnackbar={handleCloseSnackbar}
        severity={severity}
        alertMessage={alertMessage}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: "30px",
          mb: "30px",
          ml: "30px",
          mr: "30px",
        }}
      >
        <TableContainer component={Paper} align="center">
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ background: "#2F85CE" }}>
                  Name
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  Email
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  NIC
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  Phone Number
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  UserType
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  Status
                </StyledTableCell>
                <StyledTableCell align="letf" style={{ background: "#2F85CE" }}>
                  Delete
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <StyledTableRow
                  key={user.id}
                  // sx={{
                  //   ":hover": { backgroundColor: "#666" },
                  //   "&.custom-row": {
                  //     backgroundColor: user.isActive ? "" : "",
                  //   },
                  // }}
                  className="custom-row"
                >
                  <StyledTableCell component="th" scope="row">
                    {user.name}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {user.email}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {user.nic}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {user.phone}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Button
                      sx={{
                        color: "#2F85CE",
                        textTransform: "capitalize",
                        ":hover": {
                          backgroundColor: "#2F85CE",
                          color: "white",
                        },
                      }}
                      onClick={() => editButtonClicked(user)}
                    >
                      {user.userType}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        backgroundColor: user.isActive ? "green" : "red",
                        color: "white",
                        padding: "8px",
                        minWidth: "36px",
                        height: "36px",
                        ":hover": {
                          backgroundColor: "#2F85CE",
                          color: "white",
                        },
                      }}
                      onClick={() => editUserStatus(user)}
                    >
                      {user.isActive ? "Active" : "Non Active"}
                    </Button>
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    <DeleteIcon
                      sx={{
                        borderRadius: "5px",
                        width: "40px",
                        height: "30px",
                        ":hover": {
                          backgroundColor: "#2F85CE",
                          color: "white",
                        },
                      }}
                      onClick={() => deleteButtonClicked(user.id)}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle
            sx={{
              backgroundColor: "#2F85CE",
              color: "white",
              textAlign: "center",
            }}
          >
            Update UserType
          </DialogTitle>
          <DialogContent sx={{ mt: "10px" }}>
            <FormControl sx={{ mt: "10px" }}>
              <FormLabel id="radio-buttons-group-label">Types</FormLabel>
              <RadioGroup
                onChange={handleType}
                defaultValue={selectedUser.status}
              >
                <FormControlLabel
                  value={"traveler"}
                  control={<Radio />}
                  label="Traveler"
                />
                <FormControlLabel
                  value={"user"}
                  control={<Radio />}
                  label="User"
                />
                <FormControlLabel
                  value={"traveler agent"}
                  control={<Radio />}
                  label="Traveler agent"
                />
                <FormControlLabel
                  value={"backofficer"}
                  control={<Radio />}
                  label="Backofficer"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                backgroundColor: "#2F85CE",
                width: "30%",
                color: "white",
                ":hover": {
                  backgroundColor: "#2F85CE",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "#2F85CE",
                color: "white",
                width: "70%",
                ":hover": {
                  backgroundColor: "#50C878",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={handleUpdate}
            >
              Update Type
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <Dialog open={deleteDialogOpen} onClose={handleCloseDelete}>
          <DialogContent sx={{ mt: "10px" }}>
            <DialogContentText>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></Box>
              Are you sure! Do you want to delete it?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                backgroundColor: "#2F85CE",
                width: "50%",
                color: "white",
                ":hover": {
                  backgroundColor: "red",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={handleCloseDelete}
            >
              No! Don't
            </Button>
            <Button
              sx={{
                backgroundColor: "#2F85CE",
                color: "white",
                width: "50%",
                ":hover": {
                  backgroundColor: "#50C878",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={handleDelete}
            >
              yes, please
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserManagement;
