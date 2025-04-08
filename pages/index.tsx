import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    oneliner: '',
    problem: '',
    features: '',
    businessModel: '',
    competitors: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    localStorage.setItem('pitchDeck', JSON.stringify(data));
    router.push('/result');
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">PitchDeck AI Team</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" onChange={handleChange} placeholder="Startup name" className="w-full border p-2 rounded" />
        <input name="oneliner" onChange={handleChange} placeholder="One-liner / mission" className="w-full border p-2 rounded" />
        <textarea name="problem" onChange={handleChange} placeholder="Problem you're solving" className="w-full border p-2 rounded" />
        <textarea name="features" onChange={handleChange} placeholder="Core features" className="w-full border p-2 rounded" />
        <textarea name="businessModel" onChange={handleChange} placeholder="Business model" className="w-full border p-2 rounded" />
        <textarea name="competitors" onChange={handleChange} placeholder="Known competitors (optional)" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Generate Pitch Deck</button>
      </form>
    </div>
  );
} 