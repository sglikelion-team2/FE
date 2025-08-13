// src/app/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { UserPrefProvider } from "../store/userPref";
export default function App(){
  return (
    <BrowserRouter>
      <UserPrefProvider>
        <AppRoutes />
      </UserPrefProvider>
    </BrowserRouter>
  );
}
