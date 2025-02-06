"use client";
import { useState, useEffect } from "react";
import { Character } from "./types/character";
import {get_synergy_score} from "./functions/charmethods";
import { fetchData } from "./functions/apicall";


export default function Home() {
  const [data, setData] = useState("");
  const [cards, setCards] = useState<Character[]>([]);
  const [team, setTeam] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("name");
  const [synergy, set_synergy] = useState(0);
  //Sorting config
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'ascending'
  });
  const handleSort = (key: keyof Character) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    setSortConfig({ key, direction });

    const sortCharacters = (characters: Character[]) => {
      return [...characters].sort((a, b) => {
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          // String sorting
          return direction === 'ascending'
            ? (a[key] as string).localeCompare(b[key] as string)
            : (b[key] as string).localeCompare(a[key] as string);
        } else if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          // Number sorting
          return direction === 'ascending'
            ? (a[key] as number) - (b[key] as number)
            : (b[key] as number) - (a[key] as number);
        }
        return 0;
      });
    };
    const sortedCards = sortCharacters(cards);
    setCards(sortedCards);
  };

  //Update team Health
  const [health, changeHealth] = useState(0);
  useEffect(() =>{
    changeHealth(team.reduce((s, card) =>s + card.hp, 0));
  }, [team]);

  //Default Search from api (No FIlters)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await fetchData("card", "", "");
        const sortedResults = [...results].sort((a, b) => a.id + b.id);
        console.log(sortedResults);
        setCards(sortedResults);
      } catch (err) {
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  //Search with some parameters data from the api
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results: Character[] = await fetchData("card", selectedOption, data);
      const availableResults = results
      .filter(card => !team.some(teamCard => teamCard.id === card.id))
      .sort((a, b) => {
        const key = sortConfig.key as keyof Character;
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return sortConfig.direction === 'ascending'
            ? (a[key] as string).localeCompare(b[key] as string)
            : (b[key] as string).localeCompare(a[key] as string);
        } else if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          return sortConfig.direction === 'ascending'
            ? (a[key] as number) - (b[key] as number)
            : (b[key] as number) - (a[key] as number);
        }
        return 0;
      });
      setCards(availableResults);
    } catch (err) {
      setError("Failed to fetch characters. Please try again.");
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    set_synergy(get_synergy_score(team));
  }, [team])

  const handleAddToTeam = (card: Character) => {
    if (team.length >= 6) {
      alert("Team is full! Maximum 6 characters allowed.");
      return;
    }
    if (team.some(teamCard => teamCard.id === card.id)) {
      alert("This character is already in your team!");
      return;
    }
    setTeam([...team, card]);
    setCards(cards.filter(c => c.id !== card.id));
  };

  const handleRemoveFromTeam = (cardId: number) => {
    const removedCard = team.find(card => card.id === cardId);
    if (!removedCard) return;
    setTeam(team.filter(card => card.id !== cardId));
    const shouldAddBack = !data || 
      removedCard.name.toLowerCase().includes(data.toLowerCase()); 
    if (shouldAddBack) {
      const newCards = [...cards, removedCard];
      const sortedCards = newCards.sort((a, b) => {
        const key = sortConfig.key as keyof Character;
        
        if (typeof a[key] === 'string' && typeof b[key] === 'string') {
          return sortConfig.direction === 'ascending'
            ? (a[key] as string).localeCompare(b[key] as string)
            : (b[key] as string).localeCompare(a[key] as string);
        } else if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          return sortConfig.direction === 'ascending'
            ? (a[key] as number) - (b[key] as number)
            : (b[key] as number) - (a[key] as number);
        }
        return 0;
      });
      setCards(sortedCards);
    }
  };


  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setData(event.target.value);
    handleSearch();
  };

  const handleKeyDown =  async (event: React.KeyboardEvent<HTMLInputElement>) =>  {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    handleSearch();
  };

  return (
    <div>
      <h1>Dokkan Search</h1>
      <div>
      <input type="text" value={data}  onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Search Here" />
      <select
        value={selectedOption}
        onChange={handleDropdownChange}
        className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="" disabled>
          Select an option
        </option>
        <option value="name">Name</option>
        <option value="title">Title</option>
      </select>
      <div className="flex gap-4">
      {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-xl text-gray-600">Loading characters...</div>
          </div>
        )}
      
      {!isLoading && !error && (         
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Search Table</h2>
            <div className="overflow-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                  <th 
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('title')}
                  >
                    Title 
                    {sortConfig.key === 'title' && 
                      (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                  </th>
                  <th 
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortConfig.key === 'name' && 
                      (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                  </th>
                  <th 
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('hp')}
                  >
                    HP
                    {sortConfig.key === 'hp' && 
                      (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                  </th>
                  <th 
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('atk')}
                  >
                    ATK
                    {sortConfig.key === 'atk' && 
                      (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                  </th>
                  <th 
                    className="border p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('def')}
                  >
                    DEF
                    {sortConfig.key === 'def' && 
                      (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                  </th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr key={card.id}>
                      <td className="border p-2">{card.title}</td>
                      <td className="border p-2">{card.name}</td>
                      <td className="border p-2">{card.hp}</td>
                      <td className="border p-2">{card.atk}</td>
                      <td className="border p-2">{card.def}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleAddToTeam(card)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Add to Team
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cards.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        No characters found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold mb-2">Current Team</h2>
            <p>Total Team Health: {health}</p>
          </div>
            <div className="overflow-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">HP</th>
                    <th className="border p-2">ATK</th>
                    <th className="border p-2">DEF</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((card, index) => (
                    <tr key={card.id}
                    className={index == 0 ? "bg-yellow-400" : ""}>
                      <td className="border p-2">{card.title}</td>
                      <td className="border p-2">{card.name}</td>
                      <td className="border p-2">{card.hp}</td>
                      <td className="border p-2">{card.atk}</td>
                      <td className="border p-2">{card.def}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleRemoveFromTeam(card.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {team.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        No characters in team
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <p className="text-right">Team Synergy: {synergy}</p>
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}
