// import moment from 'moment';

class Util {

  loadScript(url: string) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.appendChild(script)
  }

  // dateformat(date: Date, formatStr = 'YYYY-MM-DD') {
  //   if (date) {
  //     return moment(date).format(formatStr);
  //   }
  // }


  inOf(arr: Array<any>, targetArr: any) {
    let res = true
    arr.forEach(item => {
      if (targetArr.indexOf(item) < 0) {
        res = false
      }
    })
    return res
  }

  oneOf(ele: any, targetArr: Array<any>) {
    if (targetArr.indexOf(ele) >= 0) {
      return true
    } else {
      return false
    }
  }



  extend(...args: any[]) {
    let options; let name; let src; let srcType; let copy; let copyType; let copyIsArray; let clone
    let target = args[0] || {}
    let i = 1
    const length = args.length
    let deep = false
    if (typeof target === 'boolean') {
      deep = target
      target = args[i] || {}
      i++
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {}
    }
    if (i === length) {
      target = this
      i--
    }
    for (; i < length; i++) {
      if ((options = args[i]) !== null) {
        for (name in options) {
          src = target[name]
          copy = options[name]
          if (target === copy) {
            continue
          }
          srcType = Array.isArray(src) ? 'array' : typeof src
          if (deep && copy && ((copyIsArray = Array.isArray(copy)) || typeof copy === 'object')) {
            if (copyIsArray) {
              copyIsArray = false
              clone = src && srcType === 'array' ? src : []
            } else {
              clone = src && srcType === 'object' ? src : {}
            }
            target[name] = this.extend(deep, clone, copy)
          } else if (copy !== undefined) {
            target[name] = copy
          }
        }
      }
    }
    return target
  }
  
  decodeJwt(token: string):any {
    const text = decodeURIComponent(escape(window.atob(token.split('.')[1])));
    const obj = JSON.parse(text);
    return obj;
  }
}
const util = new Util()
export default util
