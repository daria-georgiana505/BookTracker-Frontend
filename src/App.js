import React from 'react';
import { BrowserRouter, Routes, Route} from "react-router-dom";

import './App.css';
import BooksTable from './BooksTable.js';
import Details from './Details.js';
import UpdateBook from './UpdateBook.js';
import AddBook from './AddBook.js';
import MainPage from './MainPage.js';
import Login from './Login.js';
import Register from './Register.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="" element={<MainPage />} />
            <Route path="/all" element={<BooksTable />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/update/:id" element={<UpdateBook />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
