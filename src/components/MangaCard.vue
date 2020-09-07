<template>
  <v-card style="height:100%;">
    <div class="pl-4 pt-4">
      <v-btn text color="primary" @click="toEdit">Edit</v-btn>
      <v-divider vertical class="px-2" />
      <v-btn text color="error" @click="del">delete</v-btn>
    </div>
    <v-card-title>
      <v-img :src="cover" :aspect-ratio="1" class="pointer" @click="toDetail" />
    </v-card-title>

    <v-divider />

    <v-list dense>
      <v-list-item>
        <v-list-item-content>名称(中文):</v-list-item-content>
        <v-list-item-content class="align-end justify-end text-right">{{
          title_cn
        }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>名称(日文):</v-list-item-content>
        <v-list-item-content class="align-end justify-end text-right">{{
          title_jp
        }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>名称(英文):</v-list-item-content>
        <v-list-item-content class="align-end justify-end text-right">{{
          title_en
        }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>作者:</v-list-item-content>
        <v-list-item-content class="align-end justify-end text-right">{{
          author.name_cn
        }}</v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>出版时间:</v-list-item-content>
        <v-list-item-content class="align-end justify-end">{{
          publish_time | formatDate
        }}</v-list-item-content>
      </v-list-item>

      <div class="d-flex px-4">
        <div style="white-space:nowrap">标签:</div>
        <div class="pl-4 flex">
          <div class="text-right tag-box">
            <div class="pa-1 d-inline-block" v-for="tag in tags" :key="tag._id">
              <v-chip x-small color="blue" dark>
                {{ tag.title }}
              </v-chip>
            </div>
          </div>
        </div>
      </div>
    </v-list>
    <v-dialog v-model="delConfirmVsible" max-width="290">
      <v-card>
        <v-card-title class="headline">操作提示</v-card-title>
        <v-card-text>
          确定要删除这本漫画吗？
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="delConfirmVsible = false">
            取消
          </v-btn>
          <v-btn color="red darken-1" text @click="confirmDel">
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { delManga } from '@/api/manga';

export default {
  props: {
    mid: {
      type: String,
      required: true,
    },

    cover: {
      type: String,
      required: true,
    },
    title_cn: {
      type: String,
      required: true,
    },
    title_jp: {
      type: String,
      default: '',
    },
    title_en: {
      type: String,
      default: '',
    },
    author: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    publish_time: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    delConfirmVsible: false,
    delId: -1,
  }),

  filters: {
    formatDate(date) {
      const d = new Date(date);
      return [d.getFullYear(), d.getMonth() + 1].join('/');
    },
  },
  methods: {
    toEdit() {
      this.$router.push({ name: 'MangaEdit', params: { id: this.mid } });
    },

    del() {
      this.delId = this.mid;
      this.delConfirmVsible = true;
    },

    async confirmDel() {
      if (this.delId === -1) return false;
      await delManga(this.delId);
      this.delId = -1;
      this.delConfirmVsible = false;
      this.getMangas();
    },

    toDetail() {},
  },
};
</script>

<style></style>
