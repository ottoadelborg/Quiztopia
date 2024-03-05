import { useState, useRef, useEffect } from 'react'
import mapboxgl, { Map as MapGl, accessToken } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from "react-router-dom";
import "./Home.css"

interface Position {
	latitude: number;
	longitude: number;
}


mapboxgl.accessToken = "pk.eyJ1IjoicHlsbGUiLCJhIjoiY2xsemY3MmRsMHkyMzNycDNrbDFncGw4ZSJ9.JFVyyWR53XxuAYFwWSrz2w"
console.log('Kontrollera att access token hittas: ', accessToken);


export function HomePage() {

    const navigate = useNavigate()

	const [message, setMessage] = useState<string>('')
    const [viewQuiz, setViewQuiz] = useState<{ question: string; username: string, quizId: string }[]>([]);

	
	const mapContainer = useRef(null)
	const mapRef = useRef<MapGl | null>(null)
	const [lat, setLat] = useState<number>(57.7)
	const [lng, setLng] = useState<number>(11.89)
	const [zoom, setZoom] = useState<number>(10)
	const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

	
	useEffect(() => {
		if( mapRef.current || !mapContainer.current ) return
		
		mapRef.current = new MapGl({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom
		});
		const map: MapGl = mapRef.current
		
			map.on('move', () => {
			interface Position {
				lng: number;
				lat: number;
			}
			const position: Position = map.getCenter()
			setLat(Number(position.lat.toFixed(4)))
			setLng(Number(position.lng.toFixed(4)))
			setZoom(map.getZoom());
		})

    
	}, [lat, lng, zoom])


	const getQuiz = async (map: MapGl | null,
		marker: mapboxgl.Marker | null) => {
		const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz'
		const settings = {
			method: 'GET',
		}
    
		const response = await fetch(url, settings)
		const data = await response.json()
		console.log('getQuiz: ', data);
		
        
		if (data.success && map) {
            const questions: { question: string, username: string, quizId: string }[] = [];

			data.quizzes.forEach((quiz: any) => {
			  quiz.questions.forEach((question: any) => {
				console.log('Processing question:', question.question);
				if (question.location && question.location.longitude !== undefined && question.location.latitude !== undefined) {
					const { longitude, latitude } = question.location;
					if (!isNaN(Number(longitude)) && !isNaN(Number(latitude))) {
						marker = new mapboxgl.Marker({ color: "green" })
							.setLngLat([Number(longitude), Number(latitude)])
							.addTo(map);
				
						const popup = new mapboxgl.Popup()
							.setHTML(`<h3>${question.question}</h3>`)
						
						marker.setPopup(popup);
						questions.push({
							question: question.question,
							username: quiz.username,
							quizId: quiz.quizId
						});
					}
				}				
            });
            setViewQuiz(questions);
            console.log(viewQuiz);   
        });
        }
         
	} 
	

  async function getPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        const geo = navigator.geolocation;
        geo.getCurrentPosition(pos => {
          const position: Position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
            
          }
          const message = `Din position är: ${position.latitude}, ${position.longitude}`;
          setMessage(message)
          console.log(position);
          resolve(position)
        }, error => {
          reject(error.message)
        })
      } else {
        reject('Uppdatera webläsaren för att få tillgång till denna hemsidan')
      }
    })
  
  
  }

  async function markCurrentLocationOnMap(
	map: MapGl | null,
	marker: mapboxgl.Marker | null
  ) {
	const position = await getPosition();
	const { latitude, longitude } = position;
  
	if (map) {
	  marker = new mapboxgl.Marker()
		.setLngLat([longitude, latitude])
		.addTo(map);
	  setMarker(marker); 
	} 
  
	const popup = new mapboxgl.Popup({
	  offset: 25,
	  closeButton: false,
	});
  
	if (map) {
	  popup.addTo(map).setLngLat([longitude, latitude]);
	}
  }
  
  

	return (
		<div className="app">
			<header className='LoginHeader'>
				<h1>Välkommen till Quiztopia</h1>
                <button className='CreateBtn' onClick={() => navigate("/CreateUser")}> Skapa användare </button>
				<button className='LoginBtn' onClick={() => navigate("/Login")}> Logga in </button>
				<button className='WhereBtn' onClick={() => markCurrentLocationOnMap(mapRef.current, marker)}>Vart är jag nu?</button>
				<button className='Quizzbtn'onClick={() => getQuiz(mapRef.current, marker)}> Visa alla quiz </button>
				<p> {message} </p>
			</header>
			<main>
        <div ref={mapContainer} className="map-container" />

        <p> Center position: {lat} lat, {lng} lng </p>
                <section>
                    {viewQuiz.map((item, index) => (
                        <section key={index} style={{ marginTop: "4rem" }}>
                            <h3>Fråga: {item.question}</h3>
                            <p>Skapad av: {item.username}</p>
                            <p>Quiz namn: {item.quizId}</p>
                        </section>
                    ))}
                </section>
			</main>
		</div>
	)
}

export default HomePage