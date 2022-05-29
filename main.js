//backend

//tensorflow 
//import * as tf from "@tensorflow/tfjs";
//const model = await tf.loadLayersModel('localstorage://caeDNA11.h5');

const { app, BrowserWindow } = require('electron') // Load Electron
//export {createWindow};
const { ipcMain } = require('electron')
const path = require('path');
const url = require('url');
const { dialog } = require('electron');  //새로 사용할 질문창

//파이썬 파일
let {PythonShell} = require('python-shell');
const { generateKeyPairSync } = require('crypto');
//const { stringify } = require('querystring');
const spawn = require('child_process').spawn;


var input;
var file_input;
let one_hot;
let predict_result;
let dna_data;

app.disableHardwareAcceleration()
//[27384:0528/004556.979:ERROR:gpu_init.cc(481)] 
//Passthrough is not supported, GL is disabled, ANGLE is
// 에러에 대한 코드
const options = {
    type: 'question',  //종류
    buttons: ['취소', 'Yes', 'No'],  //버튼 스타일
    defaultId: 2,  //고유 아이디
    title: '제목',  //제목
    message: '메시지 입니다.',
    detail: '세부내용입니다.',
    checkboxChecked: false,  //체크박스(메시지를 저장합니다 이런 기능)
 };

function createWindow () { // 창 만들기
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          enableRemoteModule: true
        }
        
    })

    win.loadFile('index.html') // index.html 불러오기
    win.webContents.openDevTools()//개발자 도구로 실행
}

app.whenReady().then(() => { // 앱 준비 완료
    createWindow() // 창 만들기
    
})

app.on('window-all-closed', function () { // 모든 창이 닫힐경우
    if (process.platform !== 'darwin') app.quit() // 앱 종료
})

ipcMain.on('pridict-view',(event, args)=>{// 검사 통과 후 다음 페이지
    input = args;
    console.log(input);
    
    BrowserWindow.getAllWindows()[0].loadURL(url.format({
        pathname : path.join(__dirname,'predict.html'),
        protocol:'file',
        slashes:true
    }));
});

ipcMain.on('stringError',()=>{
    dialog.showErrorBox("문자열 에러","ATCG로만 이루어져야 합니다.");
    //dialog.showMessageBox(null,{type:'info',title:'Ok', message:'ATCG로만 이루어져야 합니다.'});  
})
ipcMain.on('fileTypeError',()=>{
    dialog.showErrorBox("파일 형식 에러",".txt 등등 이루어져야 합니다.");
    //dialog.showMessageBox(null,{type:'info',title:'Ok', message:'ATCG로만 이루어져야 합니다.'});  
})

ipcMain.on('pridictfile-view',(event, args)=>{// 검사 통과 후 다음 페이지
    file_input = args;
    console.log(file_input);
    
    BrowserWindow.getAllWindows()[0].loadURL(url.format({
        pathname : path.join(__dirname,'predict.html'),
        protocol:'file',
        slashes:true
    }));
});

ipcMain.on('getdata',(event,args)=>{
    console.log("getdata1"+input);
    console.log(typeof(input));
    console.log("getdata2"+file_input);
    console.log(typeof(file_input));
    if(input){
        console.log("putdata1"+input);
        event.reply('getdata-reply',input);
    }else if(file_input){
        console.log("putdata2"+file_input);
        event.reply('getdata-reply',file_input);
        
    }
    
});
ipcMain.on('get-onehot',(event,args)=>{
    // PythonShell.run('oneHotencoder.py',args,(err,data)=>{
    //     if (err) throw err;
    //     console.log("pydata : "+data)
    // })
    const pythonProcess = spawn('python',["oneHotencoder.py", args]);
    pythonProcess.stdout.on('data',(data)=>{
        console.log(data)
        console.log("data.length : " + data.length)//104+length
        console.log(data.length)
        console.log("data type: " + typeof(data))
        console.log("toString: "+data.toString())
        console.log(data.toString())
        console.log("toString length: "+data.toString().length)
        console.log("data[0] : "+data[0].toString())
        console.log("data[1] : "+data[1].toString())
        console.log("data[2] : "+data[2].toString())
        //console.log("data Substring : "+ data.substring(104))
        //console.log("data Substring : "+ data.substring(105))
        
        //console.log(data.toString().substring(26+args.length))
        //console.log(data.toString().substring(29))
        //3개일때 data.length 108, 29부터 substring
        //0개 -> 26, n개 -> 26+args.length
        //one_hot = data.toString().substring(26+args.length);
        predict_result=data.toString()
        //event.reply("reply-onehot",one_hot);
        event.reply("reply-onehot",predict_result);
    })
    // if(input){
    //     console.log("putdata1"+input);
    //     event.reply('getdata-reply',input);
    // }else if(file_input){
    //     console.log("putdata2"+file_input);
    //     event.reply('getdata-reply',file_input);
        
    //}
    
});

ipcMain.on('recommend-view',(event, args)=>{// 다음 페이지
    dna_data = args;
    console.log(dna_data);
    
    BrowserWindow.getAllWindows()[0].loadURL(url.format({
        pathname : path.join(__dirname,'recommend.html'),
        protocol:'file',
        slashes:true
    }));
});