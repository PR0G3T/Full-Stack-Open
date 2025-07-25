import { useField, useResource } from '../hooks'

const ResourceDemo = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
    content.reset()
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
    name.reset()
    number.reset()
  }

  return (
    <div>
      <h2>Resource Hook Demo (Exercise 7.8)</h2>
      
      <h3>notes</h3>
      <form onSubmit={handleNoteSubmit}>
        <input type={content.type} value={content.value} onChange={content.onChange} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h3>persons</h3>
      <form onSubmit={handlePersonSubmit}>
        name <input type={name.type} value={name.value} onChange={name.onChange} /> <br/>
        number <input type={number.type} value={number.value} onChange={number.onChange} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default ResourceDemo
