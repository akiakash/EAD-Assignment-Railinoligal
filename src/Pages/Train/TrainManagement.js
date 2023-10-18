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
  Avatar,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DescriptionAlerts from "../../Components/AlertMsg/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useUser } from "../../Components/commonData";

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

const TrainManagement = () => {
  const { setTrain } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [AddOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedTrain, setSelectedTrain] = useState([]);
  const [trains, setTrains] = useState([]);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedScheduleDateTime, setUpdatedScheduleDateTime] = useState("");
  const [updatedSeatsCount, setUpdatedSeatsCount] = useState("");
  const [updatedFrom, setUpdatedFrom] = useState("");
  const [updatedTo, setUpdatedTo] = useState("");
  const [newTrainName, setNewTrainName] = useState("");
  const [newTrainScheduleDateTime, setNewTrainScheduleDateTime] = useState("");
  const [newTrainSeatCount, setNewTrainSeatCount] = useState("");
  const [newTrainFrom, setNewTrainFrom] = useState("");
  const [newTrainTo, setNewTrainTo] = useState("");

  useEffect(() => {
    axios.get(`/trains`).then((res) => {
      setTrains(res.data);
    });
  }, []);

  const handleUpdatedName = (e) => {
    setUpdatedName(e.target.value);
  };

  const handleScheduleDateTime = (newDate) => {
    if (newDate) {
      const formattedDate = newDate.format("YYYY-MM-DDTHH:mm:ss");
      setUpdatedScheduleDateTime(formattedDate);
    }
  };

  const handleNewTrainScheduleDateTime = (newDate) => {
    if (newDate) {
      const formattedDate = newDate.format("YYYY-MM-DDTHH:mm:ss");
      setNewTrainScheduleDateTime(formattedDate);
    }
  };

  const handleSeatCount = (e) => {
    setUpdatedSeatsCount(e.target.value);
  };

  const handleFrom = (e) => {
    setUpdatedFrom(e.target.value);
  };

  const handleTo = (e) => {
    setUpdatedTo(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const editButtonClicked = (train) => {
    setSelectedTrain(train);
    setUpdatedName(train.trainName);
    setUpdatedScheduleDateTime(train.scheduleDateTime);
    setUpdatedSeatsCount(train.seatsCount);
    setUpdatedFrom(train.from);
    setUpdatedTo(train.to);
    handleClickOpen();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickAddOpen = () => {
    setAddOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTrainName("");
    setNewTrainScheduleDateTime("");
    setNewTrainSeatCount("");
    setNewTrainFrom("");
    setNewTrainTo("");
    setOpen(false);
  };

  const closemodal = () => {
    setAddOpen(false);
    console.log("closing");
  };

  const handleAddClose = () => {
    setAddOpen(false);
    setSelectedTrain([]);
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

  const handleUpdate = () => {
    console.log(selectedTrain);
    axios
      .put(`/trains/${selectedTrain.id}`, {
        id: selectedTrain.id,
        trainName: updatedName,
        scheduleDateTime: updatedScheduleDateTime,
        seatsCount: parseInt(updatedSeatsCount),
        from: updatedFrom,
        to: updatedTo,
      })
      .then((response) => {
        console.log(response);
        setSelectedTrain([]);
        setUpdatedName("");
        setUpdatedScheduleDateTime("");
        setUpdatedSeatsCount("");
        setUpdatedFrom("");
        setUpdatedTo("");
        handleClose();
        setSeverity("success");
        setAlertMessage("Updated sucessfully");
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

  const handleAdd = () => {
    console.log(selectedTrain);
    axios
      .post(`/trains`, {
        trainName: newTrainName,
        scheduleDateTime: newTrainScheduleDateTime,
        seatsCount: parseInt(newTrainSeatCount),
        from: newTrainFrom,
        to: newTrainTo,
      })
      .then((response) => {
        setNewTrainName("");
        setNewTrainScheduleDateTime("");
        setNewTrainSeatCount("");
        setNewTrainFrom("");
        setNewTrainTo("");
        handleAddClose();
        setSeverity("success");
        setAlertMessage("Added sucessfully");
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        setSeverity("error");
        setAlertMessage(err.response.data.errors.train);
        setOpenSnackbar(true);
        if (err.response.status === 401) {
          navigate("/");
        }
      });
  };

  const handleDelete = () => {
    axios
      .delete(`/trains/${deleteId}`)
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
        setSeverity("error");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
        if (err.response.status === 401) {
          navigate("/");
        }
      });
  };

  const reserveButtonClicked = (train) => {
    setTrain({
      isCreateTrain: true,
      id: train.id,
      trainName: train.trainName,
      scheduleDateTime: train.scheduleDateTime,
      seatsCount: train.seatsCount,
      from: train.from,
      to: train.to,
    });
    navigate("/reservation");
  };

  return (
    <Box>
      <Button
        sx={{
          mt: "50px",
          left: "800px",
          color: "white",
          textTransform: "capitalize",
          backgroundColor: "#2F85CE",
          ":hover": { backgroundColor: "#2F85CE" },
        }}
        onClick={() => handleClickAddOpen()}
      >
        Add new train
      </Button>
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
              <TableRow style={{ background: "#2F85CE" }}>
                <StyledTableCell style={{ background: "#2F85CE" }}>
                  TrainName
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  ScheduleDateTime
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  SeatsCount
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  From
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  To
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  Reserve
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  Edit
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  Delete
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {trains.map((train) => (
                <StyledTableRow
                  key={train.id}
                  sx={{
                    ":hover": { backgroundColor: "white" },
                    "&.custom-row": {},
                  }}
                  className="custom-row"
                >
                  <StyledTableCell component="th" scope="row">
                    {train.trainName}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {train.scheduleDateTime}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {train.seatsCount}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {train.from}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {train.to}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Button
                      sx={{
                        textTransform: "capitalize",
                      }}
                      onClick={() => reserveButtonClicked(train)}
                    >
                      <AddCircleIcon />
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Button
                      sx={{
                        textTransform: "capitalize",
                      }}
                      onClick={() => editButtonClicked(train)}
                    >
                      <EditIcon />
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
                      onClick={() => deleteButtonClicked(train.id)}
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
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
            }}
          >
            Update Train
          </DialogTitle>
          <DialogContent sx={{ mt: "10px" }}>
            <DialogContentText>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt=""
                  src={updatedScheduleDateTime}
                  sx={{
                    width: 90,
                    height: 90,
                    backgroundColor: "black",
                    position: "top",
                  }}
                />
              </Box>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Train name"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={updatedName}
              onChange={handleUpdatedName}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  "DateTimePicker",
                  "DateTimePicker",
                  "DateTimePicker",
                ]}
              >
                <DemoItem label="Pick the date and time">
                  <DateTimePicker
                    defaultValue={dayjs(updatedScheduleDateTime)}
                    onChange={(newDate) => handleScheduleDateTime(newDate)}
                    views={[
                      "year",
                      "month",
                      "day",
                      "hours",
                      "minutes",
                      "seconds",
                    ]}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>

            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Seat count"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={updatedSeatsCount}
              onChange={handleSeatCount}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="From"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={updatedFrom}
              onChange={handleFrom}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="To"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={updatedTo}
              onChange={handleTo}
            />
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                backgroundColor: "black",
                width: "50%",
                color: "white",
                ":hover": {
                  backgroundColor: "red",
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
                backgroundColor: "black",
                color: "white",
                width: "50%",
                ":hover": {
                  backgroundColor: "#50C878",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <Dialog
          open={AddOpen}
          onClose={handleAddClose}
          style={{ borderRadius: "40px" }}
        >
          <DialogTitle
            sx={{
              backgroundColor: "#2F85CE",
              color: "white",
              textAlign: "center",
            }}
          >
            Add New Train
          </DialogTitle>
          <DialogContent sx={{ mt: "10px", width: "400px" }}>
            <DialogContentText>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></Box>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Train name"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setNewTrainName(e.target.value);
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  "DateTimePicker",
                  "DateTimePicker",
                  "DateTimePicker",
                ]}
              >
                <DemoItem label="Pick the date and time">
                  <DateTimePicker
                    onChange={(newDate) =>
                      handleNewTrainScheduleDateTime(newDate)
                    }
                    views={[
                      "year",
                      "month",
                      "day",
                      "hours",
                      "minutes",
                      "seconds",
                    ]}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>

            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Seat count"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setNewTrainSeatCount(e.target.value);
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="From"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setNewTrainFrom(e.target.value);
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="To"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setNewTrainTo(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              sx={{
                backgroundColor: "#2F85CE",
                width: "50%",
                color: "white",
                ":hover": {
                  backgroundColor: "#2F85CE",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={closemodal}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "#2F85CE",
                color: "white",
                width: "50%",
                ":hover": {
                  backgroundColor: "#2F85CE",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={handleAdd}
            >
              Add
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
                backgroundColor: "black",
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
                backgroundColor: "black",
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

export default TrainManagement;
