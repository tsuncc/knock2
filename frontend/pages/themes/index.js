import React from 'react'
import ThemeBranches from '@/components/page-components/themes/branch-nav/theme-branches'
import IndexLayout from '@/components/layout'

export default function ThemeList() {
  return (
    <>
      <IndexLayout pageName="themes" title="密室逃脫" background="dark">
        <div className="container">
          {/* 分店分頁標籤 */}
          <ThemeBranches />
        </div>
        <div className="container">
          <div className="row"></div>
        </div>
      </IndexLayout>
    </>
  )
}
