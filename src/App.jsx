import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/landingpage';
import Gamepage from './components/Gamepage';


function App() {
  

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<LandingPage></LandingPage>}> </Route>
    <Route path='/game' element={<Gamepage></Gamepage>}></Route>
   </Routes>
   
   </BrowserRouter>
  );
}

export default App; 