<template>
  <div class="analize">
    <!--place to place SnackBars-->
    <!--Normal notification-->
    <v-snackbar  v-model="snackbarNoti" outlined color="blue">
      {{ snackbarNotiText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="orange" text v-bind="attrs" @click="snackbarNoti = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
    <!--Reload Bar-->
        <v-snackbar  v-model="snackbarReload"  outlined color="red">
      课程信息加载失败
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="()=>{snackbarReload = false; requestFullCourse(listId = 1) ;}">
          重试
        </v-btn>
      </template>
    </v-snackbar>
    <div
      class="courseBox"
      :key="'t' + termData.semester"
      v-for="termData in courseData.courseData"
    >
      <PARABAR :bar-id="termData.semester"></PARABAR>
      <v-divider inset></v-divider>
      <div
        v-if="termData.course.length > 0"
        transition="slide-x-transition"
        class="columbox"
        @wheel.prevent="scrollBarWheel"
        name="columBox"
      >
        <div
          class="columbox-acrylic"
          name="acrylic"
          v-if="showAcrylic"
          @click="hideRely"
        >
          <COURSECARD
            v-on:show-rely="showRely"
            :haveHover="haveHover"
            name="courseCard"
            v-for="course in termData.course"
            :key="'relyk' + course.course_id"
            :course="course"
            :id="'relyk' + course.course_id"
          ></COURSECARD>
        </div>
        <COURSECARD
          v-on:show-rely="showRely"
          :haveHover="haveHover"
          name="courseCard"
          v-for="course in termData.course"
          :key="'k' + course.course_id"
          :course="course"
          :id="'k' + course.course_id"
        ></COURSECARD>
      </div>
      <div v-else class="noClassInfoBox">
        <div class="noClassInfo">该学期没有课程</div>
      </div>
    </div>
    <v-btn elevation="2" @click="requestFullCourse(1)">sssss</v-btn>
  </div>
</template>
<script>
import COURSECARD from "./corse-card.vue";
import PARABAR from "./paraBar.vue";
import axios from "axios";
export default {
  components: { COURSECARD, PARABAR },
  methods: {
    scrollBarWheel(e) {
      //make course row scrollable with mouse whell
      let target = e.target; //capture scroll event and try to get the box
      var whileCount = 5;
      if (target.getAttribute("name") == "acrylic") {
        return;
      } //prevent from scrolling acrylic away
      while (target.getAttribute("name") != "columBox" && whileCount > 0) {
        if (target.getAttribute("name") == "acrylic") {
          //prevent from scrolling acrylic away-incase of scroll on card
          return;
        }
        target = target.parentNode; //if scroll on card, get its parent node
        whileCount--;
      }
      e = e || window.event;
      if (e.wheelDelta) {
        if (e.wheelDelta > 0) {
          //scroll up
          target.scrollLeft -= this.scrollSpeed;
        }
        if (e.wheelDelta < 0) {
          target.scrollLeft += this.scrollSpeed;
        }
      } else if (e.detail) {
        //for fireFox
        if (e.detail > 0) {
          target.scrollLeft -= this.scrollSpeed;
        }
        if (e.detail < 0) {
          target.scrollLeft += this.scrollSpeed;
        }
      }
    },
    showRely(e) {
      this.haveHover = false;
      this.showAcrylic = true;
      console.log(e);
    },
    hideRely() {
      this.haveHover = true;
      this.showAcrylic = false;
    },
    requestFullCourse(listId = 1) {
      console.log(listId);
      this.snackbarNotiText="加载课程信息中";
      this.snackbarNoti=true;
      this.$parent.$emit("setloadings", true);
      let requestUrl = this.APIUrl + "detail";
      axios({
        method: "get",
        url: requestUrl,
      })
        .then((response) => {
          console.log(response.data);
          this.courseData = response.data;
      this.snackbarNotiText="信息加载完成";
       this.snackbarNoti=true;
        })
        .catch((error) => {
          console.log(error.statusText);
                this.snackbarText="信息加载失败";
      this.snackbarReload=true;
        });
      this.$emit("setLoading", false);
    },
  },
  data() {
    return {
      APIUrl: "http://39.108.211.7/family/",
      courseLength: 2,
      overlay: true,
      showAcrylic: false,
      scrollSpeed: 70,
      haveHover: true,
       snackbarNoti: false,
      snackbarText: 'Hello, I\'m a snackbar',
      snackbarReload:false,
      snackbarNotiText:"",
      courseData: {
        semesterCount: 8,
        courseData: [
          {
            semester: 1,
            course: [
              {
                name: "计算机组成原理与设计实验",
                credit: 2,
                solo: false,
                CId: 1,
              },
              {
                name: "设计制作HTML时会遇到CSS强制英文",
                credit: 1,
                solo: true,
                CId: 2,
              },
              { name: "aaa", credit: 3, solo: true, CId: 3 },
              { name: "bbb", credit: 4, solo: true, CId: 4 },
              { name: "aaa", credit: 5, solo: true, CId: 5 },
              { name: "bbb", credit: 6, solo: true, CId: 6 },
            ],
          },
          {
            semester: 2,
            course: [
              { name: "aaa", credit: 2, solo: true, CId: 7 },
              { name: "bbb", credit: 2, solo: true, CId: 8 },
              { name: "aaa", credit: 3, solo: true, CId: 9 },
              { name: "bbb", credit: 4, solo: true, CId: 10 },
              { name: "aaa", credit: 5, solo: true, CId: 11 },
              { name: "bbb", credit: 6, solo: true, CId: 12 },
            ],
          },
          {
            semester: 3,
            course: [
              { name: "aaa", credit: 2, solo: true, CId: 13 },
              { name: "bbb", credit: 2, solo: true, CId: 14 },
              { name: "aaa", credit: 3, solo: true, CId: 15 },
              { name: "bbb", credit: 4, solo: true, CId: 16 },
              { name: "aaa", credit: 5, solo: true, CId: 17 },
              { name: "bbb", credit: 6, solo: true, CId: 18 },
            ],
          },
          {
            semester: 4,
            course: [
              { name: "aaa", credit: 2, solo: true, CId: 19 },
              { name: "bbb", credit: 2, solo: true, CId: 20 },
              { name: "aaa", credit: 3, solo: true, CId: 21 },
              { name: "bbb", credit: 4, solo: true, CId: 22 },
              { name: "aaa", credit: 5, solo: true, CId: 23 },
              { name: "bbb", credit: 6, solo: true, CId: 24 },
            ],
          },
          {
            semester: 5,
            course: [
              { name: "aaa", credit: 2, solo: true, CId: 25 },
              { name: "bbb", credit: 2, solo: true, CId: 26 },
              { name: "aaa", credit: 3, solo: true, CId: 27 },
              { name: "bbb", credit: 4, solo: true, CId: 28 },
              { name: "aaa", credit: 5, solo: true, CId: 29 },
              { name: "bbb", credit: 6, solo: true, CId: 30 },
            ],
          },
          {
            semester: 6,
            course: [
              { name: "aaa", credit: 2, solo: true, CId: 31 },
              { name: "bbb", credit: 2, solo: true, CId: 32 },
              { name: "aaa", credit: 3, solo: true, CId: 33 },
              { name: "bbb", credit: 4, solo: true, CId: 34 },
              { name: "aaa", credit: 5, solo: true, CId: 35 },
              { name: "bbb", credit: 6, solo: true, CId: 36 },
            ],
          },
        ],
      },
    };
  },
};
</script>
<style>
.columbox {
  width: 90%;
  overflow-x: scroll;
  display: flex;
  flex-direction: row;
  margin: 20px auto 20px auto;
  position: relative;
}
.columbox::-webkit-scrollbar {
  height: 0px;
}
.columbox-acrylic {
  width: 90%;
  overflow-x: scroll;
  display: flex;
  flex-direction: row;
  margin: 5vh auto 5vh auto;
  position: absolute;
  margin-left: 0px;
  margin-top: 0px;
  width: 100%;
  background-color: rgb(225, 225, 225, 0.3);
  z-index: 50;
  backdrop-filter: blur(5px);
  height: 100%;
  border-radius: 15px;
}
.columbox-acrylic::-webkit-scrollbar {
  height: 0px;
}
.analize {
  position: relative;
}
.st {
  position: sticky;
  top: 35px;
  left: 25px;
}
.noClassInfo {
  position: absolute;
  top: 0px;
  left: 90px;
  color: grey;
  font-weight: bold;
}
.noClassInfoBox {
  margin-bottom: 35px;
  position: relative;
}
</style>