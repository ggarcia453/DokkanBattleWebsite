"use client"
import { useState, useEffect } from 'react';
import { fetchData } from "../functions/apicall";
import { Category } from '../types/category';
import { Character } from '../types/character';
import { Query, operations } from '../types/conditions';

const searchCat = async (mode: string = "", query: string = "") => {
  return await fetchData("category", mode, query);
}
const searchChar = async(mode: string= "", query: string = "") =>{
  return await fetchData("card", mode, query);
}

const FinderPage = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [res, setRes] = useState<Character[]>([]);
    const [catsearch, setCatSearch] = useState("");
    const [qstring, setqstring] = useState("");
    const [addcat, setaddCat] = useState(true);
    useEffect(() => {
        const loadInitialData = async () => {
          try {
            setLoading(true);
            const data = await searchCat();
            setCategories(data);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
    
        loadInitialData();
      }, []);

    const addtoCatToQuery = (cat: Category) => {
      setqstring(qstring + cat.name);
    };
    
    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      setCatSearch(event.target.value)
      console.log(event.target.value)
      setCategories(await searchCat("name", event.target.value));
    };

    const handleKeyDown =  async (event: React.KeyboardEvent<HTMLInputElement>) =>  {
      if (event.key === 'Enter') {
        setCategories(await searchCat("name", catsearch));
      }
    };
    const handleSubmit = async () => {
      const q = new Query(qstring);
      await q.fillOut();
      setRes(await q.grabChars());
      setqstring("");
      setaddCat(true);
    };
    if (loading) {
      return <div>Loading...</div>;
  }
    return (
    <main>
      <div className='float-left'>
        <input type="text" placeholder='Search Categories' value={catsearch} onKeyDown={handleKeyDown} onChange={handleChange}/>
        <div className="flex items-start gap-4 mt-2">
          <table className="border-collapse border">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className='hover:bg-blue-50 transition-colors duration-150 ease-in-out' onClick={() => {if (addcat) {addtoCatToQuery(cat); setaddCat(false)}}}>
                  <td className="border text-center p-2">{cat.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col space-y-4">
            <button className='border px-4 py-2' onClick={handleSubmit}>
              Submit Query
            </button>
            <button className="border px-4 py-2" onClick={() => {
              setRes([]);
              setqstring("");
              setaddCat(true);
            }}>
              Reset Query
            </button>
            <div className="flex space-x-4">
              <button className="border px-4 py-2"onClick={() => {
                if (addcat) return;
                setqstring(qstring + " & ");
                setaddCat(true);
              }}>AND</button>
              <button className="border px-4 py-2" onClick={() => {
                if (addcat) return;
                setqstring(qstring + " || ");
                setaddCat(true);
              }}>OR</button>
            </div>
            <div className="flex space-x-4">
              <button className="border px-7 py-2" onClick={() => {setqstring(qstring + "(")}}>(</button>
              <button className="border px-7 py-2" onClick={() => {setqstring(qstring + ")")}}>)</button>
            </div>
          </div>
          <p>"{qstring}"</p>
          {res.length != 0 && (
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                Search Table
              </h2>
              <div className="overflow-auto">
                <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Title</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">HP</th>
                    <th className="border p-2">ATK</th>
                    <th className="border p-2">DEF</th>
                  </tr>
                </thead>
                <tbody>
                  {res.map((card) => (
                    <tr key={card.id}>
                      <td className="border p-2">{card.title}</td>
                      <td className="border p-2">{card.name}</td>
                      <td className="border p-2">{card.hp}</td>
                      <td className="border p-2">{card.atk}</td>
                      <td className="border p-2">{card.def}</td>
                    </tr>
                  ))}
                  {res.length === 0 && (
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
        </div>
      </div>
    </main>)
}
export default FinderPage;