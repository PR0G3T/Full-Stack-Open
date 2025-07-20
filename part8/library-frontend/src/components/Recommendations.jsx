import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { 
      genre: userResult.data?.me?.favoriteGenre 
    },
    skip: !userResult.data?.me?.favoriteGenre
  })

  if (!show) {
    return null
  }

  if (userResult.loading) {
    return <div>loading...</div>
  }

  if (!userResult.data?.me) {
    return <div>You must be logged in to see recommendations</div>
  }

  const user = userResult.data.me
  const books = booksResult.data?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{user.favoriteGenre}</strong></p>

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
    </div>
  )
}

export default Recommendations
