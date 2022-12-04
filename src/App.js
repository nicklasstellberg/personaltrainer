import "./App.css";
import { AppBar } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Customerlist from "./components/Customerlist";
import Traininglist from "./components/Traininglist";
import CalendarComponent from "./components/Calendar";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Trainer
          </Typography>
        </Toolbar>
      </AppBar>
      <Router>
           <div className="App">
            <ul>
              <li>
                <Link to="/">Customers</Link>
              </li>
              <li>
                <Link to="/traininglist">Trainings</Link>
              </li>
              <li>
                <Link to="/calendar">Calendar</Link>
              </li>
            </ul>
           <Routes>
                 <Route exact path='/' element={< Customerlist />}></Route>
                 <Route exact path='/traininglist' element={< Traininglist />}></Route>
                 <Route exact path='/calendar' element={< CalendarComponent />}></Route>
          </Routes>
          </div>
       </Router>
    </div>
  );
}

export default App;
