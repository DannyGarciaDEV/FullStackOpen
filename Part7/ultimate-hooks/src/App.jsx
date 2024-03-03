import React, { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchResourceList = async (url) => {
      try{
        const resourcesDetails = await axios.get(url);
        return resourcesDetails.data;
      }catch(error){
        return { found: false };
      }
    }

    fetchResourceList(baseUrl).then((resourcesDetails) => {
      console.log('resoucesDetails', resourcesDetails);
      setResources(resourcesDetails);
    });

  }, [baseUrl])

  const create = async (resource) => {
    try{
      const newResource = await axios.post(baseUrl, resource);
      const updatedResources = (await axios.get(baseUrl)).data; // fetching the updated list of resources
      setResources(updatedResources);
      return newResource.data;
    }catch(error){
      return { found: false };
    }
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {Array.isArray(notes) && notes.map(n => <p key={n.id}>{n.content}</p>)}
  
      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {Array.isArray(persons) && persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}
export default App