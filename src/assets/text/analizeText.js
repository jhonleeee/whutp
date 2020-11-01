/*export default{
  
}*/
export const ANATXT={
    PCS:`//a funtion to open custom box stolen from js/customControl.js?v=2.002
    function customAlert(text,tip){
        mybg =parent.parent.document.createElement("div"); 
        mybg.setAttribute("id","mybg");  
        mybg.style.background = "#000";  
        mybg.style.width = "100%";  
        var s_height=document.body.scrollHeight; 
        if(s_height<window.screen.availHeight) 
        { 
            s_height=window.screen.availHeight; 
        } 
        mybg.style.height = s_height+"px";  
        mybg.style.position = "fixed";  
        mybg.style.top = "0";  
        mybg.style.left = "0";  
        mybg.style.zIndex = "19999";  
        mybg.style.opacity = "0.3";  
        mybg.style.filter = "Alpha(opacity=30)";   
         $("body",parent.parent.document).append($(mybg));
        myDilog= parent.parent.document.createElement("div");
        myDilog.setAttribute=("id","alert");
        myDilog.innerHTML="<div style='padding:5px 5px ;font-weight:bold;height:27px;border-radius:15px;background:#f1f1f1;color:#000;'>\
        <span style='position:absolute;border-radius:15px;left:10px;top:9px;'>"+tip+"</span><label id='close' style='background-image:url(../images/girl_bg.png);\
        background-position:-749px -235px;float:right;width:16px;height:14px;position:absolute;right:10px;top:9px;cursor:pointer'></label></div><br/>\
        <div style='height:15px; text-align:center'> <div style='font-size:16px; '><div style='position:absolute;left:10px; background-image:url(../images/girl_bg.png);\
        background-position:-716px -215px;width:34px;height:34px;padding-top:10px;display:inline-block;'></div><div  style='float:left;text-align:left;display:inline-block;\
        padding-left:60px;padding-right:10px;padding-top:5px;'><textarea style='margin-bottom:20px' onclick='this.focus();this.select()' type='text' >"+text+"</textarea>\
        </div></div></div><br><br><br><div style=' padding:15px;margin-right:15px; height:25px;padding:5px 0 0 5px;clear:both;'>\
        <input style='position:absolute;right:20px;bottom:13px; background-image:url(../images/girl_bg.png);\
        background-position:-766px -224px;width:63px;height:25px;border:0px;cursor: pointer;' type='button' name='closebtn'   id='closebtn'></div>"
        myDilog.style.boxShadow="grey 1px 1px 25px";
        myDilog.style.width="400px";
        myDilog.style.background="#ffffff";
        myDilog.style.zIndex="20000";
        myDilog.style.borderRadius ="15px";
        myDilog.style.position = "fixed";  
        var left = ($(window.top).width()-400)/2;
        myDilog.style.top = "30%";  
        myDilog.style.left = left+"px";
        myDilog.style.boxShadow="0 0 8px  rbga(0,0,0,0.2)";
        $("body",parent.parent.document).append($(myDilog));
        parent.parent.document.body.parentNode.style.overflow="hidden";
        var mClose = parent.parent.document.getElementById("close");
        var closebtn= parent.parent.document.getElementById("closebtn"); 
        closebtn.onclick = closeAlert;
        mClose.onclick = closeAlert;
    }
    function closeAlert(){
        $(myDilog).remove();
        $(mybg).remove();
        parent.parent.document.body.parentNode.style.overflow="scroll"; 
    }
    function GPAConversion(score){
        try{
            let scoreInt = parseInt(score);
            if(!scoreInt){
                return -1;
            }
            if(scoreInt>=90){
                return 4;
            }else if(scoreInt>=85){
                return 3.7;
            }else if(scoreInt>=82){
                return 3.3;
            }else if(scoreInt>=78){
                return 3.0;
            }else if(scoreInt>=75){
                return 2.7;
            }else if(scoreInt>=72){
                return 2.3
            }else if(scoreInt>=68){
                return 2.0
            }else if(scoreInt>=64){
                return 1.5
            }else if(scoreInt>=60){
                return 1;
            }else{
                return 0;
            }
        }catch(e){
            console.log("Parse Score Error!");
            console.log(e);
            return -1;
        }
    }
    //A way to get academic transcript(in Json) Ver.Fennekin
    function checkPage(){
        let btn3 = document.getElementById("btn3");
        return btn3.classList.contains("current");
    }
    function checkSite(){
        let location = window.location.host;
        return "bkjw.whu.edu.cn"==location;
    }
    function getAcademicTrans(){
        //!!Please run this script on layer 'Top'!
        try{
        if(!checkSite()){
            console.warn("这个只支持旧教务系统...（bkjw.whu.edu.cn）");
            return;
        }
        if(!checkPage()){
            customAlert("获得成绩信息，需要帮忙点击一下页面上方的成绩按钮哦","跑错地方啦");
            return;
        }
        var AcademicList = new Object();//not Array,or json->string will ignore attr,whitch means only get []
        let iframe  =document.getElementById("page_iframe").contentWindow.document.getElementById("iframe0").contentWindow;
    
        let form = iframe.document.getElementsByClassName("listTable");
        if(form.length==0){
            //throw "FormNotFind";
        }
        let rows = form[0].firstElementChild.children;
        AcademicList["Count"]=rows.length-1;
        AcademicList["Courses"]= new Array();
        AcademicList["Student"]=document.getElementById("nameLable").textContent.trim();
        for(var i =1;i<rows.length;i++){
            let row = rows[i];
            let columns = row.children;
            var newCourse = new Object();
            newCourse["name"] = columns[0].textContent.trim();
            newCourse["Cid"]= columns[0].getAttribute("data-lsnid").trim();
            newCourse["Ctype"]= columns[1].textContent.trim();
            newCourse["GeneralCtype"]= columns[2].textContent.trim();
            if(columns[3].children.length>0){
                var Cattrs = new Array();
                [...columns[3].children].forEach(attr => {
                    Cattrs.push(attr.textContent.trim());
                });
                newCourse["Cattr"]=Cattrs;
            }else{
                newCourse["Cattr"]={};
            }
            newCourse["point"]= columns[4].textContent.trim();
            newCourse["teacher"]= columns[5].textContent.trim();
            newCourse["academy"]= columns[6].textContent.trim();
            newCourse["studyType"]= columns[7].textContent.trim();
            newCourse["year"]=columns[8].textContent.trim();
            newCourse["semester"]=columns[9].textContent.trim();
            newCourse["score"]=columns[10].textContent.trim();
            newCourse["GPA"]=GPAConversion(newCourse["score"]);
            AcademicList["Courses"].push(newCourse);
        }
            console.log(AcademicList);
            console.log(JSON.stringify(AcademicList));
            customAlert(JSON.stringify(AcademicList),"请选中并复制下面的内容，提交到之前的页面中");
        }catch(e){
            console.info("出现问题了，如果console面板上方选择的层级（context）是Top的话，下面的报错信息也许会有用...");
            console.log(e);
        }
    }
    getAcademicTrans();`
   }