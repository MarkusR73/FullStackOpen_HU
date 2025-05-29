import { useState, useEffect } from 'react'
import type { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryService';
import './App.css'

function App() {
  //const [newDiaryEntry, setNewDiaryEntry] = useState('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  
  useEffect(() => {
    getAllDiaryEntries().then((data: DiaryEntry[]) => {
      setDiaryEntries(data)
    })
  }, [])
  

  /*const diaryEntryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault()
    createDiaryEntry({ content: newNote }).then(data => {
      setNotes(notes.concat(data))
    })
    setNewNote('')
  };
  */

  return (
    <div>
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
