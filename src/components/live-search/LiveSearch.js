import React, { useEffect, useRef, useState } from 'react';
import './LiveSearch.scss';
import { ReactComponent as SvgSearch } from '../../assets/live-search/iconmonstr-search-thin.svg';
import Spinner from '../spinner/Spinner';

const LiveSearch = ({ searchData, title, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const selectedElement = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.length > 1) {
        setIsLoading(true);
        searchData(inputValue)
          .then((newResults) => {
            setIsLoading(false);
            setCursor(0);
            newResults ? setResults(newResults) : setResults([]);
          })
          .catch((error) => {
            setIsLoading(false);
            setCursor(0);
            setResults([]);
          });
      } else {
        setResults([]);
      }
    }, 500); //Wait for 500 ms before make an API call in order to avoid make a lot of requests.
    return () => clearTimeout(timer);
  }, [inputValue, searchData]);

  useEffect(() => {
    if (selectedElement && selectedElement.current) {
      selectedElement.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end',
      });
      console.log(inputRef);
    }
  }, [cursor]);

  const makeBold = (text, match) => {
    const re = new RegExp(match, 'gi');
    const toRet = text.replace(re, (str) => `<b>${str}</b>`);

    return toRet;
  };

  const resultsJSX = () => {
    const list = results.map((result, index) => (
      <li
        ref={cursor === index ? selectedElement : null}
        key={result.id}
        className={`LiveSearch__resultItem ${
          cursor === index ? 'LiveSearch__resultItem--selected' : ''
        }`}
        dangerouslySetInnerHTML={{
          __html: `<span>${makeBold(result.name, inputValue)}</span>`,
        }}
      />
    ));
    return <ul className='LiveSearch__resultList'>{list}</ul>;
  };

  function handleKeyDown(e) {
    if (e.keyCode === 38 && cursor > 0) {
      setCursor((prevCursor) => prevCursor - 1);
    } else if (e.keyCode === 40 && cursor < results.length - 1) {
      setCursor((prevCursor) => prevCursor + 1);
    }
  }

  return (
    <div className='LiveSearch'>
      <p className='LiveSearch__title'>{title}</p>
      <div className='LiveSearch__searchWrapper'>
        <input
          className='LiveSearch__input'
          placeholder={placeholder}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        {isLoading ? <Spinner /> : <SvgSearch />}
      </div>
      {results && results.length > 0 && resultsJSX()}
    </div>
  );
};

export default LiveSearch;
