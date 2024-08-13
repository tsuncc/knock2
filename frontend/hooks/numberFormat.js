export const formatIntlNumber = (value) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatPrice = (value) => {
  const number = +value
  const IntlNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number)
  return `$${IntlNumber}`
}


export const formatDateWithWeekday = (dateString) => {
  const date = new Date(dateString)
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return date.toLocaleDateString('zh-TW', options) // 範例：2024年7月17日 (星期二)
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return date.toLocaleDateString('zh-TW', options) // 範例：2024年7月17日
}