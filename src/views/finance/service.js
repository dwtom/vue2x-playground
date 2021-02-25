/*
 * @Description: filename
 * @Author: Dong Wei
 * @Date: 2021-02-25 16:25:08
 * @LastEditors: Dong Wei
 * @LastEditTime: 2021-02-25 17:21:11
 * @FilePath: \vue2x-playground\src\views\finance\service.js
 */
import * as API from '@/api/fund';

export const getFundRank = async () => {
  let result = {};
  try {
    const res = await API.postFundRankData({ sort: 'r' });
  } catch (error) {
    console.log(error);
  }
  return result;
};