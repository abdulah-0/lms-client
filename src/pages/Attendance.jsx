import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getAttendance, deleteAttendance } from '../api';  // 🛠

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const response = await getAttendance();
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      enqueueSnackbar('Failed to fetch attendance.', { variant: 'error' });
    }
  };

  const toggleAttendance = (id) => {
    const updatedData = attendanceData.map((student) =>
      student.id === id
        ? { ...student, status: student.status === 'Present' ? 'Absent' : 'Present' }
        : student
    );
    setAttendanceData(updatedData);
    // Optional: You can update the server if needed
  };

  const handleDeleteAttendance = async () => {
    try {
      await deleteAttendance(deleteId);
      setAttendanceData(attendanceData.filter(student => student.id !== deleteId));
      enqueueSnackbar('Student deleted successfully!', { variant: 'success' });
      setOpenDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
      enqueueSnackbar('Failed to delete student.', { variant: 'error' });
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom color="primary">
        Attendance
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Roll Number</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>
                  <Chip
                    label={student.status}
                    color={student.status === 'Present' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color={student.status === 'Present' ? 'error' : 'success'}
                      size="small"
                      onClick={() => toggleAttendance(student.id)}
                    >
                      {student.status === 'Present' ? 'Mark Absent' : 'Mark Present'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => confirmDelete(student.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteAttendance} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Attendance;
