import { Pagination, PaginationItem } from '@mui/material'
// 箭頭圖
// import { TbDog } from 'react-icons/tb'
import arrowLeft from '@/public/products/arrow-left.svg'
import arrowRight from '@/public/products/arrow-right.svg'
import Image from 'next/image'
// 改顏色
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/context/theme'
import { useProduct } from '@/context/product-context'

export default function MyPagination({ totalPages, favoriteData }) {
  const { router, data } = useProduct()

  const handlePageChange = (event, value) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: value },
    })
  }

  const CustomPrevious = () => (
    <Image src={arrowLeft} alt="Previous" width={47} height={21} />
  )
  const CustomNext = () => (
    <Image src={arrowRight} alt="Next" width={47} height={21} />
  )

  return (
    <>
      <ThemeProvider theme={theme}>
        <div className="col-12 d-flex justify-content-center mt-5">
          <Pagination
            onChange={handlePageChange}
            size="large"
            count={favoriteData ? favoriteData.totalPages : data.totalPages}
            defaultPage={1}
            color="primary"
            renderItem={(item) => (
              <PaginationItem
                sx={{
                  color: '#B99755',
                  ':hover': {
                    backgroundColor: 'rgba(185, 151, 85, 0.20)',
                  },
                  '&.Mui-selected': {
                    color: '#fff', // 修改選中狀態下的文字顏色
                  },
                }}
                slots={{
                  previous: CustomPrevious,
                  next: CustomNext,
                }}
                {...item}
              />
            )}
          />
        </div>
      </ThemeProvider>
    </>
  )
}
