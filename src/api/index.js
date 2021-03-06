/*
 * @Description: 接口
 * @Author: Dong Wei
 * @Date: 2020-12-23 09:47:57
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-01-19 13:47:24
 * @FilePath: \vue2x-playground\src\api\index.js
 */
import axios from 'axios';

// 取消请求
// ！！Cancel Token 将逐步退出历史舞台，推荐使用 AbortController 来实现请求中止。axios貌似不支持
// https://github.com/umijs/umi-request/blob/master/README_zh-CN.md
const CancelToken = axios.CancelToken;
let cancelRequest; // 理论上说应该每个cancel方法对应一个axios请求，只有CancelToken可以共用，但是当前场景每一个tab只有一个接口请求所以没有写那么麻烦

// tab栏切换用
// 测试地址 https://www.juhe.cn/box/index/id/235
// 获取新闻头条
export function getTopNewsData(data) {
  const params = {
    ...data,
    key: '4aef0910519190988f0c58346007b8b0'
  };
  // return axios.post(`${_JUHE_}/toutiao/index?key=${params.key}`, {}, {
  return axios({
    url: `${_JUHE_}/toutiao/index`,
    method: 'get',
    params,
    cancelToken: new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      cancelRequest = c;
    })
  });
}

// 获取天气
export function getWeaterForcastData(data) {
  const params = {
    ...data,
    key: 'c24048f9e20c1ee57a0bd18a53c9967e'
  };
  const key = 'c24048f9e20c1ee57a0bd18a53c9967e';
  // return axios.post(`${_JUHEOLD_}/simpleWeather/query?key=${key}&city=${data.city}`, {}, {
  return axios({
    url: `${_JUHEOLD_}/simpleWeather/query`,
    method: 'get',
    params,
    cancelToken: new CancelToken(function executor(c) {
      // executor 函数接收一个 cancel 函数作为参数
      cancelRequest = c;
    })
  });
}

export { cancelRequest };