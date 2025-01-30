const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

// Execute all: npm run tests
// just this file: npm test ./tests/user_api.test.js

beforeEach(async () => {
  await User.deleteMany({})
})

describe('Username tests:', () => {
  test('Fails with 400 if username is not included in request', async () => {
    const newUser = {
      name: 'Pertti Keinonen',
      password: 'S@iraanN0p€€'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'User validation failed: username: Path `username` is required.')
  })

  test('Fails with 400 if username has length less than 3', async () => {
    const newUser = {
      username: 'Pe',
      name: 'Pertti Keinonen',
      password: 'S@iraanN0p€€'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'User validation failed: username: Path `username` (`Pe`) is shorter than the minimum allowed length (3).')
  })

  test('Fails with 400 if username already exists', async () => {
    const newUser = {
      username: 'PeKe',
      name: 'Pertti Keinonen',
      password: 'S@iraanN0p€€'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'expected `username` to be unique')
  })
})

describe('Password tests:', () => {
  test('Fails with 400 if password is not included in request', async () => {
    const newUser = {
      username: 'PeKe',
      name: 'Pertti Keinonen'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Password is required')
  })

  test('Fails with 400 if password has length less than 3', async () => {
    const newUser = {
      username: 'PeKe',
      name: 'Pertti Keinonen',
      password: 'S@'
    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.strictEqual(response.body.error, 'Password must be at least 3 characters long')
  })
})

after(async () => {
  await mongoose.connection.close()
})