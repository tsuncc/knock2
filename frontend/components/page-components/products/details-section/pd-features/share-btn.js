import {
  FacebookShareButton,
  LineShareButton,
  WhatsappShareButton,
} from 'react-share'
import { FacebookIcon, LineIcon, WhatsappIcon } from 'react-share'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import myStyle from './features.module.css'

export default function ShareBtn() {
  const [sharePath, setSharePath] = useState('')
  const router = useRouter()
  useEffect(() => {
    // setSharePath(`${window.location.origin}${router.asPath}`)
    // FB的要開虛擬，否則分享內容會變404
    setSharePath(`https://583b-219-70-178-11.ngrok-free.app${router.asPath}`)
  }, [router.isReady])
  return (
    <div className={myStyle.share}>
      <FacebookShareButton url={sharePath} hashtag={'一起來玩桌遊!'}>
        <FacebookIcon size={30} round={true} />
      </FacebookShareButton>

      <LineShareButton url={sharePath}>
        <LineIcon size={30} round={true} />
      </LineShareButton>
      <WhatsappShareButton url={sharePath}>
        <WhatsappIcon size={30} round={true} />
      </WhatsappShareButton>
    </div>
  )
}
