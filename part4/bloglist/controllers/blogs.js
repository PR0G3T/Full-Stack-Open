const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

blogRouter.post('/', userExtractor, async (req, res) => {
  try {
    const { title, author, url, likes } = req.body

    if (!title || !url) {
      return res.status(400).json({ 
        error: 'title and url are required' 
      })
    }

    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    await savedBlog.populate('user', { username: 1, name: 1 })
    res.status(201).json(savedBlog)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

blogRouter.delete('/:id', userExtractor, async (req, res) => {
  try {
    const id = req.params.id
    
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'permission denied' })
    }

    await Blog.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: 'malformatted id' })
  }
})

blogRouter.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { title, author, url, likes } = req.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, author, url, likes },
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
      res.json(updatedBlog)
    } else {
      res.status(404).json({ error: 'blog not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'malformatted id' })
  }
})

module.exports = blogRouter
