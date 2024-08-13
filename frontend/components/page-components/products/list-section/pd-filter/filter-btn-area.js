import React, { useState } from 'react'
import FilterBtn from '@/components/UI/filter-btn'
import { useRouter } from 'next/router'
import { AiFillCaretUp } from 'react-icons/ai'
import { AiFillCaretDown } from 'react-icons/ai'
import { useProduct } from '@/context/product-context'
import OutlineBtn from '@/components/UI/outline-btn'

export default function FilterBtnArea({
  priceToggle,
  setPriceToggle,
  NewToggle,
  setNewToggle,
}) {
  const router = useRouter()
  const { showIcon, setShowIcon, showIconNew, setShowIconNew } = useProduct()

  // const [priceToggle, setPriceToggle] = useState(false)
  // const [NewToggle, setNewToggle] = useState(false)

  const handleFilterCreated = (sort, order) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sort: sort, order: order },
      },
      undefined,
      { scroll: false }
    )
    setShowIcon(false)
    setShowIconNew(!showIconNew)
    setNewToggle(!NewToggle)
  }

  const handleFilterPrice = (sort, order) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, sort: sort, order: order },
      },
      undefined,
      { scroll: false }
    )
    setShowIcon(true)
    setShowIconNew(false)
    setPriceToggle(!priceToggle)
  }

  return (
    <>
      <OutlineBtn
        btnText={
          <>
            最新上架
            {showIconNew && (NewToggle ? <AiFillCaretUp /> : '')}
          </>
        }
        onClick={() =>
          handleFilterCreated('created_at', NewToggle ? '' : 'DESC')
        }
      />
      <OutlineBtn
        btnText={
          <>
            價格排序
            {showIcon &&
              (priceToggle ? <AiFillCaretUp /> : <AiFillCaretDown />)}
          </>
        }
        // marginLeft={'10px'}
        onClick={() => handleFilterPrice('price', priceToggle ? 'DESC' : 'ASC')}
      />

      {/* <FilterBtn
        btnText={'最新上架'}
        onClick={() => handleFilterCreated('created_at', 'DESC')}
      />
      <FilterBtn
        btnText={
          <>
            價格排序
            {showIcon &&
              (priceToggle ? <AiFillCaretUp /> : <AiFillCaretDown />)}
          </>
        }
        marginLeft={'10px'}
        onClick={() => handleFilterPrice('price', priceToggle ? 'DESC' : 'ASC')}
      /> */}
    </>
  )
}
