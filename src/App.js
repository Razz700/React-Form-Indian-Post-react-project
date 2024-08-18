import React, { useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [search,setSearch]=useState('');
  const [isfetch,setIsfetch]=useState(false);
  const [data,setData]=useState();
  const [loader,setLoader]=useState(false);
  const [filter,setFilter]=useState('');
  const [error,setError]=useState();

  const handleChange=(e)=>setSearch(e.target.value);
  const handleLookup=async(e)=>{
e.preventDefault();
setLoader(true);
setError(null);
const value=parseInt(search);
if (value.toString().length==6) {
  console.log(typeof(value),value,value.toString().length);
  try{
    const result=await axios(`https://api.postalpincode.in/pincode/${search}`);
    console.log(result);
    if (result.data[0].Status==='Success') {
      //console.log(result.data[0].Status);
      setData(result.data[0]);
      setIsfetch(true);
      setLoader(false);
    }else if(result.data[0].Status==='Error'){
      // console.log(result.data[0].Status);
      setLoader(false);
      setData(result.data[0]);
      setIsfetch(true);
    }
    }catch(e){
      setLoader(false);
      console.log(e);
      setError(e);
    }
}else{
  alert('code is not 6 digits');
  setLoader(false);
  return;
}
  }
  ////////////////////////////////////////////
  const handlefilter=(e)=>{
    const value=e.target.value
    setFilter(value);
  }
  let finalData;
  if(isfetch){
    if (data.PostOffice!==null) {
      const check=filter.toLowerCase().trim();
      finalData=data.PostOffice.filter((item)=>item.Name.toLowerCase().includes(check) || item.BranchType.toLowerCase().includes(check) || item.DeliveryStatus.toLowerCase().includes(check) || item.District.toLowerCase().includes(check) || item.Division.toLowerCase().includes(check));
    }
  }
  //////////////////////////////////////////////
  return (
    <div className='main'>
   {!isfetch &&   <div className='find-div'> 
    <p className='title'>Enter Pincode</p>
    <form>
    <input onChange={handleChange} type='text' placeholder='Pincode' value={search} required /><br/>
    <button onClick={handleLookup}>Lookup</button>
    </form>
      </div>}
     {error && <p className='error'>{error.message}</p>}
      {loader && <div className='loader-div'><div className='loader'></div>
      <p>Loading...</p></div>}

  {isfetch && data && <div className='find-data-div'>
    <p className='title'>Pincode: {search}</p>  
    <p className='title'>Message: <span>{data.Message}</span></p>
    {data.PostOffice!==null && <input onChange={handlefilter} value={filter} type='text' placeholder='Filter' />}
    
    {data.PostOffice!==null &&
    <ul>
    {finalData.length===0 &&  <p>Couldn’t find the postal data you’re looking for…</p>}
    {data.PostOffice!==null && finalData.map((item,i)=><li className='post-office' key={'item'+i}>
        <p>Name: {item.Name}</p>
        <p>Branch Type: {item.BranchType}</p>
        <p>Delivery Status: {item.DeliveryStatus}</p>
        <p>District: {item.District}</p>
        <p>Division: {item.Division}</p></li>)}
    </ul>}
    </div>}

    </div>
  )
}

export default App