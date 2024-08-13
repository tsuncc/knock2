import { THEME_LIST, BRANCH_LIST } from '@/configs/api-path'
import { useEffect, useState, useMemo } from 'react'
import { Select, MenuItem, FormControl, Button } from '@mui/material'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'
import TabPanel from '@mui/joy/TabPanel'
import Card02 from '@/components/UI/cards-themes'
import GoogleMap from './google-map.js'
import myStyles from './branch_themes.module.css'
import styles from './branch_themes.module.css'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeBranches() {
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const handleClearFilters = () => {
    setDifficultyFilter('all')
    setTimeFilter('all')
  }
  const [data, setData] = useState({
    success: false,
    themes: [],
  })
  const [data2, setData2] = useState({
    success: false,
    branches: [],
  })
  const [selectedBranch, setSelectedBranch] = useState(1) // 默認選擇的第一個分店

  useEffect(() => {
    fetch(`${THEME_LIST}?branch_id=${selectedBranch}`)
      .then((response) => response.json())
      .then((myData) => {
        setData({
          success: true,
          themes: myData.themes,
        })
      })
      .catch((error) => {
        console.error('Error fetching themes:', error)
      })

    fetch(BRANCH_LIST)
      .then((response) => response.json())
      .then((data) => {
        setData2({
          success: true,
          branches: data.branches,
        })
      })
      .catch((error) => {
        console.error('Error fetching branches:', error)
      })
  }, [selectedBranch])

  const filteredThemes = useMemo(() => {
    return data.themes.filter((theme) => {
      const matchesDifficulty =
        difficultyFilter === 'all' || theme.difficulty === difficultyFilter
      const matchesTime =
        timeFilter === 'all' || theme.theme_time.toString() === timeFilter
      return matchesDifficulty && matchesTime
    })
  }, [data.themes, difficultyFilter, timeFilter])

  const handleChange = (event, newValue) => {
    setSelectedBranch(newValue) // 更新分店
  }

  const handleDifficultyChange = (event) => {
    setDifficultyFilter(event.target.value)
  }

  const handleTimeChange = (event) => {
    setTimeFilter(event.target.value)
  }

  return (
    <div className={myStyles.container}>
      <Tabs
        aria-label="tabs"
        value={selectedBranch}
        onChange={handleChange}
        sx={{ bgcolor: 'transparent' }}
      >
        <TabList disableUnderline className={myStyles.tabList}>
          <hr className={myStyles.hr} />
          <Tab
            disableIndicator
            className={`${myStyles.tab} ${
              selectedBranch === 1 ? myStyles.tabSelected : ''
            }`}
            value={1}
          >
            高雄店
          </Tab>
          <Tab
            disableIndicator
            className={`${myStyles.tab} ${
              selectedBranch === 2 ? myStyles.tabSelected : ''
            }`}
            value={2}
          >
            台中店
          </Tab>
          <Tab
            disableIndicator
            className={`${myStyles.tab} ${
              selectedBranch === 3 ? myStyles.tabSelected : ''
            }`}
            value={3}
          >
            台北店
          </Tab>
          <hr className={myStyles.hr} />
        </TabList>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBranch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container">
              <div className={styles.filterContainer}>
                <FormControl className={styles.styledFormControl}>
                  <Select
                    value={difficultyFilter}
                    onChange={handleDifficultyChange}
                    displayEmpty
                    className={styles.styledSelect}
                    renderValue={(value) => (value === 'all' ? '難度' : value)}
                    size="small"
                    sx={{
                      height: '40px',
                      '& .MuiSelect-select': {
                        paddingTop: '5px',
                        paddingBottom: '5px',
                      },
                    }}
                  >
                    <MenuItem value="all" className={styles.styledMenuItem}>
                      所有難度
                    </MenuItem>
                    <MenuItem value="EASY" className={styles.styledMenuItem}>
                      EASY
                    </MenuItem>
                    <MenuItem value="MEDIUM" className={styles.styledMenuItem}>
                      MEDIUM
                    </MenuItem>
                    <MenuItem value="HARD" className={styles.styledMenuItem}>
                      HARD
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl className={styles.styledFormControl}>
                  <Select
                    value={timeFilter}
                    onChange={handleTimeChange}
                    displayEmpty
                    className={styles.styledSelect}
                    renderValue={(value) =>
                      value === 'all' ? '時間' : `${value}分鐘`
                    }
                    size="medium"
                    sx={{
                      height: '40px',
                      '& .MuiSelect-select': {
                        paddingTop: '4px',
                        paddingBottom: '4px',
                      },
                    }}
                  >
                    <MenuItem value="all" className={styles.styledMenuItem}>
                      所有時間
                    </MenuItem>
                    <MenuItem value="60" className={styles.styledMenuItem}>
                      60分鐘
                    </MenuItem>
                    <MenuItem value="90" className={styles.styledMenuItem}>
                      90分鐘
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  className={styles.styledButton}
                  onClick={handleClearFilters}
                  sx={{
                    height: '40px',
                    padding: '15px 10px',
                  }}
                >
                  清除篩選
                </Button>
              </div>
            </div>

            <TabPanel value={1}>
              <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
                {filteredThemes.map((theme) => (
                  <Card02
                    key={theme.theme_id}
                    branchName={theme.branch_name}
                    themeImg={theme.theme_img}
                    themeName={theme.theme_name}
                    difficulty={theme.difficulty}
                    introduction={theme.introduction}
                    min_players={theme.min_players}
                    max_players={theme.max_players}
                    themeTime={theme.theme_time}
                    branch_themes_id={theme.branch_themes_id}
                  />
                ))}
              </div>
              <div>
                {data2.branches
                  .filter((branch) => branch.branch_id === 1)
                  .map((branch) => (
                    <GoogleMap
                      key={branch.branch_id}
                      branchName={branch.branch_name}
                      openTime={branch.open_time}
                      closeTime={branch.close_time}
                      branchPhone={branch.branch_phone}
                      branchAddress={branch.branch_address}
                      mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.4358966739437!2d120.30607541022621!3d22.63753097935983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e04f2bd6ad2a5%3A0x2c7b3141395ed1d6!2zODA36auY6ZuE5biC5LiJ5rCR5Y2A5bu65ZyL5LqM6Lev!5e0!3m2!1szh-TW!2stw!4v1720144112391!5m2!1szh-TW!2stw"
                    />
                  ))}
              </div>
            </TabPanel>
            <TabPanel value={2}>
              <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
                {filteredThemes.map((theme) => (
                  <Card02
                    key={theme.theme_id}
                    branchName={theme.branch_name}
                    themeImg={theme.theme_img}
                    themeName={theme.theme_name}
                    difficulty={theme.difficulty}
                    introduction={theme.introduction}
                    min_players={theme.min_players}
                    max_players={theme.max_players}
                    themeTime={theme.theme_time}
                    branch_themes_id={theme.branch_themes_id}
                  />
                ))}
              </div>
              <div>
                {data2.branches
                  .filter((branch) => branch.branch_id === 2)
                  .map((branch) => (
                    <GoogleMap
                      key={branch.branch_id}
                      branchName={branch.branch_name}
                      openTime={branch.open_time}
                      closeTime={branch.close_time}
                      branchPhone={branch.branch_phone}
                      branchAddress={branch.branch_address}
                      mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14593.4358966739437!2d120.68607541022621!3d24.14753097935983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d2b41ad2a5%3A0x2c7b3141395ed1d6!2zODA36auY6ZuE5biC5LiJ5rCR5Y2A5bu65ZyL5LqM6Lev!5e0!3m2!1szh-TW!2stw!4v1720144112391!5m2!1szh-TW!2stw"
                    />
                  ))}
              </div>
            </TabPanel>
            <TabPanel value={3}>
              <div className="col-12 d-flex flex-row flex-wrap justify-content-center">
                {filteredThemes.map((theme) => (
                  <Card02
                    key={theme.theme_id}
                    branchName={theme.branch_name}
                    themeImg={theme.theme_img}
                    themeName={theme.theme_name}
                    difficulty={theme.difficulty}
                    introduction={theme.introduction}
                    min_players={theme.min_players}
                    max_players={theme.max_players}
                    themeTime={theme.theme_time}
                    branch_themes_id={theme.branch_themes_id}
                  />
                ))}
              </div>
              <div>
                {data2.branches
                  .filter((branch) => branch.branch_id === 3)
                  .map((branch) => (
                    <GoogleMap
                      key={branch.branch_id}
                      branchName={branch.branch_name}
                      openTime={branch.open_time}
                      closeTime={branch.close_time}
                      branchPhone={branch.branch_phone}
                      branchAddress={branch.branch_address}
                      mapSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14593.4358966739437!2d121.50607541022621!3d25.03753097935983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e04f2bd6ad2a5%3A0x2c7b3141395ed1d6!2zODA36auY6ZuE5biC5LiJ5rCR5Y2A5bu65ZyL5LqM6Lev!5e0!3m2!1szh-TW!2stw!4v1720144112391!5m2!1szh-TW!2stw"
                    />
                  ))}
              </div>
            </TabPanel>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
