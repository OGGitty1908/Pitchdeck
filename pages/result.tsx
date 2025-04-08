import { useEffect, useState } from 'react';
import Image from 'next/image';

const getSlideImage = (title: string) => {
  const images: { [key: string]: string } = {
    'Cover Slide': '/images/cover.jpg',
    'Problem': '/images/problem.jpg',
    'Solution': '/images/solution.jpg',
    'Market Research': '/images/research.jpg',
    'Story & UVP': '/images/story.jpg',
    'Business Model': '/images/business.jpg',
    'Competitors': '/images/competitors.jpg',
    'Call to Action': '/images/cta.jpg',
  };
  return images[title] || '/images/default.jpg';
};

export default function ResultPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const deck = localStorage.getItem('pitchDeck');
    if (deck) {
      const parsed = JSON.parse(deck);
      setSlides(parsed.slides || []);
    }
  }, []);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading slides...</p>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 p-4 flex justify-between items-center">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg">
          Slide {currentSlide + 1} of {slides.length}
        </span>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Slide Content */}
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="relative h-64">
            <Image
              src={getSlideImage(currentSlideData.title)}
              alt={currentSlideData.title}
              layout="fill"
              objectFit="cover"
              className="opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
            <h2 className="absolute bottom-0 left-0 right-0 p-6 text-3xl font-bold">
              {currentSlideData.title}
            </h2>
          </div>
          
          <div className="p-8">
            <div className="prose prose-invert max-w-none">
              {currentSlideData.content.split('\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="mb-4 text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Preview */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 overflow-x-auto">
        <div className="flex space-x-4 max-w-4xl mx-auto">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-32 h-24 rounded overflow-hidden relative flex-shrink-0 ${
                currentSlide === idx ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Image
                src={getSlideImage(slide.title)}
                alt={slide.title}
                layout="fill"
                objectFit="cover"
                className="opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
              <span className="absolute bottom-1 left-1 right-1 text-xs font-medium truncate">
                {slide.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 