import React from 'react'
import { usePoseCamStore } from './store/usePoseCamStore'
import { NavBar } from './components/ui/NavBar'
import { HomePage } from './pages/HomePage'
import { StudioPage } from './pages/StudioPage'
import { GalleryPage } from './pages/GalleryPage'

export default function App() {
  const { page } = usePoseCamStore()

  return (
    <div className="relative w-full h-full font-sans">
      <main className="h-full w-full" style={{paddingBottom: page === 'studio' ? 0 : 0}}>
        {page === 'home' && <HomePage />}
        {page === 'studio' && <StudioPage />}
        {page === 'gallery' && <GalleryPage />}
      </main>
      <NavBar />
    </div>
  )
}
