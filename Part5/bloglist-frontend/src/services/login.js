import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/login';

const login = async ({ username, password }) => {
  const response = await axios.post(baseUrl, { username, password });
  return response.data;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default { login };