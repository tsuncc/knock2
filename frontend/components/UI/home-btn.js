import { Button } from '@mui/material'
import Link from 'next/link'

export default function HomeBtn({
  linkSrc = '',
  btnText = '請輸入按鈕文字',
  color = '#7B7B7B',
  borderColor = '#7B7B7B',
  backgroundColor = 'unset',
  hoverColor = '#7B7B7B',
  hoverBorderColor = '#D9D9D9',
  hoverBackgroundColor = '#D9D9D9',
}) {
  return (
    <>
      <Link href={linkSrc}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            color: color,
            fontFamily: 'Noto Serif JP',
            lineHeight: 2.5,
            borderRadius: '100px',
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            textTransform: 'none',
            padding: {
              xs: '10px 25px',
              sm: '16px 40px',
            },
            fontSize: {
              xs: '16px',
              sm: '20px',
            },
            width: {
              xs: '100%',
              sm: 'unset',
            },
            ':hover': {
              color: hoverColor,
              borderColor: hoverBorderColor,
              backgroundColor: hoverBackgroundColor,
            },
          }}
        >
          <span>{btnText}</span>
        </Button>
      </Link>
      <style jsx>
        {`
          span {
            color: ${color};
          }

          span:hover: {
            color: ${hoverColor};
          }
        `}
      </style>
    </>
  )
}
