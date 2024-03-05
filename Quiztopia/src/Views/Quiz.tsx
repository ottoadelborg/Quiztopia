import { useState } from 'react'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Quiz.css"


interface CreateQuiz {
    success: boolean;
    token?: string;
    quizId?: string;
  }

  
  export function QuizName() {

    const navigate = useNavigate()
    const location = useLocation();
    const token = location.state.token;
    console.log(token);
    

    const [quizName,setQuizName] = useState<string>('')
    const [message,setMessage] = useState<string>('')



    const createQuiz = async () => {

		const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz'
		const settings = {
			method: 'POST',
      headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name: quizName,
			})
		}
		const response = await fetch(url, settings)    
		const data: CreateQuiz = await response.json()
		console.log('createQuiz: ', data);

        if (data.success) {
            setMessage("Quiz namnet registrerat!")
        } else{
            setMessage("Kunde inte skapa quiz, testa igen.")
        }
	}
    

    return(
        <section className='QuizSection'>
            <h1>Döp ditt quiz</h1>
            <input type="text" placeholder="Quiz Namn" className='QuizInput' value={quizName} onChange={event => setQuizName(event.target.value)} />
            <button className='Createbtn'onClick={createQuiz}> Skapa quiz </button>
            {message === 'Quiz namnet registrerat!' && (
            <button className='Addbtn'onClick={() => navigate("/CreateQuestion", { state: { token, quizName } })}> Lägg till frågor!  </button>
            )}
        </section>
    )
}