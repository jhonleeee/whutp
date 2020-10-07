<template>
  <v-hover v-slot:default="{ hover }">
      <v-slide-x-transition>
    <v-card
      class="cCard"
      transition="slide-x-transition"
      :elevation="hover ? 6 : 2"
    >
    <div style="width: 100%;height:5px;" :class="courseTypeMainColor">
      </div>
      <v-expand-transition>
        <div
          v-if="hover&&haveHover"
          class="d-flex transition-fast-in-fast-out lighten-2 v-card--reveal display-3 white--text"
          :class="courseTypeMainColor"
          style="height: 100%; flex-direction: column;z-index:888;"
        >
          <div class="course-card-expand-dock d-flex flex-column justify-space-around mb-6">
            <v-btn
              block
              color="secondary"
              @click="copyCorseInfo"
              class="course-card-expand-button"
            >{{copyBtn}}</v-btn>
       
            <v-btn
              block
              color="secondary"
              @click="showRely"
              :disabled="course.solo==1"
              class="course-card-expand-button"
            >{{course.solo==1?"暂无依赖":"前置课程"}}</v-btn>
          </div>
        </div>
      </v-expand-transition>
      <v-card-text class="d-flex flex-column" style="height:100%">
        <p class="course-card-name">
          {{course.name}}
          <v-chip x-small color="red" text-color="white" style="margin-left: 10px;">前置课程</v-chip>
        </p>
        <!-- <p>课程备注</p> -->
        <!-- <p class="course-card-text-background"></p> -->
        <div class="d-flex flex-row course-card-badge-row">
          <v-chip :class="courseTypeMainColor" text-color="white">
            <v-avatar left :class="courseTypeBadgeColor">{{majorDic[course.major]}}</v-avatar>{{cTypeDic[course.type]}}
          </v-chip>
          <v-chip :color="creditBadgeColor" text-color="white">
            <v-avatar left class="light-blue lighten-1">{{course.credit}}</v-avatar>学分
          </v-chip>
        </div>
      </v-card-text>
      <div class="have-rely-triangle" v-if="course.solo!=1"></div>
    </v-card>
      </v-slide-x-transition>
  </v-hover>
</template>
<script>
export default {};
</script>
<style scoped>
.cCard {
  margin: 10px;
  position: relative;
  border-radius: 15px 15px 5px 5px;
  word-break: normal;
  width: 200px;
  min-height:150px;
}
.cCard-pink {
  border-top: 5px solid hotpink;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
.course-card-expand-button {
  margin: 10px auto;
}
.course-card-expand-toolBar {
  align-self: flex-start;
  font-size: 5px;
}
.course-card-expand-dock {
  width: 90%;
  padding: 5px auto auto auto 5px;
}
.course-card-name {
  font-size: 20px;
  font-weight: bolder;
}

/* .course-card-text-background {
  position: absolute;
  font-size: 45px;
  color: rgb(0, 0, 0, 0.3);
  z-index: 0;
  user-select: none;
  right: 5px;
  bottom: 25px;
  font-weight: 50px;
} */
.course-card-badge-row {
  opacity: 0.8;
  margin: auto auto 10px 5px;
  bottom: 0px;
  width: 100%;
  align-self: flex-end;
}
.course-card-badge-row > span {
  margin-right: 5px;
}
.have-rely-triangle{
width:0;
height:0;
border-left:7px solid transparent;
border-bottom:7px solid grey;
position: absolute;
right:0px;
bottom:0px;
border-bottom-left-radius:0px !important;
border-bottom-right-radius:0px !important;
}
</style>
<script>
export default {
  props: ["haveHover", "course"],
  methods: {
    copyCorseInfo() {
      let that = this;
      if (this.copyBtnOnSuccess) {
        navigator.clipboard.writeText(JSON.stringify(this.course)).then(
          function () {
            that.copyBtn = "已全部复制";
          },
          function () {
            that.copyBtn = "复制失败";
          }
        );
      } else {
        console.log(JSON.stringify(this.course));
        navigator.clipboard.writeText(this.course.name).then(
          function () {
            that.copyBtn = "复制信息";
            that.copyBtnOnSuccess = true;
          },
          function () {
            that.copyBtn = "复制失败";
          }
        );
      }
      setTimeout(() => {
        that.copyBtn = "复制课名";
        that.copyBtnOnSuccess = false;
      }, "2000");
    },
    showRely() {
      console.log(this.course.CId);
      this.$emit("show-rely", this.course.CId);
    },
  },
  computed: {
    creditBadgeColor() {
      let credit = this.course.credit;
      if(credit<=1){
         return "light-blue";
      }else if(credit<=2){
        return "light-blue darken-1";
      }else if(credit<=3){
         return "light-blue darken-2";
      }else if(credit<=4){
         return "light-blue darken-3";
      }else{
  return "light-blue darken-4";
      }
    },
    courseTypeBadgeColor(){
      switch(this.course.major){
        case 1:
          return "amber darken-4";
        case 2:
          return "orange darken-4";
        case 3:
          return "deep-orange darken-4";
        default:
          return "blue-grey darken-2";
      }
    },
  courseTypeMainColor(){
    if(this.course.major==1){
      if(this.course.type==0){
        return "amber lighten-1";
      }else{
        return "amber darken-2";
      }
    }else if(this.course.major==2){
      if(this.course.type==0){
        return "orange lighten-1";
      }else{
        return "orange darken-2";
      }
    }else if(this.course.major==3){
            if(this.course.type==0){
        return "deep-orange lighten-1";
      }else{
        return "deep-orange darken-2";
      }
    }
  }

  }
  ,
  data() {
    return {
      hover: false,
      copyBtn: "复制课名",
      copyBtnOnSuccess: false,
      majorDic:['空','计','软','通'],
      cTypeDic:['选修','必修']
    };
  },
};
</script>