//import { createWindow } from "./main.js"; 

const { webContents } = require("electron");
const ipcRenderer = require('electron').ipcRenderer;
const dialog  = require('electron').remote;

//파이썬 파일 호출
//const spawn= require('child_process').spawn;

//const get_input_py = spawn('python',['oneHotencoder.py',input])
//const get_file_py = spawn('python',['oneHotencoder.py',file_data])
//document.getElementById("search").addEventListener("click",search);
var path = document.location.pathname;
let filename;//파일이름
let file_data;//파일 내의 데이터
let input;
let save_data;
let one_hot_data;
let predict_result;
let recommend_result;

console.log(path);
if(/index.html$/.test(path)){
   document.getElementById("search").addEventListener("click",search);
}
else if(/predict.html$/.test(path)){
   console.log("input"+input);
   console.log("file_data"+file_data);
   
   let start = new Date();

   ipcRenderer.send('getdata',save_data);
   ipcRenderer.on('getdata-reply',(event,arg)=>{
      save_data=arg;
      console.log("save_data1"+save_data);
      document.getElementById("predictResult").value=save_data;
      //const one_hot = spawn('python',['oneHotencoder.py',save_data]);
      //one_hot.stdout.on('data',(result)=>{
      //   one_hot_data=result.data;
      //   console.log(one_hot);
      //})
      
      ipcRenderer.send('get-onehot',save_data);
      ipcRenderer.on("reply-onehot",(event,arg)=>{
         //one_hot_data=arg;
         predict_result=arg;
         //console.log("one_hot_data : "+one_hot_data);
         console.log("predict result : "+predict_result);
         
         //결과값 페이지에 삽입하기
         document.getElementById('predict_Restauration').value=predict_result;
         if(parseFloat(predict_result)<0.2){
            document.getElementById('predict_Result').value="rbcl 유전자 입니다.";
            let end = new Date();
            console.log("predict time : "+((end-start)/1000)+"s");
         }
         else{
            document.getElementById('predict_Result').value="rbcl 유전자가 아닙니다.";
            let end = new Date();
            console.log("predict time : "+((end-start)/1000)+"s");
         }
         
      })
      
      //predict(save_data);
   });
   //console.log("save_data2"+save_data);//여기선 안담김.
   document.getElementById("recommend").addEventListener("click",recommend);
}else if(/recommend.html$/.test(path)){
   ipcRenderer.send('get-recommend',(recommend_result));
   ipcRenderer.on("reply-recommend",(event,arg)=>{
      recommend_result=arg;
      document.getElementById("recommend_Result").value=recommend_result;
   });
   document.getElementById("back-to-first").addEventListener("click",back);
}

//document.getElementById("inputfile").onchange(inputfile);

function search(){
   filename = document.getElementById("inputfile").value;
   input = document.getElementById("input").value;
   console.log("fasta"+filename)
   console.log(typeof(filename))
   console.log("inputval"+input)
   if(/.txt$/.test(filename) || /.fasta$/.test(filename) || /.seq$/.test(filename) || /.xml$/.test(filename)){//.txt .파일이면
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
   }else if(filename){
      if(!(/.txt$/.test(filename) && /.fasta$/.test(filename) && /.seq$/.test(filename) && /.xml$/.test(filename))){
      //if(!(/.txt$/.test(filename) || /.fasta$/.test(filename) || /.seq$/.test(filename))){
         // !(.txt or .fasta or .seq) -> not .txt and not .fasta and not .seq
         //확장자가 틀릴 때 
         console.log("filetypeerror"+input);
         ipcRenderer.send('fileTypeError');
      }
   }
   //else if(input){//문자열일때
   else{//문자열일때
   console.log(input);
   console.log(typeof(input));
   if(/[^(A|T|C|G|R|Y|S|W|K|M|B|D|H|V|N)]/.test(input) || input===""){// not ATCG 이면 true
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

   if(/[^(A|T|C|G|R|Y|S|W|K|M|B|D|H|V|N)]/.test(file_data) || file_data===""){// not ATCG 이면 true
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
   ipcRenderer.send('recommend-view',save_data);
}
function back(){
   //like search
   ipcRenderer.send('first-view');
}