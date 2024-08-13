import React from 'react'
import { useRouter } from 'next/router'
import IndexLayout from '@/components/layout'
import DetailSection from '@/components/page-components/themes/detail-section'
import Banner from '@/components/page-components/themes/detail-section/banner/banner'
import Item from '@/components/page-components/themes/detail-section/item/item'
import Step from '@/components/page-components/themes/detail-section/step/step'
import Calendar from '@/components/page-components/themes/detail-section/calendar/calendar'
import { ThemeProvider, useTheme } from '@/context/theme-context'

function ThemeDetailsContent() {
  const router = useRouter()
  const { themeDetails, getThemeDetails } = useTheme()
  const [themeName, setThemeName] = React.useState('')
  const branch_themes_id = router.query.branch_themes_id

  React.useEffect(() => {
    if (router.isReady && branch_themes_id) {
      getThemeDetails(branch_themes_id)
    }
  }, [router.isReady, branch_themes_id, getThemeDetails])

  React.useEffect(() => {
    if (themeDetails) {
      setThemeName(themeDetails.theme_name)
    }
  }, [themeDetails])

  if (!themeDetails) {
    return <div> </div>
  }

  return (
    <IndexLayout pageName="themesDetails" title="密室逃脫" background="dark">
      <DetailSection
        Banner={<Banner />}
        Item={<Item />}
        Step={<Step />}
        Calendar={<Calendar branch_themes_id={branch_themes_id} />}
      />
      <div className="container">
        <div className="row"></div>
      </div>
    </IndexLayout>
  )
}

const ThemeDetails = () => (
  <ThemeProvider>
    <ThemeDetailsContent />
  </ThemeProvider>
)

export default ThemeDetails
