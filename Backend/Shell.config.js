const SSH2Shell =require("ssh2shell");

const Volume = require('./models/Volume.model');
const Aggregate= require('./models/Aggregate.model');
const Svm = require('./models/Svm.model');
const Helperfunctions =require('./routes/HelperFunctions');

let AggreArray=[];
let SvmArray=[];
let VolArray=[];

var host={
    server:{
        host:process.env.host,
        port:process.env.port,
        userName:"admin",
        password:""
    },
    commands:[],
    idleTimeOut: 5000,
    debug: false,
    standardPrompt: "",
    varbose:true,
    showBanner:         false,

    // enter:              "\r\n",
    // connectedMessage:    "\r\n",
    // readyMessage:        "\r\n",
    // closedMessage:       "\r\n",
    //process each command response
    onCommandComplete: async function( command, response, sshObj) {
        switch (command)
        {
            case "aggr show -aggregate !*aggr0* -fields cluster,aggregate,node,size,usedsize,percent-used,availsize,volcount":{
                let AggreArray=await AggreFunction(command,response);
                Helperfunctions.CreateArray(Aggregate,AggreArray,function(result){
                    console.log(result)
                    });
                break;
            }
            case "vserver show -vserver !*cluster* -fields vserver,subtype,aggregate":{
                let svmArray=await SvmFunction(command,response)
                 Helperfunctions.CreateArray(Svm,svmArray,function(result){
                    console.log(result);
                });
                break;
            }
            case "vol show -vserver !*cluster* -volume !*root* -fields node,aggregate,vserver,volume,total,size,used,available":{
                // let volarray=await VolFunction(command,response);
                // Helperfunctions.CreateArray(Volume,volarray,function(result){
                // console.log(result);
                // });
                break;
            }
            default :{
                this.emit("msg",response.slice(command.length+3,(response.length-16)));
                break;
            }
        }
    }
};
SSH = new SSH2Shell(host),
//Use a callback function to process the full session text
callback = function(sessionText){
}
    function cutStrSpace(str,Parr){
        let arr=[];
        let Tindex=0;
        while(Tindex!==-1){
            let Tcounter=str.indexOf(" ",Tindex);
            if(Tcounter!=-1){
                let Tstr=str.slice(Tindex,Tcounter);
                if(Tstr.length!==0)
                {
                    arr.push(Tstr)
                }
            Tindex=Tcounter+1;
            }else{
                Tindex=Tcounter;
            }
        }
        Parr.push(arr);
    }
    async function VolFunction(command,response){
        let Tempres=response.slice(command.length+3,(response.length-16));
        let Title=Tempres.slice(0,135);
        let numofVol=parseInt(Tempres.slice(Tempres.length-26,Tempres.length-24));
        let CharB=Tempres.slice(135,Tempres.length-26);
        let index=0;
        for (let i=0;i<numofVol;i++){                  
            let Vol=CharB.slice(index,CharB.length/(numofVol-i));
            cutStrSpace(Vol,VolArray);
            index+=(CharB.length/(numofVol-i))+1;
        }
        let VolObjArray=[];
        console.log(VolArray)
        VolArray.forEach((volobj)=>{
            let AggreObj=FindAggreByName(volobj[2]);
            let volume=new Volume({
                locationstring:".../"+volobj[2]+"/"+volobj[0]+"/"+volobj[1],
                Cluster:AggreObj,
                env:volobj[7],
                aggregate:volobj[2],
                svm:volobj[0],
                Name:volobj[1],
                total:(volobj[5].slice(0,volobj[5].length-2)/1024).toFixed(3),
                used:(volobj[6].slice(0,volobj[6].length-2)/1024).toFixed(3),
                available:(volobj[4].slice(0,volobj[4].length-2)/1024).toFixed(3),
                dedupeCapSaved:0,   
                });+
            VolObjArray.push(volume);
        })
        console.log("--------vol----------")
        console.log(VolObjArray)
        console.log("---------------------")
        return VolObjArray;
    }
    function SvmFunction(command,response){
        let Tempres=response.slice(command.length+3,(response.length-16));
            let Title=Tempres.slice(0,57);//title
            let numofSvms=parseInt(Tempres.slice(Tempres.length-26,Tempres.length-24));
            let CharB=Tempres.slice(57,Tempres.length-26);//response
            let index=0;
            // console.log(Title);
            // console.log(CharB);
            
            for (let i=0;i<numofSvms;i++){                  
                let Svm=CharB.slice(index,CharB.length/(numofSvms-i));
                cutStrSpace(Svm,SvmArray);
                index+=(CharB.length/(numofSvms-i));
            }
            let Aggreobj;
            let SvmObjArray=[];
            SvmArray.forEach(async(Svmobj)=>{
                AggreArray.forEach(Aggre=>{
                    if(Aggre[0]==Svmobj[2]){
                        Aggreobj=Aggre;
                    }
                });
                let svm=new Svm({
                    Cluster:Aggreobj[3],
                    env:Aggreobj[1],
                    aggregate:Svmobj[2],
                    Name:Svmobj[0],
                    total:0,
                    used:0,
                    available:0,
                    full:0,
                    dedupeCapSaved:0,
                    VolumeCount:Aggreobj[7],
                });
                VolArray.forEach(Vol=>{
                    if(Vol[0]==Svmobj[0])
                    {
                        svm.total+=(Vol[5].slice(0,Vol[5].length-2)/1024).toFixed(3);
                        svm.used+=(Vol[6].slice(0,Vol[6].length-2)/1024).toFixed(3);
                        svm.available+=(Vol[4].slice(0,Vol[4].length-2)/1024).toFixed(3);
                    }

                })
                svm.full=parseInt(((svm.total-svm.available)/svm.total)*100)
                SvmObjArray.push(svm);

            });
            console.log("--------svm----------")
            console.log(SvmObjArray)
            console.log("---------------------")
            return SvmObjArray;
    }
    function AggreFunction(command,response){
        let Tempres=response.slice(command.length+3,(response.length-16));
            let numofAggre=parseInt(Tempres.slice(Tempres.length-26,Tempres.length-24));
            let Tableheader= Tempres.slice(0,121);
            let CharB=Tempres.slice(165,Tempres.length-26);
            let index=0;
            // console.log(Tableheader);
            // console.log(CharB)
                for (let i=0;i<numofAggre;i++){
                    
                    let Aggre=CharB.slice(index,CharB.length/(numofAggre-i));
                    cutStrSpace(Aggre,AggreArray);
                    index+=(CharB.length/(numofAggre-i))+1;
            }
            let AggreObjArray=[];
            AggreArray.forEach(async(Aggreobj)=>{
                let Aggre=new Aggregate({
                    Cluster:Aggreobj[3],
                    Name:Aggreobj[0],
                    env:Aggreobj[1],
                    total:(Aggreobj[5].slice(0,Aggreobj[5].length-2)/1024).toFixed(3),
                    used:(Aggreobj[6].slice(0,Aggreobj[6].length-2)/1024).toFixed(3),
                    allocated:0,
                    leftToAllocate:(Aggreobj[2].slice(0,Aggreobj[2].length-2)/1024).toFixed(3),
                    full:Aggreobj[4].slice(0,Aggreobj[4].length-1),
                    overSubsPrecent:0,
                })
                // console.log("---------------|"+j+"|--------------")
                AggreObjArray.push(Aggre);
            })
            console.log("--------Aggre----------")
            console.log(AggreObjArray)
            console.log("---------------------")
        return AggreObjArray;
    }
    function FindAggreByName(Name)
    {
        AggreArray.forEach(Aggre => {
            if (Aggre[0] == Name) {
                return (Aggre[3]);
            }
        });
    }
    module.exports={
        async ActiveCommendInShell(command){
            host.commands=command
            SSH=new SSH2Shell(host),
            await SSH.connect();
        },
        async GetShellData(){
            host.commands=["row 0","set -units MB",
            "aggr show -aggregate !*aggr0* -fields cluster,aggregate,node,size,usedsize,percent-used,availsize,volcount",
            "vol show -vserver !*cluster* -volume !*root* -fields node,aggregate,vserver,volume,total,size,used,available",
            "vserver show -vserver !*cluster* -fields vserver,subtype,aggregate",]
            await SSH.connect();
        },
        createVolume(svm,vol,aggre,size){
            host.commands=[`volume create -vserver ${svm} -volume ${vol} -aggregate ${aggre} 
                -state online -size${size} -state online -policy default`]
                SSH.connect();
        }
}


