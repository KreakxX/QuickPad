import * as os from 'node:os';
import * as pty from 'node-pty';
import WebSocket, { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8090 });



wss.on("connection", (ws)=>{
    wss.on("meesage",(data) =>{
        terminalBackend(ws)
    })
})

function terminalBackend(ws){
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

ptyProcess.onData((data) => {
  process.stdout.write(data);
});

ptyProcess.write('ls\r');
ptyProcess.resize(100, 40);
ptyProcess.write('ls\r');

    broadToClient(ws)
}

function broadToClient(ws ,data){
    ws.send(JSON.stringify(data))
}