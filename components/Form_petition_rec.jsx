'use client'

import { useState, useEffect } from 'react'
import { MicrophoneIcon, StopCircleIcon } from '@heroicons/react/24/solid'
import MicRecorder from 'mic-recorder-to-mp3'

const mp3Recorder = new MicRecorder({ bitRate: 128 })

export default function AudioPetitionForm({ onRecommend }) {
  const [recording, setRecording] = useState(false)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('')


useEffect(() => {
    async function fetchLocation() {
    const res = await fetch('/api/get_location')
    const { location } = await res.json()
    setLocation(location)  // e.g. “San Francisco, California, United States”
    }
    fetchLocation()
}, [])

  const toggleRecording = async () => {
    if (!recording) {
      try {
        await mp3Recorder.start()
        setRecording(true)
      } catch (e) {
        console.error('Could not start recording:', e)
        setLoading(false)
      }
    } else {
      try {
        const [buffer, blob] = await mp3Recorder.stop().getMp3()
        setRecording(false)
        
        // send MP3 blob + Location to API
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64 = reader.result.split(',')[1]
          setLoading(true)
          const res = await fetch('/api/recommend_petition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                audio: base64,
                location: location })
          })
          const { recommendation } = await res.json()
          setRecommendation(recommendation)
          setLoading(false)
          // if (onRecommend) onRecommend(recommendation)
        }
        reader.readAsDataURL(blob)
      } catch (e) {
        console.error('Could not stop recording:', e)
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center pt-6 min-h-screen border-b border-gray-900/10 space-y-6">
     <h1 className="text-3xl font-bold">Record your voice note</h1>
      <p className="text-gray-500 text-sm">
        Record a short message about what you’re angry about, and we’ll suggest a petition you can start.
      </p>
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Blurred gradient background */}
        <div className="absolute inset-14 rounded-full bg-gradient-to-tr from-purple-400 via-red-500 to-blue-500 filter blur-xl z-0"></div>

        {/* Only show the button when not loading */}
        {!loading && (
          <button
            onClick={toggleRecording}
            className={`z-10 p-6 rounded-full shadow-lg border cursor-pointer ${
              recording
                ? 'bg-red-500 border-red-600 hover:bg-red-600'
                : 'bg-white border-gray-200 hover:bg-gray-100'
            } focus:outline-none`}
          >
            {recording ? (
              <StopCircleIcon className="w-8 h-8 text-white" />
            ) : (
              <MicrophoneIcon className="w-8 h-8 text-gray-700" />
            )}
          </button>
        )}

        {/* White spinner on top when loading */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      

      {recommendation && (
        <div className="bg-gray-100 p-10 rounded-2xl w-full max-w-3xl">
          <h4 className="font-semibold">Your Petition Recommendation</h4>
          <pre className="pt-3 rounded font-sans text-base whitespace-pre-wrap break-words">
          <p>{recommendation}</p>
          </pre>
        </div>
      )}
    </div>
  )
}