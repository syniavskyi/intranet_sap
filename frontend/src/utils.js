import moment from 'moment'

export const createRateDate = function(rateDate) {
    let day = parseFloat(moment(rateDate).format('D')),
      month = parseFloat(moment(rateDate).format('M')),
      dayOfWeek = parseFloat(moment(rateDate).weekday())
        
    if (dayOfWeek === 6) {
      if (day !== 1 ) {
        day = day - 1 
        rateDate.setDate(day)
      } else {
        rateDate = new Date(rateDate.getFullYear(), rateDate.getMonth() - 1, 0)
      }
    } else if (dayOfWeek === 0) {
      if (day !== 1 ) {
        day = day - 2 
        rateDate.setDate(day)
      } else {
        rateDate = new Date(rateDate.getFullYear(), rateDate.getMonth() - 1, 0)
        day = moment(rateDate).format('D')
        day = day - 1 
        rateDate.setDate(day)
      }
    }
  
    return rateDate
  }