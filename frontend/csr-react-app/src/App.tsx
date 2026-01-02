import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SearchDebouncedCache from './system-design/search-debounce-cache'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/search/debounced-cache" element={<SearchDebouncedCache />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
