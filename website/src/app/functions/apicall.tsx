async function fetchData(mode: string, filter : string, query: string){
    try {
      const urltofetch = (query === "" || mode == "" || filter == "")
        ? `http://localhost:5175/${mode}/` 
        : `http://localhost:5175/${mode}/${filter}/${query}`;
      const res = await fetch(urltofetch);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const json = await res.json();
      return json;
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

export {fetchData};