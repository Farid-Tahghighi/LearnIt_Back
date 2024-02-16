import axios from "axios";
import authHeader from "./auth-header.service";

const API_URL = "http://localhost:3000/users/";

export const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

export const getUserBoard = () => {
  return axios.get(API_URL + "student", { headers: authHeader() });
};

export const getModeratorBoard = () => {
  return axios.get(API_URL + "moderator", { headers: authHeader() });
};

export const getAdminBoard = () => {
  return axios.get(API_URL + "teacher", { headers: authHeader() });
};
