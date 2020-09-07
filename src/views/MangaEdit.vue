<template>
  <div>
    <v-card class="mx-auto pa-6" outlined>
      <v-form ref="form" v-model="valid" lazy-validation autocomplete="off">
        <v-text-field
          v-model="formValue.path"
          :rules="pathRules"
          label="资源路径"
          required
        ></v-text-field>
        <v-text-field
          v-model="formValue.title_cn"
          :rules="nameRules"
          label="中文名称"
          required
        ></v-text-field>
        <v-text-field v-model="formValue.title_jp" label="日文名称"></v-text-field>
        <v-text-field v-model="formValue.title_en" label="英文名称"></v-text-field>
        <v-autocomplete
          :rules="authorRules"
          v-model="formValue.author"
          :items="authorList"
          :loading="authorLoading"
          :search-input.sync="authorSync"
          :filter="filterAuthor"
          clearable
          item-text="name_cn"
          item-value="_id"
          label="作者"
        >
          <template v-slot:no-data>
            <v-skeleton-loader
              ref="skeleton"
              type="list-item"
              class="mx-auto"
              :loading="authorLoading"
            >
              <v-list-item>
                <v-list-item-title>
                  未找到匹配项，输入中文，英文或日文来搜索作者
                </v-list-item-title>
              </v-list-item>
            </v-skeleton-loader>
          </template>
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name_cn"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>

        <v-combobox
          v-model="formValue.tags"
          :filter="filterTag"
          :items="tagList"
          :rules="tagRules"
          item-value="_id"
          label="选择标签"
          multiple
          hide-selected
          small-chips
        >
          <template v-slot:selection="{ attrs, item, parent, selected }">
            <v-chip
              v-if="item === Object(item)"
              v-bind="attrs"
              color="blue darken-3"
              :input-value="selected"
              label
              small
              dark
            >
              <span class="pr-2">
                {{ item.title }}
                <v-icon small @click="parent.selectItem(item)">mdi-close</v-icon>
              </span>
            </v-chip>
          </template>
          <template v-slot:item="{ item }">
            <v-chip color="blue darken-3" dark label small>
              {{ item.title }}
            </v-chip>
          </template>
        </v-combobox>
        <v-row v-if="formValue.cover">
          <v-col cols="3">
            <v-img :src="'https://api.karasu.cn/manga/' + formValue.cover" aspect-ratio="2"></v-img>
          </v-col>
        </v-row>
        <v-file-input
          accept="image/*"
          label="漫画封面"
          show-size
          :prepend-icon="null"
          v-model="cover"
          @change="uploadFile"
          :loading="uploading"
          :rules="fileRules"
        >
          <template v-slot:selection="{ text }">
            <v-chip small label color="primary">
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>
        <v-dialog
          ref="dialog"
          v-model="datePickerVisible"
          :return-value.sync="formValue.publish_time"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="formValue.publish_time"
              label="出版日期"
              readonly
              v-bind="attrs"
              v-on="on"
              clearable
            ></v-text-field>
          </template>
          <v-date-picker v-model="formValue.publish_time" type="month" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="datePickerVisible = false">取消</v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(formValue.publish_time)"
              >确定</v-btn
            >
          </v-date-picker>
        </v-dialog>
        <v-btn
          color="success"
          class="mt-4"
          @click="submit"
          :loading="submitLoading"
          :disabled="submitDisabled"
        >
          保存
        </v-btn>
      </v-form>
    </v-card>
    <v-snackbar v-model="snackbarVisible" color="success" top>
      保存成功
    </v-snackbar>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { searchAuthor } from '@/api/author';
import { uploadCover } from '@/api/upload';
import { fetchTag } from '@/api/tag';
import { createManga, fetchMangaDetail, updateManga } from '@/api/manga';

export default {
  data: () => ({
    valid: true,
    nameRules: [(v) => !!v || '名称必填'],
    pathRules: [(v) => !!v || '文件路径必填'],
    fileRules: [(v) => !!v || '封面必填'],
    tagRules: [(v) => !!v.length || '补充tag信息'],
    authorRules: [(v) => !!v || '作者必填'],
    authorSync: null,
    formValue: {
      path: '',
      title_cn: '',
      title_jp: '',
      title_en: '',
      author: '',
      cover: '',
      tags: [],
    },
    cover: [],
    authorList: [],
    authorLoading: false,
    uploading: false,
    submitLoading: false,
    tagList: [],
    datePickerVisible: false,
    snackbarVisible: false,
    submitDisabled: false,
    mangaId: null,
  }),

  async mounted() {
    this.fetchAuthor = debounce(this.fetchAuthor, 500);
    await this.getTags();
    const mangaId = this.$route.params.id;
    if (mangaId) {
      this.mangaId = mangaId;
      this.getMangaDetail(mangaId);
    }
  },

  methods: {
    async getMangaDetail(mangaId) {
      const result = await fetchMangaDetail(mangaId);
      this.formValue = {
        path: result.path,
        title_cn: result.title_cn,
        title_jp: result.title_jp,
        title_en: result.title_en,
        author: result.author._id,
        cover: result.cover,
        tags: this.tagList.filter((item) => result.tags.indexOf(item._id) > -1),
        publish_time: this.formatDate(result.publish_time),
      };
      this.authorList = [result.author];
    },

    async submit() {
      if (this.$refs.form.validate()) {
        this.submitLoading = true;
        let method = createManga;
        const { mangaId: id } = this;
        if (id) {
          method = updateManga;
        }
        try {
          await method({
            ...this.formValue,
            id,
            tags: this.formValue.tags.map((item) => item._id),
          });
          this.snackbarVisible = true;
          this.submitDisabled = true;
          setTimeout(() => {
            this.$router.push({ name: 'Home' });
          }, 1000);
        } finally {
          this.submitLoading = false;
        }
      }
    },

    async uploadFile(file) {
      if (!file) return false;
      this.uploading = true;
      try {
        const result = await uploadCover(file);
        this.formValue = { ...this.formValue, cover: result.target };
      } finally {
        this.uploading = false;
      }
    },

    filterTag(item, text) {
      if (!item.title) return false;
      return (
        item.title
          .toString()
          .toLowerCase()
          .indexOf(text.toString().toLowerCase()) > -1
      );
    },

    filterAuthor(item, text) {
      if (!item.name_cn) return false;
      const filter = (val) =>
        val
          .toString()
          .toLowerCase()
          .indexOf(text.toString().toLowerCase()) > -1;
      return filter(item.name_cn) || filter(item.name_jp) || filter(item.name_en);
    },

    async getTags() {
      const result = await fetchTag();
      this.tagList = result.list;
    },

    async fetchAuthor(name) {
      try {
        const res = await searchAuthor({ name });
        this.authorList = res;
      } finally {
        this.authorLoading = false;
      }
    },

    formatDate(date) {
      const d = new Date(date);
      if (d.getTime() > 0) {
        const m = d.getMonth() + 1;
        return [d.getFullYear(), m < 10 ? `0${m}` : m].join('-');
      }
      return '';
    },
  },

  watch: {
    authorSync(name) {
      this.authorLoading = true;
      this.fetchAuthor(name);
    },

    cover(v) {
      if (!v) {
        this.formValue = { ...this.formValue, cover: '' };
      }
    },
  },
};
</script>

<style></style>
