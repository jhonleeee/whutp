<template>
<div>
<v-divider></v-divider>
<iframe src="www.baidu.com"></iframe>
</div>
</template>
<script>
export default {
   beforeRouteEnter (to,from,next) {
   console.log("sss");
   console.log(to.query.target);
   next();
  }
}
</script>
<style>

</style>