import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    const deck = localStorage.getItem('pitchDeck');
    if (deck) {
      const parsed = JSON.parse(deck);
      setSlides(parsed.slides || []);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your AI-Generated Pitch Deck</h1>
      {slides.length === 0 ? (
        <p>Loading slides...</p>
      ) : (
        slides.map((slide, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">{slide.title}</h2>
            <p>{slide.content}</p>
          </div>
        ))
      )}
    </div>
  );
} 