import { BRANCH_THEMES } from '@/configs/api-path'
import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import Card02 from '@/components/UI/cards-themes'
import { Box } from '@mui/joy'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './section3.module.css'
import HomeBtn from '@/components/UI/home-btn'
import _ from 'lodash'

export default function HomeSection3() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch(`${BRANCH_THEMES}?branch_id=1`)
      .then((response) => response.json())
      .then((myData) => {
        let shuffledThemes = _.shuffle(myData.themes).map((theme) => ({
          ...theme,
          branch_themes_id: theme.branch_themes_id || theme.theme_id,
        }))
        setData(shuffledThemes)
      })
      .catch((error) => {
        console.error('Error fetching themes:', error)
      })
  }, [])

  const settings = {
    className: 'center',
    centerMode: true,
    slidesToShow: 6,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    focusOnSelect: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 2100,
        settings: {
          centerMode: true,
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          centerMode: true,
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1500,
        settings: {
          centerMode: true,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 850,
        settings: {
          centerMode: true,
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          centerMode: false,
          slidesToShow: 1,
        },
      },
    ],
  }

  return (
    <>
      <Box className={styles['home-section3']}>
        <div className={styles['title']}>
          <h1>Game Theme</h1>
        </div>

        <div className={`${styles['slider']} slider-container`}>
          <Slider {...settings}>
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
          </Slider>
        </div>

        <div className={styles['HomeBtn']}>
          <HomeBtn
            linkSrc="/themes"
            btnText="更多詳情"
            hoverColor="white"
            hoverBorderColor="#222222"
            hoverBackgroundColor="#222222"
          />
        </div>
      </Box>
    </>
  )
}
