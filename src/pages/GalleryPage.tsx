import React, { useState } from 'react'
import { Trash2, X, Download } from 'lucide-react'
import { usePoseCamStore, CapturedPhoto } from '../store/usePoseCamStore'

function PhotoCard({ photo, onDelete, onView }: { photo: CapturedPhoto; onDelete: () => void; onView: () => void }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm" style={{aspectRatio:'4/5'}}>
      <img src={photo.dataUrl} alt="Captured" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2.5 flex items-end justify-between">
        <span className="text-white/70 text-[9px]">
          {new Date(photo.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        <div className="flex gap-1.5">
          <button onClick={onView} className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <span className="text-white text-[10px]">⛶</span>
          </button>
          <button onClick={onDelete} className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Trash2 size={11} className="text-red-300" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface Lightbox { photo: CapturedPhoto; view: 'result' | 'inspo' }

export function GalleryPage() {
  const { photos, deletePhoto, setPage } = usePoseCamStore()
  const [lightbox, setLightbox] = useState<Lightbox | null>(null)

  const handleDownload = (dataUrl: string) => {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `posecam-${Date.now()}.jpg`
    a.click()
  }

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-cream-100" style={{paddingBottom:'72px'}}>
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-warm-600 font-bold text-xl mb-1">Your shots</h1>
        <p className="text-warm-400 text-xs">{photos.length} photo{photos.length !== 1 ? 's' : ''} saved</p>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="text-5xl mb-4">📷</div>
          <p className="text-warm-500 font-semibold mb-1">Nothing yet</p>
          <p className="text-warm-400 text-xs mb-6">Head to the Studio, upload an inspiration, and take your first shot.</p>
          <button
            onClick={() => setPage('studio')}
            className="bg-warm-600 text-white px-5 py-2.5 rounded-full text-sm font-medium"
          >
            Open Studio
          </button>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-3">
          {photos.map(photo => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onDelete={() => deletePhoto(photo.id)}
              onView={() => setLightbox({ photo, view: 'result' })}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-2">
              <button
                onClick={() => setLightbox(l => l ? {...l, view:'result'} : null)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  lightbox.view === 'result' ? 'bg-white text-black' : 'text-white/50'
                }`}
              >Result</button>
              {lightbox.photo.inspirationUrl && (
                <button
                  onClick={() => setLightbox(l => l ? {...l, view:'inspo'} : null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    lightbox.view === 'inspo' ? 'bg-white text-black' : 'text-white/50'
                  }`}
                >Inspiration</button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(lightbox.view === 'result' ? lightbox.photo.dataUrl : lightbox.photo.inspirationUrl!)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
              >
                <Download size={15} className="text-white" />
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={15} className="text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={lightbox.view === 'result' ? lightbox.photo.dataUrl : (lightbox.photo.inspirationUrl || lightbox.photo.dataUrl)}
              alt="View"
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
          </div>

          {lightbox.photo.inspirationUrl && (
            <div className="p-4 text-center">
              <p className="text-white/40 text-xs">
                {lightbox.view === 'inspo' ? 'Inspiration reference' : 'Your captured shot'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
