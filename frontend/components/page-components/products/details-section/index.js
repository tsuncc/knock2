import Message from '../message'
import myStyle from './details.module.css'

export default function DetailsSection({ breadcrumb, features, tab }) {
  return (
    <>
      <div className="container">{breadcrumb}</div>
      <div className="container">
        <div className={myStyle.section}>
          {features}
          {tab}
        </div>
      </div>
      <Message />
    </>
  )
}
