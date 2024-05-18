import { useState,useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [apidata, setApidata] = useState([]);
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState(null);

  const numformat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
 

  const fetchData = async () =>{
    await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    ).then(resp =>{
      console.log("Response: ", resp.data);
      setApidata(resp.data)
    })
    .catch(error=>{
      console.log("Error: ",error);
    });    
  }

  useEffect(()=>{
    fetchData();
  },[])

 
  const filteredData = apidata.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortType === 'market_cap') {
      return b.market_cap - a.market_cap;
      console.log("Sorted: ",sortType);
    }
    if (sortType === 'percentage_change') {
      return b.price_change_percentage_24h - a.price_change_percentage_24h;
      console.log("Sorted2: ",sortType);
    }
    return 0;
  });

  return (
    <div className="App">
      <div className='panel'>
        <input  type="text"  placeholder="Search By Name or Symbol"  onChange={e => setSearch(e.target.value)}  />
        <button onClick={() => setSortType('market_cap')}>Sort by Mkt Cap</button>
        <button onClick={() => setSortType('percentage_change')}>Sort by percentage</button>
      </div>
      <table>
        <tbody>
          {sortedData.map((item,index) => (
          <tr key={index}>
            <td className='f'><img src={item.image} alt={index} />  </td>           
            <td>{item.name}</td>
            <td>{ item.symbol.toUpperCase()}</td>
            <td className='ralign'>${item.current_price}</td>
            <td className='ralign'>{numformat.format(item.total_volume)}</td>
            <td className='ralign' 
            style={{ color: item.price_change_percentage_24h < 0 ? 'red' : 'green' }}>{(item.price_change_percentage_24h).toFixed(2)}%</td>
            <td className='ralign b-end'>Mkt Cap : {numformat.format(item.market_cap)}</td>            
          </tr>
        ))}
          
        </tbody>
      </table>      
    </div>
  );
}

export default App;
