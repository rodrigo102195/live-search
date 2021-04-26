import './App.css';
import LiveSearch from './components/live-search/LiveSearch';
import { useCallback } from 'react';

function App() {
  const URL = 'https://rickandmortyapi.com/api/character/';
  const searchData = useCallback((name) => {
    return new Promise((resolve, reject) => {
      fetch(`${URL}?name=${name}`)
        .then((response) => response.json())
        .then((data) => resolve(data.results))
        .catch((error) => reject(error));
    });
  }, []);

  return (
    <div className='App'>
      <LiveSearch
        title='Encuentra un personaje'
        placeholder='Escribe el nombre...'
        searchData={searchData}
      />
    </div>
  );
}

export default App;
