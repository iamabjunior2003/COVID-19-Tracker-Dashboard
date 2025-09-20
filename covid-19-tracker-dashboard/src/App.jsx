import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/Login'
import DashBoard from './components/DashBoard'
import SignUp from './components/SignUp'
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'
import AllTimeData from './components/AllTimeData'
import History from './components/History'
import CountryData from './components/CountryData'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="alldata" element={<AllTimeData />} />
        <Route path="history" element={<History />} />
        <Route path="countrydata" element={<CountryData />} />
      </Routes>
    </>
  )
}

export default App
