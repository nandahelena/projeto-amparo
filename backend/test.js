#!/usr/bin/env node

// Simple test script for backend endpoints
const http = require('http')

async function test(name, options, body) {
  return new Promise((resolve) => {
    console.log(`\n📝 Test: ${name}`)
    console.log(`Method: ${options.method} ${options.path}`)
    if (body) console.log(`Body: ${JSON.stringify(body)}`)

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`)
        try {
          const json = JSON.parse(data)
          console.log(`Response: ${JSON.stringify(json, null, 2)}`)
        } catch {
          console.log(`Response: ${data}`)
        }
        resolve(res.statusCode)
      })
    })

    req.on('error', (err) => {
      console.error(`❌ Error: ${err.message}`)
      resolve(null)
    })

    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

async function runTests() {
  console.log('🚀 Backend Integration Tests')
  console.log('============================\n')

  const baseOptions = {
    hostname: 'localhost',
    port: 4000,
    headers: { 'Content-Type': 'application/json' },
  }

  // Test 1: Register
  await test('Register User', { ...baseOptions, method: 'POST', path: '/api/register' }, {
    email: 'amparo@test.com',
    password: 'senha123456',
    fullName: 'Amparo Tester',
  })

  // Test 2: Register Duplicate (should fail)
  await test('Register Duplicate Email', { ...baseOptions, method: 'POST', path: '/api/register' }, {
    email: 'amparo@test.com',
    password: 'outraSenha',
    fullName: 'Another User',
  })

  // Test 3: Login
  const loginStatus = await test('Login', { ...baseOptions, method: 'POST', path: '/api/login' }, {
    email: 'amparo@test.com',
    password: 'senha123456',
  })

  console.log('\n✅ Tests completed!')
  process.exit(0)
}

runTests().catch((err) => {
  console.error('Test suite error:', err)
  process.exit(1)
})
