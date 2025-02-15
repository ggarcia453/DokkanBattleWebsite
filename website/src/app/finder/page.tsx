"use client"
import { useState, useEffect } from 'react';
import { fetchData } from "../functions/apicall";
import { Category } from '../types/category';
import { Query, operations } from '../types/conditions';

const searchCat = async (mode: string = "", query: string = "") => {
  return await fetchData("category", mode, query);
}

const FinderPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [catsearch, setCatSearch] = useState("");
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
      
      console.log(cat);
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
                <tr key={cat.id} onClick={() => addtoCatToQuery(cat)}>
                  <td className="border text-center p-2">{cat.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col space-y-4">
            <button className="border px-4 py-2" onClick={() => {}}>
              Reset Query
            </button>
            <div className="flex space-x-4">
              <button className="border px-4 py-2">AND</button>
              <button className="border px-4 py-2">OR</button>
            </div>
            <div className="flex space-x-4">
              <button className="border px-7 py-2">(</button>
              <button className="border px-7 py-2">)</button>
            </div>
          </div>
        </div>
      </div>
    </main>)
}
export default FinderPage;