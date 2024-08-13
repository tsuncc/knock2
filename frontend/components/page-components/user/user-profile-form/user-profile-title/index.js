import { FaArrowLeftLong } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'
import ClearButton from '@/components/UI/clear-button'

export default function UserProfileFormTitle({
  text = '',
  href,
  quickInput = '',
}) {
  const router = useRouter()
  const hrefHandler = () => {
    if (href) {
      router.push(href)
    }
  }
  return (
    <>
      <div className="title">
        {href ? (
          <IconButton onClick={hrefHandler}>
            <FaArrowLeftLong />
          </IconButton>
        ) : null}
        <h5>{text}</h5>
        {quickInput === '' ? null : (
          <ClearButton
            btnText={<span style={{ color: '#FFF' }}>快速輸入</span>}
            onClick={quickInput}
          />
        )}
      </div>
      <style jsx>{`
        .title {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          padding-bottom: 10px;
          margin-bottom: 20px;
          border-bottom: 1px solid #d9d9d9;
          svg {
            fill: #b99755;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </>
  )
}
