import { useState, useEffect } from 'react'
import type { DiaryEntry } from './types';
import { getAllDiaryEntries, createDiaryEntry } from './services/diaryService';
import './App.css'

function App() {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  
  useEffect(() => {
    getAllDiaryEntries().then((data: DiaryEntry[]) => {
      setDiaryEntries(data)
    })
  }, [])
  

  const diaryEntryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry = await createDiaryEntry({ date, visibility, weather, comment });
      setDiaryEntries(diaryEntries.concat(newEntry));
      setDate('');
      setVisibility('');
      setWeather('');
      setComment('');
    } catch (error) {
      // Optionally handle error here
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Add new entry</h1>
      <form onSubmit={diaryEntryCreation}>
        <div>
          <label>Date: </label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Visibility: </label>
          <input
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          />
        </div>
        <div>
          <label>Weather: </label>
          <input
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          />
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
