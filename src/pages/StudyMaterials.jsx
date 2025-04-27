import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getMaterials, addMaterial, deleteMaterial } from '../api'; // 🛠
import axios from 'axios';

function StudyMaterials() {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [open, setOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file: null });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchMaterialsData();
  }, []);

  const fetchMaterialsData = async () => {
    try {
      const response = await getMaterials();
      setStudyMaterials(response.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      enqueueSnackbar('Failed to fetch study materials.', { variant: 'error' });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewMaterial({ title: '', description: '', file: null });
  };

  const handleAddMaterial = async () => {
    if (!newMaterial.file) {
      enqueueSnackbar('Please upload a file.', { variant: 'error' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', newMaterial.file);

      const uploadResponse = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = uploadResponse.data.url;

      const newEntry = {
        title: newMaterial.title,
        description: newMaterial.description,
        link: uploadedUrl,
      };

      const response = await addMaterial(newEntry);
      setStudyMaterials([...studyMaterials, response.data]);
      handleClose();
      enqueueSnackbar('Study material uploaded successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Upload failed', error);
      enqueueSnackbar('Upload failed. Try again.', { variant: 'error' });
    }
  };

  const handleDeleteMaterial = async () => {
    try {
      await deleteMaterial(deleteId);
      setStudyMaterials(studyMaterials.filter(material => material.id !== deleteId));
      enqueueSnackbar('Study material deleted successfully!', { variant: 'success' });
      setOpenDialog(false);
    } catch (error) {
      console.error('Delete failed:', error);
      enqueueSnackbar('Failed to delete study material.', { variant: 'error' });
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
        Study Materials
      </Typography>

      {/* Upload Button */}
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="success" onClick={handleClickOpen}>
          Upload Study Material
        </Button>
      </Stack>

      {/* Materials Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studyMaterials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.title}</TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      href={material.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => confirmDelete(material.id)}
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

      {/* Upload Material Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload New Study Material</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Material Title"
            fullWidth
            value={newMaterial.title}
            onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Material Description"
            fullWidth
            value={newMaterial.description}
            onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddMaterial} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this study material?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteMaterial} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudyMaterials;
