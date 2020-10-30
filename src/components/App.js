import { Link } from 'react-router-dom';

function App () {
  return (
    <div>
      Hello from Slack
      <div>
        <Link to='/register'>Register</Link>
      </div>
    </div>
  )
}

export default App
