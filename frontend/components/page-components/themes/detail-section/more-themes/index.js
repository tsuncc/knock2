import React from 'react'
import myStyle from './details.module.css'
import { useState, useEffect } from 'react'
import { BRANCH_THEMES } from '@/configs/api-path'
import Card02 from '@/components/UI/cards-themes'
import _ from 'lodash'

export default function MoreThemes() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${BRANCH_THEMES}?branch_id=1`)
      .then((response) => response.json())
      .then((myData) => {
        let shuffledThemes = _.shuffle(myData.themes).map((theme) => ({
          ...theme,
          branch_themes_id: theme.branch_themes_id || theme.theme_id,
        }))
        // 只取前三個主題
        setData(shuffledThemes.slice(0, 3))
      })
      .catch((error) => {
        console.error('Error fetching themes:', error)
      })
  }, [])

  return (
    <>
      <div className="container">
        <h2 className={myStyle.h1}>More Themes</h2>
        <div className="row mt-5 d-flex justify-content-evenly ">
          <div className="d-flex justify-content-evenly flex-wrap">
            {data.map((theme) => (
              <Card02
                key={theme.theme_id}
                branchName={theme.branch_name}
                themeImg={theme.theme_img}
                themeName={theme.theme_name}
                difficulty={theme.difficulty}
                introduction={theme.introduction}
                min_players={theme.min_players}
                max_players={theme.max_players}
                themeTime={theme.theme_time}
                branch_themes_id={theme.branch_themes_id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
