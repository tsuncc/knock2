import Message from '../message'
import myStyle from './list.module.css'
import TopMatter from './top-matter'

export default function ListSection({ top, filter, card }) {
  return (
    <div className={myStyle.section}>
    <TopMatter/>
    
      <div id='buy'></div>
      {top}
      {filter}
      {card}
     
        <Message />
  
    </div>
  )
}
