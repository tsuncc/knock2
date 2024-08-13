import styles from '@/components/page-components/teams/teams.module.css'

export default function TeamsNotice() {
  return (
    <>
      <h3 className={`d-none d-lg-block ${styles.teamTitle}`}>注意事項</h3>
      <div className={styles.teamsNotice}>
        <ol>
          <li>
            在創立團隊之前，請先完成預約行程的手續並支付訂金。只有在預約成功後才能創建團隊。
          </li>
          <li>創團後，團長可以審核是否讓申請入團的使用者加入。</li>
          <li>
            創建團隊時，請注意團隊人數限制。團隊人數一旦確定，
            <br />
            將無法再進行更改，請在創建之前仔細確認團隊人數。
          </li>
          <li>
            請選擇一個合適且符合規範的團隊名稱。團隊名稱應該清晰明瞭，不得包含不當或違法的內容。
          </li>
          <li>
            創團後，團長和團員應遵守平台或服務的相關規定和條款。如果違反規定，可能會影響團隊的運營或成員資格。
          </li>
          <li>
            請在備註欄中提供團隊創建的詳細信息或特殊要求。這些信息有助於其他成員了解團隊的運作和規範。
          </li>
        </ol>
      </div>
    </>
  )
}
