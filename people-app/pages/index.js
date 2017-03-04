import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'
import socketIo from 'socket.io-client'

export default class IndexPage extends React.Component {
  static async getInitialProps({res}) {
    const peopleDbHost = res ? process.env.PEOPLE_DB : window.peopleDbHost

    return { peopleDbHost, people: await (await fetch(`http://${peopleDbHost}/people`)).json()}
  }

  constructor(props) {
    super(props)
    this.state = props
  }

  componentWillMount() {
    this.setState({socketIo: socketIo(`http://${this.state.peopleDbHost}`)})
  }

  render() {
    const {people} = this.state

    return (
      <div className="container">
        <script dangerouslySetInnerHTML={{__html: `window.peopleDbHost = ${JSON.stringify(this.props.peopleDbHost)}`}}>
        </script>
        <Head>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
        </Head>
        <style jsx>{`
          .panel {
            max-width: 50rem;
            margin: 10px;
          }
          .delete-button {
            float: right;
          }
        `}
        </style>
        <div className="panel panel-default">
          <div className="panel-heading"><h1 className="panel-title">People</h1></div>
          <ul className="list-group">{
            people.map(person => (
              <Link href={`/person?id=${person.id}`} key={person.id}>
                <a className="list-group-item">
                  <div>
                    <button className="btn btn-xs delete-button"
                      onClick={(ev) => this.deletePerson(ev, person.id)}>
                      delete
                    </button>
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

  async deletePerson(ev, id) {
    ev.stopPropagation()
    await fetch(`http://${this.state.peopleDbHost}/people/${id}`, {
      method: 'DELETE'
    })

    this.setState({people: this.state.people.filter(p => p.id !== id)})
  }
}
