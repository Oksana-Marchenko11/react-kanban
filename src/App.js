import "./App.css";

import Search from "./components/Search.jsx";
import Navbar from "./components/NavBar.jsx";
import Kanban from "./components/Kanbans.jsx";

function App() {
  return (
    <div>
      <Search />
      <Navbar />
      <Kanban />
    </div>
  );
}

export default App;
