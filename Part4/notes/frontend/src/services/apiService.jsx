import axios from 'axios';

const baseUrl = 'http://localhost:8080'; // Update with your backend URL

const apiService = {
  

  addNote: async (noteData) => {
    try {
      const response = await axios.post(`${baseUrl}/add-note`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  updateNote: async (noteId, updatedData) => {
    try {
      const response = await axios.put(`${baseUrl}/update-note/${noteId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  deleteNote: async (noteId) => {
    try {
      const response = await axios.delete(`${baseUrl}/delete-note/${noteId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },
  getNotes: async () => {
    try {
      const response = await axios.get(`${baseUrl}/get-notes`); // Replace with your actual endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }
}

export default apiService;