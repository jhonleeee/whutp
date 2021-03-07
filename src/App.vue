<template>
  <v-app class="mini-Scroll-Bar" id="app" :class="{'light-bg':!this.$vuetify.theme.dark,'dark-bg':this.$vuetify.theme.dark,}">
    <v-app-bar
      :collapse="!appBarShow"
      :collapse-on-scroll="appBarShow"
      src="https://www.setaswall.com/wp-content/uploads/2017/04/Material-Wallpaper-1-3840x2169-768x434.jpg"
      app
      clipped-left
      dark
      scroll-target="#app"
      style="z-index: 9999;"
      :class="{ isLoading: isLoading }"
    >
      <!--scrool-target can't work-->
      <!--I should have carried out this AppBar myself-->
      <v-app-bar-nav-icon @click="showDrawer"></v-app-bar-nav-icon>

      <v-toolbar-title>前置课程确认</v-toolbar-title>

      <v-spacer></v-spacer>
      <!--Lock the App bar-->
      <v-checkbox
        v-model="collapseLock"
        color="white"
        hide-details
      ></v-checkbox>
      <!--Sign if loading-->
       <v-expand-x-transition>
      <v-progress-circular
        v-show="isLoading"
        :width="3"
        indeterminate
        color="white"
      ></v-progress-circular>
       </v-expand-x-transition>
    </v-app-bar>
    <!--App drawer-contains navigation tags and style setting options-->
    <DRAWER
      @expand-bar="collapseOnScroll = $event"
      @change-major-setting-dialog="handleMajorSettingDialog"
      :bg="drawerBg"
      :majorSource="majorSource"
       :majors='majors'
       :grades='grades'
      ref="drawer"
      @mouseleave="collapseOnScroll = true"
    ></DRAWER>
    <v-main
            id="maincontainer"
        class="maincontainer"
        @wheel="scrollTopBarShow"
         transition="scale-transition"
    >
      <SETINDLG :display='showSettingModel' :major-source='majorSource' :majors='majors' :grades='grades' @change-major='handleChangeMajor'></SETINDLG>
      <v-slide-x-transition>
        <router-view @set-loading="setLoading" :creditRequire='credits.find(obj=>obj.majorId==majorSource.major)'></router-view>
        </v-slide-x-transition>

    </v-main>
  </v-app>
</template>

<script>
//import {jsPlumb} from 'jsplumb';//https://zhuanlan.zhihu.com/p/41808577
import DRAWER from "./components/drawer";//Drawer in the left side of App
import DRAWERBG from '@/assets/image/bg/drawerImg.jpeg';//background img of App drawer
import SETINDLG from './components/SettingDialog';
export default {
  name: "App",
  components: {
    DRAWER,
    SETINDLG
  },
  computed: {
    appBarShow() {
      if (this.collapseLock) return true;
      else return this.collapseOnScroll;
    },
    drawerBg(){
      return DRAWERBG;
    }
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
    handleMajorSettingDialog(display){
      this.showSettingModel=display
    },
    handleChangeMajor(newMajor){//when change mojor,academy etc. in SettingDialog
    this.majorSource=newMajor;
    this.handleMajorSettingDialog(false);
    console.log(newMajor)
    }
    ,
    showDrawer() {
      this.$refs.drawer.drawer = true;
    },
    showMsg(val){
      console.log(val);
    },
    setLoading(isLoading) {
      if (isLoading) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    },
  },
  mounted: function () {
    if (window.matchMedia('prefers-color-scheme: dark').matches) {//sele theme base on user browser setting
 this.$vuetify.theme.dark=true;
} else {
  this.$vuetify.theme.dark=false;
}
//load user preferences
  //load user major
  
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
      alert: true,//showing alert
      collapseOnScroll: true,//obsoleted
      collapseLock: false,//always expand the app bar
      collapseScrollCombo: 0,
      collapseScrollInvokeCount: 1,
      isLoading: true,//app bar loding circle
      show:false,
      showSettingModel:false,
      majors:[{name:'计算机技术',id:0},{name:'软件工程',id:1}],
      grades:[{name:'8字班',id:0},{name:'9字班',id:1}],
      credits:[{'compulsory':43,'elective':27,majorId:0,gradeId:0},{'compulsory':45.5,'elective':24.5,majorId:1,gradeId:0}],
      majorSource:{
        'grade':1,
        'major':1,
        'academy':0
      }
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
.dark-bg{
    background-image: url(./assets/memphis-colorful-dark.png) !important;
  background-repeat: repeat !important;
}
.v-navigation-drawer--is-mobile {
  margin-top: 55px;
}
.v-toolbar--collapsed{
border-bottom-right-radius: 24px !important;
}
#app{
  overflow: scroll !important;
}
</style>