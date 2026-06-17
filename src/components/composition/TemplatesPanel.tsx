import React, { useState } from 'react'
import { Plus, X, Check, Trash2, Bookmark } from 'lucide-react'
import { usePoseCamStore } from '../../store/usePoseCamStore'

const EMOJI_OPTIONS = ['📍', '🌊', '☕', '✈️', '🏞️', '🌆', '🌸', '🪞', '🎬', '🛤️']

export function TemplatesPanel({ onClose }: { onClose: () => void }) {
  const { templates, overlay, applyTemplate, deleteTemplate, saveTemplate, activeTemplateId } = usePoseCamStore()
  const [isSaving, setIsSaving] = useState(false)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0])

  const handleSave = () => {
    if (!name.trim()) return
    saveTemplate(name.trim(), emoji)
    setIsSaving(false)
    setName('')
  }

  return (
    <div className="glass-dark rounded-2xl p-4 shadow-2xl max-h-[60vh] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Bookmark size={14} className="text-accent-400" />
          <span className="text-white font-semibold text-sm">Shot Templates</span>
        </div>
        <button onClick={onClose} className="text-white/50">
          <X size={16} />
        </button>
      </div>

      {isSaving ? (
        <div className="space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Waterfall Pose"
            className="w-full bg-white/10 text-white placeholder-white/40 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-accent-400"
          />
          <div className="flex gap-1.5 flex-wrap">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-colors ${
                  emoji === e ? 'bg-white' : 'bg-white/10'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSaving(false)}
              className="flex-1 py-2.5 rounded-lg bg-white/10 text-white/70 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="flex-1 py-2.5 rounded-lg bg-accent-500 text-white text-xs font-medium disabled:opacity-40"
            >
              Save Template
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsSaving(true)}
            disabled={!overlay.image}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white/10 text-white text-xs font-medium mb-3 disabled:opacity-40"
          >
            <Plus size={14} />
            {overlay.image ? 'Save current setup as template' : 'Upload an overlay first'}
          </button>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
            {templates.length === 0 ? (
              <p className="text-white/40 text-xs text-center py-6">
                No templates yet. Set up your overlay, grid, and filter the way you like, then save it for next time.
              </p>
            ) : (
              templates.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 rounded-xl p-2.5 transition-colors ${
                    activeTemplateId === t.id ? 'bg-accent-500/25 ring-1 ring-accent-400/50' : 'bg-white/8'
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                    {t.overlayImage ? (
                      <img src={t.overlayImage} className="w-full h-full object-cover" alt={t.name} />
                    ) : (
                      <span className="text-lg">{t.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{t.emoji} {t.name}</p>
                    <p className="text-white/40 text-[10px]">
                      {t.gridMode !== 'none' ? t.gridMode : 'no grid'} · {t.digiFilter !== 'none' ? t.digiFilter : 'natural'}
                    </p>
                  </div>
                  <button
                    onClick={() => applyTemplate(t.id)}
                    className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"
                  >
                    {activeTemplateId === t.id ? (
                      <Check size={14} className="text-accent-300" />
                    ) : (
                      <span className="text-white text-[10px] font-medium">Use</span>
                    )}
                  </button>
                  <button
                    onClick={() => deleteTemplate(t.id)}
                    className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 size={12} className="text-red-300" />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
