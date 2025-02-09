"use client"
import { useState, useEffect } from 'react';
import { fetchData } from "../functions/apicall";
import { Category } from '../types/category';
const FinderPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    useEffect(() => {
        const loadInitialData = async () => {
          try {
            const results = await fetchData("category", "", "");
            setCategories(results)
          } catch (err) {
            console.error(err);
          }
        };
    
        loadInitialData();
      }, []);
    return <main>
        <p className="text-center text-xl"> Under Construction </p>
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
    </main>
}
export default FinderPage;