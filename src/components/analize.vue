<template>
  <div class="analize">
    <!--place to place SnackBars-->
    <!--Normal notification-->
    <v-snackbar v-model="snackbarNoti" outlined color="blue">
      {{ snackbarNotiText }}
      <template v-slot:action="{ attrs }">
        <v-btn color="orange" text v-bind="attrs" @click="snackbarNoti = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
    <!--Reload Bar-->
    <v-snackbar v-model="snackbarReload" outlined color="red">
      课程信息加载失败
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="
            () => {
              snackbarReload = false;
              requestFullCourse((listId = 1));
            }
          ">
          重试
        </v-btn>
      </template>
    </v-snackbar>
    <div class="courseBox" :key="'t' + termData.semester" v-for="termData in courseData.courseData">
      <PARABAR :bar-id="termData.semester" :id="'seme'+termData.semester"></PARABAR>
      <v-divider inset></v-divider>
      <div v-if="termData.course.length > 0" transition="slide-x-transition" class="columbox"
        @wheel.prevent.stop="scrollBarWheel" name="columBox">
        <!-- 
          ABANDONED: old style of showing rely
          <div class="columbox-acrylic" name="acrylic" v-if="showAcrylic" @click="hideRely">
          <COURSECARD v-on:show-rely="showRely" :haveHover="haveHover" name="courseCard"
            v-for="course in termData.course" :key="'relyk' + course.course_id" :course="course"
            :id="'relyk' + course.course_id"></COURSECARD>
        </div> -->
        <COURSECARD  @show-rely="loadRely" @clear-rely="clearRely" :haveHover="haveHover" name="courseCard" v-for="course in termData.course"
          :key="'k' + course.course_id" :course="course" :id="'k' + course.course_id" v-show="!showingRely||course.isPre==1||course.isWatch==1"></COURSECARD>
      </div>
      <div v-else class="noClassInfoBox">
        <div class="noClassInfo">该学期没有课程</div>
      </div>
    </div>
    <!--Float sheets Begin-->
    <!--Float sheet-current courses-->
    <div class="text-center">
      <v-bottom-sheet v-model="coursesheet" inset>
        <v-sheet class="text-center" height="400px" style="overflow-y: scroll">
          <v-card>
            <v-toolbar color="cyan" dark flat>
              <v-toolbar-title>课程信息管理</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <template v-slot:extension>
                <v-tabs v-model="courseSheetTab" align-with-title>
                  <v-tabs-slider color="orange"></v-tabs-slider>
                  <v-tab key="courseSheetTabAllCourse"> 课程统计 </v-tab>
                  <v-tab key="courseSheetTabAddExist"> 添加成绩 </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
            <v-tabs-items v-model="courseSheetTab">
              <v-tab-item key="courseSheetTabAllCourse">
                <v-card flat>
                  <v-card-text>
                    <!--Analyze all the courses-->
                    所有课程分析
                    <div class="my-3">
                      <v-simple-table  fixed-header v-if="seletedCourseData!=null">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">
            课程名
          </th>
          <th class="text-center">
            课程类型
          </th>
                    <th class="text-center">
            学分
          </th>
          <th class="text-center">
            成绩
          </th>
                    <th class="text-center">
            绩点
          </th>
          <th class="text-center">
            选修学期
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="course in seletedCourseData.Courses"
          :key="course.Cid"
        >
          <td>{{ course.name }}</td>
          <td>{{ course.Ctype }}</td>
              <td>{{ course.point }}</td>
          <td>{{ course.score==""?"-": course.score}}</td>
                <td>{{ course.GPA==-1?"-":course.GPA }}</td>
                      <td>{{ course.year+'-'+course.semester }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <div v-else>
    还没有添加成绩记录...
  </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="courseSheetTabAddExist">
                <v-card flat>
                  <v-card-text>
                    <!--Add exsiting courses-->
                    <v-stepper v-model="steperAddCourse" vertical>
                      <v-stepper-step :complete="steperAddCourse > 1" step="1">
                        如何添加成绩
                      </v-stepper-step>
                      <v-stepper-content step="1">
                        <div class="text-h5">轻松添加已选课程，避免延毕</div>
                        <div class="d-block">
                          从教务系统导入已选课程信息，统计自己的专选/必修学分
                        </div>
                        <v-btn color="primary" @click="steperAddCourse = 2">
                          开始吧
                        </v-btn>
                      </v-stepper-content>
                      <v-stepper-step :complete="steperAddCourse > 2" step="2">
                        登录教务系统
                        <small>要旧版的哦</small>
                      </v-stepper-step>
                      <v-stepper-content step="2">
                        <div class="d-block">
                          登录
                          <a href="http://bkjw.whu.edu.cn/" class="text-decoration-none"
                            target="_blank">旧版教务系统</a>，选择成绩界面，点击“查询全部”按钮在页面中查询所有的课程信息
                        </div>
                        <v-btn color="primary" @click="
                            () => {
                              steperAddCourse = 3;
                            }
                          ">
                          获取数据
                        </v-btn>
                        <v-btn text @click="steperAddCourse = 1"> 返回 </v-btn>
                      </v-stepper-content>
                      <v-stepper-step :complete="steperAddCourse > 3" step="3">
                        获取数据
                      </v-stepper-step>
                      <v-stepper-content step="3">
                        <div class="d-block">
                          按F12打开开发者工具，在Console栏输入并执行左侧的脚本
                        </div>
                        <div class="d-block">
                          当页面显示出课程信息后，复制并填入右侧的区域中
                        </div>
                        <v-row>
                          <v-col cols="12" md="6">
                            <v-textarea outlined name="parseCourseScript" label="解析脚本" :value="parseCourseScript"
                              readonly></v-textarea>
                          </v-col>
                          <v-col cols="12" md="6">
                            <v-textarea outlined name="parseCourseJson" label="课程信息" v-model="parseCourseJson">
                            </v-textarea>
                          </v-col>
                        </v-row>
                        <v-btn color="primary" @click="checkAndAdd(true)">
                          导入信息
                        </v-btn>
                        <v-btn text @click="steperAddCourse = 2"> 返回 </v-btn>
                      </v-stepper-content>
                      <v-stepper-step step="4"> 查看导入结果 </v-stepper-step>
                      <v-stepper-content step="4">
                        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
                        <v-btn color="primary" @click="steperAddCourse = 1">
                          重试
                        </v-btn>
                      </v-stepper-content>
                    </v-stepper>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!--Float sheets End-->
    <!--Float dial btns-->
    <v-speed-dial v-model="dialFab" direction="top" open-on-hover fixed transition="slide-y-reverse-transition"
      class="speedDial">
      <template v-slot:activator>
        <v-btn v-model="dialFab" color="blue darken-2" dark fab>
          <v-icon v-if="dialFab"> mdi-widgets </v-icon>
          <v-icon v-else> mdi-widgets-outline </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" @click="openSeleSheet">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
            <v-btn fab dark small color="light-green" @click="sortCourse">
        <v-icon>mdi-sort</v-icon>
      </v-btn>
    </v-speed-dial>
    <div id="creditCounter">
 <v-chip color="light-blue lighten-2" text-color="white">
            <v-avatar left class="light-blue lighten-1">必</v-avatar>{{creditSele.compulsory}}/{{creditRequire.compulsory}}
          </v-chip>
           <v-chip color="blue" text-color="white">
            <v-avatar left class="light-blue lighten-1">选</v-avatar>{{creditSele.elective}}/{{creditRequire.elective}}
          </v-chip>
    </div>
    <!--Testing component-->
  </div>
</template>
<script>
  import COURSECARD from "./corse-card.vue";
  import PARABAR from "./paraBar.vue";
  import axios from "axios";
  import {
    ANATXT
  } from "../assets/text/analizeText.js"; //long static text for module analize.vue
  export default {
    components: {
      COURSECARD,
      PARABAR
    },
    mounted:function(){

      const localCourseData = localStorage.getItem("courseData");
      if(localCourseData!=null){
        this.courseData = JSON.parse(localCourseData);
        this.checkAndAdd();
      }else{
        this.requestFullCourse(1);
      }
    },
    methods: {
      test(){
        this.$vuetify.theme.dark=!this.$vuetify.theme.dark;
        this.$i18n.locale='en';
        this.$emit('set-loading',true);
      },
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
      hideRely() {
        this.haveHover = true;
        this.showAcrylic = false;
      },
      openSeleSheet(){
        this.coursesheet=true;
      },
      requestFullCourse(listId = 1) {
        console.log(listId);
        this.snackbarNotiText = "加载课程信息中";
        this.snackbarNoti = true;
        this.$parent.$emit("set-loading", true);
        let requestUrl = encodeURI(this.APIUrl + "detail.php");
        axios({
            method: "get",
            url: requestUrl,
          })
          .then((response) => {
            this.snackbarNoti = false;
            this.courseData = this.initCourse(response.data);
            this.snackbarNotiText = "信息加载完成";
            this.snackbarNoti = true;
            this.checkAndAdd();
          })
          .catch((error) => {
            console.log(error.statusText);
            this.snackbarNoti = false;
            this.snackbarText = "信息加载失败";
            this.snackbarReload = true;
          });
        this.$emit("set-loading", false);
      },
       initCourse(rawCourseData) {
            if (rawCourseData.courseData == null) return;
            rawCourseData.courseData.forEach((seme) => {
              if (seme.label == null) {
                seme.haveLabel = 0;
                seme.label = null;
              }
              seme.course.forEach((course) => {
                if (course.haveSele == null) {
                  course.haveSele = 0;
                  course.haveLearned = 0;
                  course.report = null;
                  course.isPre=0;
                  course.isWatch=0;
                }
              });
            })
            return rawCourseData;
            },
      //sort the course
      sortCourse(){
        if(this.courseData==""){
          return;
        }
        this.courseData.courseData.forEach((seme)=>{
          //for each semester
          seme.course.sort(function(a,b){return a.major>b.major?-1:1;});
        });
      }
      ,
      checkAndAdd(overide=false) {
        //parse and check the formart of course score Json
        try {
          if(!overide){
          var data = localStorage.getItem("Ldata");
          }else{
          data = this.parseCourseJson;
          }
          var courseObj = JSON.parse(data);
          this.seletedCourseData = courseObj;
          this.initSeleCourse(courseObj);
          if (courseObj.Count >= 0) {
            this.steperAddCourse = 4;
            localStorage.setItem("Ldata",data);
            this.initSeleCourse();
          } else {
            this.parseCourseJson = "解析成功但是信息出现错误";
          }
        } catch (e) {
          console.log(e);
          this.parseCourseJson = "解析错误" + e.detail;
        }
      },
      initSeleCourse(rawCourseData) { //initial data structure based on selected courses
        if (rawCourseData == null) //haven't load score
          return;
        rawCourseData.Courses.forEach((seleCourse) => {
              if ((seleCourse.Ctype == "专业教育必修" || seleCourse.Ctype == "专业教育选修"||seleCourse.Ctype=="专业必修"||seleCourse.Ctype=="专业选修") && seleCourse.studyType ==
                "普通") { //find seleted 
                this.courseData.courseData.forEach(
                  (seme) => {
                    seme.course.forEach(
                      (semeCourse) => {
                      if(semeCourse.name==seleCourse.name){
                        semeCourse.haveSele=1;
                        semeCourse.haveLearned=1;
                        semeCourse.report=seleCourse;
                      }
                      }
                    )
                  })
                }
              })
        rawCourseData.Courses.sort((a,b)=>{
          return a.year==b.year?a.semester-b.semester:a.year-b.year;
        })
        return rawCourseData;
            /*this.courseData.courseData.forEach(
              (seme)=>{
                  seme.course.forEach((course) => {
              if (course.haveSele == null) {
                course.haveSele = 0;
                course.haveLearned = 0;
                course.report = null;
              }
              if (haveLoadCourse) {
                this.seletedCourseData.Courses.forEach((seleCourse) => {
                  if (seleCourse.name == course.name) {
                    //have seleted 
                    course.haveSele = 0;
                    if (seleCourse.score != "") {
                      //have score
                      course.haveLearned = 1;
                      course.report = seleCourse;
                    }
                  }
                });
              }
            });
              }
            )*/
          },
            loadRely(cid) {//Load course's rely
            if(this.showingRely){
              this.clearRely();
            }
            if (cid <0) return;
        this.$parent.$emit("setloadings", true);
        let requestUrl = encodeURI(this.APIUrl + "before.php?cid="+cid);
        axios({
            method: "get",
            url: requestUrl,
          })
          .then((response) => {
            this.showingRely=true;
            const relyArr = response.data.course;
            if(relyArr==null||relyArr.length<=0){//Err:have 
            throw("Course rely empty");
            }
            var relyCid = new Array();
            relyArr.forEach((relyCourse)=>{
              relyCid.push(relyCourse.course_id);
            })
            this.courseData.courseData.forEach((seme)=>{
                seme.course.forEach((course) => {
                  if(cid==course.course_id){
                    course.isWatch=1;
                  }
                  var isRely = false;
                  relyCid.some((relyCid)=>{
                    if(relyCid==course.course_id){
                    isRely=true;
                    return true;}
                  })
                  if(isRely){
                  course.isPre=1;
                }
                });
              })
            this.snackbarNoti = false;
            this.$parent.$emit("setloadings", false);
          })
          .catch((error) => {
            console.log(error.statusText);
            this.snackbarNoti = false;
            this.snackbarText = "信息加载失败";
            this.snackbarReload = false;
          });
          this.$emit("set-loading", false);
      },
      clearRely(){//Exit relying mode
        this.courseData.courseData.forEach((seme)=>{
                seme.course.forEach((course) => {
                  course.isPre=0;
                  course.isWatch=0;
                })
                });
        this.showingRely=false;
      }
      },
      computed:{
        creditSele:function(){//Cacu credit enquirment
          var creditSele={'compulsory':0,'elective':0};
          var compCredit = 0;
          var elecCredit = 0;
          if(this.courseData.semesterCount<=0){
            return creditSele;
          }
          this.courseData.courseData.forEach((seme)=>{
            seme.course.forEach((course)=>{
              if(course.haveSele==1){//look for selected courses
                if(course.type==1){//compulsory
                    compCredit+=course.credit;
                }else if(course.type==0){
                    elecCredit+=course.credit;
                }
              }
            })
          });
          creditSele.compulsory=compCredit;
          creditSele.elective=elecCredit;
          return creditSele;
        }
      },
      data() {
        return {
          APIUrl: "https://migu.plus/whutp/api/",
          APIUrlCourseRely:"https://migu.plus/whutp/api/before",
          courseLength: 2,
          overlay: true,
         // showAcrylic: false,
          scrollSpeed: 70,
          haveHover: true,
          snackbarNoti: false,
          snackbarText: "Hello, I'm a snackbar",
          snackbarReload: false,
          snackbarNotiText: "",
          dialFab: false,
          showingRely:false,//if showing the rely of courses
          /*basic summery of selected course-BEGIN*/
          seleCourseCount: 0,
          seleElectiveCourseCount: 0,
          seleRequiredCourseCount: 0,
          /*basic summery of selected course-END*/
          /*for Course Sheet-BEGIN*/
          coursesheet:false,
          courseSheetTab: "courseSheetTabAllCourse",
          //steper for adding course
          steperAddCourse: 1,
          //script for parsing corses
          parseCourseScript: ANATXT.PCS,
          //course json submitted by the user
          parseCourseJson: "",
          //
          parseResultText: "当前课程导入还没有成功哦，重试一下吧",
          /*for Course Sheet-END*/
          /*for Credit counter-BEGIN*/
          creditRequire:{'compulsory':27.5,'elective':27},
          /*for Credit counter-END*/
          desserts: [{
              name: "Frozen Yogurt",
              calories: 159,
            },
            {
              name: "Ice cream sandwich",
              calories: 237,
            },
            {
              name: "Eclair",
              calories: 262,
            },
            {
              name: "Cupcake",
              calories: 305,
            },
            {
              name: "Gingerbread",
              calories: 356,
            },
            {
              name: "Jelly bean",
              calories: 375,
            },
            {
              name: "Lollipop",
              calories: 392,
            },
            {
              name: "Honeycomb",
              calories: 408,
            },
            {
              name: "Donut",
              calories: 452,
            },
            {
              name: "KitKat",
              calories: 518,
            },
          ],
          seletedCourseData: null,
          courseData: {
            semesterCount: 0,
            courseData:{}
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
    font-weight: bold;
    opacity: 0.8;
  }

  .noClassInfoBox {
    margin-bottom: 35px;
    position: relative;
  }

  .speedDial {
    right: 20px;
    bottom: 20px;
    z-index: 1;
  }
  #creditCounter{
    height:56px;
    border-radius: 30px;
    background-color: #1976D2;
    position: fixed;
    bottom:20px;
    right:20px;
    padding-right:60px;
    padding-left: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  #creditCounter>span:first-child{
margin-right: 5px;
  }
  @media only screen and (max-width: 600px) {
  .columbox {
    width:95%;
    overflow-x: scroll;
    display: flex;
    flex-direction: row;
    margin: 5px auto 50px auto;
    position: relative;
    flex-wrap: wrap;
  }
  }
</style>