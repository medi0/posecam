import React from 'react'
import { Camera, Image, Home } from 'lucide-react'
import { usePoseCamStore, Page } from '../../store/usePoseCamStore'

export function NavBar() {
  const { page, setPage } = usePoseCamStore()

  const items: { id: Page; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'studio', icon: <Camera size={20} />, label: 'Studio' },
    { id: 'gallery', icon: <Image size={20} />, label: 'Gallery' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-warm-400/10">
      <div className="flex items-center justify-around py-2 pb-safe max-w-lg mx-auto">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all duration-200 ${
              page === item.id
                ? 'text-accent-600'
                : 'text-warm-400 hover:text-warm-600'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
