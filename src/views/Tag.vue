<template>
  <div class="about">
    <v-card class="mx-auto pa-6" outlined>
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
            <v-form v-model="formValid" ref="form">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.title"
                      label="tag名称"
                      required
                      :rules="nameRules"
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
      <v-data-iterator :items="list" :options.sync="options" hide-default-footer disable-pagination>
        <template v-slot:default="props">
          <v-row>
            <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
              <v-card>
                <v-card-title class="subheading font-weight-bold">{{ item.title }}</v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>作品数量：{{ item.count }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-card>
  </div>
</template>

<script>
import { createTag, fetchTag } from '@/api/tag';

export default {
  data: () => ({
    headers: [
      {
        text: '名称',
        value: 'title',
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
      title: '',
    },
    defaultItem: {
      title: '',
    },
    formValid: false,
    nameRules: [(v) => !!v || '名称必填'],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '录入信息' : '编辑信息';
    },
  },

  methods: {
    async getList() {
      this.loading = true;
      try {
        const res = await fetchTag();
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
        await createTag(this.editedItem);
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
