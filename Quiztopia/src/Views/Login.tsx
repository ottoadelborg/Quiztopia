import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./Login.css"

interface ApiLoginResponse {
	success: boolean;
	message?: string;
	token?: string;
}

export function Login() {

    const navigate = useNavigate()


    const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [token, setToken] = useState<string>('')
	const [message, setMessage] = useState<string>('')


  
	const handleLogin = async () => {
    const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login'
		const settings = {
			method: 'POST',
			body: JSON.stringify({
        username: username,
				password: password
			})
		}
		const response = await fetch(url, settings)
		const data: ApiLoginResponse = await response.json()
		console.log('handleLogin: ', data);
		if( data.success ) {
      setMessage('Du är inloggad!')
			if( data.token ) setToken(data.token)
      
      console.log(token);
		} else {
			setMessage('Det gick inte att logga in :(')
		}
    
	}
    

    return(
        <section className='Loginsection'>
            <h1>{message}</h1>
			<h3 className='HeaderText'>Logga in</h3>
				<article>
					<input className='Inputuser' type="text" placeholder="Användarnamn" value={username} onChange={event => setUsername(event.target.value)} />
					<input className='Inputpass'type="text" placeholder="Lösenord" value={password} onChange={event => setPassword(event.target.value)} />
				</article>
			<button className='Loginbtn' onClick={handleLogin}> Logga in </button>
			<button className="Homebtn" onClick={() => navigate("/")}>Hem</button>
			{message === 'Du är inloggad!' && (
                <button className='Createquizbtn' onClick={() => navigate("/QuizName", { state: { token } })}>Skapa Quiz</button>
            )}
        </section>
    )
}