import { useState, useRef, useEffect } from "react";

const GStyles = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:${dark?"#0D1117":"#EEF4FF"};}
    input,textarea,button,select{font-family:'Inter',sans-serif;}
    ::-webkit-scrollbar{width:3px;}
    ::-webkit-scrollbar-thumb{background:${dark?"#2A3550":"#B8CAEE"};border-radius:4px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes popIn{0%{transform:scale(0.86);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes floatBadge{0%{transform:scale(0)}60%{transform:scale(1.35)}100%{transform:scale(1)}}
    @keyframes recPulse{0%,100%{opacity:1}50%{opacity:0.3}}
    @keyframes waveBar{0%,100%{transform:scaleY(0.25)}50%{transform:scaleY(1)}}
    @keyframes slideIn{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes checkPop{0%{transform:scale(0)}70%{transform:scale(1.3)}100%{transform:scale(1)}}
    .fu{animation:fadeUp 0.36s ease both;}
    .pi{animation:popIn 0.28s cubic-bezier(.34,1.56,.64,1) both;}
    .si{animation:slideIn 0.32s cubic-bezier(.2,.8,.4,1) both;}
    .card{transition:transform 0.18s,box-shadow 0.18s;}
    .card:hover{transform:translateY(-2px);}
    .btn{transition:filter 0.14s,transform 0.1s;}
    .btn:hover{filter:brightness(0.92);transform:scale(0.98);}
    .rec{animation:recPulse 1s ease infinite;}
    .wav{animation:waveBar 0.55s ease infinite;}
    .chk{animation:checkPop 0.3s cubic-bezier(.34,1.56,.64,1) both;}
  `}</style>
);

/* ═══ THEME ═══════════════════════════════════════════════════════════════ */
const mkTheme = (accent="#3D6FD4", dark=false) => {
  if (dark) return { bg:"#0D1117",bgAlt:"#161B27",card:"#1C2336",border:"#253050",border2:"#2E3C60",text:"#E8EEFF",sub:"#7A8DB8",dim:"#3A4A70",accent,blue1:"#1E3A6E",blue2:"#2A5298",blue3:"#3D6FD4",blue4:"#6B9FFF",blue5:"#A8C4FF",success:"#5AB88A",danger:"#E07080",gold:"#C9A84C",shadow:"rgba(0,0,10,0.5)",overlay:"rgba(0,0,10,0.8)",ff:"'Inter',sans-serif",serif:"'Playfair Display',serif" };
  return { bg:"#EEF4FF",bgAlt:"#E2ECFF",card:"#FFFFFF",border:"#D0DCFF",border2:"#B8CAEE",text:"#0D1B3E",sub:"#5A6E9A",dim:"#A0B0D0",accent,blue1:"#EEF4FF",blue2:"#C8DAFF",blue3:"#7AA4E8",blue4:"#3D6FD4",blue5:"#1B3F8A",success:"#3D9E6A",danger:"#C85060",gold:"#B8922A",shadow:"rgba(30,60,140,0.10)",overlay:"rgba(10,20,60,0.55)",ff:"'Inter',sans-serif",serif:"'Playfair Display',serif" };
};

/* ═══ CONSTANTS ══════════════════════════════════════════════════════════ */
const CATEGORIES = [
  {id:"groceries",label:"Groceries",icon:"🛒",color:"#3DAD6A"},{id:"household",label:"Household",icon:"🏠",color:"#3D6FD4"},
  {id:"clothes",label:"Clothing",icon:"👗",color:"#A84FD4"},{id:"electronics",label:"Electronics",icon:"💻",color:"#D4844F"},
  {id:"health",label:"Health",icon:"💊",color:"#D44F6A"},{id:"beauty",label:"Beauty",icon:"💄",color:"#D44FA8"},
  {id:"sports",label:"Sports",icon:"⚽",color:"#4FAD3D"},{id:"toys",label:"Toys & Games",icon:"🎮",color:"#D4C44F"},
  {id:"books",label:"Books",icon:"📚",color:"#6A3DD4"},{id:"food",label:"Dining & Food",icon:"🍽️",color:"#D4694F"},
  {id:"travel",label:"Travel",icon:"✈️",color:"#4FBBD4"},{id:"other",label:"Other",icon:"📦",color:"#8A9A9A"},
];
const catById = id => CATEGORIES.find(c=>c.id===id)||CATEGORIES[CATEGORIES.length-1];
const COLOUR_SWATCHES = ["#3D6FD4","#6B4FD4","#D44F8A","#D44F4F","#D4844F","#D4C44F","#4FAD6B","#4FBBD4","#1B3F8A","#8A1B6B","#1B8A52","#8A5A1B","#2D2D2D","#7A4FBF","#BF4F4F"];
const REACTIONS = ["❤️","😘","🥰","👏","🙏","🎉"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const RECUR_OPTS = [{id:"none",label:"No repeat"},{id:"weekly",label:"Every week"},{id:"biweekly",label:"Every 2 weeks"},{id:"monthly",label:"Every month"}];

const CURRENCIES = [
  {code:"USD",symbol:"$",name:"US Dollar",flag:"🇺🇸"},{code:"EUR",symbol:"€",name:"Euro",flag:"🇪🇺"},
  {code:"GBP",symbol:"£",name:"British Pound",flag:"🇬🇧"},{code:"NGN",symbol:"₦",name:"Nigerian Naira",flag:"🇳🇬"},
  {code:"GHS",symbol:"₵",name:"Ghanaian Cedi",flag:"🇬🇭"},{code:"ZAR",symbol:"R",name:"South African Rand",flag:"🇿🇦"},
  {code:"KES",symbol:"KSh",name:"Kenyan Shilling",flag:"🇰🇪"},{code:"INR",symbol:"₹",name:"Indian Rupee",flag:"🇮🇳"},
  {code:"SAR",symbol:"﷼",name:"Saudi Riyal",flag:"🇸🇦"},{code:"AED",symbol:"د.إ",name:"UAE Dirham",flag:"🇦🇪"},
  {code:"BRL",symbol:"R$",name:"Brazilian Real",flag:"🇧🇷"},{code:"JPY",symbol:"¥",name:"Japanese Yen",flag:"🇯🇵"},
  {code:"CNY",symbol:"¥",name:"Chinese Yuan",flag:"🇨🇳"},{code:"CAD",symbol:"CA$",name:"Canadian Dollar",flag:"🇨🇦"},
  {code:"AUD",symbol:"A$",name:"Australian Dollar",flag:"🇦🇺"},{code:"KRW",symbol:"₩",name:"South Korean Won",flag:"🇰🇷"},
  {code:"MXN",symbol:"MX$",name:"Mexican Peso",flag:"🇲🇽"},{code:"PHP",symbol:"₱",name:"Philippine Peso",flag:"🇵🇭"},
  {code:"IDR",symbol:"Rp",name:"Indonesian Rupiah",flag:"🇮🇩"},{code:"TRY",symbol:"₺",name:"Turkish Lira",flag:"🇹🇷"},
  {code:"PLN",symbol:"zł",name:"Polish Zloty",flag:"🇵🇱"},{code:"SEK",symbol:"kr",name:"Swedish Krona",flag:"🇸🇪"},
  {code:"NOK",symbol:"kr",name:"Norwegian Krone",flag:"🇳🇴"},{code:"CHF",symbol:"Fr",name:"Swiss Franc",flag:"🇨🇭"},
  {code:"EGP",symbol:"E£",name:"Egyptian Pound",flag:"🇪🇬"},{code:"PKR",symbol:"₨",name:"Pakistani Rupee",flag:"🇵🇰"},
];
const currByCode = code => CURRENCIES.find(c=>c.code===code)||CURRENCIES[0];
const fmt = (n, sym="$") => `${sym}${(n||0).toFixed(2)}`;

/* ═══ SEED DATA ═════════════════════════════════════════════════════════ */
const SEED_FAMILY = {name:"The Johnson Family",banner:null,photo:null,accentColor:"#3D6FD4",currency:"USD"};
const SEED_PROFILES = [
  {id:1,name:"Sarah",role:"Mother",photo:null,pageColor:"#D44F8A",isPrivate:false,notifications:[]},
  {id:2,name:"James",role:"Father",photo:null,pageColor:"#3D6FD4",isPrivate:false,notifications:[]},
  {id:3,name:"Emma",role:"Daughter",photo:null,pageColor:"#6B4FD4",isPrivate:false,notifications:[]},
  {id:4,name:"Liam",role:"Son",photo:null,pageColor:"#4FAD6B",isPrivate:false,notifications:[]},
];
const N = Date.now();
const SEED_ITEMS = [
  {id:1,forId:3,addedBy:1,name:"Wireless Headphones",note:"White Sony ones 🎧",store:"Best Buy, 200 Park Ave",category:"electronics",price:89.99,recurrence:"none",color:"#6B4FD4",image:null,video:null,purchased:false,purchasedBy:null,reactions:[],comments:[],createdAt:N-86400000},
  {id:2,forId:4,addedBy:2,name:"Football Boots",note:"Size 7, Nike preferred",store:"SportsDirect, 45 High St",category:"sports",price:64.50,recurrence:"none",color:"#4FAD6B",image:null,video:null,purchased:true,purchasedBy:2,reactions:[{type:"❤️",by:4,at:N-3e6},{type:"😘",by:3,at:N-2e6}],comments:[{id:1,by:4,text:"Thank you Dad!! 🙌",at:N-3600000,type:"text"}],createdAt:N-172800000,purchasedAt:N-86400000},
  {id:3,forId:1,addedBy:2,name:"Silk Scarf",note:"Burgundy or navy",store:"Nordstrom, 500 Michigan Ave",category:"clothes",price:42.00,recurrence:"none",color:"#D44F8A",image:null,video:null,purchased:false,purchasedBy:null,reactions:[],comments:[],createdAt:N-43200000},
  {id:4,forId:2,addedBy:1,name:"Milk & Bread",note:"Full-fat milk please",store:"Whole Foods",category:"groceries",price:12.40,recurrence:"weekly",color:"#3DAD6A",image:null,video:null,purchased:true,purchasedBy:1,reactions:[],comments:[],createdAt:N-259200000,purchasedAt:N-200000000},
  {id:5,forId:1,addedBy:1,name:"Hand Cream",note:"Neutrogena",store:"Boots",category:"beauty",price:8.99,recurrence:"monthly",color:"#D44FA8",image:null,video:null,purchased:true,purchasedBy:1,reactions:[{type:"🥰",by:3,at:N-100000}],comments:[],createdAt:N-302400000,purchasedAt:N-250000000},
];
const SEED_CHAT = [
  {id:1,by:1,text:"Hey everyone, going to the shops later 🛒",at:N-7200000,type:"text"},
  {id:2,by:4,text:"Can you grab my football boots?? 🙏",at:N-7000000,type:"text"},
  {id:3,by:2,text:"Already on the list Liam 👍",at:N-6800000,type:"text"},
];

/* ═══ HELPERS ═══════════════════════════════════════════════════════════ */
function timeAgo(ts){if(!ts)return"";const s=Math.floor((Date.now()-ts)/1000);if(s<60)return"just now";if(s<3600)return`${Math.floor(s/60)}m ago`;if(s<86400)return`${Math.floor(s/3600)}h ago`;return`${Math.floor(s/86400)}d ago`;}
function hexToRgb(hex){return`${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;}

/* ═══ MINI COMPONENTS ════════════════════════════════════════════════════ */
const Lbl=({children,T,style={}})=><div style={{fontSize:10,letterSpacing:2.5,color:T.dim,textTransform:"uppercase",fontWeight:700,marginBottom:10,...style}}>{children}</div>;
const Toggle=({on,onToggle,color,T})=><button onClick={onToggle} style={{width:46,height:26,borderRadius:13,background:on?color:T.border2,border:"none",cursor:"pointer",position:"relative",transition:"background 0.25s",flexShrink:0}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:on?23:3,transition:"left 0.25s",boxShadow:"0 1px 5px rgba(0,0,0,0.25)"}}/></button>;

function ColourPicker({value,onChange,T}){
  return <div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>{COLOUR_SWATCHES.map(c=><button key={c} onClick={()=>onChange(c)} style={{width:28,height:28,borderRadius:"50%",background:c,border:value===c?"3px solid #fff":"3px solid transparent",cursor:"pointer",boxShadow:value===c?`0 0 0 2px ${c}`:"none",transform:value===c?"scale(1.2)":"scale(1)",transition:"all 0.14s"}}/>)}</div>
    <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:12,color:T.sub}}>Custom:</span><input type="color" value={value} onChange={e=>onChange(e.target.value)} style={{width:32,height:32,borderRadius:8,border:`1px solid ${T.border2}`,cursor:"pointer",padding:2,background:"transparent"}}/><span style={{fontSize:12,color:T.sub,fontFamily:"monospace"}}>{value}</span></div>
  </div>;
}

function Av({p,size=44,badge=0,onClick,ring=false,T}){
  if(!p)return null;const color=p.pageColor||T.accent;
  return <div onClick={onClick} style={{position:"relative",width:size,height:size,flexShrink:0,cursor:onClick?"pointer":"default"}}>
    {p.photo?<img src={p.photo} alt={p.name} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",border:`2.5px solid ${ring?color:"transparent"}`}}/>:<div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color}40,${color}18)`,border:`2.5px solid ${color}60`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,color,fontFamily:"'Playfair Display',serif",fontWeight:600,userSelect:"none"}}>{p.name?.[0]||"?"}</div>}
    {badge>0&&<div style={{position:"absolute",top:-3,right:-3,minWidth:17,height:17,borderRadius:9,background:"#E07080",border:`2px solid ${T.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:700,padding:"0 4px",animation:"floatBadge 0.3s ease"}}>{badge>9?"9+":badge}</div>}
  </div>;
}

function AudioPlayer({src,T,color}){
  const [playing,setPlaying]=useState(false);const [prog,setProg]=useState(0);const [dur,setDur]=useState(0);const aRef=useRef();
  useEffect(()=>{const a=aRef.current;if(!a)return;const t=()=>setProg(a.currentTime/a.duration*100||0);const m=()=>setDur(Math.round(a.duration||0));const e=()=>{setPlaying(false);setProg(0);};a.addEventListener("timeupdate",t);a.addEventListener("loadedmetadata",m);a.addEventListener("ended",e);return()=>{a.removeEventListener("timeupdate",t);a.removeEventListener("loadedmetadata",m);a.removeEventListener("ended",e);};},[]);
  const toggle=()=>{const a=aRef.current;if(!a)return;playing?a.pause():a.play();setPlaying(!playing);};
  const fmtT=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  return <div style={{display:"flex",alignItems:"center",gap:10,background:`${color}18`,borderRadius:24,padding:"8px 14px",border:`1px solid ${color}35`,minWidth:160}}>
    <audio ref={aRef} src={src}/>
    <button onClick={toggle} style={{width:32,height:32,borderRadius:"50%",background:color,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",flexShrink:0}}>{playing?"⏸":"▶"}</button>
    {playing&&<div style={{display:"flex",gap:2,alignItems:"center",height:20}}>{[0,1,2,3,4].map(i=><div key={i} className="wav" style={{width:3,height:16,background:color,borderRadius:2,animationDelay:`${i*0.1}s`,transformOrigin:"bottom"}}/>)}</div>}
    <div style={{flex:1}}><div style={{height:3,background:`${color}28`,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${prog}%`,background:color,borderRadius:4,transition:"width 0.1s"}}/></div></div>
    <span style={{fontSize:11,color:T.sub,whiteSpace:"nowrap"}}>{fmtT(dur)}</span>
  </div>;
}

function AudioRecorder({onSend,onCancel,T,color}){
  const [state,setState]=useState("idle");const [secs,setSecs]=useState(0);const [url,setUrl]=useState(null);
  const mrRef=useRef();const timerRef=useRef();const chunks=useRef([]);
  const fmtT=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const start=async()=>{try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});const mr=new MediaRecorder(stream);mrRef.current=mr;chunks.current=[];mr.ondataavailable=e=>chunks.current.push(e.data);mr.onstop=()=>{const blob=new Blob(chunks.current,{type:"audio/webm"});setUrl(URL.createObjectURL(blob));setState("preview");stream.getTracks().forEach(t=>t.stop());};mr.start();setState("recording");setSecs(0);timerRef.current=setInterval(()=>setSecs(s=>s+1),1000);}catch{alert("Microphone access needed");}};
  const stop=()=>{clearInterval(timerRef.current);mrRef.current?.stop();};
  const cancel=()=>{clearInterval(timerRef.current);mrRef.current?.stop();setState("idle");onCancel();};
  if(state==="idle")return <button onClick={start} style={{display:"flex",alignItems:"center",gap:6,background:`${color}18`,border:`1px solid ${color}40`,borderRadius:20,padding:"8px 14px",cursor:"pointer",fontSize:13,color,fontWeight:600}}>🎙 Voice</button>;
  if(state==="recording")return <div style={{display:"flex",alignItems:"center",gap:10,background:`${color}15`,borderRadius:24,padding:"8px 14px",border:`1px solid ${color}40`}}>
    <div className="rec" style={{width:10,height:10,borderRadius:"50%",background:"#E05050",flexShrink:0}}/>
    <span style={{fontSize:13,color:T.text,fontWeight:600}}>{fmtT(secs)}</span>
    <div style={{display:"flex",gap:2}}>{[0,1,2,3].map(i=><div key={i} className="wav" style={{width:3,height:14,background:color,borderRadius:2,animationDelay:`${i*0.12}s`,transformOrigin:"bottom"}}/>)}</div>
    <button onClick={stop} style={{background:color,border:"none",borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:12,color:"#fff",fontWeight:700}}>Stop</button>
    <button onClick={cancel} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:18,color:T.dim}}>✕</button>
  </div>;
  return <div style={{display:"flex",flexDirection:"column",gap:8}}>
    <AudioPlayer src={url} T={T} color={color}/>
    <div style={{display:"flex",gap:8}}>
      <button onClick={cancel} style={{flex:1,background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:11,padding:"8px 0",cursor:"pointer",fontSize:13,color:T.sub}}>Discard</button>
      <button onClick={()=>onSend(url)} style={{flex:2,background:color,border:"none",borderRadius:11,padding:"8px 0",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700}}>Send Voice</button>
    </div>
  </div>;
}

function MediaCapture({onCapture,onCancel,T,color,label="Add Media"}){
  const [mode,setMode]=useState("choose");const [stream,setStream]=useState(null);const [mType,setMType]=useState("photo");const [recording,setRecording]=useState(false);const [captured,setCaptured]=useState(null);const [recSecs,setRecSecs]=useState(0);
  const vRef=useRef();const cRef=useRef();const mrRef=useRef();const chunks=useRef([]);const timerRef=useRef();const fileRef=useRef();
  const stopStream=()=>{if(stream)stream.getTracks().forEach(t=>t.stop());setStream(null);};
  const openCam=async(type)=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:type==="video"});setStream(s);setMType(type);setMode("camera");setTimeout(()=>{if(vRef.current){vRef.current.srcObject=s;vRef.current.play();}},100);}catch{alert("Camera access needed");setMode("choose");}};
  const snap=()=>{const v=vRef.current,c=cRef.current;if(!v||!c)return;c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);stopStream();setCaptured({type:"photo",url:c.toDataURL("image/jpeg",0.85)});setMode("preview");};
  const startRec=()=>{if(!stream)return;chunks.current=[];const mr=new MediaRecorder(stream);mrRef.current=mr;mr.ondataavailable=e=>chunks.current.push(e.data);mr.onstop=()=>{const blob=new Blob(chunks.current,{type:"video/webm"});stopStream();setCaptured({type:"video",url:URL.createObjectURL(blob)});setMode("preview");};mr.start();setRecording(true);setRecSecs(0);timerRef.current=setInterval(()=>setRecSecs(s=>s+1),1000);};
  const stopRec=()=>{clearInterval(timerRef.current);mrRef.current?.stop();setRecording(false);};
  const handleFile=e=>{const f=e.target.files[0];if(!f)return;setCaptured({type:f.type.startsWith("video")?"video":"photo",url:URL.createObjectURL(f)});setMode("preview");};
  useEffect(()=>()=>{stopStream();clearInterval(timerRef.current);},[]);
  const fmtT=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  if(mode==="choose")return <div style={{background:T.bgAlt,borderRadius:18,padding:20,border:`1px solid ${T.border}`}}>
    <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:14}}>{label}</div>
    <div style={{display:"flex",gap:10}}>
      {[["📸","Photo","photo"],["🎥","Video","video"],["🖼","File","file"]].map(([icon,lbl,act])=>(
        <button key={act} onClick={()=>act==="file"?fileRef.current.click():openCam(act)} style={{flex:1,background:T.card,border:`1px solid ${T.border2}`,borderRadius:14,padding:"12px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
          <span style={{fontSize:22}}>{icon}</span><span style={{fontSize:12,color:T.sub}}>{lbl}</span>
        </button>
      ))}
      <input ref={fileRef} type="file" accept="image/*,video/*" style={{display:"none"}} onChange={handleFile}/>
    </div>
    <button onClick={onCancel} style={{width:"100%",background:"transparent",border:"none",padding:"10px 0 2px",cursor:"pointer",fontSize:13,color:T.dim}}>Cancel</button>
  </div>;
  if(mode==="camera")return <div style={{borderRadius:18,overflow:"hidden",border:`1px solid ${T.border}`,position:"relative"}}>
    <video ref={vRef} style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"}} playsInline muted/>
    <canvas ref={cRef} style={{display:"none"}}/>
    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px 16px",background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <button onClick={()=>{stopStream();setMode("choose");}} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:20,padding:"7px 14px",cursor:"pointer",color:"#fff",fontSize:13}}>✕</button>
      {mType==="photo"?<button onClick={snap} style={{width:52,height:52,borderRadius:"50%",background:"#fff",border:"4px solid rgba(255,255,255,0.5)",cursor:"pointer",fontSize:22}}>📸</button>
      :<button onClick={recording?stopRec:startRec} style={{width:52,height:52,borderRadius:"50%",background:recording?"#E05050":"#fff",border:"4px solid rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
        {recording?<><div className="rec" style={{width:10,height:10,borderRadius:"50%",background:"#fff"}}/><span style={{color:"#fff",fontSize:12,fontWeight:700}}>{fmtT(recSecs)}</span></>:<span style={{fontSize:22}}>🎥</span>}
      </button>}
      <div style={{width:40}}/>
    </div>
  </div>;
  return <div style={{borderRadius:18,overflow:"hidden",border:`1px solid ${T.border}`}}>
    {captured?.type==="photo"?<img src={captured.url} style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"}}/>:<video src={captured?.url} controls style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"}}/>}
    <div style={{display:"flex",gap:10,padding:12,background:T.card}}>
      <button onClick={()=>{setCaptured(null);setMode("choose");stopStream();}} style={{flex:1,background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:11,padding:"9px 0",cursor:"pointer",fontSize:13,color:T.sub}}>Retake</button>
      <button onClick={()=>{onCapture(captured);stopStream();}} style={{flex:2,background:color,border:"none",borderRadius:11,padding:"9px 0",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700}}>Use This</button>
    </div>
  </div>;
}

function DonutChart({segments,total,centerLabel,centerSub,size=180}){
  const R=70,C=size/2,circ=2*Math.PI*R;let offset=0;
  const slices=segments.filter(s=>s.value>0).map(s=>{const dash=s.value/total*circ;const gap=circ-dash;const sl={...s,dash,gap,offset};offset+=dash;return sl;});
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    <circle cx={C} cy={C} r={R} fill="none" stroke="#E0E8FF" strokeWidth={22}/>
    {slices.map((s,i)=><circle key={i} cx={C} cy={C} r={R} fill="none" stroke={s.color} strokeWidth={22} strokeDasharray={`${s.dash} ${s.gap}`} strokeDashoffset={-s.offset} style={{transform:`rotate(-90deg)`,transformOrigin:`${C}px ${C}px`}}/>)}
    <text x={C} y={C-8} textAnchor="middle" fontSize={20} fontWeight={700} fill="#0D1B3E" fontFamily="'Playfair Display',serif">{centerLabel}</text>
    <text x={C} y={C+14} textAnchor="middle" fontSize={11} fill="#5A6E9A" fontFamily="'Inter',sans-serif">{centerSub}</text>
  </svg>;
}

function QRCode({name,color,T}){
  const pat=[[1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],[1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],[1,0,1,1,1,0,1,0,1,0,0,0,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],[1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,1],[0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0],[1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1],[0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1],[1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0],[1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,1],[1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,0,1],[1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,1,0],[1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1]];
  return <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
    <div style={{background:T.card,borderRadius:16,padding:16,border:`1px solid ${T.border}`}}><svg width={120} height={120} viewBox="0 0 17 17">{pat.map((row,r)=>row.map((cell,c)=>cell?<rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={color}/>:null))}</svg></div>
    <div style={{fontSize:13,color:T.sub,textAlign:"center"}}>Scan to add <strong style={{color:T.text}}>{name||"member"}</strong></div>
  </div>;
}

/* ═══ ITEM ROW ══════════════════════════════════════════════════════════ */
function ItemRow({it,T,gp,onClick,onReact,activeId,showFor=false,currSym="$",tripMode=false,onTripTick}){
  const cat=catById(it.category);
  const rCount=REACTIONS.reduce((a,r)=>{a[r]=it.reactions.filter(x=>x.type===r).length;return a},{});
  const recur=RECUR_OPTS.find(r=>r.id===it.recurrence);
  return <div className="card" onClick={tripMode?undefined:onClick} style={{background:T.card,borderRadius:16,marginBottom:10,overflow:"hidden",border:tripMode&&it.tripTicked?`2px solid ${T.success}`:`1px solid ${T.border}`,cursor:tripMode?"default":"pointer",boxShadow:`0 3px 12px ${T.shadow}`,opacity:tripMode&&it.tripTicked?0.6:1,transition:"all 0.2s"}}>
    <div style={{height:3,background:it.purchased?T.success:it.color}}/>
    <div style={{padding:14,display:"flex",gap:12}}>
      {tripMode?<button onClick={()=>onTripTick(it.id)} className={it.tripTicked?"chk":""} style={{width:44,height:44,borderRadius:12,background:it.tripTicked?T.success:T.bgAlt,border:`2px solid ${it.tripTicked?T.success:T.border2}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,transition:"all 0.2s"}}>{it.tripTicked?"✓":"○"}</button>
      :(it.image||it.video)?it.video?<video src={it.video} style={{width:54,height:54,borderRadius:11,objectFit:"cover",flexShrink:0}}/>:<img src={it.image} style={{width:54,height:54,borderRadius:11,objectFit:"cover",flexShrink:0}}/>
      :<div style={{width:54,height:54,borderRadius:11,background:`${it.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{cat.icon}</div>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{fontSize:14,fontWeight:700,color:(it.purchased||it.tripTicked)?T.dim:T.text,textDecoration:(it.purchased||it.tripTicked)?"line-through":"none",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginRight:8}}>{it.name}</div>
          {it.purchased?<div style={{fontSize:10,color:T.success,background:`${T.success}18`,padding:"3px 8px",borderRadius:5,flexShrink:0,fontWeight:700}}>BOUGHT</div>:it.price>0&&<div style={{fontSize:11,color:T.gold,fontWeight:700,flexShrink:0}}>{fmt(it.price,currSym)}</div>}
        </div>
        <div style={{display:"flex",gap:5,marginTop:4,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,background:`${cat.color}18`,color:cat.color,borderRadius:5,padding:"1px 6px",fontWeight:600,whiteSpace:"nowrap"}}>{cat.icon} {cat.label}</span>
          {recur&&recur.id!=="none"&&<span style={{fontSize:10,background:`${T.blue3}18`,color:T.blue3,borderRadius:5,padding:"1px 6px",fontWeight:600}}>🔁 {recur.label}</span>}
          {showFor&&gp(it.forId)&&<span style={{fontSize:10,color:T.sub}}>for {gp(it.forId).name}</span>}
          {it.store&&<span style={{fontSize:10,color:T.dim,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>📍 {it.store.split(",")[0]}</span>}
        </div>
        {!tripMode&&<div style={{display:"flex",gap:5,marginTop:7,alignItems:"center"}}>
          {REACTIONS.filter(r=>rCount[r]>0).map(r=><span key={r} onClick={e=>{e.stopPropagation();onReact(it.id,r,activeId);}} style={{fontSize:11,background:T.bgAlt,borderRadius:18,padding:"2px 7px",cursor:"pointer",color:T.sub}}>{r} {rCount[r]}</span>)}
          {it.comments.length>0&&<span style={{fontSize:11,color:T.dim,marginLeft:"auto"}}>💬 {it.comments.length}</span>}
        </div>}
      </div>
    </div>
  </div>;
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════════════ */
export default function App(){
  const [dark,setDark]=useState(false);
  const [family,setFamily]=useState(SEED_FAMILY);
  const [profiles,setProfiles]=useState(SEED_PROFILES);
  const [items,setItems]=useState(SEED_ITEMS);
  const [chat,setChat]=useState(SEED_CHAT);
  const [view,setView]=useState("family");
  const [activeId,setActiveId]=useState(null);
  const [selItemId,setSelItemId]=useState(null);
  const [editItemId,setEditItemId]=useState(null);
  const [commentText,setCommentText]=useState("");
  const [chatText,setChatText]=useState("");
  const [showAudio,setShowAudio]=useState(null);
  const [showChatAudio,setShowChatAudio]=useState(false);
  const [showMedia,setShowMedia]=useState(null);
  const [tab,setTab]=useState("for");
  const [catFilter,setCatFilter]=useState("all");
  const [inviteStep,setInviteStep]=useState("method");
  const [inviteData,setInviteData]=useState({name:"",role:"",phone:"",email:"",pageColor:"#3D6FD4"});
  const [showInvite,setShowInvite]=useState(false);
  const [editColorFor,setEditColorFor]=useState(null);
  const [spendMonth,setSpendMonth]=useState(new Date().getMonth());
  const [spendYear,setSpendYear]=useState(new Date().getFullYear());
  const [iForm,setIForm]=useState({name:"",note:"",store:"",category:"other",price:"",recurrence:"none",color:"#3D6FD4",image:null,video:null,forId:null,isPrivate:false});
  const [tripMode,setTripMode]=useState(false);
  const [shareModal,setShareModal]=useState(null); // profileId
  const [currSearch,setCurrSearch]=useState("");
  const chatEndRef=useRef();

  const T=mkTheme(family.accentColor,dark);
  const bannerRef=useRef();const familyLogoRef=useRef();const memPhotoRef=useRef();const itemImgRef=useRef();

  const ap=profiles.find(p=>p.id===activeId);
  const si=items.find(i=>i.id===selItemId);
  const gp=id=>profiles.find(p=>p.id===id);
  const unread=pid=>(gp(pid)?.notifications||[]).filter(n=>!n.read).length;
  const boughtItems=items.filter(i=>i.purchased).sort((a,b)=>(b.purchasedAt||0)-(a.purchasedAt||0));
  const currSym=currByCode(family.currency||"USD").symbol;
  const fmtMoney=n=>fmt(n,currSym);
  const fileToUrl=(file,cb)=>{const r=new FileReader();r.onload=ev=>cb(ev.target.result);r.readAsDataURL(file);};

  const spendingItems=items.filter(it=>{if(!it.purchased||!it.purchasedAt)return false;const d=new Date(it.purchasedAt);return d.getMonth()===spendMonth&&d.getFullYear()===spendYear;});
  const monthTotal=spendingItems.reduce((s,it)=>s+(parseFloat(it.price)||0),0);
  const catSpend=CATEGORIES.map(cat=>({...cat,total:spendingItems.filter(it=>it.category===cat.id).reduce((s,it)=>s+(parseFloat(it.price)||0),0)})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);

  const notify=(toId,msg)=>setProfiles(ps=>ps.map(p=>p.id===toId?{...p,notifications:[{id:Date.now(),msg,read:false,at:Date.now()},...(p.notifications||[])]}:p));
  const markBought=(itemId,byId)=>{const it=items.find(i=>i.id===itemId);if(!it||it.purchased)return;setItems(is=>is.map(i=>i.id===itemId?{...i,purchased:true,purchasedBy:byId,purchasedAt:Date.now()}:i));notify(it.forId,`${gp(byId)?.name} bought "${it.name}" for you! 🛍️`);};
  const unmark=id=>setItems(is=>is.map(i=>i.id===id?{...i,purchased:false,purchasedBy:null,purchasedAt:null}:i));
  const react=(itemId,emoji,byId)=>{if(!byId)return;setItems(is=>is.map(i=>{if(i.id!==itemId)return i;const has=i.reactions.find(r=>r.by===byId&&r.type===emoji);return{...i,reactions:has?i.reactions.filter(r=>!(r.by===byId&&r.type===emoji)):[...i.reactions,{type:emoji,by:byId,at:Date.now()}]};}));const it=items.find(i=>i.id===itemId);if(it&&it.forId!==byId)notify(it.forId,`${gp(byId)?.name} reacted ${emoji} to "${it.name}"`);};
  const addTextComment=(itemId,byId,text)=>{if(!text.trim()||!byId)return;setItems(is=>is.map(i=>i.id===itemId?{...i,comments:[...i.comments,{id:Date.now(),by:byId,text:text.trim(),at:Date.now(),type:"text"}]}:i));const it=items.find(i=>i.id===itemId);if(it&&it.forId!==byId)notify(it.forId,`${gp(byId)?.name} commented on "${it.name}"`);setCommentText("");};
  const addAudioComment=(itemId,byId,url)=>{if(!byId)return;setItems(is=>is.map(i=>i.id===itemId?{...i,comments:[...i.comments,{id:Date.now(),by:byId,audioUrl:url,at:Date.now(),type:"audio"}]}:i));setShowAudio(null);};
  const addMediaComment=(itemId,byId,media)=>{if(!byId)return;setItems(is=>is.map(i=>i.id===itemId?{...i,comments:[...i.comments,{id:Date.now(),by:byId,mediaUrl:media.url,mediaType:media.type,at:Date.now(),type:"media"}]}:i));setShowMedia(null);};
  const handleMediaCapture=(media)=>{if(!showMedia||!activeId)return;if(showMedia.target==="item"){setIForm(f=>({...f,image:media.type==="photo"?media.url:null,video:media.type==="video"?media.url:null}));setShowMedia(null);}else addMediaComment(showMedia.itemId,activeId,media);};
  const saveItem=()=>{if(!iForm.name.trim()||!iForm.forId)return;const data={...iForm,price:parseFloat(iForm.price)||0};if(editItemId){setItems(is=>is.map(i=>i.id===editItemId?{...i,...data}:i));}else{const ni={id:Date.now(),...data,addedBy:activeId,purchased:false,purchasedBy:null,reactions:[],comments:[],createdAt:Date.now(),tripTicked:false};setItems(is=>[...is,ni]);if(data.forId!==activeId)notify(data.forId,`${gp(activeId)?.name} added "${data.name}" to your wishlist`);}setView("member");setEditItemId(null);};
  const dismissNotifs=pid=>setProfiles(ps=>ps.map(p=>p.id===pid?{...p,notifications:p.notifications.map(n=>({...n,read:true}))}:p));
  const canSee=forId=>{const o=gp(forId);return!o?.isPrivate||forId===activeId;};
  const tripTick=id=>setItems(is=>is.map(i=>i.id===id?{...i,tripTicked:!i.tripTicked}:i));
  const endTrip=()=>{items.filter(i=>i.tripTicked&&!i.purchased&&activeId).forEach(it=>markBought(it.id,activeId));setItems(is=>is.map(i=>({...i,tripTicked:false})));setTripMode(false);};

  /* Chat helpers */
  const sendChatText=()=>{if(!chatText.trim()||!activeId)return;setChat(c=>[...c,{id:Date.now(),by:activeId,text:chatText.trim(),at:Date.now(),type:"text"}]);setChatText("");setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:"smooth"}),80);};
  const sendChatAudio=url=>{if(!activeId)return;setChat(c=>[...c,{id:Date.now(),by:activeId,audioUrl:url,at:Date.now(),type:"audio"}]);setShowChatAudio(false);setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:"smooth"}),80);};

  /* Wishlist share text */
  const buildShareText=pid=>{const p=gp(pid);const pItems=items.filter(i=>i.forId===pid&&!i.purchased);if(!pItems.length)return`${p?.name} has no pending wishlist items right now! 🎉`;return`🧺 ${p?.name}'s Wishlist — The Blue Basket\n\n${pItems.map(it=>{const cat=catById(it.category);return`${cat.icon} ${it.name}${it.price?` (${fmtMoney(it.price)})`:""}\n${it.store?`   📍 ${it.store}`:""}${it.note?`\n   💬 ${it.note}`:""}`}).join("\n\n")}\n\n— Shared from The Blue Basket 🧺`;};

  const shell=ch=><div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:T.ff,maxWidth:480,margin:"0 auto",overflowX:"hidden",position:"relative"}}><GStyles dark={dark}/>{ch}</div>;
  const MediaOverlay=()=>showMedia?<div style={{position:"fixed",inset:0,background:T.overlay,zIndex:500,display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)"}} onClick={()=>setShowMedia(null)}><div onClick={e=>e.stopPropagation()} style={{background:T.card,borderRadius:"24px 24px 0 0",padding:20,width:"100%",maxWidth:480,margin:"0 auto",borderTop:`1px solid ${T.border}`}}><MediaCapture onCapture={handleMediaCapture} onCancel={()=>setShowMedia(null)} T={T} color={T.accent}/></div></div>:null;

  const Nav=()=><div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:dark?"rgba(13,17,23,0.97)":"rgba(238,244,255,0.97)",backdropFilter:"blur(16px)",borderTop:`1px solid ${T.border}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,8px)"}}>
    {[{id:"family",icon:"🏠",lbl:"Home"},{id:"member",icon:"👤",lbl:"Profile",needs:true},{id:"chat",icon:"💬",lbl:"Chat"},{id:"bought",icon:"🛍️",lbl:"Bought"},{id:"spending",icon:"📊",lbl:"Spending"},{id:"settings",icon:"⚙️",lbl:"Settings"}].map(n=>(
      <button key={n.id} onClick={()=>{if(n.needs&&!activeId)return;setView(n.id);}} style={{flex:1,background:"transparent",border:"none",padding:"10px 0 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,opacity:n.needs&&!activeId?0.3:1,position:"relative"}}>
        <span style={{fontSize:17}}>{n.icon}</span>
        <span style={{fontSize:9,fontWeight:700,color:view===n.id?T.accent:T.dim,letterSpacing:0.3}}>{n.lbl}</span>
        {view===n.id&&<div style={{position:"absolute",bottom:0,width:20,height:2,borderRadius:2,background:T.accent}}/>}
      </button>
    ))}
  </div>;

  /* ═══ FAMILY HOME ══════════════════════════════════════════════════════ */
  if(view==="family") return shell(<>
    <MediaOverlay/>
    <div className="fu" style={{paddingBottom:85}}>
      <div style={{position:"relative",width:"100%"}}>
        <div onClick={()=>bannerRef.current.click()} style={{width:"100%",height:180,background:family.banner?`url(${family.banner}) center/cover no-repeat`:`linear-gradient(135deg,${T.blue1} 0%,${T.blue2} 40%,${T.blue3} 70%,${T.blue4} 100%)`,cursor:"pointer",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-60%)",textAlign:"center",pointerEvents:"none",zIndex:2}}>
            <div style={{fontSize:28,marginBottom:6}}>🧺</div>
            <div style={{fontSize:26,fontFamily:"'Playfair Display',serif",fontWeight:700,color:"rgba(255,255,255,0.88)",letterSpacing:0.5,textShadow:"0 2px 14px rgba(0,0,0,0.4)",whiteSpace:"nowrap"}}>The Blue Basket</div>
            {!family.banner&&<div style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",marginTop:10,fontFamily:"'Inter',sans-serif"}}>Tap to set banner photo</div>}
          </div>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 50%,rgba(0,0,0,0.55) 100%)"}}/>
          <div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.4)",borderRadius:20,padding:"5px 10px",fontSize:11,color:"#fff",backdropFilter:"blur(4px)"}}>✎ Banner</div>
          <button onClick={e=>{e.stopPropagation();setDark(d=>!d);}} style={{position:"absolute",top:12,left:12,background:"rgba(0,0,0,0.4)",border:"none",borderRadius:20,padding:"6px 10px",cursor:"pointer",fontSize:16,backdropFilter:"blur(4px)"}}>{dark?"☀️":"🌙"}</button>
          <input ref={bannerRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&fileToUrl(e.target.files[0],url=>setFamily(f=>({...f,banner:url})))}/>
        </div>
        <div style={{padding:"0 20px",marginTop:-36,position:"relative",zIndex:10,display:"flex",alignItems:"flex-end",gap:14}}>
          <div style={{position:"relative",flexShrink:0,cursor:"pointer"}} onClick={()=>familyLogoRef.current.click()}>
            {family.photo?<img src={family.photo} style={{width:72,height:72,borderRadius:18,objectFit:"cover",border:`3px solid ${T.card}`,boxShadow:`0 4px 14px ${T.shadow}`}}/>:<div style={{width:72,height:72,borderRadius:18,background:`linear-gradient(135deg,${T.accent},${T.blue3})`,border:`3px solid ${T.card}`,boxShadow:`0 4px 14px ${T.shadow}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🏡</div>}
            <div style={{position:"absolute",bottom:-3,right:-3,width:20,height:20,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",border:`2px solid ${T.card}`}}>✎</div>
            <input ref={familyLogoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&fileToUrl(e.target.files[0],url=>setFamily(f=>({...f,photo:url})))}/>
          </div>
          <div style={{paddingBottom:8,flex:1,minWidth:0}}>
            <div style={{fontSize:20,fontFamily:T.serif,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{family.name}</div>
            <div style={{fontSize:11,color:T.accent,fontWeight:600,marginTop:2,fontStyle:"italic",letterSpacing:0.3}}>Our Little Home 🏡</div>
            <div style={{fontSize:11,color:T.sub,marginTop:2}}>{profiles.length} members · {items.length} items</div>
          </div>
        </div>
      </div>

      {/* Stats + Shopping Trip button */}
      <div style={{padding:"14px 20px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{flex:1,height:6,background:T.border,borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",width:`${items.length?(items.filter(i=>i.purchased).length/items.length*100):0}%`,background:`linear-gradient(90deg,${T.accent},${T.blue4})`,borderRadius:10,transition:"width 0.5s"}}/></div>
          <div style={{fontSize:12,color:T.sub,fontWeight:600,whiteSpace:"nowrap"}}>{items.filter(i=>i.purchased).length}/{items.length} bought</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[[boughtItems.length,"Purchased",T.success],[items.filter(i=>!i.purchased).length,"Pending",T.accent],[fmtMoney(monthTotal),"This Month",T.gold]].map(([n,l,c])=>(
            <div key={l} style={{flex:1,background:T.card,borderRadius:12,padding:"8px 6px",border:`1px solid ${T.border}`,textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:c,fontFamily:T.serif}}>{n}</div>
              <div style={{fontSize:9,color:T.sub,letterSpacing:0.5}}>{l}</div>
            </div>
          ))}
        </div>
        {/* 🛒 Shopping Trip Mode button */}
        <button onClick={()=>{setActiveId(activeId||profiles[0]?.id);setView("trip");}} style={{width:"100%",background:`linear-gradient(90deg,${T.success},#4FC88A)`,border:"none",borderRadius:14,padding:"13px 0",cursor:"pointer",fontSize:15,color:"#fff",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px rgba(${hexToRgb(T.success)},0.35)`}}>
          🛒 Start Shopping Trip
        </button>
      </div>

      {/* Category strip */}
      <div style={{padding:"18px 0 0"}}>
        <div style={{paddingLeft:20,marginBottom:10}}><Lbl T={T} style={{marginBottom:0}}>Browse by Category</Lbl></div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingLeft:20,paddingRight:20,paddingBottom:4}}>
          <button onClick={()=>{setCatFilter("all");setView("categories");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"10px 14px",cursor:"pointer",flexShrink:0,minWidth:68}}>
            <span style={{fontSize:22}}>🔍</span><span style={{fontSize:10,color:T.sub,fontWeight:600}}>All</span>
          </button>
          {CATEGORIES.map(cat=>{const cnt=items.filter(it=>it.category===cat.id).length;return <button key={cat.id} onClick={()=>{setCatFilter(cat.id);setView("categories");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"10px 12px",cursor:"pointer",flexShrink:0,minWidth:68,position:"relative"}}>
            <span style={{fontSize:22}}>{cat.icon}</span><span style={{fontSize:10,color:T.sub,fontWeight:600,whiteSpace:"nowrap"}}>{cat.label.split(" ")[0]}</span>
            {cnt>0&&<div style={{position:"absolute",top:6,right:6,width:14,height:14,borderRadius:"50%",background:cat.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:700}}>{cnt}</div>}
          </button>;})}
        </div>
      </div>

      {/* Members grid */}
      <div style={{padding:"20px 20px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <Lbl T={T} style={{marginBottom:0}}>Family Members</Lbl>
          <button onClick={()=>{setShowInvite(true);setInviteStep("method");}} className="btn" style={{background:T.accent,border:"none",borderRadius:20,padding:"6px 14px",cursor:"pointer",fontSize:12,color:"#fff",fontWeight:700}}>+ Invite</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {profiles.map((p,i)=>{
            const pc=p.pageColor||T.accent;const nb=unread(p.id);const pItems=items.filter(it=>it.forId===p.id);const pending=pItems.filter(it=>!it.purchased).length;
            return <div key={p.id} className="card pi" onClick={()=>{setActiveId(p.id);setView("member");}} style={{animationDelay:`${i*0.07}s`,background:T.card,borderRadius:20,padding:18,cursor:"pointer",border:`1px solid ${T.border}`,boxShadow:`0 4px 18px rgba(${hexToRgb(pc)},0.12)`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-14,right:-14,width:60,height:60,borderRadius:"50%",background:`${pc}12`}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <Av p={p} size={50} badge={nb} ring T={T}/>
                <button onClick={e=>{e.stopPropagation();setShareModal(p.id);}} style={{background:`${pc}18`,border:"none",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:12,color:pc}} title="Share wishlist">🔗</button>
              </div>
              <div style={{marginTop:12}}>
                <div style={{fontSize:16,fontFamily:T.serif,fontWeight:600,color:T.text,display:"flex",alignItems:"center",gap:5}}>{p.name}{p.isPrivate&&<span style={{fontSize:9,background:T.border,borderRadius:5,padding:"1px 5px",color:T.sub}}>🔒</span>}</div>
                <div style={{fontSize:11,color:T.sub,marginTop:2}}>{p.role}</div>
              </div>
              <div style={{marginTop:10,display:"flex",gap:6}}>
                <div style={{background:T.bgAlt,borderRadius:7,padding:"3px 8px",fontSize:11,color:T.sub}}>{pItems.length} items</div>
                {pending>0&&<div style={{background:`${pc}20`,borderRadius:7,padding:"3px 8px",fontSize:11,color:pc,fontWeight:700}}>{pending} pending</div>}
              </div>
            </div>;
          })}
          <div onClick={()=>{setShowInvite(true);setInviteStep("method");}} style={{background:"transparent",borderRadius:20,border:`1.5px dashed ${T.border2}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",minHeight:140}}>
            <div style={{width:36,height:36,borderRadius:"50%",border:`1.5px dashed ${T.dim}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:T.dim}}>+</div>
            <div style={{fontSize:12,color:T.dim}}>Add Member</div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div style={{padding:"22px 20px 0"}}>
        <Lbl T={T}>Recent Activity</Lbl>
        <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {[...items].sort((a,b)=>b.createdAt-a.createdAt).slice(0,5).map((it,i,arr)=>{
            const fp=gp(it.forId),bp=gp(it.addedBy),cat=catById(it.category);
            return <div key={it.id} onClick={()=>{setActiveId(it.forId);setSelItemId(it.id);setView("item");}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",cursor:"pointer"}}>
              <span style={{fontSize:18,flexShrink:0}}>{cat.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,color:T.text,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{it.name}</div>
                <div style={{fontSize:11,color:T.sub,marginTop:1}}>for {fp?.name}{it.price?` · ${fmtMoney(it.price)}`:""}</div>
              </div>
              {it.purchased?<div style={{fontSize:10,color:T.success,background:`${T.success}18`,padding:"3px 8px",borderRadius:5,flexShrink:0,fontWeight:700}}>BOUGHT</div>:<div style={{fontSize:10,color:T.sub,whiteSpace:"nowrap"}}>{timeAgo(it.createdAt)}</div>}
            </div>;
          })}
          {items.length===0&&<div style={{padding:"28px",color:T.dim,textAlign:"center",fontSize:14}}>No items yet</div>}
        </div>
      </div>
      <div style={{height:32}}/>
    </div>
    <Nav/>

    {/* Share modal */}
    {shareModal&&(()=>{const p=gp(shareModal);const shareText=buildShareText(shareModal);return <div style={{position:"fixed",inset:0,background:T.overlay,display:"flex",alignItems:"flex-end",zIndex:400,backdropFilter:"blur(4px)"}} onClick={()=>setShareModal(null)}>
      <div onClick={e=>e.stopPropagation()} className="pi" style={{background:T.card,borderRadius:"26px 26px 0 0",padding:26,width:"100%",borderTop:`1px solid ${T.border}`,maxWidth:480,margin:"0 auto"}}>
        <div style={{fontSize:22,fontFamily:T.serif,fontWeight:700,color:T.text,marginBottom:4}}>Share {p?.name}'s Wishlist 🔗</div>
        <div style={{fontSize:13,color:T.sub,marginBottom:16}}>Share this with grandparents, friends, or anyone who wants to get them a gift!</div>
        <div style={{background:T.bgAlt,borderRadius:14,padding:16,border:`1px solid ${T.border}`,marginBottom:16,maxHeight:200,overflowY:"auto"}}>
          <pre style={{fontSize:12,color:T.text,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:T.ff}}>{shareText}</pre>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{navigator.clipboard?.writeText(shareText);setShareModal(null);}} style={{flex:1,background:T.accent,border:"none",borderRadius:13,padding:14,cursor:"pointer",fontSize:14,color:"#fff",fontWeight:700}}>📋 Copy Text</button>
          {navigator.share&&<button onClick={()=>{navigator.share({title:`${p?.name}'s Wishlist — The Blue Basket`,text:shareText}).then(()=>setShareModal(null)).catch(()=>{});}} style={{flex:1,background:T.success,border:"none",borderRadius:13,padding:14,cursor:"pointer",fontSize:14,color:"#fff",fontWeight:700}}>📤 Share</button>}
        </div>
        <button onClick={()=>setShareModal(null)} style={{width:"100%",background:"transparent",border:"none",padding:"12px 0 2px",cursor:"pointer",fontSize:14,color:T.sub}}>Cancel</button>
      </div>
    </div>;})()}

    {/* Invite modal */}
    {showInvite&&<div style={{position:"fixed",inset:0,background:T.overlay,display:"flex",alignItems:"flex-end",zIndex:400,backdropFilter:"blur(4px)"}} onClick={()=>setShowInvite(false)}>
      <div onClick={e=>e.stopPropagation()} className="pi" style={{background:T.card,borderRadius:"26px 26px 0 0",padding:26,width:"100%",borderTop:`1px solid ${T.border}`,maxWidth:480,margin:"0 auto"}}>
        {inviteStep==="method"&&<>
          <div style={{fontSize:22,fontFamily:T.serif,fontWeight:700,color:T.text,marginBottom:6}}>Add Family Member</div>
          <div style={{fontSize:13,color:T.sub,marginBottom:18}}>How would you like to invite them?</div>
          {[{icon:"📱",label:"Phone Number",desc:"Send an SMS invite",step:"phone"},{icon:"✉️",label:"Email Address",desc:"Send an email invite",step:"email"},{icon:"📷",label:"QR Code",desc:"Perfect for young children",step:"qr"}].map(opt=>(
            <button key={opt.step} onClick={()=>setInviteStep(opt.step)} className="btn" style={{width:"100%",background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:14,padding:"13px 16px",cursor:"pointer",textAlign:"left",marginBottom:9,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:24}}>{opt.icon}</span><div><div style={{fontSize:15,fontWeight:700,color:T.text}}>{opt.label}</div><div style={{fontSize:12,color:T.sub,marginTop:1}}>{opt.desc}</div></div><span style={{marginLeft:"auto",color:T.dim,fontSize:18}}>›</span>
            </button>
          ))}
          <button onClick={()=>setShowInvite(false)} style={{width:"100%",background:"transparent",border:"none",padding:"10px 0 2px",cursor:"pointer",fontSize:14,color:T.sub}}>Cancel</button>
        </>}
        {(inviteStep==="phone"||inviteStep==="email")&&<>
          <button onClick={()=>setInviteStep("method")} style={{background:"transparent",border:"none",color:T.sub,fontSize:14,cursor:"pointer",marginBottom:16,padding:0}}>← Back</button>
          <div style={{fontSize:20,fontFamily:T.serif,fontWeight:700,color:T.text,marginBottom:18}}>{inviteStep==="phone"?"Via Phone":"Via Email"}</div>
          {[["Full Name","name","text"],["Role","role","text"],[inviteStep==="phone"?"Phone Number":"Email",inviteStep==="phone"?"phone":"email",inviteStep==="phone"?"tel":"email"]].map(([ph,k,t])=>(
            <input key={k} type={t} value={inviteData[k]} onChange={e=>setInviteData(d=>({...d,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:12,padding:"12px 14px",fontSize:15,color:T.text,outline:"none",marginBottom:10}}/>
          ))}
          <Lbl T={T}>Page Colour</Lbl><ColourPicker value={inviteData.pageColor} onChange={c=>setInviteData(d=>({...d,pageColor:c}))} T={T}/>
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button onClick={()=>setShowInvite(false)} style={{flex:1,background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:13,cursor:"pointer",fontSize:14,color:T.sub}}>Cancel</button>
            <button onClick={()=>{if(!inviteData.name.trim())return;setProfiles(ps=>[...ps,{id:Date.now(),name:inviteData.name,role:inviteData.role||"Member",photo:null,pageColor:inviteData.pageColor,isPrivate:false,notifications:[]}]);setShowInvite(false);}} style={{flex:2,background:T.accent,border:"none",borderRadius:12,padding:13,cursor:"pointer",fontSize:14,color:"#fff",fontWeight:700}}>{inviteStep==="phone"?"Send SMS & Add":"Send Email & Add"}</button>
          </div>
        </>}
        {inviteStep==="qr"&&<>
          <button onClick={()=>setInviteStep("method")} style={{background:"transparent",border:"none",color:T.sub,fontSize:14,cursor:"pointer",marginBottom:16,padding:0}}>← Back</button>
          <div style={{fontSize:20,fontFamily:T.serif,fontWeight:700,color:T.text,marginBottom:6}}>QR Code Invite</div>
          <div style={{fontSize:13,color:T.sub,marginBottom:16}}>Set up their profile, then they scan to join.</div>
          {[["Full Name","name"],["Role","role"]].map(([ph,k])=><input key={k} value={inviteData[k]} onChange={e=>setInviteData(d=>({...d,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:12,padding:"12px 14px",fontSize:15,color:T.text,outline:"none",marginBottom:10}}/>)}
          <Lbl T={T}>Page Colour</Lbl><ColourPicker value={inviteData.pageColor||"#3D6FD4"} onChange={c=>setInviteData(d=>({...d,pageColor:c}))} T={T}/>
          {inviteData.name&&<div style={{marginTop:18}}><QRCode name={inviteData.name} color={inviteData.pageColor||T.accent} T={T}/></div>}
          <div style={{display:"flex",gap:10,marginTop:18}}>
            <button onClick={()=>setShowInvite(false)} style={{flex:1,background:T.bgAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:13,cursor:"pointer",fontSize:14,color:T.sub}}>Cancel</button>
            <button onClick={()=>{if(!inviteData.name.trim())return;setProfiles(ps=>[...ps,{id:Date.now(),name:inviteData.name,role:inviteData.role||"Member",photo:null,pageColor:inviteData.pageColor||T.accent,isPrivate:false,notifications:[]}]);setShowInvite(false);}} disabled={!inviteData.name.trim()} style={{flex:2,background:T.accent,border:"none",borderRadius:12,padding:13,cursor:"pointer",fontSize:14,color:"#fff",fontWeight:700,opacity:inviteData.name.trim()?1:0.5}}>Create Profile</button>
          </div>
        </>}
      </div>
    </div>}
  </>);

  /* ═══ SHOPPING TRIP MODE ═════════════════════════════════════════════════ */
  if(view==="trip"){
    const tripItems=items.filter(i=>!i.purchased);
    const ticked=tripItems.filter(i=>i.tripTicked).length;
    return shell(<>
      <div className="fu" style={{paddingBottom:90}}>
        <div style={{background:`linear-gradient(135deg,${T.success} 0%,#4FC88A 100%)`,padding:"44px 22px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <div style={{fontSize:11,letterSpacing:3,color:"rgba(255,255,255,0.7)",textTransform:"uppercase",fontWeight:700,marginBottom:4}}>Shopping Trip</div>
              <div style={{fontSize:28,fontFamily:T.serif,fontWeight:700,color:"#fff"}}>Let's Shop! 🛒</div>
            </div>
            <button onClick={()=>setView("family")} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"7px 13px",cursor:"pointer",color:"#fff",fontSize:13}}>✕ Exit</button>
          </div>
          {/* Progress */}
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:14,padding:"12px 16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.9)",fontWeight:600}}>{ticked} of {tripItems.length} items ticked</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>{tripItems.length-ticked} left</span>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,0.3)",borderRadius:8,overflow:"hidden"}}><div style={{height:"100%",width:`${tripItems.length?ticked/tripItems.length*100:0}%`,background:"#fff",borderRadius:8,transition:"width 0.3s"}}/></div>
          </div>
          {/* Who's shopping */}
          {!activeId&&<div style={{marginTop:14}}>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginBottom:8}}>Who is shopping?</div>
            <div style={{display:"flex",gap:8}}>{profiles.map(p=><button key={p.id} onClick={()=>setActiveId(p.id)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:20,padding:"6px 14px",cursor:"pointer",color:"#fff",fontSize:13,fontWeight:600}}>{p.name}</button>)}</div>
          </div>}
        </div>

        <div style={{padding:"16px 20px"}}>
          {/* Group by person */}
          {profiles.map(p=>{
            const pItems=tripItems.filter(i=>i.forId===p.id);
            if(pItems.length===0)return null;
            return <div key={p.id} style={{marginBottom:22}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <Av p={p} size={32} ring T={T}/>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{p.name}'s items</div>
                <div style={{fontSize:11,color:T.sub,marginLeft:"auto"}}>{pItems.filter(i=>i.tripTicked).length}/{pItems.length} ✓</div>
              </div>
              {pItems.map(it=><ItemRow key={it.id} it={it} T={T} gp={gp} onClick={()=>{}} onReact={react} activeId={activeId} currSym={currSym} tripMode={true} onTripTick={tripTick}/>)}
            </div>;
          })}
          {tripItems.length===0&&<div style={{textAlign:"center",padding:"44px 0",color:T.dim}}><div style={{fontSize:44,marginBottom:12}}>🎉</div><div style={{fontSize:16,fontWeight:600,color:T.text}}>All done!</div><div style={{fontSize:13,marginTop:6}}>Everything has been purchased</div></div>}
        </div>
      </div>
      {/* Finish trip button */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,padding:"12px 20px 24px",background:dark?"rgba(13,17,23,0.97)":"rgba(238,244,255,0.97)",backdropFilter:"blur(16px)",borderTop:`1px solid ${T.border}`}}>
        <button onClick={endTrip} disabled={ticked===0} style={{width:"100%",background:ticked>0?T.success:T.border,border:"none",borderRadius:14,padding:16,cursor:ticked>0?"pointer":"default",fontSize:15,color:ticked>0?"#fff":T.dim,fontWeight:700,transition:"all 0.2s"}}>
          ✓ Mark {ticked} item{ticked!==1?"s":""} as Purchased & Finish Trip
        </button>
      </div>
    </>);
  }

  /* ═══ FAMILY CHAT ════════════════════════════════════════════════════════ */
  if(view==="chat") return shell(<>
    <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
      <div style={{background:`linear-gradient(135deg,${T.blue3} 0%,${T.blue4} 100%)`,padding:"44px 22px 18px",flexShrink:0}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",fontWeight:700,marginBottom:4}}>The Blue Basket</div>
        <div style={{fontSize:26,fontFamily:T.serif,fontWeight:700,color:"#fff"}}>Family Chat 💬</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:4}}>{profiles.length} members</div>
        {/* Who am I */}
        {!activeId&&<div style={{marginTop:12}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginBottom:8}}>Chat as:</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{profiles.map(p=><button key={p.id} onClick={()=>setActiveId(p.id)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:20,padding:"5px 14px",cursor:"pointer",color:"#fff",fontSize:13,fontWeight:600}}>{p.name}</button>)}</div>
        </div>}
        {activeId&&<div style={{marginTop:10,fontSize:12,color:"rgba(255,255,255,0.75)"}}>Chatting as <strong style={{color:"#fff"}}>{ap?.name}</strong></div>}
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px"}}>
        {chat.map((msg,i)=>{
          const sender=gp(msg.by);const isMe=msg.by===activeId;const showName=!isMe&&(i===0||chat[i-1].by!==msg.by);
          return <div key={msg.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",gap:8,marginBottom:10,alignItems:"flex-end"}}>
            {!isMe&&<Av p={sender||{name:"?",photo:null}} size={30} T={T}/>}
            <div style={{maxWidth:"72%"}}>
              {showName&&<div style={{fontSize:11,color:sender?.pageColor||T.sub,fontWeight:700,marginBottom:3,paddingLeft:4}}>{sender?.name}</div>}
              <div style={{background:isMe?ap?.pageColor||T.accent:T.card,borderRadius:isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",border:isMe?"none":`1px solid ${T.border}`,boxShadow:`0 2px 8px ${T.shadow}`}}>
                {msg.type==="audio"?<AudioPlayer src={msg.audioUrl} T={T} color={isMe?"rgba(255,255,255,0.8)":sender?.pageColor||T.accent}/>
                :msg.type==="media"?msg.mediaType==="video"?<video src={msg.mediaUrl} controls style={{maxWidth:200,borderRadius:10}}/>:<img src={msg.mediaUrl} style={{maxWidth:200,borderRadius:10,display:"block"}}/>
                :<div style={{fontSize:14,color:isMe?"#fff":T.text,lineHeight:1.5}}>{msg.text}</div>}
              </div>
              <div style={{fontSize:10,color:T.dim,marginTop:3,textAlign:isMe?"right":"left",paddingLeft:4,paddingRight:4}}>{timeAgo(msg.at)}</div>
            </div>
          </div>;
        })}
        <div ref={chatEndRef}/>
      </div>

      {/* Input bar */}
      <div style={{padding:"10px 16px 24px",background:T.card,borderTop:`1px solid ${T.border}`,flexShrink:0}}>
        {showChatAudio?<AudioRecorder onSend={sendChatAudio} onCancel={()=>setShowChatAudio(false)} T={T} color={ap?.pageColor||T.accent}/>
        :<div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={chatText} onChange={e=>setChatText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChatText()} placeholder={activeId?`Message as ${ap?.name}…`:"Select a profile above to chat"} disabled={!activeId} style={{flex:1,background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:22,padding:"10px 16px",fontSize:14,color:T.text,outline:"none"}}/>
          <button onClick={()=>setShowChatAudio(true)} disabled={!activeId} style={{background:`${ap?.pageColor||T.accent}18`,border:`1px solid ${(ap?.pageColor||T.accent)}40`,borderRadius:"50%",width:38,height:38,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:activeId?1:0.4}}>🎙</button>
          <button onClick={sendChatText} disabled={!activeId||!chatText.trim()} style={{background:ap?.pageColor||T.accent,border:"none",borderRadius:"50%",width:38,height:38,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,opacity:activeId&&chatText.trim()?1:0.4}}>➤</button>
        </div>}
      </div>
    </div>
    <Nav/>
  </>);

  /* ═══ CATEGORIES ═════════════════════════════════════════════════════════ */
  if(view==="categories") return shell(<>
    <div className="fu" style={{paddingBottom:90}}>
      <div style={{background:`linear-gradient(160deg,${T.blue2} 0%,${T.blue3} 100%)`,padding:"44px 22px 24px"}}>
        <button onClick={()=>setView("family")} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"7px 13px",cursor:"pointer",color:"#fff",fontSize:13,marginBottom:16}}>← Back</button>
        <div style={{fontSize:30,fontFamily:T.serif,fontWeight:700,color:"#fff"}}>Categories</div>
        <div style={{display:"flex",gap:8,overflowX:"auto",marginTop:14,paddingBottom:4}}>
          <button onClick={()=>setCatFilter("all")} style={{background:catFilter==="all"?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)",border:"none",borderRadius:20,padding:"6px 14px",cursor:"pointer",color:"#fff",fontSize:12,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>🔍 All ({items.length})</button>
          {CATEGORIES.filter(c=>items.some(it=>it.category===c.id)).map(cat=>(
            <button key={cat.id} onClick={()=>setCatFilter(cat.id)} style={{background:catFilter===cat.id?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)",border:"none",borderRadius:20,padding:"6px 14px",cursor:"pointer",color:"#fff",fontSize:12,fontWeight:catFilter===cat.id?700:400,whiteSpace:"nowrap",flexShrink:0}}>{cat.icon} {cat.label} ({items.filter(it=>it.category===cat.id).length})</button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px 20px 20px"}}>
        {catFilter==="all"?CATEGORIES.map(cat=>{const catItems=items.filter(it=>it.category===cat.id);if(!catItems.length)return null;return <div key={cat.id} style={{marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:`${cat.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{cat.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.text}}>{cat.label}</div><div style={{fontSize:11,color:T.sub}}>{catItems.length} items · {fmtMoney(catItems.filter(i=>i.purchased).reduce((s,i)=>s+(parseFloat(i.price)||0),0))} spent</div></div>
          </div>
          {catItems.map(it=><ItemRow key={it.id} it={it} T={T} gp={gp} onClick={()=>{setActiveId(it.forId);setSelItemId(it.id);setView("item");}} onReact={react} activeId={activeId} currSym={currSym}/>)}
        </div>;}):(<>
          {(()=>{const cat=catById(catFilter);const catItems=items.filter(it=>it.category===catFilter);return <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,background:T.card,borderRadius:14,padding:14,border:`1px solid ${T.border}`}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${cat.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{cat.icon}</div>
              <div><div style={{fontSize:16,fontWeight:700,color:T.text}}>{cat.label}</div><div style={{fontSize:12,color:T.sub}}>{catItems.length} items · {fmtMoney(catItems.filter(i=>i.purchased).reduce((s,i)=>s+(parseFloat(i.price)||0),0))} spent</div></div>
            </div>
            {catItems.length===0?<div style={{textAlign:"center",padding:"44px 0",color:T.dim}}><div style={{fontSize:36,marginBottom:10}}>{cat.icon}</div><div>No {cat.label} items yet</div></div>
            :catItems.map(it=><ItemRow key={it.id} it={it} T={T} gp={gp} onClick={()=>{setActiveId(it.forId);setSelItemId(it.id);setView("item");}} onReact={react} activeId={activeId} currSym={currSym}/>)}
          </>;})()} 
        </>)}
      </div>
    </div>
    <Nav/>
  </>);

  /* ═══ SPENDING ═══════════════════════════════════════════════════════════ */
  if(view==="spending") return shell(<>
    <div className="fu" style={{paddingBottom:90}}>
      <div style={{background:`linear-gradient(160deg,${T.gold}30 0%,${T.accent}20 100%)`,padding:"44px 22px 24px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:11,letterSpacing:3,color:T.gold,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Family Finance</div>
        <div style={{fontSize:30,fontFamily:T.serif,fontWeight:700,color:T.text}}>Spending Dashboard</div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:18,background:T.card,borderRadius:14,padding:"10px 14px",border:`1px solid ${T.border}`}}>
          <button onClick={()=>{let m=spendMonth-1,y=spendYear;if(m<0){m=11;y--;}setSpendMonth(m);setSpendYear(y);}} style={{background:T.bgAlt,border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,color:T.sub}}>‹</button>
          <div style={{flex:1,textAlign:"center",fontSize:15,fontWeight:700,color:T.text}}>{MONTHS[spendMonth]} {spendYear}</div>
          <button onClick={()=>{let m=spendMonth+1,y=spendYear;if(m>11){m=0;y++;}setSpendMonth(m);setSpendYear(y);}} style={{background:T.bgAlt,border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,color:T.sub}}>›</button>
        </div>
      </div>
      <div style={{padding:"20px 20px"}}>
        <div style={{background:T.card,borderRadius:20,padding:20,border:`1px solid ${T.border}`,marginBottom:16,display:"flex",alignItems:"center",gap:20,boxShadow:`0 4px 20px ${T.shadow}`}}>
          {monthTotal>0?<DonutChart segments={catSpend.map(c=>({color:c.color,value:c.total}))} total={monthTotal} centerLabel={fmtMoney(monthTotal)} centerSub={`${MONTHS[spendMonth]} total`} size={160}/>:<div style={{width:160,height:160,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,color:T.dim}}><span style={{fontSize:36}}>📊</span><span style={{fontSize:13}}>No data</span></div>}
          <div style={{flex:1}}><div style={{fontSize:12,color:T.sub,marginBottom:4}}>Total Spent</div><div style={{fontSize:28,fontWeight:700,fontFamily:T.serif,color:T.text}}>{fmtMoney(monthTotal)}</div><div style={{fontSize:12,color:T.sub,marginTop:8}}>{spendingItems.length} purchases</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>{catSpend.length} categories</div></div>
        </div>
        {catSpend.length>0&&<><Lbl T={T}>By Category</Lbl>
          <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:16}}>
            {catSpend.map((cat,i)=>{const pct=monthTotal>0?cat.total/monthTotal*100:0;return <div key={cat.id} style={{padding:"14px 16px",borderBottom:i<catSpend.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${cat.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><span style={{fontSize:14,fontWeight:700,color:T.text}}>{cat.label}</span><span style={{fontSize:15,fontWeight:700,color:cat.color}}>{fmtMoney(cat.total)}</span></div>
                  <div style={{height:5,background:T.bgAlt,borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:cat.color,borderRadius:10,transition:"width 0.5s"}}/></div>
                </div>
                <span style={{fontSize:12,color:T.sub,minWidth:32,textAlign:"right"}}>{pct.toFixed(0)}%</span>
              </div>
              {spendingItems.filter(it=>it.category===cat.id).map(it=>{const fp=gp(it.forId);return <div key={it.id} style={{display:"flex",alignItems:"center",gap:10,paddingLeft:48,paddingBottom:4}}><div style={{fontSize:12,color:T.text,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.name}</div><div style={{fontSize:11,color:T.sub,whiteSpace:"nowrap"}}>for {fp?.name}</div><div style={{fontSize:12,fontWeight:600,color:T.text,whiteSpace:"nowrap"}}>{fmtMoney(it.price)}</div></div>;})}
            </div>;})}
          </div>
        </>}
        {profiles.some(p=>spendingItems.some(it=>it.forId===p.id))&&<><Lbl T={T}>By Family Member</Lbl>
          <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:16}}>
            {profiles.map((p,i)=>{const pItems=spendingItems.filter(it=>it.forId===p.id);const pTotal=pItems.reduce((s,it)=>s+(parseFloat(it.price)||0),0);if(!pItems.length)return null;const pc=p.pageColor||T.accent;const pct=monthTotal>0?pTotal/monthTotal*100:0;return <div key={p.id} style={{padding:"14px 16px",borderBottom:i<profiles.length-1?`1px solid ${T.border}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><Av p={p} size={36} T={T} ring/>
                <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><span style={{fontSize:14,fontWeight:700,color:T.text}}>{p.name}</span><span style={{fontSize:15,fontWeight:700,color:pc}}>{fmtMoney(pTotal)}</span></div><div style={{height:5,background:T.bgAlt,borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pc,borderRadius:10,transition:"width 0.5s"}}/></div></div>
                <span style={{fontSize:12,color:T.sub,minWidth:36,textAlign:"right"}}>{pItems.length} item{pItems.length!==1?"s":""}</span>
              </div>
            </div>;})}
          </div>
        </>}
        {spendingItems.length===0&&<div style={{textAlign:"center",padding:"50px 0",color:T.dim}}><div style={{fontSize:44,marginBottom:12}}>📊</div><div style={{fontSize:15}}>No purchases in {MONTHS[spendMonth]} {spendYear}</div><div style={{fontSize:13,marginTop:6}}>Add a price to items and mark them purchased to track spending</div></div>}
      </div>
    </div>
    <Nav/>
  </>);

  /* ═══ MEMBER PROFILE ═════════════════════════════════════════════════════ */
  if(view==="member"&&ap){
    const pc=ap.pageColor||T.accent;
    const forItems=items.filter(i=>i.forId===activeId);const byItems=items.filter(i=>i.addedBy===activeId);
    const showItems=tab==="for"?forItems:byItems;const notifs=(ap.notifications||[]).filter(n=>!n.read);
    return shell(<>
      <div className="fu" style={{paddingBottom:90}}>
        <div style={{background:`linear-gradient(160deg,${pc}28 0%,${pc}08 100%)`,padding:"44px 22px 24px",borderBottom:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
            <div style={{fontSize:10,letterSpacing:3,color:pc,textTransform:"uppercase",fontWeight:700}}>Profile</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShareModal(activeId)} style={{background:`${pc}18`,border:`1px solid ${pc}30`,borderRadius:20,padding:"6px 12px",cursor:"pointer",fontSize:12,color:pc,fontWeight:600}}>🔗 Share</button>
              <button onClick={()=>setEditColorFor(editColorFor===activeId?null:activeId)} style={{background:`${pc}18`,border:`1px solid ${pc}30`,borderRadius:20,padding:"6px 12px",cursor:"pointer",fontSize:12,color:pc,fontWeight:600}}>🎨</button>
              <button onClick={()=>{setIForm({name:"",note:"",store:"",category:"other",price:"",recurrence:"none",color:pc,image:null,video:null,forId:activeId,isPrivate:false});setEditItemId(null);setView("addItem");}} style={{background:pc,border:"none",borderRadius:20,padding:"7px 16px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700}}>+ Add</button>
            </div>
          </div>
          {editColorFor===activeId&&<div style={{background:T.card,borderRadius:14,padding:14,marginBottom:16,border:`1px solid ${T.border}`}}><Lbl T={T} style={{marginBottom:8}}>My Page Colour</Lbl><ColourPicker value={ap.pageColor||T.accent} onChange={c=>setProfiles(ps=>ps.map(p=>p.id===activeId?{...p,pageColor:c}:p))} T={T}/></div>}
          <div style={{display:"flex",alignItems:"flex-end",gap:16}}>
            <div style={{position:"relative"}}><Av p={ap} size={80} ring T={T}/>
              <button onClick={()=>memPhotoRef.current.click()} style={{position:"absolute",bottom:2,right:2,width:24,height:24,borderRadius:"50%",background:pc,border:`2px solid ${T.bg}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff"}}>✎</button>
              <input ref={memPhotoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&fileToUrl(e.target.files[0],url=>setProfiles(ps=>ps.map(p=>p.id===activeId?{...p,photo:url}:p)))}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:26,fontFamily:T.serif,fontWeight:700,color:T.text}}>{ap.name}</div>
              <div style={{fontSize:12,color:T.sub,marginTop:3}}>{ap.role}</div>
              <div style={{display:"flex",gap:16,marginTop:12}}>
                {[[forItems.length,"Items",pc],[forItems.filter(i=>i.purchased).length,"Bought",T.success],[fmtMoney(forItems.filter(i=>i.purchased).reduce((s,i)=>s+(parseFloat(i.price)||0),0)),"Spent",T.gold]].map(([n,l,c])=>(
                  <div key={l}><div style={{fontSize:18,fontWeight:700,color:c,fontFamily:T.serif}}>{n}</div><div style={{fontSize:9,color:T.sub,letterSpacing:0.8}}>{l.toUpperCase()}</div></div>
                ))}
              </div>
            </div>
          </div>
          <div style={{marginTop:16,display:"flex",alignItems:"center",justifyContent:"space-between",background:dark?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.6)",borderRadius:13,padding:"10px 14px",border:`1px solid ${T.border}`}}>
            <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>Wishlist Privacy</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>{ap.isPrivate?"Only you can see this":"Family can see your wishlist"}</div></div>
            <Toggle on={ap.isPrivate} onToggle={()=>setProfiles(ps=>ps.map(p=>p.id===activeId?{...p,isPrivate:!p.isPrivate}:p))} color={pc} T={T}/>
          </div>
        </div>
        {notifs.length>0&&<div style={{margin:"14px 22px 0",background:`${T.danger}10`,borderRadius:14,padding:14,border:`1px solid ${T.danger}25`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><Lbl T={T} style={{marginBottom:0}}>🔔 {notifs.length} New</Lbl><button onClick={()=>dismissNotifs(activeId)} style={{background:"transparent",border:"none",fontSize:11,color:T.sub,cursor:"pointer"}}>dismiss all</button></div>
          {notifs.slice(0,4).map(n=><div key={n.id} style={{padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:13,color:T.text,lineHeight:1.5,display:"flex",justifyContent:"space-between",gap:10}}><span>{n.msg}</span><span style={{color:T.dim,fontSize:11,whiteSpace:"nowrap"}}>{timeAgo(n.at)}</span></div>)}
        </div>}
        <div style={{display:"flex",margin:"16px 22px 0",background:T.card,borderRadius:12,padding:4,border:`1px solid ${T.border}`}}>
          {[["My Wishlist","for"],["Added by Me","by"]].map(([l,v])=>(<button key={v} onClick={()=>setTab(v)} style={{flex:1,background:tab===v?pc:"transparent",border:"none",borderRadius:9,padding:"9px 0",cursor:"pointer",fontSize:13,color:tab===v?"#fff":T.sub,fontWeight:tab===v?700:400,transition:"all 0.2s"}}>{l}</button>))}
        </div>
        <div style={{padding:"12px 22px 20px"}}>
          {showItems.length===0&&<div style={{textAlign:"center",padding:"44px 0",color:T.dim}}><div style={{fontSize:36,marginBottom:10}}>🛍️</div><div>Nothing here yet</div></div>}
          {showItems.map(it=>{
            if(!canSee(it.forId)&&it.addedBy!==activeId)return <div key={it.id} style={{background:T.card,borderRadius:14,marginBottom:10,padding:"14px 16px",border:`1px dashed ${T.border}`,display:"flex",alignItems:"center",gap:10}}><span>🔒</span><div style={{fontSize:13,color:T.dim}}>{gp(it.forId)?.name}'s private item</div></div>;
            return <ItemRow key={it.id} it={it} T={T} gp={gp} onClick={()=>{setSelItemId(it.id);setView("item");}} onReact={react} activeId={activeId} showFor={false} currSym={currSym}/>;
          })}
        </div>
      </div>
      <Nav/>
      {/* Share modal */}
      {shareModal===activeId&&(()=>{const shareText=buildShareText(activeId);return <div style={{position:"fixed",inset:0,background:T.overlay,display:"flex",alignItems:"flex-end",zIndex:400,backdropFilter:"blur(4px)"}} onClick={()=>setShareModal(null)}>
        <div onClick={e=>e.stopPropagation()} className="pi" style={{background:T.card,borderRadius:"26px 26px 0 0",padding:26,width:"100%",borderTop:`1px solid ${T.border}`,maxWidth:480,margin:"0 auto"}}>
          <div style={{fontSize:22,fontFamily:T.serif,fontWeight:700,color:T.text,marginBottom:4}}>Share {ap?.name}'s Wishlist 🔗</div>
          <div style={{fontSize:13,color:T.sub,marginBottom:16}}>Share this with anyone — grandparents, friends — before a birthday or Christmas! 🎄</div>
          <div style={{background:T.bgAlt,borderRadius:14,padding:16,border:`1px solid ${T.border}`,marginBottom:16,maxHeight:200,overflowY:"auto"}}><pre style={{fontSize:12,color:T.text,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:T.ff}}>{shareText}</pre></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>{navigator.clipboard?.writeText(shareText);setShareModal(null);}} style={{flex:1,background:T.accent,border:"none",borderRadius:13,padding:14,cursor:"pointer",fontSize:14,color:"#fff",fontWeight:700}}>📋 Copy</button>
            {navigator.share&&<button onClick={()=>{navigator.share({title:`${ap?.name}'s Wishlist`,text:shareText}).then(()=>setShareModal(null)).catch(()=>{});}} style={{flex:1,background:T.success,border:"none",borderRadius:13,padding:14,cursor:"pointer",fontSize:14,color:"#fff",fontWeight:700}}>📤 Share</button>}
          </div>
          <button onClick={()=>setShareModal(null)} style={{width:"100%",background:"transparent",border:"none",padding:"12px 0 2px",cursor:"pointer",fontSize:14,color:T.sub}}>Cancel</button>
        </div>
      </div>;})()}
    </>);
  }

  /* ═══ BOUGHT FEED ════════════════════════════════════════════════════════ */
  if(view==="bought") return shell(<>
    <div className="fu" style={{paddingBottom:90}}>
      <div style={{background:`linear-gradient(160deg,${T.blue2} 0%,${T.success}70 100%)`,padding:"44px 22px 24px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Community</div>
        <div style={{fontSize:30,fontFamily:T.serif,fontWeight:700,color:"#fff"}}>Bought for You 🛍️</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.7)",marginTop:6}}>{boughtItems.length} item{boughtItems.length!==1?"s":""} · {fmtMoney(boughtItems.reduce((s,it)=>s+(parseFloat(it.price)||0),0))} total</div>
      </div>
      <div style={{padding:"16px 20px"}}>
        {boughtItems.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:T.dim}}><div style={{fontSize:44,marginBottom:12}}>🎁</div><div style={{fontSize:15}}>Nothing bought yet</div></div>}
        {boughtItems.map((it,i)=>{
          const fp=gp(it.forId),bp=gp(it.purchasedBy),cat=catById(it.category);const rCount=REACTIONS.reduce((a,r)=>{a[r]=it.reactions.filter(x=>x.type===r).length;return a},{});
          return <div key={it.id} className="pi" style={{animationDelay:`${i*0.05}s`,background:T.card,borderRadius:20,marginBottom:14,overflow:"hidden",border:`1px solid ${T.border}`,boxShadow:`0 4px 20px ${T.shadow}`}}>
            <div style={{height:4,background:`linear-gradient(90deg,${it.color},${T.blue4})`}}/>
            <div style={{padding:"16px 16px 0"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                {bp&&<Av p={bp} size={34} ring T={T}/>}
                <div style={{flex:1,fontSize:13,fontWeight:700,color:T.text}}>
                  <span style={{color:bp?.pageColor||T.accent}}>{bp?.name||"Someone"}</span><span style={{color:T.sub,fontWeight:400}}> bought for </span><span style={{color:fp?.pageColor||T.accent}}>{fp?.name}</span>
                  <div style={{fontSize:11,color:T.dim,fontWeight:400,marginTop:1}}>{cat.icon} {cat.label}{it.price?` · ${fmtMoney(it.price)}`:""} · {timeAgo(it.purchasedAt||it.createdAt)}</div>
                </div>
                {fp&&<Av p={fp} size={34} ring T={T}/>}
              </div>
              <div style={{display:"flex",gap:12,marginBottom:12}}>
                {(it.image||it.video)?it.video?<video src={it.video} style={{width:64,height:64,borderRadius:13,objectFit:"cover",flexShrink:0}}/>:<img src={it.image} style={{width:64,height:64,borderRadius:13,objectFit:"cover",flexShrink:0}}/>:<div style={{width:64,height:64,borderRadius:13,background:`${it.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{cat.icon}</div>}
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:17,fontWeight:700,color:T.text,fontFamily:T.serif}}>{it.name}</div>{it.store&&<div style={{fontSize:12,color:T.sub,marginTop:4}}>📍 {it.store}</div>}{it.note&&<div style={{fontSize:12,color:T.dim,marginTop:3,fontStyle:"italic"}}>{it.note}</div>}</div>
              </div>
              <div style={{borderTop:`1px solid ${T.border}`,paddingTop:10,paddingBottom:10}}>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  {REACTIONS.map(r=>{const cnt=rCount[r];const mine=activeId&&it.reactions.find(x=>x.type===r&&x.by===activeId);return <button key={r} onClick={()=>react(it.id,r,activeId||1)} style={{fontSize:15,background:mine?`${it.color}18`:T.bgAlt,border:`1px solid ${mine?it.color:T.border}`,borderRadius:18,padding:"5px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all 0.15s"}}>{r}{cnt>0&&<span style={{fontSize:11,color:T.sub,fontWeight:600}}>{cnt}</span>}</button>;})}
                </div>
              </div>
              {it.comments.length>0&&<div style={{borderTop:`1px solid ${T.border}`,paddingTop:10,paddingBottom:4}}>
                {it.comments.map(c=>{const cp=gp(c.by);return <div key={c.id} style={{display:"flex",gap:8,marginBottom:10}}><Av p={cp||{name:"?",photo:null}} size={28} T={T}/><div style={{flex:1,background:T.bgAlt,borderRadius:11,padding:"7px 11px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,fontWeight:700,color:cp?.pageColor||T.sub}}>{cp?.name}</span><span style={{fontSize:10,color:T.dim}}>{timeAgo(c.at)}</span></div>{c.type==="audio"?<AudioPlayer src={c.audioUrl} T={T} color={cp?.pageColor||T.accent}/>:c.type==="media"?c.mediaType==="video"?<video src={c.mediaUrl} controls style={{width:"100%",borderRadius:8,maxHeight:160}}/>:<img src={c.mediaUrl} style={{width:"100%",borderRadius:8,maxHeight:160,objectFit:"cover"}}/>:<div style={{fontSize:13,color:T.text,lineHeight:1.5}}>{c.text}</div>}</div></div>;})}
              </div>}
              {activeId&&<div style={{borderTop:`1px solid ${T.border}`,paddingTop:10,paddingBottom:14}}>
                {showAudio===it.id?<AudioRecorder onSend={(url)=>addAudioComment(it.id,activeId,url)} onCancel={()=>setShowAudio(null)} T={T} color={ap?.pageColor||T.accent}/>
                :showMedia?.itemId===it.id&&showMedia.target==="comment"?<MediaCapture onCapture={handleMediaCapture} onCancel={()=>setShowMedia(null)} T={T} color={ap?.pageColor||T.accent}/>
                :<div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <Av p={ap} size={28} T={T}/>
                  <input id={`ci-${it.id}`} placeholder={`Comment as ${ap?.name}…`} onKeyDown={e=>{if(e.key==="Enter"){addTextComment(it.id,activeId,e.target.value);e.target.value="";}}} style={{flex:1,background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:18,padding:"7px 12px",fontSize:13,color:T.text,outline:"none"}}/>
                  <button onClick={()=>setShowAudio(it.id)} style={{background:`${ap?.pageColor||T.accent}18`,border:`1px solid ${(ap?.pageColor||T.accent)}40`,borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🎙</button>
                  <button onClick={()=>setShowMedia({itemId:it.id,target:"comment"})} style={{background:`${T.blue3}18`,border:`1px solid ${T.blue3}40`,borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>📷</button>
                  <button onClick={()=>{const el=document.getElementById(`ci-${it.id}`);addTextComment(it.id,activeId,el.value);el.value="";}} style={{background:T.accent,border:"none",borderRadius:18,padding:"7px 13px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700,whiteSpace:"nowrap"}}>Send</button>
                </div>}
              </div>}
            </div>
          </div>;
        })}
      </div>
    </div>
    <Nav/>
  </>);

  /* ═══ ITEM DETAIL ════════════════════════════════════════════════════════ */
  if(view==="item"&&si&&ap){
    const fp=gp(si.forId),addP=gp(si.addedBy),buyP=si.purchasedBy?gp(si.purchasedBy):null;
    const cat=catById(si.category);const rCount=REACTIONS.reduce((a,r)=>{a[r]=si.reactions.filter(x=>x.type===r).length;return a},{});
    return shell(<div className="fu" style={{paddingBottom:40}}>
      <div style={{background:`linear-gradient(160deg,${si.color}22 0%,${T.bg} 100%)`,padding:"26px 22px 20px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
          <button onClick={()=>setView("member")} style={{background:dark?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.75)",border:"none",borderRadius:10,padding:"7px 13px",cursor:"pointer",color:T.sub,fontSize:13}}>← Back</button>
          <button onClick={()=>{setIForm({name:si.name,note:si.note,store:si.store,category:si.category,price:String(si.price||""),recurrence:si.recurrence||"none",color:si.color,image:si.image,video:si.video,forId:si.forId,isPrivate:si.isPrivate||false});setEditItemId(si.id);setView("addItem");}} style={{background:"transparent",border:`1px solid ${T.border2}`,borderRadius:10,padding:"7px 13px",cursor:"pointer",color:T.sub,fontSize:13}}>Edit</button>
        </div>
        <div style={{display:"flex",gap:16}}>
          {(si.image||si.video)?si.video?<video src={si.video} style={{width:80,height:80,borderRadius:16,objectFit:"cover",flexShrink:0}} controls/>:<img src={si.image} style={{width:80,height:80,borderRadius:16,objectFit:"cover",flexShrink:0}}/>:<div style={{width:80,height:80,borderRadius:16,background:`${si.color}18`,border:`1px solid ${si.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0}}>{cat.icon}</div>}
          <div><div style={{fontSize:22,fontFamily:T.serif,fontWeight:700,color:T.text,lineHeight:1.3}}>{si.name}</div>
          <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
            <span style={{fontSize:11,background:`${cat.color}20`,color:cat.color,borderRadius:6,padding:"2px 8px",fontWeight:600}}>{cat.icon} {cat.label}</span>
            {si.price>0&&<span style={{fontSize:11,background:`${T.gold}20`,color:T.gold,borderRadius:6,padding:"2px 8px",fontWeight:600}}>{fmtMoney(si.price)}</span>}
            {si.recurrence&&si.recurrence!=="none"&&<span style={{fontSize:11,background:`${T.blue3}20`,color:T.blue3,borderRadius:6,padding:"2px 8px",fontWeight:600}}>🔁 {RECUR_OPTS.find(r=>r.id===si.recurrence)?.label}</span>}
          </div>
          <div style={{fontSize:12,color:T.sub,marginTop:6}}>For <span style={{color:fp?.pageColor||T.accent,fontWeight:700}}>{fp?.name}</span> · by {addP?.name}</div></div>
        </div>
      </div>
      <div style={{padding:"16px 22px",display:"flex",flexDirection:"column",gap:11}}>
        {[[si.store,"📍 Where to buy"],[si.note,"📝 Note"]].filter(([v])=>v).map(([val,label])=>(<div key={label} style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}><Lbl T={T}>{label}</Lbl><div style={{fontSize:14,color:T.text,lineHeight:1.65}}>{val}</div></div>))}
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>Purchase Status</Lbl>
          {si.purchased?<div>
            <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:10,background:`${T.success}10`,borderRadius:11,padding:11}}><div style={{width:36,height:36,borderRadius:"50%",background:`${T.success}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✓</div><div><div style={{fontSize:14,color:T.success,fontWeight:700}}>Purchased!</div>{buyP&&<div style={{fontSize:12,color:T.sub,marginTop:1}}>by <span style={{color:buyP.pageColor||T.accent,fontWeight:700}}>{buyP.name}</span></div>}</div></div>
            <button onClick={()=>unmark(si.id)} style={{background:"transparent",border:`1px solid ${T.border2}`,borderRadius:9,padding:"7px 13px",cursor:"pointer",fontSize:12,color:T.sub}}>Unmark</button>
          </div>:<div>
            <div style={{fontSize:13,color:T.sub,marginBottom:11}}>Who is buying this?</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{profiles.map(p=><button key={p.id} onClick={()=>markBought(si.id,p.id)} className="btn" style={{display:"flex",alignItems:"center",gap:7,background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:11,padding:"7px 11px",cursor:"pointer"}}><Av p={p} size={24} T={T}/><span style={{fontSize:13,color:T.text,fontWeight:500}}>{p.name}</span></button>)}</div>
          </div>}
        </div>
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>React</Lbl>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{REACTIONS.map(r=>{const mine=si.reactions.find(x=>x.type===r&&x.by===activeId);const cnt=rCount[r];return <button key={r} onClick={()=>react(si.id,r,activeId)} style={{fontSize:17,background:mine?`${si.color}18`:T.bgAlt,border:`1px solid ${mine?si.color:T.border2}`,borderRadius:11,padding:"7px 11px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,transition:"all 0.16s"}}>{r}{cnt>0&&<span style={{fontSize:11,color:T.sub,fontWeight:600}}>{cnt}</span>}</button>;})}</div>
        </div>
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>Comments & Voice Messages</Lbl>
          {si.comments.length===0&&<div style={{fontSize:13,color:T.dim,textAlign:"center",padding:"8px 0 6px"}}>No messages yet</div>}
          {si.comments.map(c=>{const cp=gp(c.by);return <div key={c.id} style={{display:"flex",gap:9,marginBottom:12}}><Av p={cp||{name:"?",photo:null}} size={32} T={T}/><div style={{flex:1,background:T.bgAlt,borderRadius:13,padding:"9px 12px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:11,fontWeight:700,color:cp?.pageColor||T.sub}}>{cp?.name}</span><span style={{fontSize:10,color:T.dim}}>{timeAgo(c.at)}</span></div>{c.type==="audio"?<AudioPlayer src={c.audioUrl} T={T} color={cp?.pageColor||T.accent}/>:c.type==="media"?c.mediaType==="video"?<video src={c.mediaUrl} controls style={{width:"100%",borderRadius:8,maxHeight:160}}/>:<img src={c.mediaUrl} style={{width:"100%",borderRadius:8,maxHeight:160,objectFit:"cover"}}/>:<div style={{fontSize:13,color:T.text,lineHeight:1.5}}>{c.text}</div>}</div></div>;})}
          {showAudio===si.id?<div style={{marginTop:8}}><AudioRecorder onSend={(url)=>addAudioComment(si.id,activeId,url)} onCancel={()=>setShowAudio(null)} T={T} color={ap.pageColor||T.accent}/></div>
          :showMedia?.itemId===si.id&&showMedia.target==="comment"?<div style={{marginTop:8}}><MediaCapture onCapture={handleMediaCapture} onCancel={()=>setShowMedia(null)} T={T} color={ap.pageColor||T.accent}/></div>
          :<div style={{display:"flex",gap:7,marginTop:si.comments.length>0?8:0,alignItems:"center"}}><Av p={ap} size={32} T={T}/><input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTextComment(si.id,activeId,commentText)} placeholder="Write a comment…" style={{flex:1,background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:12,padding:"8px 12px",fontSize:13,color:T.text,outline:"none"}}/><button onClick={()=>setShowAudio(si.id)} style={{background:`${ap.pageColor||T.accent}18`,border:`1px solid ${(ap.pageColor||T.accent)}40`,borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🎙</button><button onClick={()=>setShowMedia({itemId:si.id,target:"comment"})} style={{background:`${T.blue3}18`,border:`1px solid ${T.blue3}40`,borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>📷</button><button onClick={()=>addTextComment(si.id,activeId,commentText)} style={{background:T.accent,border:"none",borderRadius:11,padding:"8px 13px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:700,whiteSpace:"nowrap"}}>Send</button></div>}
        </div>
        <button onClick={()=>{setItems(is=>is.filter(i=>i.id!==si.id));setView("member");}} style={{width:"100%",background:"transparent",border:`1px solid ${T.border2}`,borderRadius:12,padding:13,cursor:"pointer",fontSize:13,color:T.sub,marginTop:4}}>Remove Item</button>
      </div>
    </div>);
  }

  /* ═══ ADD / EDIT ITEM ════════════════════════════════════════════════════ */
  if(view==="addItem"&&ap) return shell(<>
    <MediaOverlay/>
    <div className="fu">
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"20px 22px 14px",borderBottom:`1px solid ${T.border}`,background:T.card}}>
        <button onClick={()=>setView("member")} style={{background:"transparent",border:"none",color:T.sub,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:21,fontFamily:T.serif,fontWeight:700,color:T.text}}>{editItemId?"Edit Item":"Add Item"}</div>
      </div>
      <div style={{padding:"18px 22px 40px",display:"flex",flexDirection:"column",gap:13}}>
        {/* Media zone */}
        <div style={{borderRadius:17,overflow:"hidden",border:`2px dashed ${T.border2}`,minHeight:140,background:T.card,position:"relative"}}>
          {iForm.video?<video src={iForm.video} controls style={{width:"100%",maxHeight:200,objectFit:"cover",display:"block"}}/>:iForm.image?<img src={iForm.image} style={{width:"100%",maxHeight:200,objectFit:"cover",display:"block"}}/>:<div style={{height:140,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,color:T.dim}}><div style={{fontSize:28}}>🖼</div><div style={{fontSize:12,letterSpacing:1.2}}>PHOTO OR VIDEO</div></div>}
          <div style={{position:"absolute",bottom:10,right:10,display:"flex",gap:7}}>
            <button onClick={()=>setShowMedia({itemId:null,target:"item"})} style={{background:"rgba(0,0,0,0.55)",border:"none",borderRadius:20,padding:"7px 13px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:600,backdropFilter:"blur(4px)"}}>📷 Camera</button>
            <button onClick={()=>itemImgRef.current.click()} style={{background:"rgba(0,0,0,0.55)",border:"none",borderRadius:20,padding:"7px 13px",cursor:"pointer",fontSize:13,color:"#fff",fontWeight:600,backdropFilter:"blur(4px)"}}>🖼 File</button>
          </div>
          <input ref={itemImgRef} type="file" accept="image/*,video/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);setIForm(fm=>({...fm,image:f.type.startsWith("video")?null:url,video:f.type.startsWith("video")?url:null}));}}/>
        </div>
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>Item Name *</Lbl>
          <input value={iForm.name} onChange={e=>setIForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Wireless Headphones" style={{width:"100%",background:"transparent",border:"none",fontSize:14,color:T.text,outline:"none"}}/>
        </div>
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>Category</Lbl>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{CATEGORIES.map(cat=>(
            <button key={cat.id} onClick={()=>setIForm(f=>({...f,category:cat.id,color:cat.color}))} style={{display:"flex",alignItems:"center",gap:5,background:iForm.category===cat.id?`${cat.color}22`:T.bgAlt,border:`1px solid ${iForm.category===cat.id?cat.color:T.border2}`,borderRadius:10,padding:"7px 10px",cursor:"pointer",transition:"all 0.15s"}}>
              <span style={{fontSize:16}}>{cat.icon}</span><span style={{fontSize:12,color:iForm.category===cat.id?cat.color:T.sub,fontWeight:iForm.category===cat.id?700:400}}>{cat.label}</span>
            </button>
          ))}</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1,background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
            <Lbl T={T}>Price ({currSym})</Lbl>
            <input type="number" min="0" step="0.01" value={iForm.price} onChange={e=>setIForm(f=>({...f,price:e.target.value}))} placeholder="0.00" style={{width:"100%",background:"transparent",border:"none",fontSize:14,color:T.text,outline:"none"}}/>
          </div>
          <div style={{flex:2,background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
            <Lbl T={T}>Store & Address</Lbl>
            <input value={iForm.store} onChange={e=>setIForm(f=>({...f,store:e.target.value}))} placeholder="e.g. Best Buy, 200 Park Ave" style={{width:"100%",background:"transparent",border:"none",fontSize:14,color:T.text,outline:"none"}}/>
          </div>
        </div>
        {/* Recurrence */}
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>🔁 Repeat</Lbl>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{RECUR_OPTS.map(opt=>(
            <button key={opt.id} onClick={()=>setIForm(f=>({...f,recurrence:opt.id}))} style={{background:iForm.recurrence===opt.id?`${T.blue3}20`:T.bgAlt,border:`1px solid ${iForm.recurrence===opt.id?T.blue3:T.border2}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",fontSize:12,color:iForm.recurrence===opt.id?T.blue3:T.sub,fontWeight:iForm.recurrence===opt.id?700:400,transition:"all 0.15s"}}>{opt.label}</button>
          ))}</div>
        </div>
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>Note</Lbl>
          <textarea value={iForm.note} onChange={e=>setIForm(f=>({...f,note:e.target.value}))} placeholder="Any special instructions…" style={{width:"100%",background:"transparent",border:"none",fontSize:14,color:T.text,outline:"none",resize:"none",minHeight:50}}/>
        </div>
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`}}>
          <Lbl T={T}>For</Lbl>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{profiles.map(p=><button key={p.id} onClick={()=>setIForm(f=>({...f,forId:p.id}))} style={{display:"flex",alignItems:"center",gap:7,background:iForm.forId===p.id?`${p.pageColor||T.accent}18`:T.bgAlt,border:`1px solid ${iForm.forId===p.id?p.pageColor||T.accent:T.border2}`,borderRadius:10,padding:"7px 11px",cursor:"pointer"}}><Av p={p} size={24} T={T}/><span style={{fontSize:13,color:iForm.forId===p.id?p.pageColor||T.accent:T.sub,fontWeight:iForm.forId===p.id?700:400}}>{p.name}</span></button>)}</div>
        </div>
        <div style={{background:T.card,borderRadius:13,padding:14,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontSize:14,fontWeight:600,color:T.text}}>Private Item</div><div style={{fontSize:12,color:T.sub,marginTop:1}}>Only you can see this</div></div>
          <Toggle on={iForm.isPrivate} onToggle={()=>setIForm(f=>({...f,isPrivate:!f.isPrivate}))} color={T.accent} T={T}/>
        </div>
        <button onClick={saveItem} style={{background:T.accent,border:"none",borderRadius:14,padding:17,cursor:"pointer",fontSize:15,fontWeight:700,color:"#fff",boxShadow:`0 4px 16px rgba(${hexToRgb(T.accent)},0.38)`,marginTop:4}}>{editItemId?"Save Changes":"Add to List"}</button>
      </div>
    </div>
  </>);

  /* ═══ SETTINGS ═══════════════════════════════════════════════════════════ */
  if(view==="settings") return shell(<>
    <div className="fu" style={{paddingBottom:90}}>
      <div style={{background:`linear-gradient(160deg,${T.blue2} 0%,${T.blue3} 100%)`,padding:"48px 22px 28px"}}>
        <div style={{fontSize:11,letterSpacing:3,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Preferences</div>
        <div style={{fontSize:30,fontFamily:T.serif,fontWeight:700,color:"#fff"}}>Settings</div>
      </div>
      <div style={{padding:"22px 20px"}}>
        <Lbl T={T}>Family Profile</Lbl>
        <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:18}}>
          <div style={{padding:16,display:"flex",alignItems:"center",gap:14}}>
            <div style={{position:"relative",flexShrink:0,cursor:"pointer"}} onClick={()=>familyLogoRef.current.click()}>
              {family.photo?<img src={family.photo} style={{width:62,height:62,borderRadius:16,objectFit:"cover",border:`2px solid ${T.accent}40`}}/>:<div style={{width:62,height:62,borderRadius:16,background:`${T.accent}18`,border:`2px dashed ${T.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🏡</div>}
              <div style={{position:"absolute",bottom:-2,right:-2,width:20,height:20,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",border:`2px solid ${T.card}`}}>✎</div>
              <input ref={familyLogoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>e.target.files[0]&&fileToUrl(e.target.files[0],url=>setFamily(f=>({...f,photo:url})))}/>
            </div>
            <div style={{flex:1}}><Lbl T={T} style={{marginBottom:7}}>Family Name</Lbl><input value={family.name} onChange={e=>setFamily(f=>({...f,name:e.target.value}))} style={{width:"100%",background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:10,padding:"9px 12px",fontSize:15,color:T.text,outline:"none"}}/></div>
          </div>
          <div style={{padding:"0 16px 16px"}}><Lbl T={T} style={{marginBottom:8}}>App Accent Colour</Lbl><ColourPicker value={family.accentColor} onChange={c=>setFamily(f=>({...f,accentColor:c}))} T={T}/></div>
        </div>
        <Lbl T={T}>Appearance</Lbl>
        <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,marginBottom:18}}>
          <div style={{padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:15,fontWeight:600,color:T.text}}>Dark Mode</div><div style={{fontSize:12,color:T.sub,marginTop:2}}>Switch to a dark theme</div></div>
            <Toggle on={dark} onToggle={()=>setDark(d=>!d)} color={T.accent} T={T}/>
          </div>
        </div>
        <Lbl T={T}>Currency</Lbl>
        <div style={{background:T.card,borderRadius:16,border:`1px solid ${T.border}`,marginBottom:18,overflow:"hidden"}}>
          <div style={{padding:"12px 14px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:8}}>Currently: {currByCode(family.currency||"USD").flag} {currByCode(family.currency||"USD").name} ({currByCode(family.currency||"USD").symbol})</div>
            <input value={currSearch} onChange={e=>setCurrSearch(e.target.value)} placeholder="Search currency…" style={{width:"100%",background:T.bgAlt,border:`1px solid ${T.border2}`,borderRadius:10,padding:"9px 12px",fontSize:14,color:T.text,outline:"none"}}/>
          </div>
          <div style={{maxHeight:220,overflowY:"auto"}}>
            {CURRENCIES.filter(c=>!currSearch||(c.name+c.code+c.symbol).toLowerCase().includes(currSearch.toLowerCase())).map(c=>(
              <button key={c.code} onClick={()=>setFamily(f=>({...f,currency:c.code}))} style={{width:"100%",padding:"12px 14px",background:(family.currency||"USD")===c.code?`${T.accent}12`:"transparent",border:"none",borderBottom:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
                <span style={{fontSize:20}}>{c.flag}</span>
                <div style={{flex:1}}><div style={{fontSize:14,fontWeight:(family.currency||"USD")===c.code?700:400,color:T.text}}>{c.name}</div><div style={{fontSize:11,color:T.sub}}>{c.code} · {c.symbol}</div></div>
                {(family.currency||"USD")===c.code&&<span style={{color:T.accent,fontSize:18}}>✓</span>}
              </button>
            ))}
          </div>
        </div>
        <Lbl T={T}>Member Page Colours</Lbl>
        <div style={{background:T.card,borderRadius:18,border:`1px solid ${T.border}`,overflow:"hidden",marginBottom:18}}>
          {profiles.map((p,i)=>(<div key={p.id} style={{borderBottom:i<profiles.length-1?`1px solid ${T.border}`:"none"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}><Av p={p} size={40} T={T} ring/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{p.name}</div><div style={{fontSize:11,color:T.sub}}>{p.role}</div></div><div style={{width:26,height:26,borderRadius:"50%",background:p.pageColor||T.accent,border:`2px solid ${T.border2}`,cursor:"pointer"}} onClick={()=>setEditColorFor(editColorFor===p.id?null:p.id)}/></div>
            {editColorFor===p.id&&<div style={{padding:"0 16px 16px"}}><ColourPicker value={p.pageColor||T.accent} onChange={c=>setProfiles(ps=>ps.map(pr=>pr.id===p.id?{...pr,pageColor:c}:pr))} T={T}/></div>}
          </div>))}
        </div>
        <button onClick={()=>{setShowInvite(true);setInviteStep("method");}} style={{width:"100%",background:T.accent,border:"none",borderRadius:14,padding:16,cursor:"pointer",fontSize:15,color:"#fff",fontWeight:700,boxShadow:`0 4px 16px rgba(${hexToRgb(T.accent)},0.35)`}}>+ Invite Family Member</button>
      </div>
    </div>
    <Nav/>
  </>);

  return shell(<div style={{padding:40,color:T.dim,textAlign:"center",paddingTop:100}}><div style={{fontSize:48,marginBottom:16}}>🧺</div><div style={{fontSize:20,fontFamily:T.serif,fontWeight:700,color:T.text,marginBottom:8}}>The Blue Basket</div><div style={{fontSize:13,color:T.dim}}>Loading…</div></div>);
}
