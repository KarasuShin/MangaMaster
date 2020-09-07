<template>
  <div class="home">
    <v-card class="mx-auto px-3 py-6" outlined>
      <v-row justify="space-between">
        <v-col cols="3" class="py-0">
          <v-btn text color="blue darken-1 font-weight-bold" dark @click="toAdd">
            <span class="mr-3">add</span>
            <span>comics</span>
          </v-btn>
        </v-col>
        <v-col cols="3" class="py-0">
          <v-text-field label="漫画名称" append-icon="mdi-magnify" class="pa-0"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-chip-group v-model="selectTags" column multiple @change="getMangas">
            <v-chip filter outlined color="blue" v-for="tag in tags" :key="tag._id">{{
              `${tag.title}(${tag.count}) `
            }}</v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
      <v-row align="center" class="pl-3">
        <v-switch v-model="filterMode" :label="filterModeLabel" @click="getMangas"></v-switch>
        <v-btn text color="primary">reset</v-btn>
      </v-row>

      <v-divider></v-divider>
      <div class="pa-3">
        <div v-if="mangaList.length">
          <v-data-iterator :items="mangaList" :items-per-page.sync="pageSize" hide-default-footer>
            <template v-slot:default="props">
              <v-row>
                <v-col v-for="item in props.items" :key="item.name" cols="12" sm="3" md="4" lg="2">
                  <manga-card
                    :mid="item._id"
                    :cover="item.cover"
                    :title_cn="item.title_cn"
                    :title_jp="item.title_jp"
                    :title_en="item.title_en"
                    :author="item.author"
                    :publish_time="item.publish_time"
                    :tags="item.tags"
                    @del="del(item._id)"
                  />
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
          <v-pagination
            v-model="page"
            :length="pageLength"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
            @input="getMangas"
          ></v-pagination>
        </div>
        <div class="text-center" v-else>
          <div>未找到匹配漫画</div>
        </div>
      </div>
    </v-card>
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
  </div>
</template>

<script>
import { fetchTag } from '@/api/tag';
import { fetchManga } from '@/api/manga';
import MangaCard from '@/components/MangaCard.vue';

export default {
  name: 'Home',
  components: {
    MangaCard,
  },

  data: () => ({
    mangaList: [],
    mangaCount: 0,
    tags: [],
    selectTags: [],
    page: 1,
    pageSize: 20,
    filterMode: false,
  }),

  mounted() {
    this.getTags();
    this.getMangas();
  },

  methods: {
    async getTags() {
      const result = await fetchTag();
      this.tags = result.list;
    },

    async getMangas() {
      const { page, pageSize, selectTags, tags: _tags } = this;
      const tags = JSON.stringify(selectTags.map((item) => _tags[item]._id));
      const result = await fetchManga({ page, pageSize, tags, mode: this.filterModeLabel });
      const host = 'https://api.karasu.cn/manga/';
      this.mangaList = result.list.map((item) => ({ ...item, cover: host + item.cover }));
      this.mangaCount = result.count;
    },

    toAdd() {
      this.$router.push({ name: 'MangaAdd' });
    },
  },

  computed: {
    pageLength() {
      return Math.ceil(this.mangaCount / this.pageSize);
    },

    filterModeLabel() {
      return this.filterMode ? 'ANY' : 'ALL';
    },
  },
};
</script>

<style scoped>
.tag-box {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
