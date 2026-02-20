import API from './client';

export const groupsAPI = {
  createGroup: (data) => API.post('/groups', data),
  getMyGroups: () => API.get('/groups'),
  getGroupHistory: (groupId, before = null) => {
    const url = `/groups/${groupId}/messages${before ? `?before=${before}` : ''}`;
    return API.get(url);
  },
  getEligibleStudents: () => API.get('/groups/eligible-students'),
  // Department Forum
  getDeptForumHistory: (before = null) => {
    const url = `/groups/department-forum${before ? `?before=${before}` : ''}`;
    return API.get(url);
  },
  sendDeptForumMessage: (content) => API.post('/groups/department-forum', { content }),
};
