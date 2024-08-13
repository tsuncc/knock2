import FavCard from '@/components/page-components/products/favorite-section/favorite-tab/product-tab-drag/fav-card'
import { useEffect, useState, useRef } from 'react'
import { FaMarker } from 'react-icons/fa6'
import myStyle from './drag.module.css'
import { useDragFavorite } from '@/hooks/useDragFavorite'
import EmptyFavorite from '../empty-favorite'
import { PRODUCT_LIST } from '@/configs/api-path'
import { useAuth } from '@/context/auth-context'
import OrderReviewDialog from './order-review-dialog/index'

export default function ProductTabDrag({ favData }) {
  let favDataRows = favData['rows'] || []
  const { auth, authIsReady } = useAuth()

  useEffect(() => {
    getFavoriteTitle(auth.id)
  }, [authIsReady])

  const { changeDragCard } = useDragFavorite()

  // 三個狀態紀錄section三欄資料
  const [sections, setSections] = useState({
    1: [],
    2: [],
    3: [],
  })

  const [targetDrag, setTargetDrag] = useState('')

  useEffect(() => {
    let new1 = []
    let new2 = []
    let new3 = []
    favDataRows.map((v) => {
      if (v.section === 1) {
        new1.push(v)
      } else if (v.section === 2) {
        new2.push(v)
      } else if (v.section === 3) {
        new3.push(v)
      }
    })
    setSections({ 1: new1, 2: new2, 3: new3 })
  }, [favData])

  // 標題
  const [title, setTitle] = useState([])
  const inpRef1 = useRef(null)
  const inpRef2 = useRef(null)
  const inpRef3 = useRef(null)

  const getFavoriteTitle = async (title_user_id) => {
    title_user_id = +title_user_id || 1
    const url = `${PRODUCT_LIST}/favorite_title/api/${title_user_id}`
    try {
      const res = await fetch(url)
      const resData = await res.json()
      if (resData.success) {
        setTitle(resData.rows[0].title.split(','))
      } else {
        setTitle(['收藏夾1', '收藏夾2', '收藏夾3'])
        // db新增收藏標題資料
        setFavoriteTitle(auth.id, '收藏夾1,收藏夾2,收藏夾3')
      }
    } catch (e) {
      console.error(e)
    }
  }

  //  將資料設定到資料庫
  const setFavoriteTitle = async (title_user_id, newTitle) => {
    const url = `${PRODUCT_LIST}/favorite_title/add/${title_user_id}`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      })
      const resData = await res.json()
    } catch (e) {
      console.error(e)
    }
  }

  const editFavoriteTitle = async (title_user_id, newTitle) => {
    const url = `${PRODUCT_LIST}/favorite_title/edit/${title_user_id}`
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      })
      const resData = await res.json()
    } catch (e) {
      console.error(e)
    }
  }

  function handleClick(index) {
    const input = document.createElement('input')
    input.type = 'text'
    input.value = title[index]
    input.addEventListener('blur', () => {
      const newTitle = [...title]
      newTitle[index] = input.value

      setTitle(newTitle)
      // 新增收藏標題
      editFavoriteTitle(auth.id, newTitle.join(','))

      if (index === 0) {
        inpRef1.current.innerHTML = input.value
      } else if (index === 1) {
        inpRef2.current.innerHTML = input.value
      } else if (index === 2) {
        inpRef3.current.innerHTML = input.value
      }
    })

    if (index === 0) {
      inpRef1.current.innerHTML = ''
      inpRef1.current.appendChild(input)
    } else if (index === 1) {
      inpRef2.current.innerHTML = ''
      inpRef2.current.appendChild(input)
    } else if (index === 2) {
      inpRef3.current.innerHTML = ''
      inpRef3.current.appendChild(input)
    }
    input.focus()
  }

  const handleDragDown = (e, section, fav_id) => {
    e.currentTarget.style.backgroundColor = '#f2f2f2'

    setSections((prevSections) => {
      // 創建一個新的 sections 對象
      const newSections = { ...prevSections }
      // 找到要移動的項目
      const itemToMove = Object.values(prevSections)
        .flat()
        .find((v) => {
          return v.favorite_id === Number(fav_id)
        })

      if (itemToMove) {
        // 從所有 section 中移除該項目
        Object.keys(newSections).forEach((key) => {
          newSections[key] = newSections[key].filter(
            (v) => v.favorite_id !== Number(fav_id)
          )
        })

        // 將項目添加到目標 section
        newSections[section] = [...newSections[section], itemToMove]
      }
      // 修改後端
      changeDragCard(section, fav_id)

      return newSections
    })
  }

  const handleDragstart = (e) => {
    // 將drag放到TargetDrag
    setTargetDrag(e.currentTarget)
  }
  const handleDragEnter = (e) => {
    e.currentTarget.style.backgroundColor = 'rgba(185, 151, 85, 0.5)'
  }
  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#f2f2f2'
  }

  // 無收藏顯示頁面
  if (favDataRows.length === 0) {
    return <EmptyFavorite />
  }

  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-between"></div>

        {/* 卡片區 最外層*/}
        <div className={`${myStyle.grid}`}>
          {/* 欄 */}
          <div
            id="1"
            onDrop={(e) => handleDragDown(e, e.currentTarget.id, targetDrag.id)}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDragEnter={handleDragEnter}
            className="text-center bg-gray d-flex align-items-center flex-column"
          >
            <div className={`${myStyle['top-title']} d-flex position-relative`}>
              <h4
                className={myStyle.title}
                onDoubleClick={() => handleClick(0)}
                ref={inpRef1}
              >
                {title[0]}
              </h4>

              <div className={myStyle.pen}>
                <FaMarker />
              </div>
            </div>
            <div>
              {Array.isArray(sections[1]) &&
                sections[1].map((v, i) => (
                  <FavCard
                    // onDragEnd={(e) => handleDragEnd(e)}
                    onDragStart={(e) => handleDragstart(e)}
                    key={v.product_id}
                    dbData={v}
                  />
                ))}
            </div>
          </div>

          {/* 欄 */}
          <div
            id="2"
            onDrop={(e) => handleDragDown(e, e.currentTarget.id, targetDrag.id)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className="text-center bg-gray d-flex align-items-center flex-column"
          >
            <div className={`${myStyle['top-title']} d-flex position-relative`}>
              <h4
                className={myStyle.title}
                onDoubleClick={() => handleClick(1)}
                ref={inpRef2}
              >
                {title[1]}
              </h4>
              <div className={myStyle.pen}>
                <FaMarker />
              </div>
            </div>
            {/* 卡片 */}
            {Array.isArray(sections[2]) &&
              sections[2].map((v, i) => (
                <FavCard
                  // onDragEnd={(e) => handleDragEnd(e)}
                  onDragStart={(e) => handleDragstart(e)}
                  key={v.product_id}
                  dbData={v}
                />
              ))}
          </div>

          {/* 欄 */}
          <div
            id="3"
            onDrop={(e) => handleDragDown(e, e.currentTarget.id, targetDrag.id)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className="text-center bg-gray d-flex align-items-center flex-column"
          >
            <div className={`${myStyle['top-title']} d-flex position-relative`}>
              <h4
                className={myStyle.title}
                onDoubleClick={() => handleClick(2)}
                ref={inpRef3}
              >
                {title[2]}
              </h4>
              <div className={myStyle.pen}>
                <FaMarker />
              </div>
            </div>
            {/* 卡片 */}
            {Array.isArray(sections[3]) &&
              sections[3].map((v, i) => (
                <FavCard
                  // onDragEnd={(e) => handleDragEnd(e)}
                  onDragStart={(e) => handleDragstart(e)}
                  key={v.product_id}
                  dbData={v}
                />
              ))}
          </div>
        </div>

        {/* 提示 */}
        <OrderReviewDialog />
      </div>
      <style jsx>
        {`
          .container {
            background-color: white;
            border-radius: 12px;
            margin-bottom: 30px;
            padding-bottom: 20px;
          }
           {
          }
          .bg-gray {
            background-color: #f2f2f2;
            border-radius: 20px;
            padding: 20px 0;
            height: 100%;
          }
        `}
      </style>
    </div>
  )
}
