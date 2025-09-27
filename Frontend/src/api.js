import { create } from "apisauce";

export const api = create({
  baseURL: import.meta.env.VITE_API_URL || "https://report-assistant.onrender.com",
});
