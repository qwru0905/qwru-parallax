import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dev from './pages/Dev'
import YouTube from './pages/YouTube'
import Music from './pages/Music'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="/youtube" element={<YouTube />} />
        <Route path="/music" element={<Music />} />
      </Routes>
    </BrowserRouter>
  )
}
