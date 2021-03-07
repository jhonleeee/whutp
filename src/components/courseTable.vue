<template>
    <div>
        <v-alert
      border="left"
      colored-border
      elevation="2"
      transition="scale-transition"
      :value='loadingAlert'
    style="width:80%;margin:10px auto auto auto;"
    >
    <v-progress-linear :value="Math.floor((loaded_item/loading_item)*100)"></v-progress-linear>
        <div>待加载项：{{loading_item}}</div>
        <div>已加载项：{{loaded_item}}</div>
        <div>红色指向较高级，绿色来自前置课程</div>
        <div>在课程上面点击可以锁定/解锁预览状态</div>
            </v-alert>
        <div class="graph-container">
        <graph id="graph1" style="overflow:scroll !important"></graph>
        </div>
        <div class="graph-card">
              <v-card
    class="mx-auto"
    outlined
    :v-if="previewSource.length||previewTarget.length"
  >
       <v-list-item two-line>
      <v-list-item-content v-if="!previewItem">
        <v-list-item-title class="headline">
          课程依赖
        </v-list-item-title>
        <v-list-item-subtitle>将鼠标放置于课程上方以查看依赖</v-list-item-subtitle>
      </v-list-item-content>
          <v-list-item-content v-else>
        <v-list-item-title class="headline">
        {{previewItem.name}}
        </v-list-item-title>
        <v-list-item-subtitle>{{previewItem.credit}}学分,第{{Math.floor(previewItem.seme/3)+1}}学年{{(previewItem.seme%3)+1}}学期</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider
></v-divider>
<div  class="d-flex justify-space-around mb-6">
    <v-list
      two-line
      subheader
      v-if="previewSource.length"
    >
      <v-subheader ><v-icon>mdi-dock-left</v-icon>前置课程</v-subheader>
      <v-list-item v-for="source in previewSource" :key="source.course_id">
        <v-list-item-content>
          <v-list-item-title>{{source.name}}</v-list-item-title>
          <v-list-item-subtitle>{{source.credit}}学分,第{{Math.floor(source.seme/3)+1}}学年{{(source.seme%3)+1}}学期</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list
      two-line
      subheader
      v-if="previewTarget.length"
    >
      <v-subheader>后置课程<v-icon>mdi-dock-right</v-icon></v-subheader>
      <v-list-item v-for="target in previewTarget" :key="target.course_id">
        <v-list-item-content>
   <v-list-item-title>{{target.name}}</v-list-item-title>
          <v-list-item-subtitle>{{target.credit}}学分,第{{Math.floor(target.seme/3)+1}}学年{{(target.seme%3)+1}}学期</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
</div>
  </v-card>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import axios from "axios";
    export default {
        name: "courseTable",
        data:()=>({
            // margin : {top: 20, right: 20, bottom: 20, left: 100},
            graph:null,
            loadingAlert:true,//showing alert
            lockPreview:false,//troggle when click on circle
            courses_table:null,
            node_list:[],
            link_list:[],
            semester_table:[],
            height_table:[],
            loading_item:0,
            loaded_item:0,
            mounted_flag:false,
            courses_search:[],
            semester_height_point:[],
            previewSource:[],//for graph preview card
            previewTarget:[],
            previewItem:null
        }),
        created() {
            this.semester_height_point = new Array(20);
            for (let i=0;i<this.semester_height_point.length;i++) this.semester_height_point[i] = 0;
            this.height_table = new Array(250);
            for (let i=0;i<this.height_table.length;i++) this.height_table[i] = 0;
            this.semester_table = new Array(250);
            this.courses_search = new Array(250);
            this.data_process();
        },
        watch:{
          loaded_item(value){
              if (value===this.loading_item && this.mounted_flag){this.create_dataMap();this.$emit('set-loading',false);this.loadingAlert=false;}
          },
        },
        mounted() {
            this.mounted_flag = true;
            this.$emit('set-loading',true);
            this.loadingAlert=true;
        },
        methods:{
        graphPreviewCard(previewCourse){
        //let previewSouce,previewTarget=[]
        if(!previewCourse){
                    this.previewSource = [];
        this.previewTarget =[];
        this.previewItem=null;
        return;
        }
        this.previewSource = this.node_list.filter(obj=>previewCourse.sources.includes(obj.course_id));
        this.previewTarget = this.node_list.filter(obj=>previewCourse.targets.includes(obj.course_id));
        this.previewItem=previewCourse
        },
            data_process(){
axios({ method: "get",
            url: "https://migu.plus/whutp/api/detail.php",
          }).then( function (response) {//TODO:avoid bind(this) by using arrow function
                        this.courses_table = response.data;
                        this.courses_table.courseData.forEach(function(semester){
                            semester.course.forEach(function(course){
                                if (this.node_list.indexOf(course.course_id)===-1) {
                                    let temp = course;
                                    temp["id"]= course.course_id;
                                    temp["group"] = semester.semester;
                                    temp["height"] = ++this.semester_height_point[semester.semester];
                                    temp["seme"]=semester.semester;
                                    temp["credit"]=course.credit;
                                    temp["sources"] = [];
                                    temp["targets"] = [];
                                    this.semester_table[course.course_id] = semester.semester;
                                    this.height_table[course.course_id] = this.semester_height_point[semester.semester];
                                    this.node_list.push(temp);
                                    this.courses_search[course.course_id] = this.node_list.length -1;
                                }
                            }.bind(this));
                        }.bind(this));
                        this.courses_table.courseData.forEach(function(semester){
                            semester.course.forEach(function(course){
                                if (course.solo===0) {
                                    this.loading_item++;//record loading process
                                   axios({
            method: "get",
            url: "https://migu.plus/whutp/api/before.php?cid="+course.course_id,
          }).then(function(response){
                                            response.data.course.forEach(function(prev_course){
                                                this.link_list.push({
                                                        source:{group:this.semester_table[prev_course.course_id],id:prev_course.course_id,y:this.height_table[prev_course.course_id]},
                                                        target:{group:semester.semester,id:course.course_id,y:this.height_table[course.course_id]}
                                                });
                                                this.node_list[this.courses_search[course.course_id]].sources.push(prev_course.course_id);
                                                this.node_list[this.courses_search[prev_course.course_id]].targets.push(course.course_id);
                                            }.bind(this));
                                            this.loaded_item++;//record loading process
                                        }.bind(this));
                                }
                            }.bind(this));
                        }.bind(this));
                    }.bind(this));




            },
            create_dataMap(){
                // console.log("node list",this.node_list);
                // console.log("link list",this.link_list);
const svg = d3.select("#graph1")
  .append("svg")
.attr('width', 1600)
                    .attr('height', 2000)
    .call(d3.zoom().on("zoom", function (e) {
    svg.attr("transform", e.transform)
    }))
                const height = 2000;
                // eslint-disable-next-line no-unused-vars
                const step= 80;


                const graph={
                    nodes:this.node_list,
                    links:this.link_list
                }

                const margin = ({top: 50, right: 20, bottom: 20, left: 100})

                const color = d3.scaleOrdinal(graph.nodes.map(d => d.group).sort(d3.ascending), d3.schemeCategory10)




                svg.append("style").text(`

                .hover path {
                  stroke: #ccc;
                }



                .hover g.primary text {

                  font-weight: bold;
                }

                .hover g.secondary text {

                  font-weight: bold;
                }

                .hover path.primary {
                  stroke: red;
                  stroke-opacity: 1;
                }

                .hover path.secondary {
                  stroke: green;
                  stroke-opacity: 1;
                }

            `);

                const  height_point = this.semester_height_point;

                // eslint-disable-next-line no-unused-vars
                const label = svg.append("g")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .attr("text-anchor", "end")
                    .selectAll("g")
                    .data(graph.nodes)
                    .join("g")
                    .attr("transform", d => `translate(${(d.group*1.5)*margin.left},${height/height_point[d.group]*(d.height-1)+margin.top})`)
                    .call(g => g.append("circle")
                        .attr("r", 30)
                        .attr("fill", d => color(d.group)))
                    .call(g =>{
                            g.append("text")
                                .attr("x", `2em`)
                                .attr("dy",`-1em`)
                                .attr("fill", d => d3.lab(color(d.group)).brighter(3))
                                .text(d => "第"+d.group+"学期")

                        g.append("rect")
                            .attr("width",d=> `${d.name.length}em`)
                            .attr("height",`1.2em`)
                            .attr("x",d=> `${-d.name.length/2}em`)
                            .attr("dy", `1em`)
                            .attr("fill", d => d3.lab(color(d.group)))

                            g.append("text")
                                .attr("x",d=> `${d.name.length/2}em`)
                                .attr("dy", `1em`)
                                .attr("fill", d => d3.lab(color(d.group)).brighter(3))
                                .text(d => d.name)


                    });


                // eslint-disable-next-line no-unused-vars
                /*
                const arc = function(d) {
                    const y1 = d.source.y;
                    const y2 = d.target.y;
                    const r = margin.left * 4;
                    return `M${ (d.source.group+1)*margin.left},${y1}A${0.2*r},${r*0.1} 0,1,${y1 < y2 ? 1 : 0} ${(d.target.group+1)*margin.left},${y2}`;
                }

                 */



                // eslint-disable-next-line no-unused-vars
                const line = function (d){
                    return `M${(d.source.group*1.5)*margin.left},${height/height_point[d.source.group]*(d.source.y-1)+margin.top}
                    L${(d.target.group*1.5)*margin.left},${height/height_point[d.target.group]*(d.target.y-1)+margin.top}`;
                }.bind(this)

                // eslint-disable-next-line no-unused-vars
                const path = svg.insert("g", "*")
                    .attr("fill", "none")
                    .attr("stroke-opacity", 0.6)
                    .attr("stroke-width", 1.5)
                    .selectAll("path")
                    .data(graph.links)
                    .join("path")
                    .attr("stroke", d => d.source.group === d.target.group ? color(d.source.group) : "#aaa")
                    .attr("d",line)


                // eslint-disable-next-line no-unused-vars
                const overlay = svg.append("g")
                        .attr("fill", "none")
                        .attr("pointer-events", "all")
                    .selectAll("circle")
                    .data(graph.nodes)
                    .join("circle")
                        .attr("r", 30)
                        .attr("transform", d => `translate(${(d.group*1.5)*margin.left},${height/height_point[d.group]*(d.height-1)+margin.top})`)
                    .on("mouseover", (e,d) => {
                        console.log(e)
                        if(this.lockPreview)
                        return
                        svg.classed("hover", true);
                        label.classed("primary", n =>  n === d );
                        label.classed("secondary", n =>
                            n.sources.some(l => l === d.id)
                            || n.targets.some(l => l === d.id)
                        );
                        this.graphPreviewCard(d)
                        path.classed("primary", l => l.source.id === d.id)
                            .filter(".primary").raise();
                        path.classed("secondary", l => l.target.id === d.id)
                            .filter(".secondary").raise();
                    })
                    .on("mouseout", () => {
                        if(this.lockPreview)
                        return
                        svg.classed("hover", false);
                        label.classed("primary", false);
                        label.classed("secondary", false);
                        path.classed("primary", false).order();
                        path.classed("secondary", false).order();
                        this.graphPreviewCard(null);
                    }).on("click",()=>{
                        this.lockPreview=!this.lockPreview
                    });



            }
        }
    }
</script>

<style scoped>
.graph-container{
    width:100%;
    height:100%;
    overflow: hidden;
    position: absolute;
    left: 0px;
    top:0px;
}
.graph-card{
    z-index: 15;
    position: absolute;
    right:15px;
    bottom: 20px;
    transition-duration: 0.5s;
    opacity: 1;
}
.graph-card:hover{
    opacity: 0.2;
}
</style>