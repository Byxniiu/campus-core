import API from './client';

export const timetableAPI = {
  createTimetable: (data) => API.post('/timetables', data),
  getMyTimetable: () => API.get('/timetables/my-timetable'),
  getTodayClasses: () => API.get('/timetables/today'),
  getStudentTimetable: (id) => API.get(`/timetables/student/${id}`),
  updateTimetable: (id, data) => API.put(`/timetables/${id}`, data),
  deleteTimetable: (id) => API.delete(`/timetables/${id}`),
  getAllTimetables: () => API.get('/timetables'),
};

export default timetableAPI;
