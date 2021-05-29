const SSH2Shell =require("ssh2shell");

const VolumeCollection = process.env.VolumeCollection;
const AggregateCollection= process.env.AggreCollection;
const SvmCollection =process.env.SvmCollection;
const Helperfunctions =require('./routes/HelperFunctions');

let AggreArray=[];
let SvmArray=[];
let VolArray=[];
let Data={Aggre:'',Svm:'',Vol:''}
var host={
    server:{
        host:process.env.host,
        port:process.env.port,
        userName:"admin",
        password:"69zu9b3k"
    },
    commands:[],
    idleTimeOut: 5000,
    dataIdleTimeOut:10000,
    debug: true,
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
                Data.Aggre=await AggreFunction(command, response)
            break;
            }
            case "vserver show -vserver !*cluster* -fields vserver,subtype,aggregate":{
                Data.Svm=SvmFunction(command,response)
                break;
            }
            case "vol show -vserver !*cluster* -volume !*root* -fields node,aggregate,vserver,volume,total,size,used,available":{
                Data.Vol=await VolFunction(command,response);
                break;
            }
            default :{
                this.emit("msg",response.slice(command.length+3,(response.length-16)));
                break;
            }
        }
    }
    ,onEnd: function( sessionText, sshObj ) {
        console.log("---End---")
    }
};
SSH = new SSH2Shell(host),
//Use a callback function to process the full session text
callback = function(sessionText){

}
    function cutStrSpace(str,Parr){   
        let Tstr="";
        let arr=[];
        let curser=0;
        while(curser<=str.length)
        {
            if(str[curser]!=" ")
            {
                if(Tstr==null)
                {
                    Tstr=(str[curser])
                }else{
                    Tstr+=(str[curser])
                }
            }else{
                // console.log(Tstr+": "+curser+":"+str.length)
                if(Tstr!=null)
                {
                    arr.push(Tstr);
                }
                Tstr=null;
            }
            curser++;
        }
        Parr.push(arr);
    }
    async function VolFunction(command,response){
        let Tempres=response.slice(command.length+3,(response.length-16));
        let Title=Tempres.slice(0,135);
        let numofVol=parseInt(Tempres.slice(Tempres.length-26,Tempres.length-24));
        let CharB=Tempres.slice(137,Tempres.length-26);
        // console.log(Title)
        // console.log(CharB)
        // console.log(CharB.slice(0,CharB.indexOf("\r\n")))
        console.log("-------"+numofVol+"---------")

        let Temp=CharB.substring(0,CharB.length)
        let Vol="";
        for (let i=1;i<=numofVol;i++){ 
            // console.log(Temp.slice(0,Temp.indexOf("\r\n")+2))
            Vol=Temp.slice(0,Temp.indexOf("\r\n")+2)
            Temp=Temp.slice(Vol.length,Temp.length)
            cutStrSpace(Vol,VolArray);
        }
        console.log(VolArray)
        let VolObjArray=[];
        VolArray.forEach(async (volobj)=>{
            let volume=({
                locationstring:".../"+volobj[2]+"/"+volobj[0]+"/"+volobj[1],
                Cluster:"",
                env:volobj[7],
                aggregate:volobj[2],
                svm:volobj[0],
                Name:volobj[1],
                total:(volobj[3].slice(0,volobj[3].length-2)/1024).toFixed(3),
                used:(volobj[6].slice(0,volobj[6].length-2)/1024).toFixed(3),
                available:(volobj[4].slice(0,volobj[4].length-2)/1024).toFixed(3),
                dedupeCapSaved:0,   
                });
            AggreArray.forEach(Aggre => {
                if (Aggre[0] == volobj[2]) {
                    volume.Cluster = Aggre[3];
                }
            });
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
            let CharB=Tempres.slice(55,Tempres.length-26);//response
            // let index=0;
            // console.log(Title);
            // console.log(CharB);
            let Temp=CharB.substring(0,CharB.length)
            let Svm="";
            for (let i=1;i<=numofSvms;i++){ 
                
                Svm=Temp.slice(0,Temp.indexOf("\r\n")+2)
                Temp=Temp.slice(Svm.length,Temp.length)
                // if(28*(i+1)>CharB.length)
                // {
                //     Svm=CharB.slice(index,CharB.length);
                // }else{
                //     Svm=CharB.slice(index,28*(i));
                // }
                cutStrSpace(Svm,SvmArray);
                // index=(28*(i));
            }
            let Aggreobj;
            let SvmObjArray=[];
            SvmArray.forEach(async(Svmobj)=>{
                AggreArray.forEach(Aggre=>{
                    if(Aggre[0]==Svmobj[2]){
                        Aggreobj=Aggre;
                    }
                });
                let svm=({
                    locationstring:`${Aggreobj[3]}/${Svmobj[2]}/${Svmobj[0]}`,
                    Cluster:Aggreobj[3],
                    env:Aggreobj[1],
                    aggregate:Svmobj[2],
                    Name:Svmobj[0],
                    total:0,
                    used:0,
                    available:0,
                    full:0,
                    dedupeCapSaved:0,
                    VolumeCount:0,
                });
                Data.Vol.forEach(Vol=>{
                    if(Vol.svm==Svmobj[0])
                    { 
                        svm.total+=parseFloat(Vol.total);
                        svm.used+=parseFloat(Vol.used);
                        svm.available+=parseFloat(Vol.available);
                        svm.VolumeCount++;
                    }
                })
                svm.full=parseFloat(((svm.total-svm.available)/svm.total)*100).toFixed(4)
                SvmObjArray.push(svm);

            });
            // console.log("--------svm----------")
            // console.log(SvmObjArray)
            // console.log("---------------------")
            return SvmObjArray;
    }
    function AggreFunction(command,response){
        let Tempres=response.slice(command.length+3,(response.length-16));
            let numofAggre=parseInt(Tempres.slice(Tempres.length-26,Tempres.length-24));
            let Tableheader= Tempres.slice(0,121);
            let CharB=Tempres.slice(161,Tempres.length-26);
            let index=0;
            // console.log(Tableheader);
            // console.log(CharB)
                for (let i=0;i<numofAggre;i++){
                    
                    let Aggre=CharB.slice(index,CharB.length/(numofAggre-i));
                    cutStrSpace(Aggre,AggreArray);
                    index+=(CharB.length/(numofAggre-i))+1;
            }
            let AggreObjArray=[];
            AggreArray.forEach((Aggreobj)=>{
                let Aggre=({
                    locationstring:`${Aggreobj[3]}/${Aggreobj[0]}`,
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
            // console.log("--------Aggre----------")
            // console.log(AggreObjArray)
            // console.log("---------------------")
        return AggreObjArray;
    }

    module.exports={
        async ActiveCommendInShell(command){
            host.commands=command
            SSH=new SSH2Shell(host),
            await SSH.connect();
        },
        async GetShellData(callback){
            host.commands=["row 0","set -units MB",
            "aggr show -aggregate !*aggr0* -fields cluster,aggregate,node,size,usedsize,percent-used,availsize,volcount",
            "vol show -vserver !*cluster* -volume !*root* -fields node,aggregate,vserver,volume,total,size,used,available",
            "vserver show -vserver !*cluster* -fields vserver,subtype,aggregate","exit"]
            await SSH.connect(async(result)=>{
                Data.Aggre.forEach((Aggre)=>{
                    Data.Vol.forEach((Vol)=>{
                        console.log(Aggre.Name===Vol.aggregate)
                        if(Aggre.Name===Vol.aggregate){
                            console.log(Vol);
                            Aggre.allocated+=parseFloat(Vol.total);
                        }
                    })    
                })
                const resultA=await Helperfunctions.ArrayDataHendle(AggregateCollection,Data.Aggre);
                console.log(resultA);
                const resultS=await Helperfunctions.ArrayDataHendle(SvmCollection,Data.Svm);
                console.log(resultS);
                const resultV=await Helperfunctions.ArrayDataHendle(VolumeCollection,Data.Vol);
                console.log(resultV)
                callback(Data);
            })
        },
        createVolume(svm,vol,aggre,size,callback){
            host.commands=[`volume create -vserver ${svm} -volume ${vol} -aggregate ${aggre} -size ${size}GB -state online -policy default`]
                SSH.connect(async (result)=>{
                    let res={flag:true,msg:''}
                    let Error=result.indexOf("Error");
                    if(Error==-1)
                    {
                        res.flag=true;
                        res.msg='Job succeeded'
                    }else{
                        res.flag=false;
                        res.msg=result.slice(Error,result.lastIndexOf(".")+1)
                    }
                    callback(res);
                });             
        },
        createSvm(svm,aggre,callback){
            host.commands=[`vserver create -vserver ${svm} -aggregate ${aggre}`]
            SSH.connect(async(result)=>{
                let res={flag:true,msg:''}
                let Error=result.indexOf("Error");
                if(Error==-1)
                {
                    res.flag=true;
                    res.msg='Job succeeded'
                }else{
                    res.flag=false;
                    res.msg=result.slice(Error,result.lastIndexOf(".")+1)
                }
                callback(res);
            });  
        }
}


