import { useState} from 'react'
import { useLocation,useNavigate } from "react-router-dom";
import "./QuizCreate.css"

interface CreateQuestion {
    success: boolean;
    message?: string;
    quizId?: string;
  }

export function CreateQuestion() {
    
  const [answer,setAnswer] = useState<string>('')
  const [message, setMessage] = useState<string>('')
	const [question,setQuestion] = useState<string>('')
  const [lat, setLat] = useState<number>(0)
	const [lng, setLng] = useState<number>(0)

  const navigate = useNavigate()
  const location = useLocation()
  const token = location.state.token
  const quizName = location.state.quizName

    const createQuestions = async () => {
        const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question'
        const settings = {
          method:"POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: quizName,
            question: question,
            answer: answer,
            location: {
              longitude: lng,
              latitude: lat
            }
          })
          
        }
    
        const response = await fetch(url, settings)
        console.log(settings);
        const data: CreateQuestion = await response.json()

        if (data.success) {
            setMessage("Quizzet är skapat!")
        } else{
            setMessage("Kunde inte skapa quiz :(")
        }
    }


    return(
        <section className='Quizsection'>
            <section>
                <h3>Skriv fråga</h3>
                <input type="text" value={question} className='QuestionInput' onChange={event => setQuestion(event.target.value)}/>
                <h3>Skriv svar</h3>
                <input type="text" value={answer} className='QuestionInput' onChange={event => setAnswer(event.target.value)}/>
                <h3>Skriv Longitude</h3>
                <input type="text" value={lat} className='QuestionInput' onChange={event => setLat(Number(event.target.value))}/>
                <h3>Skriv Latitude</h3>
                <input type="text" value={lng} className='QuestionInput' onChange={event => setLng(Number(event.target.value))}/>
            </section>
            <h2>{message}</h2>
            <button className='Createbtn'onClick={ createQuestions }>Skapa quiz!</button>
            <button className='Homebtn' onClick={() => navigate("/")}>Hem</button>
        </section>
    )
}