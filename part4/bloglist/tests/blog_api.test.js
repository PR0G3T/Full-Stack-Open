const { test, describe, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const api = supertest(app)

// Connect to test database before starting tests
before(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

// Test user for authentication
let testUser = null
let authToken = null

// Initial test data
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    // Clear both collections
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create test user
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash
    })
    testUser = await user.save()

    // Create token for the test user
    const userForToken = {
      username: testUser.username,
      id: testUser._id,
    }
    authToken = jwt.sign(userForToken, config.SECRET)

    // Create blogs with user reference
    const blogsWithUser = initialBlogs.map(blog => ({
      ...blog,
      user: testUser._id
    }))
    await Blog.insertMany(blogsWithUser)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blog posts have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    
    blogs.forEach(blog => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('addition of a new blog', () => {
  beforeEach(async () => {
    // Clear both collections
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create test user
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash
    })
    testUser = await user.save()

    // Create token for the test user
    const userForToken = {
      username: testUser.username,
      id: testUser._id,
    }
    authToken = jwt.sign(userForToken, config.SECRET)

    // Create blogs with user reference
    const blogsWithUser = initialBlogs.map(blog => ({
      ...blog,
      user: testUser._id
    }))
    await Blog.insertMany(blogsWithUser)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Testing with Jest and Supertest',
      author: 'Test Author',
      url: 'https://test.com',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const titles = response.body.map(blog => blog.title)
    assert(titles.includes('Testing with Jest and Supertest'))
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'https://test.com'
      // likes property intentionally omitted
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title returns 400 Bad Request', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'https://test.com',
      likes: 3
      // title property intentionally omitted
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('blog without url returns 400 Bad Request', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 3
      // url property intentionally omitted
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('blog without both title and url returns 400 Bad Request', async () => {
    const newBlog = {
      author: 'Test Author',
      likes: 3
      // title and url properties intentionally omitted
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('adding a blog fails with 401 if no token is provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Test Author',
      url: 'https://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    // Clear both collections
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create test user
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = new User({
      username: 'testuser',
      name: 'Test User',
      passwordHash
    })
    testUser = await user.save()

    // Create token for the test user
    const userForToken = {
      username: testUser.username,
      id: testUser._id,
    }
    authToken = jwt.sign(userForToken, config.SECRET)

    // Create blogs with user reference
    const blogsWithUser = initialBlogs.map(blog => ({
      ...blog,
      user: testUser._id
    }))
    await Blog.insertMany(blogsWithUser)
  })

  test('succeeds with status code 204 if id is valid and user is creator', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 401 if no token provided', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400)
  })
})

describe('updating a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('succeeds with a valid id and data', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
    
    const updatedData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    assert.strictEqual(response.body.title, blogToUpdate.title)
  })

  test('can update just the likes count', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
    
    const updatedData = {
      likes: 999
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    assert.strictEqual(response.body.likes, 999)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = '507f191e810c19729de860ea'
    
    const updatedData = {
      likes: 10
    }

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send(updatedData)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    
    const updatedData = {
      likes: 10
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedData)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
