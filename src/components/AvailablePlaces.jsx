import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces]=useState([]);

  const [isFetching, setIsFetching]=useState(false);
  const [error,setError]=useState();
  // useEffect(()=>{
  //   fetch('http://localhost:3000/places')
  //     .then((response)=>{
  //       return response.json();
  //     })
  //     .then((resData)=>{
  //       setAvailablePlaces(resData.places);
  //     });
  // },[]);

  useEffect(()=>{
    
    async function fetchPlaces(){
      setIsFetching(true);
      // console.log(isFetching);
      try{
        
        const places=await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position)=>{
          const sortedPlaces=sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(places);
          setIsFetching(false);
        });
        setIsFetching(false);
        
        // console.log(resData);
      }
      catch(error){
        setError({message : error.message || 'Could not fetch places,please try agian later!'});
      }
      
      // console.log(isFetching);
      
      
      
      // console.log(isFetching);
      // console.log(resData);
    }

    fetchPlaces();
  },[]);

  if(error){
    return <Error title="An Error occured" message={error.message}/>
  }
  // fetch('http://localhost:3000/places')
  //     .then((response)=>{
  //       return response.json();
  //     })
  //     .then((resData)=>{
  //       setAvailablePlaces(resData.places);
  //     });
  
  
  return (

    
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
