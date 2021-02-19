export default function makeXmlRequestStr (json) {
  var xmlRequestStr = '<?xml version="1.0" encoding="UTF-8"?><requests><![CDATA['
  // json对象转json字符串
  var paramJson = jsonArryToString(json)
  xmlRequestStr += paramJson
  xmlRequestStr += ']]></requests>'
  return xmlRequestStr
}
function jsonArryToString (json) {
  var a = '',
    tpl = '{0}:"{1}"'
  for (var i = 0; i < json.length; i++) {
    var temp = '{'
    for (var name in json[i]) {
      var b = tpl.replace('{0}', name).replace('{1}', json[i][name])
      temp += temp === '{' ? b : ',' + b
    }
    temp += '}'
    // 遍历完一条请求
    a += a === '' ? temp : ',' + temp
  }
  return '{req:[' + a + ']}'
}
