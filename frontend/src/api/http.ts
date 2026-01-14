import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:5160",
  headers: {
    "Content-Type": "application/json",
  },
});
