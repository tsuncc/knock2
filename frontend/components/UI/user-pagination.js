import { Pagination, PaginationItem } from '@mui/material'
import Image from 'next/image'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/context/theme'
import arrowLeft from '@/public/products/arrow-left.svg'
import arrowRight from '@/public/products/arrow-right.svg'

export default function UserPagination({ page, totalPages, onPageChange }) {
  const handlePageChange = (event, value) => {
    onPageChange(value) // 更新當前頁碼
  }

  const PreviousButton = () => (
    <Image src={arrowLeft} alt="Previous" width={47} height={21} />
  )
  const NextButton = () => (
    <Image src={arrowRight} alt="Next" width={47} height={21} />
  )

  return (
    <ThemeProvider theme={theme}>
      <div className="col-12 d-flex justify-content-center mt-5">
        <Pagination
          onChange={handlePageChange}
          size="large"
          page={page} // 當前頁碼
          count={totalPages} // 總頁數
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              sx={{
                color: '#B99755',
                ':hover': {
                  backgroundColor: 'rgba(185, 151, 85, 0.20)',
                },
                '&.Mui-selected': {
                  color: '#fff',
                },
              }}
              components={{
                previous: PreviousButton,
                next: NextButton,
              }}
              {...item}
            />
          )}
        />
      </div>
    </ThemeProvider>
  )
}
