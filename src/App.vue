<template>
  <v-app class="light-bg mini-Scroll-Bar" id="app">
    <v-app-bar
      :collapse="!appBarShow"
      :collapse-on-scroll="appBarShow"
      src="https://www.setaswall.com/wp-content/uploads/2017/04/Material-Wallpaper-1-3840x2169-768x434.jpg"
      app
      clipped-left
      dark
      scroll-target="#app"
      style="z-index: 9999"
      :class="{ isLoading: isLoading }"
    >
      <!--scrool-target can't work-->
      <!--I should have carried out this AppBar myself-->
      <v-app-bar-nav-icon @click="showDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title>前置课程确认</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-checkbox
        v-model="collapseLock"
        color="white"
        hide-details
      ></v-checkbox>
      <v-progress-circular
        v-if="true"
        :width="3"
        indeterminate
        color="white"
      ></v-progress-circular>
    </v-app-bar>
    <DRAWER
      @expand-bar="collapseOnScroll = $event"
      bg="https://pbs.twimg.com/media/EjuiYmOVkAU0ziS?format=jpg&name=large"
      ref="drawer"
      @mouseleave="collapseOnScroll = true"
    ></DRAWER>
    <v-main>
      <v-container
        id="maincontainer"
        class="maincontainer"
        @wheel="scrollTopBarShow"
        @setloadings="setloading" 
         transition="scale-transition"
      >
      <v-slide-x-transition>
        <router-view></router-view>
        </v-slide-x-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
//import {jsPlumb} from 'jsplumb';//https://zhuanlan.zhihu.com/p/41808577
import DRAWER from "./components/drawer";
export default {
  name: "App",

  components: {
    DRAWER,
  },
  computed: {
    appBarShow() {
      if (this.collapseLock) return true;
      else return this.collapseOnScroll;
    },
  },
  methods: {
    scrollTopBarShow(e) {
      if (this.collapseLock) {
        return;
      }
      e = e || window.event;
      if (e.wheelDelta) {
        if (e.wheelDelta > 0) {
          //scroll up
          if (this.collapseScrollCombo <= -this.collapseScrollInvokeCount - 3) {
            //change the show/hide of the bar only if scroll to one direction for 5 times
            this.collapseScrollCombo = 0;
            this.collapseOnScroll = true;
          } else {
            if (this.collapseScrollCombo <= 0) this.collapseScrollCombo--;
            else this.collapseScrollCombo = 0;
          }
        }
        if (e.wheelDelta < 0) {
          if (this.collapseScrollCombo >= this.collapseScrollInvokeCount) {
            this.collapseScrollCombo = 0;
            this.collapseOnScroll = false;
          } else {
            if (this.collapseScrollCombo >= 0) this.collapseScrollCombo++;
            else this.collapseScrollCombo = 0;
          }
        }
      } else if (e.detail) {
        //for fireFox
        if (e.detail > 0) {
          if (this.collapseScrollCombo <= -this.collapseScrollInvokeCount - 3) {
            //change the show/hide of the bar only if scroll to one direction for 5 times
            this.collapseScrollCombo = 0;
            this.collapseOnScroll = true;
          } else {
            if (this.collapseScrollCombo <= 0) this.collapseScrollCombo--;
            else this.collapseScrollCombo = 0;
          }
        }
        if (e.detail < 0) {
          if (this.collapseScrollCombo >= this.collapseScrollInvokeCount) {
            this.collapseScrollCombo = 0;
            this.collapseOnScroll = false;
          } else {
            if (this.collapseScrollCombo >= 0) this.collapseScrollCombo++;
            else this.collapseScrollCombo = 0;
          }
        }
      }
    },
    showDrawer() {
      this.$refs.drawer.drawer = true;
    },
    setloading(isLoading) {
      if (isLoading) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    },
  },
  mounted: function () {
    //let jsPlumbIns = jsPlumb.getInstance();
    //  jsPlumbIns.ready(function () {
    //       jsPlumbIns.connect({
    //         source: 'a1',
    //         target: 'a2',
    //         endpoint: 'Dot'
    //       })
    //     })
    //TODO:When overflow-x is scroll, overflow-y will be set to scroll even you have set 'visible',which means the cross-row-line will be limited in one row
  },
  data() {
    return {
      alert: true,
      collapseOnScroll: true,
      collapseLock: false,
      collapseScrollCombo: 0,
      collapseScrollInvokeCount: 1,
      isLoading: false,
      show:false
    };
  },
};
</script>
<style scoped>
mini-Scroll-Bar::-webkit-scrollbar {
  height: 0px;
}

.light-bg {
  background-image: url(./assets/memphis-colorful.png) !important;
  background-repeat: repeat !important;
}
.v-navigation-drawer--is-mobile {
  margin-top: 55px;
}

/*.v-toolbar--collapsed{
  max-width: 150px !important;
}*/
::-webkit-scrollbar{
display: none !important;
}
</style>