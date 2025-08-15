import '../App.css';
import AppRoutes from "./routes";
import { UserPrefProvider } from "../store/userPref";

function App() {
  return (
    <div className="App">
  <UserPrefProvider>
    <AppRoutes />
    </UserPrefProvider>
        
     
    </div>
  );
}

export default App;

