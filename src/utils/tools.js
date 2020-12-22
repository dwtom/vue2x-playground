/*
 * @Description: 公共方法
 * @Author: Dong Wei
 * @Date: 2020-12-22 16:14:57
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-22 16:35:54
 * @FilePath: \vue2x-playground\src\utils\tools.js
 */

/**
 * @description: 字符串过长显示...
 * @param {String} str 原始字符串
 * @param {Number} length 需要截取（保留）的长度
 * @return {String}
 */
export const getStringSlice = (str, length) => {
  const retainStr = str.slice(0, length);
  if (str.length === retainStr.length) {
    return str;
  } else {
    return `${retainStr}...`;
  }
};

/**
* @description: 数字添加千分符
* @param {Number|String} num
* @param {Number} [fixed=0] 需要保留的小数位数,默认保留整数
* @return {String}
*/
export const getThousandsNum = (num, fixed = 0) => {
  if (typeof num !== 'number') num = Number(num);
  if (isNaN(num)) return '';
  num = num.toFixed(fixed).split('.');
  if (fixed !== 0) {
    return [num[0].replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,'), num[1]].join('.');
  } else {
    return [num[0].replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')].join('');
  }
};

// 对象转化为数组
export const ObjectToArray = (obj) => {
  const arr = [];
  Object.keys(obj).forEach(k => {
    arr.push({
      key: k,
      value: obj[k]
    });
  });
  return arr;
};