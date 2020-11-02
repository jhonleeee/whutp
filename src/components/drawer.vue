<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    expand-on-hover
    :src="bg"
    style="z-index:999"
    fixed
  >
    <div
      class="glassBox"
      :class="{dark:this.$vuetify.theme.dark}"
      @mouseenter="$emit('expand-bar',true)"
      @mouseleave="$emit('expand-bar',false)"
    >
      <v-list dense nav class="py-0">
        <v-list-item two-line :class="miniVariant && 'px-0'">
          <v-list-item-avatar>
            <img :src="user.avarta" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{user.name}}</v-list-item-title>
            <v-list-item-subtitle>{{user.bio}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-group :value="true" prepend-icon="mdi-cog-outline">
    <template v-slot:activator>
        <v-list-item-title>{{$t('drawer.setting')}}</v-list-item-title>
    </template>
    <v-list-item link @click="changeTheme">
              <v-list-item-icon>
            <v-icon>mdi-theme-light-dark</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('drawer.theme')}}</v-list-item-title>
    </v-list-item>
    <v-list-item link @click="changeLanguage">
              <v-list-item-icon>
            <v-icon>mdi-translate</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{$t('drawer.language')}}</v-list-item-title>
    </v-list-item>
</v-list-group>
        <v-divider></v-divider>

        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: ["bg"],
  data() {
    return {
      drawer: true,
      user: {
        name: "计算机科学与技术",
        bio: "2018级",
        avarta:
          "https://dss0.bdstatic.com/6Ox1bjeh1BF3odCf/it/u=2761782935,4166989354&fm=74&app=80&f=PNG&size=f121,121?sec=1880279984&t=9abf9ce3f6f313603ad9d3a367d3f67a",
      },
      color: "primary",
      colors: ["primary", "blue", "success", "red", "teal"],
      right: false,
      permanent: true,
      miniVariant: true,
      expandOnHover: true,
    };
  },
  computed: {
     items:function(){return [
        { title: this.$i18n.t('drawer.relyGraph'), icon: "mdi-view-dashboard" },
        { title:  this.$i18n.t('drawer.creditCount'), icon: "mdi-image" },
        { title: this.$i18n.t('drawer.about'), icon: "mdi-help-box" },
      ]}
  },
  methods:{
    changeTheme:function(){
      this.$vuetify.theme.dark=!this.$vuetify.theme.dark;
    },
    changeLanguage:function(){
      if(this.$i18n.locale=='zh'){
        this.$i18n.locale='en';
      }else{
          this.$i18n.locale='zh'
      }
    }
  }
};
</script>
<style scoped>
.glassBox {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  height: 100%;
  transition-duration: 0.5s;
}
.glassBox.dark{
  background-color: rgba(0, 0, 0, 0.3);
}
</style>