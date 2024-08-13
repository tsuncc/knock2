// 用法
// {data.map((v, i) => {
//   return (
//     <Card01
//       key={v["theme_id"]}
//       branchName={v["branch_name"]}
//       themeImg={v["theme_img"]}
//       themeName={v["theme_name"]}
//       difficulty={v["difficulty"]}
//       description={v["description"]}
//       suitablePlayers={v["suitable_players"]}
//       themeTime={v["theme_time"]}
//     />
//   );
// })}

import styles from './cards.module.scss'
import Image from 'next/image'

import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
  Box,
} from '@mui/joy'

import { MdOutlineGroup, MdOutlineAccessTime } from 'react-icons/md'

export default function Card01({
  branchName = '',
  themeImg = 'theme-img.png',
  themeName = '',
  difficulty = '',
  description = '',
  suitablePlayers = '',
  themeTime = 0,
}) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return '#63AA90' // 黑色
      case 'MEDIUM':
        return '#B99755' // 白色
      case 'HARD':
        return '#A43131' // 藍色
      default:
        return '#222222' // 默認顏色
    }
  }

  return (
    <Card
      variant="plain"
      sx={{
        '--Card-radius': '0px',
        p: 0,
      }}
      className={styles['card-01']}
    >
      {/* 圖片 */}
      <CardOverflow
        sx={{
          position: 'relative',
        }}
      >
        <Typography
          sx={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            color: '#FFFFFF',
            zIndex: 1,
          }}
        >
          {branchName}
        </Typography>
        <AspectRatio ratio="375/240">
          <Image
            src={`/themes-main/${themeImg}`}
            alt=""
            width={375}
            height={240}
          />
        </AspectRatio>
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20px',
            left: '25px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              bgcolor: '#222222',
              color: '#FFFFFF',
              width: 160,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {themeName}
          </Typography>
          <Typography
            sx={{
              bgcolor: getDifficultyColor(difficulty),
              color: '#FFFFFF',
              width: 100,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {difficulty}
          </Typography>
        </Box>
      </CardOverflow>

      {/* 文字 title-md body-sm */}
      <CardContent
        sx={{
          py: 3,
          px: { xs: 4, sm: 6 },
          justifyContent: 'center',
        }}
      >
        <span>{description}</span>
      </CardContent>
      <CardOverflow>
        <CardContent
          orientation="horizontal"
          sx={{
            px: 6,
            pb: 2,
            gap: {
              xs: 1,
              sm: 3,
            },
          }}
        >
          <Typography
            startDecorator={<MdOutlineGroup />}
          >{`${suitablePlayers} 人`}</Typography>
          <Typography startDecorator={<MdOutlineAccessTime />}>
            {`${themeTime} 分鐘`}
          </Typography>
          <Typography
            sx={{
              display: 'flax',
              alignContent: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: '16px',
              right: '16px',
            }}
          >
            <span>立即預訂</span>
            <Image
              src="/components/arrow-special.svg"
              alt=""
              width={49}
              height={16}
              className={styles['arrow']}
            />
          </Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  )
}
