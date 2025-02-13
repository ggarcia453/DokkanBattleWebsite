"use client"
import { useState, useEffect } from 'react';
import { fetchData } from "../functions/apicall";
import { Category } from '../types/category';
const searchCat = async (mode: string = "", query: string = "") => {
  return await fetchData("category", mode, query);
}

const FinderPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [catsearch, setCatSearch] = useState("");
    const [queryCat, setqueryCat] = useState<Category[]>([]);
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
    return <main>
      <div className='float-left'>
        <div>
        <input type="text" placeholder='Search Categories' value={catsearch} onKeyDown={handleKeyDown} onChange={handleChange}/>
        <table className="border-collapse border">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="border text-center p-2">{cat.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        </div>
        </div>
    </main>
}
export default FinderPage;