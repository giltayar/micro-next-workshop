import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'

export default class IndexPage extends React.Component {
  static async getInitialProps({res}) {
    const peopleDbHost = res ? process.env.PEOPLE_DB : window.peopleDbHost

    return { people: await (await fetch(`http://${peopleDbHost}/people`)).json()}
  }

  render() {
    const {people} = this.props
    return (
      <div className="container">
        <script>
          window.peopleDbHost = peopleDbHost
        </script>
        <Head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
        </Head>
        <style jsx>{`
          .panel {
            max-width: 50rem;
            margin: 10px;
          }
        `}
        </style>
        <div className="panel panel-default">
          <div className="panel-heading"><h1 className="panel-title">People</h1></div>
          <ul className="list-group">{
            people.map(person => (
              <Link href={`/person?id=${person.id}`}>
                <a className="list-group-item" key={person.id}>
                  <div>
                    <h4 className="list-group-item-heading">{person.first} {person.last}</h4>
                    <p className="list-group-item-text">age {person.age}</p>
                  </div>
                </a>
              </Link>
            ))
          }</ul>
          <div className="panel-footer"><Link href="/person"><button>Add</button></Link></div>
        </div>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" />
      </div>
    )
  }
}
