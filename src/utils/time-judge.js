import { TIME_PICKER_DIST } from '@constants/dist'

export function rangeGeneration(month, year) {
  let [finalList, yearList, monthList, dayList, timeList]
    = [[], [year + '年'], [], [], [],]

  // 生成用于初始化时map的空数组
  const monthList_NaN = Array.from({ length: 12 })
  let dayList_NaN = []

  // 判断大小月与平年闰年
  let judge = { bigMonth: monthJudge(month), flatYear: yearJudge(year) }

  if (month !== 1) {
    judge.bigMonth ? dayList_NaN = Array.from({ length: 31 }) : dayList_NaN = Array.from({ length: 30 })
  } else if (month === 1) {
    judge.flatYear ? dayList_NaN = Array.from({ length: 28 }) : dayList_NaN = Array.from({ length: 29 })
  }

  //填充数据

  monthList_NaN.map((i, key) => monthList.push(key + 1 + '月'))
  dayList_NaN.map((i, key) => dayList.push(key + 1 + '日'))
  TIME_PICKER_DIST.map(i => timeList.push(i.hoursAndMin))

  finalList.push(yearList)
  finalList.push(monthList)
  finalList.push(dayList)
  finalList.push(timeList)

  return finalList
}

export function choiseValue(range, value, year) {
  let finalList = []

  // 判断大小月与平年闰年
  let dayList_NaN = []
  let dayList = []

  let judge = { bigMonth: monthJudge(value), flatYear: yearJudge(year) }

  if (value !== 1) {
    judge.bigMonth ? dayList_NaN = Array.from({ length: 31 }) : dayList_NaN = Array.from({ length: 30 })
  } else if (value === 1) {
    judge.flatYear ? dayList_NaN = Array.from({ length: 28 }) : dayList_NaN = Array.from({ length: 29 })
  }

  dayList_NaN.map((i, key) => dayList.push(key + 1 + '日'))

  // 读取上一个range的信息
  const yearList = range[0]
  const monthList = range[1]
  const timeList = range[3]

  finalList.push(yearList)
  finalList.push(monthList)
  finalList.push(dayList)
  finalList.push(timeList)
  return finalList
}

export function timeFormat(num) {
  let newNum = parseInt(num)
  if (newNum < 10) {
    return "0" + newNum
  } else {
    return newNum
  }
}


function monthJudge(month) {
  let bigMonthArr = [0, 2, 4, 6, 7, 9, 11]
  let bigMonth = true
  bigMonth = bigMonthArr.includes(month)
  return bigMonth
}

function yearJudge(year) {
  let flatYear = true
  if ((year % 4 === 0 && year % 100 != 0) || year % 400 === 0) {
    flatYear = false
  } else {
    flatYear = true
  }
  return flatYear
}



// 时间戳转日时分秒
export function timestampChange(time) {
  let res = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const minuteUnit = 60
  const hourUnit = minuteUnit * 60
  const dayUnit = hourUnit * 24
  let remainTime = time


  res.days = Math.floor(time / dayUnit)
  remainTime = time % dayUnit

  res.hours = Math.floor(remainTime / hourUnit)
  remainTime = remainTime % hourUnit

  res.minutes = Math.floor(remainTime / minuteUnit)
  remainTime = remainTime % minuteUnit

  res.seconds = Math.floor(remainTime)

  return res
}
