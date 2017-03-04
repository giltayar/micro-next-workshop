const {describe, it, before, after} = require('mocha')
const chai = require('chai')
const {expect} = require('chai')
chai.use(require('chai-subset'))
const fetch = require('node-fetch')
const listen = require('test-listen')
const micro = require('micro')
const app = require('..')

describe('db app', function () {
  let service
  let url
  before(async () => {
    service = micro(app)
    url = await listen(service)
  })
  after(() => {
    if (service) {
      service.close()
    }
  })

  async function fetchBody (method, path, body) {
    return await (await fetch(url + path, {
      method,
      body: body && JSON.stringify(body),
      headers: {'content-type': 'application/json'}
    })).json()
  }

  it('should work', async function () {
    expect(await fetchBody('GET', '/people')).to.deep.equal([])

    const steve = await fetchBody('POST', '/people', { first: 'Steve', last: 'Shapiro', age: 44 })
    expect(steve)
      .to.containSubset({ first: 'Steve', last: 'Shapiro', age: 44 }).and.to.include.keys('id')

    ++steve.age
    expect(await fetchBody('PUT', '/people', steve)).to.deep.equal(steve)

    const clarissa = await fetchBody('POST', '/people', {first: 'Clarissa', last: 'Oreilly', age: 16})

    expect(await fetchBody('GET', '/people')).to.deep.equal([clarissa, steve])

    ++clarissa.age
    expect(await fetchBody('PUT', '/people', clarissa)).to.deep.equal(clarissa)

    expect(await fetchBody('GET', `/people/${clarissa.id}`)).to.deep.equal(clarissa)

    expect(await fetchBody('DELETE', `/people/${clarissa.id}`)).to.deep.equal({})

    expect(await fetchBody('GET', '/people')).to.deep.equal([steve])
  })
})
