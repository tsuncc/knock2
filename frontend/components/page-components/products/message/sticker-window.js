import React from 'react'
import myStyle from './message.module.css'

export default function StickerWindow({sendSticker}) {

 
  return (
    <>
      <div className={myStyle.stickerWindow}>
        <div className={myStyle.stickerImgArea}>

          <button onClick={()=>sendSticker(1)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_1.png"
              alt=""
            />
          </button>
          <button onClick={()=>sendSticker(2)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_2.png"
              alt=""
            />
          </button>
          <button onClick={()=>sendSticker(3)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_3.png"
              alt=""
            />
          </button>

          <button onClick={()=>sendSticker(4)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_4.png"
              alt=""
            />
          </button>
          <button onClick={()=>sendSticker(5)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_5.png"
              alt=""
            />
          </button>
          <button onClick={()=>sendSticker(6)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_6.png"
              alt=""
            />
          </button>
          <button onClick={()=>sendSticker(7)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_7.png"
              alt=""
            />
          </button>
          <button onClick={()=>sendSticker(8)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_8.png"
              alt=""
            />
          </button>
          <button onClick={()=>sendSticker(9)}>
            <img
              className={myStyle.stickerImg}
              src="/sticker/ghost_9.png"
              alt=""
            />
          </button>
        </div>
      </div>
    </>
  )
}
