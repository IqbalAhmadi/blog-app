import Post from '../models/post.model.js'
import User from '../models/user.model.js'

export const getPosts = async (req, res) => {
  const posts = await Post.find()
  res.status(200).json(posts)
}

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  res.status(200).json(post)
}

export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId

  if (!clerkUserId) {
    return res.status(401).json('Unauthorized')
  }

  const user = await User.findOne({ clerkUserId })

  if (!user) {
    return res.status(404).json('User not found')
  }

  const newPost = new Post({ user: user._id, ...req.body })

  const post = await newPost.save()
  res.status(200).json(post)
}

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId

  if (!clerkUserId) {
    return res.status(401).json('Unauthorized')
  }

  const user = await User.findOne({ clerkUserId })

  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  })

  if (!deletedPost) {
    return res.status(403).json('You can delete only your posts!')
  }

  res.status(200).json('Post has been deleted')
}