import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import myStyle from './slick.module.css'
import { useProductImg } from '@/hooks/useProductImg'
import { PRODUCT_IMG } from '@/configs/api-path'
import { useEffect, useState } from 'react'

function PdSlick({ product_id }) {
  const [isId, setIsId] = useState(0)
  // const [isData, setIsData] = useState([])

  const { data } = useProductImg(isId)
  useEffect(() => {
    setIsId(product_id)
  }, [product_id])

  // useEffect(() => {
  //   if (data) {
  //     setIsData(data)
  //     console.log('isData', isData)
  //   }
  // }, [data])

  // console.log('25-isData', isData)

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img src={`${PRODUCT_IMG}/${data[i]}.jpg`} alt="productImg" />
        </a>
      )
    },
    dots: true,
    dotsClass: `slick-dots ${myStyle['slick-thumb']}`,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  }
  return (
    <div>
      <Slider {...settings}>
        {data.map((v, i) => {
          return (
            <div key={i} className={myStyle['slider-img']}>
              <img src={`${PRODUCT_IMG}/${v}.jpg`} alt="productImg" />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default PdSlick
