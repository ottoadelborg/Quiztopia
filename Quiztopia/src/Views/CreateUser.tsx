import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./CreateUser.css"


interface ApiSignupResponse {
	success: boolean;
	message?: string;
}

export function CreateUser() {

    const navigate = useNavigate()

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [message, setMessage] = useState<string>('')

const handleCreateUser = async () => {
    const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup'
    const settings = {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        })
    }
    const response = await fetch(url, settings)
    const data: ApiSignupResponse = await response.json()
    console.log('handleCreateUser: ', data);
    
    if( data.success ) {
        setMessage('Användare Skapad!')
    } else {
        setMessage('Kunde inte skapa användare.')
    }
}


return (
    <section className="CreateSection">
        <h1>{message}</h1>
        <h3 className="HeaderText1">Skapa konto</h3>
            <article>
                    <input className='Inputuser' type="text" placeholder="Användarnamn" value={username} onChange={event => setUsername(event.target.value)} />
                    <input className='Inputpass'type="text" placeholder="Lösenord" value={password} onChange={event => setPassword(event.target.value)} />
            </article>
        {message !== 'Användare Skapad!' && (
                <button className='Createuserbtn' onClick={handleCreateUser}> Skapa användare </button>
        )}
        {message === 'Användare Skapad!' && (
            <button className='Loginbtn' onClick={() => navigate("/Login")}>Logga in</button>
        )}
        <button className="Homebtn" onClick={() => navigate("/")}>Hem</button>
    </section>
)
}