import React from 'react'
import Head from 'next/head'

export default class PersonPage extends React.Component {
  static async getInitialProps() {
    return { first: 'Gil', last: 'Tayar', age: 45, id: '1' }
  }

  render() {
    const person = this.props

    return (
      <div class="container">
        <Head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        </Head>
        <style jsx>{`
          .panel {
            max-width: 400px;
            margin: 10px;
          }
        `}</style>
        <div className="panel panel-default">
          <div className="panel-heading"><h1 className="panel-title">{person.first} {person.last}</h1></div>
          <form className="panel-body">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" className="form-control" id="firstName" placeholder="First Name" value={person.firstName} />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Last Name</label>
              <input type="text" className="form-control" id="lastName" placeholder="Last Name" value={person.lastName} />
            </div>
            <div className="form-group">
              <label htmlFor="firstName">Age</label>
              <input type="number" className="form-control" id="age" placeholder="Age" value={person.age} />
            </div>
            <button type="submit" className="btn btn-default">Save</button>
          </form>
        </div>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" />
      </div>
    )
  }
}
