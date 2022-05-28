//backend
const { app, BrowserWindow } = require('electron') // Load Electron
//export {createWindow};
const { ipcMain } = require('electron')
const path = require('path');
const url = require('url');
const { dialog } = require('electron');  //새로 사용할 질문창

var input;
var file_input;
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