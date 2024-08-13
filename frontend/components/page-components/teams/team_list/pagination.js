import { useRouter } from 'next/router'
import { Pagination, PaginationItem } from '@mui/material'
import arrowLeft from '@/public/teams/arrow-left.svg'
import arrowRight from '@/public/teams/arrow-right.svg'
import Image from 'next/image'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/context/theme'

export default function MyPagination({ totalPages, setPage }) {
  const router = useRouter()
  const { query } = router

  const handlePageChange = (event, value) => {
    router.push({
      pathname: router.pathname,
      query: { ...query, page: value },
    })
    setPage(value)
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
            count={totalPages}
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
