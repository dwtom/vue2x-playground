<template>
  <div class="home">
    <div class="home-center">
      <List>
        <ListItem
          v-for="(item, index) in list"
          :key="`mainlist-${index}`"
          class="list-item"
          @click.native="toDetailPage(item)"
        >
          <ListItemMeta
            :title="item.title"
            :description="item.desc"
          />
        </ListItem>
      </List>
    </div>
  </div>
</template>

<script>
import {homeList} from '@/data/home';
export default {
  name: 'Home',
  data() {
    return {
      list: homeList
    };
  },
  methods: {
    toDetailPage(item) {
      if (item.url) {
        this.$router.push({
          path: `/article/${item.url}`,
          query: {
            title: item.title ?? ''
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.home{
  padding: 16px;
}
.home-center{
  width: 1200px;
  margin: 0 auto;
}
.list-item{
  cursor: pointer;
}
</style>
