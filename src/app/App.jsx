// src/app/App.jsx
import '../App.css';
import AppRoutes from "./routes";
import { UserPrefProvider } from "../store/userPref";




function App() {
  return (
    
    <div className="App">
      
      <AppRoutes />
      
    </div>
  );
}

export default App;
