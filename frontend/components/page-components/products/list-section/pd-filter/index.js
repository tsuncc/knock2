import { useState } from 'react'
import Image from 'next/image'
import 'hover.css/css/hover-min.css'
import CategoryBtn from './category-btn'
import SearchInput from './search-input'
import SearchInputPhone from './search-input/search-input-phone'
import FilterBtnArea from './filter-btn-area'
import myStyle from './filter.module.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import PriceSlider from './price-slider'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import OutlineBtn from '@/components/UI/outline-btn'
import { useSnackbar } from '@/context/snackbar-context'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { TfiMoney } from 'react-icons/tfi'
import { useProduct } from '@/context/product-context'


export default function PdFilter() {
  const { openSnackbar } = useSnackbar()
  // 價格、最新按鈕toggle
  const [priceToggle, setPriceToggle] = useState(false)
  const [NewToggle, setNewToggle] = useState(false)
  // PriceSlider價格區間
  const [price, setPrice] = useState([500, 1500])

  const { setShowIcon, setShowIconNew ,setUserSearch} = useProduct()

  const router = useRouter()
  const handleClearUrl = () => {
    const { pathname } = router
    router.replace(pathname, undefined, { shallow: true })
    openSnackbar('清除篩選', 'error')
    setNewToggle(false)
    setShowIconNew(false)
    setShowIcon(false)
    setPriceToggle(false)
    setUserSearch('')
    setPrice([500, 1500])
  }
  useEffect(() => {
    AOS.init()
  }, [])

  return (
    <>
      <div data-aos="zoom-in-up" data-aos-duration="1500" className="container">
        <div className={myStyle.container}>
          <div className={myStyle.frame}>
            <Image
              className={`${myStyle.ghostLeft} hvr-wobble-top`}
              src="/ghost/ghost_14.png"
              width={178}
              height={155}
              alt="Picture of the author"
            />

            <Image
              className={`${myStyle.ghostRight} hvr-wobble-top`}
              src="/ghost/ghost_13.png"
              width={147}
              height={145}
              alt="Picture of the author"
            />

            <div className="d-flex">
              <div className={`${myStyle['frame-around']}`}></div>
              <div>
                <Image
                  className={myStyle['frame-img']}
                  src="/products/frame.svg"
                  width={180}
                  height={46}
                  alt="frame"
                />
              </div>

              <div className={`${myStyle['frame-around']}`}></div>
            </div>
          </div>

          <div id={`${myStyle['frame-border']}`}>
            {/* 手機板的input */}
            <div className={myStyle['top-input']}>
              <SearchInputPhone />
            </div>
            <CategoryBtn />

            <div className={myStyle['top-search-input']}>
              <OutlineBtn btnText={'重設'} onClick={handleClearUrl} />
            </div>

            {/* 下方區塊 */}
            <div className={`${myStyle['frame-bottom']} row`}>
              <div
                className={`${myStyle['bottom-left']} col-lg-4 align-items-center gap-3`}
              >
                {/* <FilterBtnArea /> */}
                <div className={myStyle['input-bottom']}>
                  <SearchInput />
                </div>
                <OutlineBtn btnText={'重設'} onClick={handleClearUrl} />
              </div>

              <div
                className={`${myStyle['bottom-center']} col-lg-4 d-flex flex-column justify-content-center align-items-center`}
              >
                {/* <div className={myStyle.text}>
                  <TfiMoney />
                </div> */}
                <div>
                  <PriceSlider price={price} setPrice={setPrice}/>
                </div>
              </div>

              <div className={`${myStyle['bottom-right']} col-lg-4 gap-3`}>
                <FilterBtnArea
                  priceToggle={priceToggle}
                  setPriceToggle={setPriceToggle}
                  NewToggle={NewToggle}
                  setNewToggle={setNewToggle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .container {
            margin-bottom: 5rem;
            padding: 0;
          }
        `}
      </style>
    </>
  )
}
