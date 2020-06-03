const child_process = require('child_process')

var processes = [];

var cmdArray = [
        ['sft login', 'Login'],
        ['sft logout', 'Logout'],
        ['sft list-servers -o json', 'Refresh Server List'],
        ['sft list-users', 'List Users']

]

function addCMDButton(cmd){
    var cmdList = document.getElementById('cmd-list');

    var buttonToAdd = document.createElement("button");

    buttonToAdd.setAttribute("type", "button")
    buttonToAdd.setAttribute("class", "btn btn-outline-primary btn-block asa-cmd-btn")
    buttonToAdd.setAttribute("asa-cmd", cmd[0])
    buttonToAdd.innerText = cmd[1];

    cmdList.appendChild(buttonToAdd)
}

cmdArray.forEach(cmd => {
    addCMDButton(cmd)
});

var allCmdBtns = document.querySelectorAll(".asa-cmd-btn");
allCmdBtns.forEach(btn => { 
    btn.addEventListener("click", cmdRunner, false)
});
 
function run_cmd(cmdstring){
    var thisProc  = child_process.exec(cmdstring, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          alert("Ran:\n" + cmdstring+"\n Encountered an Error:\n"+output);
          return error;
        }
        console.log(`stdout: ${stdout}`);
        console.log("pid"+thisProc.pid);
        console.error(`stderr: ${stderr}`);
        //alert("Ran:\n" + cmdstring+"\nIn Child Process: "+thisProc.pid+"\n With an Output of:\n"+stdout);
      });
      return thisProc;
}

function cmdRunner(e) {
    var cmdToRun = e.target.getAttribute("asa-cmd");
    var processRunning = run_cmd(cmdToRun);
    processes.push(processRunning);
    processRunning.stdout.on('data', (data) => {
        parseOutput(cmdToRun, data);
      });
    

    //Logging and keeping Tabs on running processes for Debugging and to diagnose perf issues.
    i=0;
    processes.forEach(function(procRunning) {
        i++
        console.log(`Process number ${i}: `+procRunning.pid)
    })
    processRunning.on("close", function () {
        processes.splice(processes.indexOf(processRunning), 1);
        console.log(`Child Process Closed`);
      });
    
    //alert("Ran:\n" + cmdToRun+"\n With an Output of:\n"+output);
    e.stopPropagation();
}

function parseOutput(asaCmd, execingProcess){
    switch (asaCmd) {
        case 'sft list-servers -o json':
          parseServers(execingProcess)
          break;
        default:
          console.log(` ${asaCmd} has no further processing defined`);
      }
      
}

function parseServers(procData){
    console.log(typeof procData);
    //Get Lines
    serverData = JSON.parse(procData);
    // serverData = procData.split("\n").slice(1);

    // console.log("server parse: "+serverData);
    var serverList = document.getElementById('server-list');
    //serverList.innerHTML = "";
     serverData.forEach(serverDatum =>{
        addServertoList(serverDatum);
    });
}

function addServertoList(rawServerDatum){
    

    var serverList = document.getElementById('server-list');
    // var serverToAdd = document.createElement("a");

    // serverToAdd.setAttribute("href","#")
    // serverToAdd.setAttribute("class", "list-group-item list-group-item-action")
    // serverToAdd.innerText = rawServerDatum;
    var serverToAddLabel = document.createElement("label");
    serverToAddLabel.setAttribute("class", "btn btn-outline-primary btn-block" )

    var serverToAddInput = document.createElement("input");

    serverToAddInput.setAttribute("type", "radio")
    serverToAddInput.setAttribute("id", rawServerDatum.hostname)
    serverToAddInput.setAttribute("autocomplete", "off")
    serverToAddInput.setAttribute("onclick", "alertTest()")
    //serverToAddInput.setAttribute("class", "btn btn-outline-primary btn-block")
    //serverToAddInput.setAttribute("data-toggle", "btn btn-outline-primary btn-block")
    serverToAddLabel.innerText = rawServerDatum.hostname;

    serverToAddLabel.appendChild(serverToAddInput);

    serverList.appendChild(serverToAddLabel)
}


function alertTest()
{
    alert("Button got clicked")
}
// for (var i = 0; i < 20; i++) {
//     addCMDButton("Command "+i)
//   }


// var cmdList = document.getElementById('cmd-list');

// var buttonToAdd = document.createElement("button");

// buttonToAdd.setAttribute("type", "button")
// buttonToAdd.setAttribute("class", "btn btn-outline-primary btn-block")
// buttonToAdd.innerText = "Command 1";

// cmdList.appendChild(buttonToAdd)