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

const getPresenterNotes = (title: string, content: string) => {
  const notes: { [key: string]: string } = {
    'Cover Slide': 'Start with a strong opening. Make eye contact with the audience.',
    'Problem': 'Emphasize the pain points. Use real-world examples if possible.',
    'Solution': 'Highlight the unique aspects of your solution.',
    'Market Research': 'Share key statistics. Be prepared to answer questions about market size.',
    'Story & UVP': 'Make it personal. Connect emotionally with the audience.',
    'Business Model': 'Be clear about revenue streams. Have backup numbers ready.',
    'Competitors': 'Be respectful but confident about your advantages.',
    'Call to Action': 'End with a clear next step. Make it easy for investors to take action.',
  };
  return notes[title] || 'No specific notes for this slide.';
};

export default function ResultPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    const deck = localStorage.getItem('pitchDeck');
    if (deck) {
      const parsed = JSON.parse(deck);
      setSlides(parsed.slides || []);
    }

    // Add keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'p') {
        togglePresenterMode();
      } else if (e.key === 't') {
        toggleTimer();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          toggleFullscreen();
        }
        if (isPresenterMode) {
          setIsPresenterMode(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isFullscreen, isPresenterMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePresenterMode = () => {
    setIsPresenterMode(!isPresenterMode);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    <div className={`min-h-screen bg-black text-white ${isFullscreen ? 'fixed inset-0' : ''}`}>
      {/* Navigation Controls */}
      <div className={`fixed top-0 left-0 right-0 bg-black/50 p-4 flex justify-between items-center z-50 ${isFullscreen ? 'opacity-0 hover:opacity-100 transition-opacity' : ''}`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-lg">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTimer}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            {formatTime(timer)}
          </button>
          <button
            onClick={togglePresenterMode}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            {isPresenterMode ? 'Exit Presenter' : 'Presenter Mode'}
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Slide Content */}
        <div className={`flex-1 flex items-center justify-center p-4 ${isPresenterMode ? 'w-3/4' : 'w-full'}`}>
          <div className={`bg-gray-900 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? 'w-full h-full rounded-none' : 'max-w-4xl'}`}>
            <div className="relative h-96">
              <Image
                src={getSlideImage(currentSlideData.title)}
                alt={currentSlideData.title}
                layout="fill"
                objectFit="cover"
                className="opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
              <h2 className="absolute bottom-0 left-0 right-0 p-8 text-4xl font-bold">
                {currentSlideData.title}
              </h2>
            </div>
            
            <div className="p-8">
              <div className="prose prose-invert max-w-none text-xl">
                {currentSlideData.content.split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Presenter Notes */}
        {isPresenterMode && (
          <div className="w-1/4 bg-gray-800 p-4 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Presenter Notes</h3>
            <div className="mb-4 p-4 bg-gray-700 rounded">
              <h4 className="font-semibold mb-2">Current Slide Notes:</h4>
              <p>{getPresenterNotes(currentSlideData.title, currentSlideData.content)}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Next Slide:</h4>
              <p className="text-gray-300">
                {currentSlide < slides.length - 1 ? slides[currentSlide + 1].title : 'End of presentation'}
              </p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Timer:</h4>
              <p className="text-2xl font-mono">{formatTime(timer)}</p>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Keyboard Shortcuts:</h4>
              <ul className="text-sm space-y-1">
                <li>→ or Space: Next slide</li>
                <li>←: Previous slide</li>
                <li>F: Toggle fullscreen</li>
                <li>P: Toggle presenter mode</li>
                <li>T: Toggle timer</li>
                <li>Esc: Exit fullscreen/presenter mode</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Slide Preview (only visible when not in fullscreen) */}
      {!isFullscreen && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/50 p-4 overflow-x-auto">
          <div className="flex space-x-4 max-w-4xl mx-auto">
            {slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-32 h-24 rounded overflow-hidden relative flex-shrink-0 transition-transform hover:scale-105 ${
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
      )}
    </div>
  );
} 