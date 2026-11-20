import { useRef, useState } from 'react'
import { exportEntries, parseImportFile } from '../lib/storage'

export default function ImportExportMenu({ onImportAppend, onImportOverwrite }) {
  const fileInputRef = useRef(null)
  const [pending, setPending] = useState(null)
  const [error, setError] = useState(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const entries = parseImportFile(String(reader.result))
        setPending(entries)
      } catch (err) {
        setError(err.message)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportEntries}
        className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Export
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setError(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xl"
          >
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setError(null)}
                className="rounded bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {pending && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setPending(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-xl"
          >
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Import {pending.length} {pending.length === 1 ? 'entry' : 'entries'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Append adds these to your existing data. Overwrite replaces all current data with this file.
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setPending(null)}
                className="rounded px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onImportAppend(pending)
                  setPending(null)
                }}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Append
              </button>
              <button
                onClick={() => {
                  if (window.confirm('This will replace all current data with the imported file. Continue?')) {
                    onImportOverwrite(pending)
                    setPending(null)
                  }
                }}
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Overwrite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
