const config = {
  MONGODB_URI: process.env.NODE_ENV === 'test' 
    ? process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/bloglist-test'
    : process.env.MONGODB_URI || 'mongodb://localhost:27017/bloglist',
  PORT: process.env.PORT || 3003,
  SECRET: process.env.SECRET || 'testsecret'
}

module.exports = config
