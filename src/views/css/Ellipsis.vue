<!--
 * @Description: 多行文本末尾显示省略号(如有英文需要添加word-break)
 * @Author: Dong Wei
 * @Date: 2020-12-25 11:11:42
 * @LastEditors: Dong Wei
 * @LastEditTime: 2020-12-28 15:08:38
 * @FilePath: \vue2x-playground\src\views\css\Ellipsis.vue
-->
<template>
  <div class="wrap">
    <p
      class="ellipsis"
      id="ellipsisBox"
    >
      {{words}}
    </p>
  </div>
</template>

<script>
// import '@/plugins/clamp';
import '@/plugins/clamp/full';
export default {
  name: 'Ellipsis',
  data() {
    return {
      wordsNum: '123456789012', // 12
      wordsLowerLetters: 'abcdefgabcdef', // 13
      wordsUpperLetters: 'ABCDEFGHIJK', // 11
      wordsChinese: '任董事长及首席', // 7
      wordsSymbol: '!@#$%^&*()_+', // 12
      wordsSymbol2: '！（）——《》', // 7
      wordsJapanese: 'いきものがかり', // 7
      // words: '史蒂夫·乔布斯（英语：Steve Jobs），是一名美国企业家、营销家和发明家，苹果公司的联合创始人之一，曾任董事长及首席执行官职位，NeXT创办人及首席执行官，也是皮克斯动画的创办人并曾任首席执行官，2006年为华特迪士尼公司的董事会成员。'
      words: '史蒂夫·乔布斯（英语：ABCDEFGHIJK）😁😱，是aaabbbdddddddsfsdfsdfsdfsdfsdf，苹果公司的联合创始人之一，曾任董事长及首席执行官职位，NeXT创办人及首席执行官，也是皮克斯动画的创办人并曾任首席执行官，2006年为华特迪士尼公司的董事会成员。'
    };
  },
  mounted() {
    this.setEllipsis();
  },
  methods: {
    setEllipsis() {
      // 实现思路：如果浏览器不兼容-webkit-line-clamp 则使用js截取字符串，如果没有特殊字符则去掉字符串最后一位并加上省略号判断字符串高度是否小于设定高度(每行高度默认等于行高，如果line-height为normal则使用1.2*fontSize)，不小于则递归继续截取字符串
      // 截至2020年底，主流浏览器(chrome,firefox,safari)均已兼容-webkit-line-clamp与-webkit-box-orient
      const box = document.getElementById('ellipsisBox');
      // eslint-disable-next-line no-undef
      $clamp(box, { clamp: 3 });
    },
    /**
     * @description: 根据内容宽度和fontsize获取省略号之前的字符串长度(由于不知道规定行数内的字母数量所以暂时无法计算)
     * @param {Stirng} str 内容字符串
     * @param {Number} lineNum 需要保留的行数
     * @param {Number} width 容器[内容]的宽度
     * @param {Number} fontSize 容器内文本的字体大小
     * @return {*}
     */
    getStringLength(str, lineNum, width, fontSize = 14) {
      // 近似计算：小写字母和数字一个字符占半个fontsize的宽度,其他的一个字符占一个fontsize的宽度
      // 按照小写字母和数字为一个字符串长度，其它为两个字符串长度来计算
      const unitNumberPerLine = Math.floor((width / fontSize) * 2); // 每一行的最小字符串长度(以小写字母和数字为最小单位)
      const unitNumberInNeed = unitNumberPerLine * lineNum; // 可以容纳的最小字符串总长度
      const lowerStrReg = /[a-z0-9]/g; // 匹配小写字母和数字
      const lowerStrLength = str.match(lowerStrReg).length; // 小写字母和数字的长度
      const otherStrLength = str.length - lowerStrLength; // 其他字符串的长度
      const strUnitLength = otherStrLength * 2 + lowerStrLength; // 按照最小单位计算出来的字符串所占总长度
    }
  }
};
</script>
<style scoped lang="less">
.wrap{
  width: 300px;
  border: 1px solid #000;
}
.ellipsis{
  word-break: break-all;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // display: -webkit-box;
  // -webkit-line-clamp: 3;
  // -webkit-box-orient: vertical;
}
</style>