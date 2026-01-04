import { useState,Suspense,lazy } from 'react'
import "@fontsource/play";
import "@fontsource/playball";
import './App.css'

// lazyload components
const Skeleton2 = lazy (()=> import('./components/Skeleton2.jsx'));
const History = lazy (()=> import('./components/History.jsx'));
const Favs = lazy (()=> import('./components/Favs.jsx'));

//import mainpage
import Karibuni from './pages/Karibuni.jsx';

//lazy load other pages
const Tamati = lazy (()=> import('./pages/Tamati.jsx'));
const Football = lazy (()=> import('./pages/Football.jsx'));
const Countries = lazy (()=> import('./pages/Countries.jsx'));
//Import routes
import {BrowserRouter,Routes,Route,Link } from 'react-router-dom'; 


function App() {
  
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-center mt-10 text-white">Loading...</div>}>
        <Routes>
            
            //Each indidvidual router
            <Route path='/' element={<Karibuni/>} ></Route>
              <Route path='/tamati' element={<Tamati/>} ></Route>
                <Route path='/football' element={<Football/>} ></Route>
                  <Route path='/countries' element={<Countries/>} ></Route>
              <Route path='/skeleton2' element={<Skeleton2/>} ></Route>
              <Route path='/history' element={<History/>} ></Route>
            <Route path='/favs' element={<Favs/>} ></Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
     
   
  )
}

export default App;
