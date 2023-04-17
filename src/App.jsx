import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from '../pages/Home'
import ForgotPassword from "../pages/ForgotPassword"
import Offers from "../pages/Offers"
import Profile from "../pages/Profile"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"


function App() {

  return (
    <>
      <Router>
        <Routes>
        <Route path="/" exact element={<Home/>}/>
        <Route path="/forgot-password" exact element={<ForgotPassword/>}/>
        <Route path="/offers" exact element={<Offers/>}/>
        <Route path="/profile" exact element={<Profile/>}/>
        <Route path="/sign-in" exact element={<SignIn/>}/>
        <Route path="/sign-up" exact element={<SignUp/>}/>
        </Routes>
    </Router>
    </>
  )
}

export default App
