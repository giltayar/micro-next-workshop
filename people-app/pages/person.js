import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import fetch from 'isomorphic-fetch'

export default class PersonPage extends React.Component {
  static async getInitialProps({res, query}) {
    const peopleDbHost = res ? process.env.PEOPLE_DB : window.peopleDbHost

    if (!query.id) {
      return {peopleDbHost, first: '', last: '', age: ''}
    } else {
      return Object.assign({},
        {peopleDbHost},
        await (await fetch(`http://${peopleDbHost}/people/${query.id}`)).json())
    }
  }

  constructor(props) {
    super(props)
    this.state = props
  }

  render() {
    const {first, last, age} = this.state

    return (
      <div className="container">
        <script dangerouslySetInnerHTML={{ __html: `window.peopleDbHost = ${JSON.stringify(this.props.peopleDbHost)}` }}>
        </script>
        <Head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
        </Head>
        <style jsx>{`
          .panel {
            max-width: 400px;
            margin: 10px;
          }
        `}</style>
        <div className="panel panel-default">
          <div className="panel-heading"><h1 className="panel-title">{first || last ? (first || '') + ' ' + (last || '') : 'New Person'}</h1></div>
          <form className="panel-body">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text"
                className="form-control" id="firstName" placeholder="First Name"
                value={first}
                onChange={(ev) => this.setState({first: ev.target.value})} />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Last Name</label>
              <input type="text"
                className="form-control" id="lastName" placeholder="Last Name"
                value={last}
                onChange={(ev) => this.setState({last: ev.target.value})} />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Age</label>
              <input type="number"
                className="form-control" id="age" placeholder="Age"
                value={age}
                onChange={(ev) => this.setState({age: parseInt(ev.target.value)})} />
            </div>
            <button type="submit" className="btn btn-default" onClick={(ev) => this.handleSave(ev)}>
              {this.state.id ? 'Save' : 'Add'}
            </button>
          </form>
        </div>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" />
      </div>
    )
  }

  async handleSave(ev) {
    ev.preventDefault()
    await fetch(`http://${this.state.peopleDbHost}/people`, {
      method: this.state.id ? 'PUT' : 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({id: this.state.id,
        first: this.state.first, last: this.state.last, age: this.state.age})
    })

    Router.push('/')
  }
}
