import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout.jsx'
import Home from './pages/home.jsx'
import SignUp from './pages/SignUpPage.jsx';
import Login from './pages/LoginPage.jsx';
import Offers from './pages/offers.jsx';
import Profile from './pages/Profle.jsx';
import ProtectedRoute from './middleware/protectedRoute.jsx'
import CreateOffer from './pages/createOffer.jsx';
import { Toaster } from 'react-hot-toast';
import Session from './pages/sessions.jsx';
import Room from './pages/Room.jsx';
import VideoCall from './pages/videoCall.jsx';
import CreateCourse from './pages/createCourse.jsx';
import Courses from './pages/Courses.jsx';
import Dashboard from './pages/Dashboard.jsx';
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allow="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <Session />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/offers/:offer_type" element={<Offers />} />
            <Route path="/courses" element={<Courses />} />
            <Route
              path="/offers/:offer_type/create"
              element={
                <ProtectedRoute>
                  <CreateOffer />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/room/:id/:toId"
              element={
                <ProtectedRoute>
                  <Room />
                </ProtectedRoute>
              }
            />
            <Route
              path="/video-call/:roomID"
              element={
                <ProtectedRoute>
                  <VideoCall />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/create-course/:userId"
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              }
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App
