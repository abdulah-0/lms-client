import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getMarks, deleteMarks } from '../api'; // 🛠

function Marks() {
  const [marksData, setMarksData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newMarks, setNewMarks] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchMarksData();
  }, []);

  const fetchMarksData = async () => {
    try {
      const response = await getMarks();
      setMarksData(response.data);
    } catch (error) {
      console.error('Error fetching marks:', error);
      enqueueSnackbar('Failed to fetch marks.', { variant: 'error' });
    }
  };

  const handleEdit = (id, currentMarks) => {
    setEditId(id);
    setNewMarks(currentMarks);
  };

  const handleSaveEdit = (id) => {
    const updatedMarks = marksData.map((student) =>
      student.id === id ? { ...student, marks: parseInt(newMarks) } : student
    );
    setMarksData(updatedMarks);
    setEditId(null);
    setNewMarks('');
    // Optional: Update to backend if needed
  };

  const handleDeleteMarks = async () => {
    try {
      await deleteMarks(deleteId);
      setMarksData(marksData.filter(student => student.id !== deleteId));
      enqueueSnackbar('Student marks deleted successfully!', { variant: 'success' });
      setOpenDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
      enqueueSnackbar('Failed to delete student marks.', { variant: 'error' });
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
        Marks
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Roll Number</strong></TableCell>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Marks Obtained</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marksData.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>{student.subject}</TableCell>
                <TableCell>
                  {editId === student.id ? (
                    <TextField
                      type="number"
                      value={newMarks}
                      onChange={(e) => setNewMarks(e.target.value)}
                      size="small"
                    />
                  ) : (
                    student.marks
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {editId === student.id ? (
                      <Button variant="contained" color="success" size="small" onClick={() => handleSaveEdit(student.id)}>
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(student.id, student.marks)}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" size="small" onClick={() => confirmDelete(student.id)}>
                          Delete
                        </Button>
                      </>
                    )}
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
            Are you sure you want to delete this student's marks?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteMarks} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Marks;
