import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { keyframes } from "@emotion/react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
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
import { useUser } from "../../Components/commonData";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

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
  const { train, setTrain } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [AddOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedReservation, setSelectedReservation] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [updatedUserId, setUpdatedUserId] = useState("");
  const [updatedScheduleDateTime, setUpdatedScheduleDateTime] = useState("");
  const [updatedSeatsCount, setUpdatedSeatsCount] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedNIC, setUpdatedNIC] = useState("");
  const [reservationTrainId, setReservationTrainId] = useState("");
  const [reservationDateAndTime, setReservationDateAndTime] = useState("");
  const [reserveSeatCount, setReserveSeatCount] = useState(1);
  const [reserveUserId, setReserveUserId] = useState("");
  const [reserveNic, setReserveNic] = useState("");
  const [oldBooking, setOldBooking] = useState("");
  const [bookedSeatCount, setBookedSeatCount] = useState("");

  useEffect(() => {
    axios.get(`/reservation`).then((res) => {
      setReservations(res.data);
    }, []);

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      console.log(userData);
      setReserveUserId(userData.id);
    }

    if (train.isCreateTrain) {
      setReservationTrainId(train.id);
      setReservationDateAndTime(train.scheduleDateTime);
      handleClickAddOpen();
      axios
        .get(`https://ead-web-api.azurewebsites.net/bookings/train/${train.id}`)
        .then((res) => {
          const bookingsData = res.data;
          setOldBooking(bookingsData);
          console.log(res);

          // Filter bookings with booking.status === true
          const filteredBookings = bookingsData.filter(
            (booking) => booking.status === true
          );

          // Calculate the sum of noOfSeates for filtered bookings
          const totalSeats = filteredBookings.reduce(
            (acc, booking) => acc + booking.noOfSeates,
            0
          );

          setBookedSeatCount(totalSeats);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleUpdatedName = (e) => {
    setUpdatedUserId(e.target.value);
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
      setReservationDateAndTime(formattedDate);
    }
  };

  const handleSeatCount = (e) => {
    setUpdatedSeatsCount(e.target.value);
  };

  const handleFrom = (e) => {
    setUpdatedStatus(e.target.value);
  };

  const handleTo = (e) => {
    setUpdatedNIC(e.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const editButtonClicked = (reservation) => {
    setUpdatedUserId(reservation.trainName);
    // setUpdatedScheduleDateTime(reservation.scheduleDateTime)
    // setUpdatedStatus(reservation.from)
    setSelectedReservation(reservation);
    setUpdatedSeatsCount(reservation.noOfSeates);
    setUpdatedNIC(reservation.nic);
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
    setReservationTrainId("");
    setReservationDateAndTime("");
    setReserveSeatCount("");
    setReserveUserId("");
    setReserveNic("");
  };

  const handleAddClose = () => {
    setTrain({
      isCreateTrain: false,
      id: "",
      trainName: "",
      scheduleDateTime: "",
      seatsCount: "",
      from: "",
      to: "",
    });
    setReserveUserId("");
    setReservationTrainId("");
    setReservationDateAndTime("");
    setReserveSeatCount("");
    setReserveUserId("");
    setReserveNic("");
    setAddOpen(false);
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

  const availableSeats = () => {
    console.log(bookedSeatCount);
    return train.seatsCount - bookedSeatCount;
  };

  const updatedAvailableSeat = () => {
    // return train.seatsCount - bookedSeatCount
  };
  const handleUpdate = () => {
    // const available = updatedAvailableSeat()
    // console.log(available)
    // if (available < reserveSeatCount) {
    //   setSeverity('info')
    //   setAlertMessage(`Sorry! maximum available seat count is ${available}`)
    //   setOpenSnackbar(true);
    // }
    console.log(selectedReservation);
    axios
      .put(`/reservation/${selectedReservation.id}`, {
        id: selectedReservation.id,
        userID: selectedReservation.userID,
        trainID: selectedReservation.trainID,
        nic: updatedNIC,
        trainName: selectedReservation.trainName,
        reservationDate: selectedReservation.reservationDate,
        noOfSeates: parseInt(updatedSeatsCount),
        status: true,
      })
      .then((response) => {
        console.log(response);
        setSelectedReservation([]);
        setUpdatedUserId("");
        setUpdatedScheduleDateTime("");
        setUpdatedSeatsCount("");
        setUpdatedStatus("");
        setUpdatedNIC("");
        handleClose();
        setSeverity("success");
        setAlertMessage("Updated successfully");
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err.response.data);
        setSeverity("info");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
        if (err.response.status === 401) {
          navigate("/");
        }
      });
  };

  const handleAdd = () => {
    const available = availableSeats();
    if (available < reserveSeatCount) {
      setSeverity("info");
      setAlertMessage(`Sorry! maximum available seat count is ${available}`);
      setOpenSnackbar(true);
    } else {
      axios
        .post(`/reservation`, {
          userID: reserveUserId,
          trainID: reservationTrainId,
          nic: reserveNic,
          trainName: train.trainName,
          reservationDate: reservationDateAndTime,
          noOfSeates: parseInt(reserveSeatCount),
          status: true,
        })
        .then((response) => {
          handleAddClose();
          setSeverity("success");
          setAlertMessage("Reserved successfully");
          setOpenSnackbar(true);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        })
        .catch((err) => {
          console.log(err.response.data);
          setSeverity("error");
          setAlertMessage(err.response.data);
          setOpenSnackbar(true);
          if (err.response.status === 401) {
            navigate("/");
          }
        });
    }
  };

  const handleDelete = () => {
    axios
      .delete(`/reservation/${deleteId}`)
      .then((response) => {
        setDeleteId(false);
        handleCloseDelete();
        setSeverity("success");
        setAlertMessage("Deleted successfully");
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

  const editReservationStatus = (reservation) => {
    reservation.status = !reservation.status;
    console.log(reservation);
    axios
      .put(`/reservation/${reservation.id}`, {
        id: reservation.id,
        userID: reservation.userID,
        trainID: reservation.trainID,
        trainName: reservation.trainName,
        nic: reservation.nic,
        reservationDate: reservation.reservationDate,
        noOfSeates: parseInt(reservation.noOfSeates),
        status: reservation.status,
      })
      .then((res) => {
        setSeverity("success");
        setAlertMessage(
          `reservation has been ${
            reservation.status ? " in active" : "deactivate"
          } state`
        );
        setOpenSnackbar(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        reservation.status = !reservation.status;
        console.log(err);
        setSeverity("error");
        setAlertMessage(err.response.data);
        setOpenSnackbar(true);
      });
  };

  //   const fadeIn = keyframes`
  //   from {
  //     opacity: 0;
  //   }
  //   to {
  //     opacity: 1;
  //   }
  // `;

  return (
    <Box>
      <Button
        sx={{
          mt: "30px",
          ml: "760px",
          color: "white",
          textTransform: "capitalize",
          backgroundColor: "#2F85CE",
        }}
        onClick={() => navigate("/")}
      >
        Reserve seats
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
              <TableRow>
                {/* <StyledTableCell align="left">UserID</StyledTableCell>
                <StyledTableCell align="left">TrainID</StyledTableCell> */}
                <StyledTableCell style={{ background: "#2F85CE" }}>
                  TrainName
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  NIC
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  ReservationDate
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  noOfSeates
                </StyledTableCell>
                <StyledTableCell align="left" style={{ background: "#2F85CE" }}>
                  Status
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
              {reservations.map((reservation) => (
                <StyledTableRow
                  key={reservation.id}
                  sx={{
                    "&.custom-row": {
                      backgroundColor: reservation.status ? "" : "#",
                    },
                  }}
                  className="custom-row"
                >
                  {/* <StyledTableCell component="th" scope="row">
                    {reservation.userID}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {reservation.trainID}
                  </StyledTableCell> */}
                  <StyledTableCell component="th" scope="row">
                    {reservation.trainName}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {reservation.nic}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {reservation.reservationDate}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {reservation.noOfSeates}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Button
                      sx={{
                        textTransform: "capitalize",
                        padding: "8px",
                        minWidth: "36px",
                        height: "36px",
                        backgroundColor: reservation.status ? "green" : "red",
                        color: "white",
                        ":hover": {
                          backgroundColor: "#2F85CE",
                        },
                      }}
                      onClick={() => editReservationStatus(reservation)}
                    >
                      {reservation.status ? (
                        <>
                          <ToggleOnIcon /> Active
                        </>
                      ) : (
                        <>
                          <ToggleOffIcon /> Non Active
                        </>
                      )}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Button
                      sx={{
                        textTransform: "capitalize",
                      }}
                      onClick={() => editButtonClicked(reservation)}
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
                      onClick={() => deleteButtonClicked(reservation.id)}
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
            Update Reservation
          </DialogTitle>
          <DialogContent sx={{ mt: "10px" }}>
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
              defaultValue={selectedReservation.trainID}
              disabled={true}
              autoFocus
              margin="dense"
              id="name"
              label="Train Id"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              defaultValue={selectedReservation.trainName}
              disabled={true}
              autoFocus
              margin="dense"
              id="name"
              label="Train Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  "DateTimePicker",
                  "DateTimePicker",
                  "DateTimePicker",
                ]}
              >
                <DemoItem label="Scheduled Time">
                  <DateTimePicker
                    disabled={true}
                    defaultValue={dayjs(selectedReservation.reservationDate)}
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
              disabled={true}
              autoFocus
              margin="dense"
              id="email"
              label="User Id"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={selectedReservation.userID}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label={"number of seats (Available seat : " + "15" + ")"}
              type="number"
              fullWidth
              variant="standard"
              defaultValue={updatedSeatsCount}
              onChange={(e) => {
                setUpdatedSeatsCount(e.target.value);
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Traveler NIC"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={updatedNIC}
              onChange={(e) => {
                setUpdatedNIC(e.target.value);
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
              onClick={handleClose}
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
              onClick={handleUpdate}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box>
        <Dialog open={AddOpen} onClose={handleAddClose}>
          <DialogTitle
            sx={{
              backgroundColor: "#2F85CE",
              color: "white",
              textAlign: "center",
            }}
          >
            Add New Reservation
          </DialogTitle>
          <DialogContent sx={{ mt: "10px" }}>
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
              defaultValue={reservationTrainId}
              disabled={true}
              autoFocus
              margin="dense"
              id="name"
              label="Train Id"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setReservationTrainId(e.target.value);
              }}
            />
            <TextField
              defaultValue={train.trainName}
              disabled={true}
              autoFocus
              margin="dense"
              id="name"
              label="Train Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  "DateTimePicker",
                  "DateTimePicker",
                  "DateTimePicker",
                ]}
              >
                <DemoItem label="Scheduled Time">
                  <DateTimePicker
                    disabled={true}
                    defaultValue={dayjs(reservationDateAndTime)}
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
              disabled={true}
              autoFocus
              margin="dense"
              id="email"
              label="User Id"
              type="text"
              fullWidth
              variant="standard"
              defaultValue={reserveUserId}
              onChange={(e) => {
                setReserveUserId(e.target.value);
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label={
                "number of seats (Available seat : " + availableSeats() + ")"
              }
              type="number"
              fullWidth
              variant="standard"
              defaultValue={reserveSeatCount}
              onChange={(e) => {
                setReserveSeatCount(e.target.value);
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Traveler NIC"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setReserveNic(e.target.value);
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
                  backgroundColor: "red",
                  color: "white",
                  cursor: "pointer",
                },
              }}
              onClick={handleAddClose}
            >
              Cancel
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

export default TrainManagement;
