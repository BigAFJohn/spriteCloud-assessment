export default {
  USERS: {
    LIST: `/users`, 
    SINGLE: (id: number) => `/users/${id}`, 
    DELAYED: (delaySeconds: number) => `/users?delay=${delaySeconds}`, 
  },

  LOGIN: `/login`,

  UPDATE_USER: (id: number) => `/users/${id}`,

  DELETE_USER: (id: number) => `/users/${id}`,
};