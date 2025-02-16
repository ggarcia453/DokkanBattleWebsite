"use client"
import { useState, useEffect } from 'react';
import { fetchData } from "../functions/apicall";
import { Category } from '../types/category';
import { Character } from '../types/character';
import { Query, operations } from '../types/conditions';

const searchCat = async (mode: string = "", query: string = "") => {
  return await fetchData("category", mode, query);
}

const FinderPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [res, setRes] = useState<Character[]>([]);
    const [catsearch, setCatSearch] = useState("");
    const [qstring, setqstring] = useState("");
    const [addcat, setaddCat] = useState(true);
    useEffect(() => {
        const loadInitialData = async () => {
          try {
            setCategories(await searchCat());
          } catch (err) {
            console.error(err);
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
            <button className='border px-4 py-2'>
              Submit Query
            </button>
            <button className="border px-4 py-2" onClick={() => {
              setqstring("");
              setaddCat(true);
            }}>
              Reset Query
            </button>
            <div className="flex space-x-4">
              <button className="border px-4 py-2"onClick={() => {
                if (addcat)
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
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>)
}
export default FinderPage;