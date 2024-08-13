import styles from './drop-zone.module.scss'
import FilterBtn from '@/components/UI/filter-btn'
import ColorPicker from '../color-picker'
import {
  FaRegLightbulb,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa'

export default function DropZone({
  children,
  uploadBtn,
  getRootProps,
  getInputProps,
  isDragActive,
  isDragReject,
  isDragAccept,
  hasImage,
  backgroundColor,
  handleColorChange,
}) {
  return (
    <>
      <div
        {...getRootProps({
          className: `
            ${styles.dorpZone} 
            ${!isDragActive ? styles.active : ''}
            ${isDragAccept ? styles.accept : ''}
            ${isDragReject ? styles.reject : ''}
                `,
        })}
      >
        <input {...getInputProps()} />
        {children}

        {isDragAccept && (
          <span>
            <FaCheckCircle />
            此檔案可以上傳
          </span>
        )}
        {isDragReject && (
          <span>
            <FaExclamationCircle />
            檔案需請選擇圖片，且需小於2MB
          </span>
        )}
        {!isDragActive && (
          <span>
            <FaRegLightbulb />
            可拖放檔案至此區域，檔案需小於2MB
          </span>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <FilterBtn
            href={null}
            btnText={hasImage ? '更換圖片' : '上傳圖片'}
            onClick={uploadBtn}
            className={styles.btn}
          />
          <ColorPicker
            color={backgroundColor}
            colorChange={handleColorChange}
          />
        </div>
      </div>
    </>
  )
}
