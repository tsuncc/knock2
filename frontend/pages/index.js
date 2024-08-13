import IndexLayout from '@/components/layout'
import Banner from '@/components/page-components/home/banner/banner'
import HomeSection2 from '@/components/page-components/home/section2'
import HomeSection3 from '@/components/page-components/home/section3'
import HomeSection4 from '@/components/page-components/home/section4'

export default function Home() {
  return (
    <>
      <IndexLayout pageName="index">
        <Banner />
        <HomeSection2 />
        <HomeSection3 />
        <HomeSection4 />
      </IndexLayout>
    </>
  )
}
