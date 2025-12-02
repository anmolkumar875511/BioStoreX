import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [team, setTeam] = useState({ name: '', members: [] })

  useEffect(() => {
    axios.get('api/team')
      .then((response) => {
        setTeam(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <>
      <h1>Hello welcome to Dashboarding</h1>
      <h4>Team Name: {team.name}</h4>
      <h5>Team Members: {team.members?.join(', ')}</h5>
    </>
  )
}

export default App
