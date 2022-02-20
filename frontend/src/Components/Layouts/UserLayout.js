import React from 'react'
import { Navbar } from '../Navbar'

export const UserLayout = (props) => {
  return (
    <div>
      {
        props.navbar ?
          <div>
            <Navbar />
            <div>
              {props.children}
            </div>

          </div>
          :
          props.children
      }

    </div>
  )
}
