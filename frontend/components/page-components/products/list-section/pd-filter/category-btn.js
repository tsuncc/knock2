import Link from 'next/link'
import { useRouter } from 'next/router'
import myStyle from './filter.module.css'
import { useProduct } from '@/context/product-context'

export default function CategoryBtn() {
  const router = useRouter()
  const { setShowIcon } = useProduct()

  const tabItems = [
    { key: 'category_id=1', name: '派對遊戲', path: '?category_id=1' },
    { key: 'category_id=2', name: '陣營遊戲', path: '?category_id=2' },
    { key: 'category_id=3', name: '家庭遊戲', path: '?category_id=3' },
    { key: 'category_id=4', name: '兒童遊戲', path: '?category_id=4' },
    { key: 'category_id=5', name: '策略遊戲', path: '?category_id=5' },
  ]
  const isActive = (key) => {
    let { category_id } = router.query
    return key.includes(category_id)
  }

  const handleShowIcon = () => {
    setShowIcon(false)
  }

  const handleLinkClick = (e, path) => {
    e.preventDefault()
    router.push(path, undefined, { scroll: false })
    handleShowIcon()
  }

  return (
    <>
      <div className="row">
        <div className={`${myStyle['category-area']} col-xl-6 offset-xl-3`}>
          <ul id={myStyle['category-ul']} className="d-flex">
            {tabItems.map((v) => (
              <li key={v.key} className={myStyle['li-line']}>
                <Link
                  className={isActive(v.key) ? myStyle['active'] : ''}
                  href={v.path}
                  // onClick={handleShowIcon}
                  onClick={(e) => handleLinkClick(e, v.path)}
                >
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
