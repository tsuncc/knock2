import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

import { useAuth } from '@/context/auth-context'
import { API_SERVER } from '@/configs/api-path'
import { useSnackbar } from '@/context/snackbar-context'
import DropZone from './drop-zone'
import AvatarDialog from './avatar-dialog'
import { FaImage } from 'react-icons/fa6'
import ZoomSlider from './zoom-slider'

export default function AvatarFormDialogs({ openDialog, closeDialog }) {
  const { openSnackbar } = useSnackbar()
  const { auth, setAuthRefresh, getAuthHeader } = useAuth()
  const [imgUrl, setImgUrl] = useState('')
  // cropper
  const [cropper, setCropper] = useState(null)
  const imageRef = useRef(null)
  const [backgroundColor, setBackgroundColor] = useState('rgb(236, 236, 236,0)')

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0].size > 2097152) {
      openSnackbar('圖片請小於 2MB', 'error')
      return
    }
    const img_url = URL.createObjectURL(acceptedFiles[0])

    setImgUrl(img_url)
  }

  const {
    open,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/gif': [],
      'image/bmp': [],
      'image/webp': [],
      'image/tiff': [],
      'image/svg': [],
    },
  })

  const [zoomValue, setZoomValue] = useState(0.1)

  const handleZoomChange = (event, newValue) => {
    if (newValue < 0.1) newValue = 0.1
    if (newValue > 2) newValue = 2

    if (cropper) {
      // 計算zoom變化
      const zoomChange = newValue - zoomValue
      cropper.zoom(zoomChange)
      setZoomValue(newValue)
    }
  }

  const handleColorChange = (color) => {
    const { r, g, b, a } = color.rgb
    setBackgroundColor(`rgba(${r}, ${g}, ${b}, ${a})`)
  }

  const avatarSubmit = () => {
    if (!cropper) return

    cropper
      .getCroppedCanvas({ width: 250, height: 250, fillColor: backgroundColor })
      .toBlob((blob) => {
        const formData = new FormData()
        formData.append('user_id', auth.id)
        formData.append('avatar', blob, 'cropped-image.png')

        const url = `${API_SERVER}/users/upload-avatar`
        const option = {
          method: 'POST',
          body: formData,
          headers: {
            ...getAuthHeader(),
          },
        }
        fetch(url, option)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              closeDialog()
              setImgUrl('')
              setAuthRefresh(true)
              openSnackbar('新增成功', 'success')
            } else {
              openSnackbar('新增失敗，請稍後再試', 'error')
            }
          })
          .catch((err) => {
            console.error(err)
            openSnackbar('新增失敗，請稍後再試', 'error')
          })
        resetUploader()
      })
  }

  const resetUploader = () => {
    if (cropper) cropper.destroy()
    setCropper(null)
    setImgUrl('')
    imageRef.current = null
    setZoomValue(0.1)
    setBackgroundColor('rgb(236, 236, 236,0)')
  }

  useEffect(() => {
    if (imgUrl && imageRef.current) {
      if (cropper) {
        setZoomValue(0.1)
        cropper.replace(imgUrl)
      } else {
        const cropperInstance = new Cropper(imageRef.current, {
          viewMode: 1,
          center: false, // 中心十字
          guides: false, // 裁切格線
          background: false, // 背景有沒有透明隔線
          dragMode: 'move', // 設置為 'move' 只允許移動圖片
          scalable: false, // 禁止調整大小
          cropBoxMovable: false, // 禁止移動裁剪框
          cropBoxResizable: false, // 禁止裁剪框調整大小
          zoomOnTouch: false, // 禁止觸控縮放
          zoomOnWheel: false, // 禁止滾輪縮放
          ready() {
            const containerData = this.cropper.getContainerData()
            const cropBoxData = {
              left: (containerData.width - 250) / 2,
              top: (containerData.height - 250) / 2,
              width: 250,
              height: 250,
            }
            this.cropper.setCropBoxData(cropBoxData)
            this.cropper.setCanvasData(cropBoxData)
          },
        })
        setCropper(cropperInstance)
      }
    }
    // eslint-disable-next-line
  }, [imgUrl])

  return (
    <>
      <AvatarDialog
        imgUrl={imgUrl}
        zoomValue={zoomValue}
        handleZoomChange={handleZoomChange}
        backgroundColor={backgroundColor}
        handleColorChange={handleColorChange}
        openDialog={openDialog}
        closeDialog={closeDialog}
        avatarSubmit={avatarSubmit}
        resetUploader={resetUploader}
      >
        <DropZone
          uploadBtn={open}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          isDragReject={isDragReject}
          isDragAccept={isDragAccept}
          hasImage={!!imgUrl}
          backgroundColor={backgroundColor}
          handleColorChange={handleColorChange}
        >
          <div className="cropperContainer">
            {imgUrl ? (
              <Image
                ref={imageRef}
                src={imgUrl}
                width={250}
                height={250}
                alt="avatar"
                style={{
                  objectFit: 'contain',
                  background: 'rgb(236, 236, 236,1)',
                  borderRadius: '50%',
                  margin: '0 auto',
                }}
              />
            ) : (
              <FaImage style={{ fontSize: '5rem' }} />
            )}
          </div>
        </DropZone>
        <ZoomSlider
          disabled={!imgUrl}
          value={zoomValue}
          zoomChange={handleZoomChange}
        />
      </AvatarDialog>

      <style jsx>{`
        .cropperContainer {
          width: 100%;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 12px;
          background-color: ${backgroundColor || 'rgb(236, 236, 236,0)'};
          & :global(.cropper-view-box) {
            border-radius: 50%;
            outline: unset;
            border: 2px solid #ffffff;
            background-color: ${backgroundColor || 'rgb(236, 236, 236,0)'};
          }
          & :global(.cropper-face) {
            background-color: unset;
          }
          & :global(.cropper-modal) {
            // background-color: unset;
            // opacity: unset;
            border-radius: 12px; /* 将裁切框变成圆形 */
          }
        }
      `}</style>
    </>
  )
}
