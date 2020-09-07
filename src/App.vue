<template>
  <v-app>
    <v-navigation-drawer
      app
      clipped
      src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
      dark
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.text"
          link
          @click="clickNavigation(item.route)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left dense color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <div class="text-h6">漫画マスター</div>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <div class="pa-6">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    items: [
      { icon: 'mdi-trending-up', text: '漫画库', route: 'Home' },
      { icon: 'mdi-youtube-subscription', text: '作者库', route: 'Author' },
      { icon: 'mdi-tag', text: '标签库', route: 'Tag' },
    ],
  }),

  methods: {
    clickNavigation(route) {
      if (route !== this.$route.name) {
        this.$router.push({ name: route });
      }
    },
  },
};
</script>

<style lang="sass">
@import './global.scss'
</style>
