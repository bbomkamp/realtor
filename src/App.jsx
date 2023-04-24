import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import ForgotPassword from "./pages/ForgotPassword"
import Offers from "./pages/Offers"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import NavBar from "./components/NavBar"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing";


function App() {

  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/forgot-password" exact element={<ForgotPassword />} />
          <Route path="/offers" exact element={<Offers />} />
          <Route path="/sign-in" exact element={<SignIn />} />
          <Route path="/sign-up" exact element={<SignUp />} />

          
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" exact element={<Profile />} />
          </Route>
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" exact element={<CreateListing/>} />
          </Route>
          <Route path="/edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" exact element={<EditListing/>} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
