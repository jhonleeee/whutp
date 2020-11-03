<!--课程信息卡片-->
<template>
<div>
  <v-hover v-slot:default="{ hover }">
      <v-slide-y-transition>
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
          style="height: 100%; flex-direction: column;z-index:888;border-radius:4px;"
        >
          <div class="course-card-expand-dock d-flex flex-column justify-space-around mb-6">
            <!--课程浮动卡片-->
     <div class="course-card-expand-button-group">
       
<v-btn
              block
              @click="copyCorseInfo"
              :disabled="copyBtn=='已全部复制'"
              class="course-card-expand-button"
            >{{copyBtn}}</v-btn>
         <v-btn
              block
              @click="seleIt"
              class="course-card-expand-button"
              v-if="!course.haveLearned==1"
            >{{course.haveSele!=1?$t('courseCard.seleCourse'):$t('courseCard.deseleCourse')}}</v-btn>
                     <v-btn
              block
              class="course-card-expand-button"
              v-if="course.haveLearned==1" 
            disabled>{{$t('courseCard.learntCourse')}}</v-btn>
            <v-btn
              block
              @click="loadRely"
              :disabled="course.solo==1"
              class="course-card-expand-button"
              v-if="!course.isWatch==1"
            >{{course.solo==1?$t('courseCard.noRely'):$t('courseCard.showRely')}}</v-btn>
             <v-btn
              block
              @click="clearRely"
              v-if="course.isWatch==1"
              class="course-card-expand-button"
            >{{$t('courseCard.clearRely')}}</v-btn>
            <v-btn
              block
              @click="copyCorseInfo"
              class="course-card-expand-button"
            >{{$t('courseCard.more')}}</v-btn>
     </div>
            
          </div>
        </div>
      </v-expand-transition>
      <v-card-text class="d-flex flex-column" style="height:100%">
        <p class="course-card-name">
          {{course.name}}
          <v-chip x-small color="light-blue" text-color="white" style="margin-left: 10px;" v-if="course.isPre==1">{{$t('courseCard.bdgpre')}}</v-chip>
          <v-chip x-small color="blue darken-3" text-color="white" style="margin-left: 10px;" v-if="course.isWatch==1">{{$t('courseCard.bdgWatch')}}</v-chip>
          <v-chip x-small color="cyan" text-color="white" style="margin-left: 10px;" v-if="course.haveSele==1&&course.haveLearned!=1">{{$t('courseCard.bdgSele')}}</v-chip>
          <v-chip x-small color="teal" text-color="white" style="margin-left: 10px;" v-if="course.haveLearned==1">{{$t('courseCard.bdgLearnt')}}</v-chip>
        </p>
        <!-- <p>课程备注</p> -->
        <p class="course-card-text-background" v-if="course.haveLearned==1">{{course.report.GPA>=0?course.report.GPA:"-"}}</p>
        <div class="d-flex course-card-badge-row">
          <v-chip :class="courseTypeMainColor" text-color="white">
            <v-avatar left :class="courseTypeBadgeColor">{{majorDic[course.major]}}</v-avatar>{{cTypeDic[course.type]}}
          </v-chip>
          <v-chip :color="creditBadgeColor" text-color="white">
            <v-avatar left class="light-blue lighten-1">{{course.credit}}</v-avatar>{{$t('courseCard.credit')}}
          </v-chip>
        </div>
      </v-card-text>
      <div class="have-rely-triangle" v-if="course.solo!=1"></div>
    </v-card>
      </v-slide-y-transition>
  </v-hover>
</div>
</template>
<script>
export default {
  props: ["haveHover", "course"],
  data:function() {
    return {
      hover: false,
      copyBtn: "复制课名",
      copyBtnOnSuccess: false,
      majorDic:['空','计','软','通'],
      cTypeDic:['选修','必修']
    };
  },
  computed:{
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
    return "";
  },
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
  },
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

        navigator.clipboard.writeText(this.course.name).then(
          function () {
            that.copyBtn =that.$i18n.t('courseCard.copyDetail');
            that.copyBtnOnSuccess = true;
          },
          function () {
            that.copyBtn = "复制失败";
          }
        );
      }
      setTimeout(() => {
        that.copyBtn =that.$i18n.t('courseCard.copyName');
        that.copyBtnOnSuccess = false;
      }, "2000");
    },
    loadRely() {
      this.$emit("show-rely", this.course.course_id);
    },
    clearRely(){
      this.$emit("clear-rely");
    },
    seleIt(){//seleAcourse
    //Vue.set(this.course,'haveSele',1);
    if(this.course.haveSele==1){
      this.course.haveSele=0;
    }else{
      this.course.haveSele=1;
    }
    }
  }
}
</script>
<style scoped>
.cCard {
  margin: 10px;
  position: relative;
  border-radius: 15px 15px 5px 5px;
  word-break: normal;
  width: 200px;
  min-height:150px;
  transition-duration: 0.2s;
}
.cCard-pink {
  border-top: 5px solid hotpink;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.75;
  position: absolute;
  width: 100%;
}
.course-card-expand-button {
  min-width: 0px !important;
  max-width: 80px;
}
.course-card-expand-button-group{
display: flex;
flex-direction: row;
justify-content: space-around;
flex-wrap: wrap;
height:80px;
align-content: space-around;
}
.course-card-expand-dock {
  width: 90%;
  padding: 5px auto auto auto 5px;
}
.course-card-name {
  font-size: 20px;
  font-weight: bolder;
}

 .course-card-text-background {
  position: absolute;
  font-size: 80px;
  z-index: 0;
  user-select: none;
  right: 5px;
  bottom: 5px;
  font-weight: 50px;
  opacity: 0.6;
} 
.course-card-badge-row {
  opacity: 0.8;
  margin: auto auto 10px 5px;
  bottom: 0px;
  width: 100%;
  align-self: flex-end;
  flex-direction: row;
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
  @media only screen and (max-width: 600px) {
    .cCard {
  margin: 10px;
  position: relative;
  border-radius: 15px 15px 5px 5px;
  word-break: normal;
  width: 130px;
  min-height:150px;
  transition-duration: 0.2s;
  min-height: 180px;
}
.course-card-badge-row {
  opacity: 0.8;
  margin: auto auto 10px 5px;
  bottom: 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.course-card-badge-row > span {
  margin-right: 0px;
  margin-top:5px;
  max-width: 75px;
}
.course-card-name {
  font-size: 15px;
  font-weight: bold;
}
.course-card-expand-button-group{
display: flex;
flex-direction: row;
justify-content: space-around;
flex-wrap: wrap;
height:80px;
align-content: space-around;
margin-top:5px;
}
.course-card-expand-button {
  min-width: 0px !important;
  max-width: 80px;
  margin-top:5px;
}
 .course-card-text-background {
  position: absolute;
  font-size: 50px;
  z-index: 0;
  user-select: none;
  right: 3px;
  bottom: -5px;
  font-weight: 50px;
  opacity: 0.6;
} 
  }
</style>
