<template>
      <div class="stikyTop">
        <v-chip
      class="transBadge"
    >
      <v-avatar
        left
        class="grey"
        style="color:white;"
      >
      {{year}}
      </v-avatar>
      
        {{semi}}
    </v-chip>
      </div>
</template>

<style scoped>
.transBadge{
  margin: 0 auto 0 10px;
  position: absolute;
  left:0px;
  top:0px;
  width:80px;
  height:30px;
  white-space: nowrap;
  background-color: rgb(255, 255, 255,0.3) !important;
  backdrop-filter: blur(2px);
  font-weight: bold;
  border:grey solid 1px;
  padding-right: 3px !important;
}
.transBadge>.v-chip__content>div{
  margin-left: -10px;
}
.stikyTop{
  position: sticky;
  top:80px;
  z-index: 10;
}
</style>
<script>
export default {
  props: ["BarId"],
  data() {
    return {};
  },
  computed: {
    year: function () {
      let termCount = parseInt(this.BarId);
      let schoolYear = Math.floor((termCount - 1) / 3);
      let yearDic = [this.$i18n.t('paraBar.freshman'),this.$i18n.t('paraBar.Sophomore'),this.$i18n.t('paraBar.jumior'),this.$i18n.t('paraBar.senior')];
      return `${yearDic[schoolYear]}`;
    },
    semi:function(){
      let termCount = parseInt(this.BarId);
       let term = termCount % 3;
        let termDic = [this.$i18n.t('paraBar.thirdSeme'),this.$i18n.t('paraBar.firstSeme'),this.$i18n.t('paraBar.secondSeme')];
  return termDic[term];
    }
  },
};
</script>