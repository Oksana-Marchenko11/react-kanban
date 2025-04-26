import "./App.css";

import Search from "./components/Search.jsx";
import Navbar from "./components/NavBar.jsx";
import Kanban from "./components/Kanbans.jsx";

function App() {
  return (
    <div style={{ backgroundColor: "#09325c", minHeight: "100vh" }}>
      <Search />
      <Navbar />
      <Kanban />
    </div>
  );
}

export default App;
