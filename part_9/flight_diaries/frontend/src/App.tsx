import { useState, useEffect } from 'react'
import type { DiaryEntry, Visibility, Weather } from './types';
import { getAllDiaryEntries, createDiaryEntry } from './services/diaryService';
import axios from 'axios';
import './App.css'

const weatherOptions = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as const;
const visibilityOptions = ['great', 'good', 'ok', 'poor'] as const;


function App() {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [comment, setComment] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    getAllDiaryEntries().then((data: DiaryEntry[]) => {
      setDiaryEntries(data)
    })
  }, [])
  

  const diaryEntryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const newEntry = await createDiaryEntry({ date, visibility, weather, comment });
      setDiaryEntries(diaryEntries.concat(newEntry));
      setDate('');
      setVisibility('great');
      setWeather('sunny');
      setComment('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data ? String(error.response.data) : 'Unknown error');
      } else {
        setError('An unexpected error occurred');
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Add new entry</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={diaryEntryCreation}>
        <div>
          <label>Date: </label>
          <input
            type="date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Visibility: </label>
          {visibilityOptions.map(option => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
                required
              />
              {option}
            </label>
          ))}
        </div>
        <div>
          <label>Weather: </label>
          {weatherOptions.map(option => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
                required
              />
              {option}
            </label>
          ))}
        </div>
        <div>
          <label>Comment: </label>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter comment"
          />
        </div>
        <button type="submit">Add Entry</button>
      </form>
      <h1>Diary Entries</h1>
      <ul>
        {diaryEntries.map(entry =>
          <li key={entry.id}>
            <strong>{entry.date}</strong> - Weather: {entry.weather}, Visibility: {entry.visibility}
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
