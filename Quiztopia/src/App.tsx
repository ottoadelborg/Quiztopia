import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CreateQuestion } from './Views/QuizCreate'
import { Login } from './Views/Login'
import { QuizName } from './Views/Quiz'
import { HomePage } from './Views/Home'
import { CreateUser } from './Views/CreateUser'

function App() {

	const router = createBrowserRouter([
		{
		  path:'/',
		  element: <HomePage/>
		},
		{
		  path:'/CreateQuestion',
		  element: <CreateQuestion/>
		},
		{
		  path:'/LogIn',
		  element: <Login/>
		},
		{
		  path:'/QuizName',
		  element: <QuizName/>
		},
		{
			path:'/CreateUser',
			element: <CreateUser/>
		}
	  ])

	return (
		<div className='App'>
      		<RouterProvider  router = { router }/>
    	</div>
	)
}

export default App