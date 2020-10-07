<template>
<v-divider></v-divider>
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