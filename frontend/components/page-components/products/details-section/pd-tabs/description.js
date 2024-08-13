import React, { useEffect, useState } from 'react'
import myStyle from './tabs.module.css'

export default function Description({ description }) {
  const [dbData, setDbData] = useState([])

  useEffect(() => {
    const newData = description.split(';')
    setDbData(newData)
  }, [description])

  return (
    <>
      {dbData.map((value, index) => (
        <p className={myStyle.description} key={index}>
          {value}
        </p>
      ))}
    </>
  )
}
