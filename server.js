const express=require("express");
const path=require("path");
const multer=require("multer");

const app=express();
const PORT=process.env.PORT||3000;
const WEBHOOK_URL=process.env.DISCORD_WEBHOOK_URL;

// 8 MB per uploaded file in this version.
const upload=multer({
  storage:multer.memoryStorage(),
  limits:{fileSize:8*1024*1024},
  fileFilter:(req,file,cb)=>{
    const ok=/^(image|video)\//.test(file.mimetype);
    cb(ok?null:new Error("Type de fichier non autorisé"),ok);
  }
});

app.use(express.static(path.join(__dirname,"public")));

app.post("/api/order",upload.single("file"),async(req,res)=>{
  const {name,discord,service,details}=req.body||{};
  if(!name||!discord||!service||!details)
    return res.status(400).json({message:"❌ Remplis tous les champs."});
  if(!WEBHOOK_URL)
    return res.status(500).json({message:"❌ Discord Webhook non configuré."});

  const fields=[
    {name:"👤 Nom",value:String(name).slice(0,100),inline:true},
    {name:"💬 Discord",value:String(discord).slice(0,100),inline:true},
    {name:"🛠️ Service",value:String(service).slice(0,100)},
    {name:"📝 Détails",value:String(details).slice(0,1000)}
  ];
  if(req.file) fields.push({name:"📎 Fichier",value:`${req.file.originalname} (${Math.round(req.file.size/1024)} KB)`});

  const payload={username:"Mohammed Chop",embeds:[{
    title:"📩 Nouvelle commande",
    color:0x8b5cf6,
    fields,
    footer:{text:"Mohammed Chop"}
  }]};

  try{
    let response;
    if(req.file){
      const form=new FormData();
      form.append("payload_json",JSON.stringify(payload));
      form.append("files[0]",new Blob([req.file.buffer],{type:req.file.mimetype}),req.file.originalname);
      response=await fetch(WEBHOOK_URL,{method:"POST",body:form});
    }else{
      response=await fetch(WEBHOOK_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
    }
    if(!response.ok){
      console.error("Discord:",response.status,await response.text());
      return res.status(502).json({message:"❌ Discord a refusé la commande. Vérifie le Webhook ou la taille du fichier."});
    }
    res.json({message:"✅ Commande envoyée sur Discord !"});
  }catch(err){
    console.error(err);
    res.status(500).json({message:"❌ Erreur serveur."});
  }
});

app.use((err,req,res,next)=>{
  if(err instanceof multer.MulterError && err.code==="LIMIT_FILE_SIZE")
    return res.status(413).json({message:"❌ Fichier trop grand. Maximum : 8 MB."});
  if(err) return res.status(400).json({message:"❌ Fichier non autorisé. Utilise une image ou une vidéo."});
  next();
});

app.listen(PORT,()=>console.log(`Mohammed Chop: http://localhost:${PORT}`));
