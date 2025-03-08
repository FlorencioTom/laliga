import { useEffect, useState } from 'react';

const FootballData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usando fetch2014
     fetch('https://api.football-data.org/v4/matches', {
       headers: { 'X-Auth-Token': 'f975b017838145dc9cdbf508097ee39c' },
     })
       .then((response) => {
         if (!response.ok) {
           throw new Error('Network response was not ok');
         }
         return response.json();
       })
       .then((data) => {
         setData(data);
         console.log(data);
         setLoading(false);
       })
       .catch((error) => {
         setError(error);
         console.log(error);
         setLoading(false);
       });
  }, [])

  return (
    <div>
      <h1>Football Competitions</h1>

    </div>
  );
}




export default FootballData;