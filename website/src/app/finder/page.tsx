"use client"
import { useState, useEffect } from 'react';
import { fetchData } from "../functions/apicall";
const FinderPage = () => {
    const [categories, setCategories] = useState<string[]>([]);
    useEffect(() => {
        const loadInitialData = async () => {
          try {
            const results = await fetchData("card", "", "");
            const sortedResults = [...results].sort((a, b) => a.id - b.id);
            console.log(sortedResults);
          } catch (err) {
            console.error(err);
          } finally {
            
          }
        };
    
        loadInitialData();
      }, []);
    return <main>
        <p className="text-center text-xl"> Under Construction </p>
    </main>
}
export default FinderPage;