//import { createWindow } from "./main.js"; 

const { webContents } = require("electron");
const ipcRenderer = require('electron').ipcRenderer;
const dialog  = require('electron').remote;

//document.getElementById("search").addEventListener("click",search);
var path = document.location.pathname;
let filename;//파일이름
let file_data;//파일 내의 데이터
let input;
let save_data;
console.log(path);
if(/index.html$/.test(path)){
   document.getElementById("search").addEventListener("click",search);
}
else if(/predict.html$/.test(path)){
   console.log("input"+input);
   console.log("file_data"+file_data);
   ipcRenderer.send('getdata',save_data);
   ipcRenderer.on('getdata-reply',(event,arg)=>{
      save_data=arg;
      console.log("save_data1"+save_data);
      document.getElementById("predictResult").value=save_data;
      predict(save_data);
   });
   console.log("save_data2"+save_data);
   document.getElementById("recommend").addEventListener("click",recommend);
}else if(/recommend.html$/.test(path)){

}

//document.getElementById("inputfile").onchange(inputfile);

function search(){
   filename = document.getElementById("inputfile").value;
   input = document.getElementById("input").value;
   if(/.txt$/.test(filename)){//.txt파일이면
      //event.preventDefault(); //submit 할때 새로고침 되는것을 방지
      let fileObject = document.getElementById("inputfile");
      let fileName = fileObject.files[0];
      let fr = new FileReader();
      fr.readAsText(fileName, "utf-8");
      fr.onload = () => {
         parseText(fr.result);
     }
     
   //   console.log("fr.reuslt"+fr.result);
     

   //   console.log("1"+file_data);
   // console.log(typeof(file_data));
   //   if(/[^(A|T|C|G)]/.test(file_data) || file_data===""){// not ATCG 이면 true
   //    ipcRenderer.send('stringError');
   // }else{//ATCG 이면 다음 페이지
   //    ipcRenderer.send('pridictfile-view',file_data);
   // }
   }else if(filename){//확장자 틀렸을때
      ipcRenderer.send('fileTypeError');
   }
   else{//문자열일때
   
   console.log(input);
   console.log(typeof(input));
   if(/[^(A|T|C|G)]/.test(input) || input===""){// not ATCG 이면 true
      ipcRenderer.send('stringError');
   }else{//ATCG 이면 다음 페이지
      ipcRenderer.send('pridict-view',input);
      console.log("여기는 가능할까"+input);
      console.log(path);
      //document.getElementById("predictResult").value=input;
   }
}
//    dialog.showMessageBox(null, options).then(function(res){
//       if(res.response == 1){
//          var data = document.getElementById('data').value;
//          ipcRenderer.send('저장하는곳', {data:data})    
          
//       } else {
           
//       }
// });
  
   //alert("hi");
   //document.getElementById("input").outerText=s+"success";
   
   //main.createWindow();//안됨
   //console.log(input);
   //window.location.href='./predict.html';
   

    //window.location.href=''
   // if(input !=='hi'){
   //  document.getElementById("predictResult").outerText=input+": fail"
   // } else{
   //  document.getElementById("predictResult").outerText=input+": success"
   // }
 
}
function inputfile(){
   filename = document.getElementById("inputfile").value;
   document.getElementById("input").value=filename;
   console.log(filename);
   console.log(typeof(filename));
}
function parseText(text) {
   console.log("2"+text)
   //file_data=text;
   // 여기서 파일 가공하면됨
   file_data=text;
   console.log("1"+file_data);
   console.log(typeof(file_data));
   if(/[^(A|T|C|G)]/.test(file_data) || file_data===""){// not ATCG 이면 true
    ipcRenderer.send('stringError');
 }else{//ATCG 이면 다음 페이지
    ipcRenderer.send('pridictfile-view',file_data);
    //document.getElementById("predictResult").value=file_data;
 }
}
function predict(data){
   // input : data
   // model : CNN
   // output : O/X or percent
   // ex : predict_result = CNN(data);
   //      document.getElementById("predict_result").value=predict_result;

}

function data(){
   if(file_data!==null){
      document.getElementById("predictResult").value=file_data;
   }
   else if(input !==null){
      document.getElementById("predictResult").value=input;
   }
   
}
function recommend(){
   //like search
   
}