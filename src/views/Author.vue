<template>
  <div class="about">
    <v-card class="mx-auto pa-6" outlined>
      <v-data-table
        :headers="headers"
        :items="list"
        :server-items-length="count"
        :options.sync="options"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:top>
          <div class="pa-3">
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" fab small>
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-form v-model="formValid" ref="form" autocomplete="off">
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name_cn"
                            label="姓名(中文)"
                            required
                            :rules="nameRules"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name_jp"
                            label="姓名(日文)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.name_en"
                            label="姓名(英文)"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.country"
                            label="国籍"
                            required
                            :rules="countryRules"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                  <v-btn color="blue darken-1" text @click="save">保存</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { createAuthor, fetchAuthor } from '@/api/author';

export default {
  data: () => ({
    headers: [
      {
        text: '姓名(中文)',
        value: 'name_cn',
      },
      {
        text: '姓名(日文)',
        value: 'name_jp',
      },
      {
        text: '姓名(英文)',
        value: 'name_en',
      },
      {
        text: '国籍',
        value: 'country',
      },
      {
        text: '作品数量',
        value: 'count',
      },
      { text: '操作', value: 'actions' },
    ],
    list: [],
    count: 0,
    loading: false,
    options: {},
    dialog: false,
    editedIndex: -1,
    editedItem: {
      name_cn: '',
      name_en: '',
      name_jp: '',
      country: '',
    },
    defaultItem: {
      name_cn: '',
      name_en: '',
      name_jp: '',
      country: '',
    },
    formValid: false,
    nameRules: [(v) => !!v || '中文名必填'],
    countryRules: [(v) => !!v || '国籍必填'],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '录入作者信息' : '编辑作者信息';
    },
  },

  methods: {
    async getList() {
      this.loading = true;
      const { page, itemsPerPage } = this.options;
      try {
        const res = await fetchAuthor({ page, pageSize: itemsPerPage });
        this.list = res.list;
        this.count = res.count;
      } finally {
        this.loading = false;
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.formValid) {
        await createAuthor(this.editedItem);
        this.getList();
        this.close();
      } else {
        this.$refs.form.validate();
      }
    },
  },

  watch: {
    options: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
};
</script>
