import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show }) => {
  const [genreFilter, setGenreFilter] = useState('')
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter || undefined }
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  // Get all unique genres for filtering
  const allGenres = books.reduce((genres, book) => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })
    return genres
  }, [])

  return (
    <div>
      <h2>books</h2>

      <div>
        <strong>in genre </strong>
        <select 
          value={genreFilter} 
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">all genres</option>
          {allGenres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        {allGenres.map(genre => (
          <button 
            key={genre}
            onClick={() => setGenreFilter(genre)}
            style={{ margin: '2px' }}
          >
            {genre}
          </button>
        ))}
        <button 
          onClick={() => setGenreFilter('')}
          style={{ margin: '2px' }}
        >
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
