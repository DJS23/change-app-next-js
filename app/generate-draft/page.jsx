'use client'

import { useState } from 'react'
import Form_petition_rec from '../../components/Form_petition_rec'

export default function PetitionRecPage() {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  const handleAudioSubmit = async (audioBase64) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/recommend_petition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: audioBase64 })
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const { recommendation } = await res.json()
      setRecommendation(recommendation)
    } catch (err) {
      console.error(err)
      setError('Sorry, could not get a recommendation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto p-6 space-y-6">
      
      <Form_petition_rec
        onSubmit={handleAudioSubmit}
        disabled={loading}
      />

      {loading && <p className="text-blue-600">Processing your audio…</p>}
      {error   && <p className="text-red-600">{error}</p>}

    </div>
  )
}