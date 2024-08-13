import { useState,useEffect} from 'react'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import ProductTabList from './product-tab-list'
import myStyle from './favorite-tab.module.css'
import MyPagination from '../../pagination'
import { useProduct } from '@/context/product-context'
import ProductTabDrag from './product-tab-drag'
import useScreenSize from '@/hooks/useScreenSize'
import ComponentOnly from './computer-only'

export default function FavoriteTab() {
  // ----MUI
  const [value, setValue] = useState('1')

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  // ----MUI
  const userClientWidth = useScreenSize()
  const [screenWidth, setScreenWidth] = useState(userClientWidth)
  useEffect(() => {
    setScreenWidth(userClientWidth)
  }, [userClientWidth])

  const { favoriteData } = useProduct()

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
          <TabList
            style={{ justifyContent: 'end' }}
            className={myStyle.right}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab
              value="1"
              icon={<FormatAlignLeftRoundedIcon />}
              aria-label="AlignLeft"
            />
            <Tab
              value="2"
              icon={<AppRegistrationIcon />}
              aria-label="favorite"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          {/* 一般卡片列表 */}
          <ProductTabList favData={favoriteData} />
          <MyPagination favoriteData={favoriteData} />
        </TabPanel>

        <TabPanel value="2">
          {/* 有分類的卡片列表 */}

          {screenWidth > 1250 ? (
            <ProductTabDrag favData={favoriteData} />
          ) : (
            <ComponentOnly />
          )}
        </TabPanel>
      </TabContext>
    </Box>
  )
}
