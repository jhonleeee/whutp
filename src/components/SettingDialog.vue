<template>
  <div class="text-center">
    <v-dialog
      :value="display"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
         修改专业信息
        </v-card-title>
        <v-card-text>
            <v-container fluid>
    <v-row align="center">
           <v-col
        class="d-flex"
        cols="12"
        sm="6"
      >
        <v-select
          :items="majors"
          item-text="name"
          item-value="id"
          v-model="newMajorSource.major"
          label="专业"
          outlined
        ></v-select>
      </v-col>
                 <v-col
        class="d-flex"
        cols="12"
        sm="6"
      >
        <v-select
          :items="grades"
          item-text="name"
          item-value="id"
          v-model="newMajorSource.grade"
          label="年级"
          outlined
        ></v-select>
      </v-col>
    </v-row>
            </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="submit"
          >
            关闭
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    name:'SettingDialog',
    props:{
display:Boolean,
majorSource:Object,
majors:Array,
grades:Array
    },
    data () {
      return {
        dialog: true,
        newMajorSource:this.majorSource
      }
    },
    methods:{
        submit:function (){
            this.$emit('change-major',this.newMajorSource);
        }
    }
  }
</script>