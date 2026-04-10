import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Practice from "./Practice";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  return (
    <div>
      {page === "login" && (
        <Login setPage={setPage} setUser={setUser} />
      )}
      {page === "register" && (
        <Register setPage={setPage} />
      )}
      {page === "dashboard" && (
        <Dashboard user={user} setPage={setPage} />
      )}
      {page === "practice" && (
        <Practice user={user} setPage={setPage} />
      )}
    </div>
  );
}

export default App;