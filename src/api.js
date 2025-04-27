import axios from 'axios';

const API_URL = 'http://localhost:5001';  // ✅ JSON Server running on this port

// Attendance APIs
export const getAttendance = () => axios.get(`${API_URL}/attendance`);
export const updateAttendance = (id, updatedData) => axios.put(`${API_URL}/attendance/${id}`, updatedData);
export const deleteAttendance = (id) => axios.delete(`${API_URL}/attendance/${id}`);

// Marks APIs
export const getMarks = () => axios.get(`${API_URL}/marks`);
export const updateMarks = (id, updatedData) => axios.put(`${API_URL}/marks/${id}`, updatedData);
export const deleteMarks = (id) => axios.delete(`${API_URL}/marks/${id}`);

// Study Materials APIs
export const getMaterials = () => axios.get(`${API_URL}/materials`);
export const addMaterial = (newMaterial) => axios.post(`${API_URL}/materials`, newMaterial);
export const deleteMaterial = (id) => axios.delete(`${API_URL}/materials/${id}`);
