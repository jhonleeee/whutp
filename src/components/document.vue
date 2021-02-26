<template>
    <iframe :src="url" style="height:100%;width:100%;"></iframe>
</template>
<script>
export default {
    name:'document',
    data:function(){return {
    url:`https://view.officeapps.live.com/op/view.aspx?src=https://migu.plus/whutp/static/syllabus/${this.$route.params.id}.docx`
    }
    },
    beforeMount:function(){
        this.$parent.$emit("setloadings", false);
    }
}
</script>