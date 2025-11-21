import * as os from 'node:os';
import * as pty from 'node-pty';
import WebSocket, { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8090 });

let ptyProcess = null


wss.on("connection", (ws)=>{
startTerminal(ws)
    ws.on("meesage",(data) =>{
         if (ptyProcess) {
      ptyProcess.write(data);  
    }
    })
})

function startTerminal (ws){
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
 ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

ptyProcess.onData((data)=>{
    ws.send(JSON.stringify(data))
})
}


