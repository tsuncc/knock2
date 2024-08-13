import styled from '@emotion/styled'
import { API_SERVER } from '@/configs/api-path'
import Image from 'next/image'
import { FaCloudUploadAlt } from 'react-icons/fa'

export default function AvatarFormItem({ avatar = '', open }) {
  const Avatar = styled.button`
    position: relative;
    width: 250px;
    height: 250px;
    border-radius: 125px;
    background-color: #222222;
    border: 1px solid #222222;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.25);
  `
  const UploadIcon = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    inset: 0;
    color: white;
    border-radius: 125px;
    font-size: 50px;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
    opacity: 0;
    transition: all 0.2s ease-in-out;
    &:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.2);
    }
  `

  return (
    <Avatar onClick={open}>
      {avatar !== '' ? (
        <Image
          src={`${API_SERVER}/avatar/${avatar}`}
          fill
          alt=" "
          style={{
            objectFit: 'contain',
            borderRadius: '100%',
          }}
        />
      ) : null}
      <UploadIcon>
        <FaCloudUploadAlt />
      </UploadIcon>
    </Avatar>
  )
}
