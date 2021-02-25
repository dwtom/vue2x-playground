/*
 * @Description: 金融数据接口
 * @Author: Dong Wei
 * @Date: 2021-02-25 16:17:35
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-02-25 16:36:31
 * @FilePath: \vue2x-playground\src\api\fund.js
 */
import axios from 'axios';

export function postFundRankData(data) {
  return axios.post(`${_FINANCEPATH_}/v1/fund/rank`, data);
}