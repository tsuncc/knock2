import styles from './cards.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { formatDateToTaiwan, formatTime } from '@/hooks/useDateFormatter'
import {
  AspectRatio,
  Card,
  CardContent,
  CardOverflow,
  Typography,
  Box,
} from '@mui/joy'

export default function Card01({
  team_id = 0,
  branchName = '',
  themeImg = 'theme-img.png',
  themeName = '',
  difficulty = '',
  max_players = '',
  team_title = '',
  rick_name = '',
  reservation_date = '',
  start_time = '',
  themeTime = 0,
  team_status = '',
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
        <Typography
          sx={{
            position: 'absolute',
            top: '20px',
            right: '15px',
            padding: '10px 0',
            // paddingTop: '10px',
            color: '#B99755',
            zIndex: 1,
            height: '100px',
            width: '100px',
            textAlign: 'center',
            // background: '#FFF',
            background: '#222222c4',
            borderRadius: '50%',
          }}
        >
          {team_status === '募集中' ? (
            <>
              <div>\募集中/</div>
              <Image
                src={`/ghost/ghost_05.png`}
                alt=""
                width={78}
                height={60}
              />
            </>
          ) : null}
          {team_status === '已成團' ? (
            <>
              <div>已成團！</div>
              <Image
                src={`/ghost/ghost_06.png`}
                alt=""
                width={78}
                height={60}
              />
            </>
          ) : null}
        </Typography>

        <AspectRatio ratio="375/240" style={{ borderRadius: '3px 3px 0 0' }}>
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
          pt: 3,
          pb: 0,
          px: { xs: 2, sm: 4 },
          justifyContent: 'center',
          color: '#B99755',
        }}
      >
        <h6 className="pb-2">{team_title}</h6>
        <span>團長：{rick_name}</span>
        <span>
          時間：{formatDateToTaiwan(reservation_date)} {formatTime(start_time)}
        </span>
        <div className="row">
          <div className="col-6">
            <span>長度：{themeTime} 分鐘</span>
          </div>
          <div className="col-6">
            <span>徵求人數：{max_players}</span>
          </div>
        </div>
      </CardContent>
      <CardOverflow>
        <CardContent
          orientation="horizontal"
          sx={{
            px: 3,
            pb: 2,
            gap: {
              xs: 1,
              sm: 3,
            },
          }}
        >
          <div style={{ margin: '0 auto', paddingTop: '3px ' }}>
            {' '}
            <Link href={`/teams/${team_id}`}>
              {team_status === '募集中' ? (
                <>
                  <button className={styles.button}>更多詳情</button>
                </>
              ) : null}
              {team_status === '已成團' ? (
                <>
                  <button
                    className={styles.button}
                    style={{ backgroundColor: '#B99755' }}
                  >
                    觀看記錄
                  </button>
                </>
              ) : null}
            </Link>
          </div>
        </CardContent>
      </CardOverflow>
    </Card>
  )
}
