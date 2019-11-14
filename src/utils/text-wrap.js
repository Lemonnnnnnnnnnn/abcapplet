//换行方法
export default function textWrap(str, length) {
  var len = 0;
  var Textarr = str.split("");
  var res = ''
  Textarr.forEach(value => {
    if (value.charCodeAt(0) < 290) {
      len++;
    } else {
      len += 2
    }

    if (len >= length) {
      res = insertStr(str, length, '\n')
      len = 0
    } else res = str
  })

  return res;
}

function insertStr(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start)
}

