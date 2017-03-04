import React from 'react'
import Link from 'next/link'

export default function IndexPage () {
  return <div>Hello <Link href='/goodbye'>world</Link></div>
}
