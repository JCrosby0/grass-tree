import{p as e,a as t,r as o,c as r,w as n,o as l,b as s,d as a,F as i,e as p,u as d,f as u,g as c,t as y,h,i as m,v as g,j as k,k as w}from"./vendor.76f275d8.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(o){const r=new URL(e,location),n=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((o,l)=>{const s=new URL(e,r);if(self[t].moduleMap[s])return o(self[t].moduleMap[s]);const a=new Blob([`import * as m from '${s}';`,`${t}.moduleMap['${s}']=m;`],{type:"text/javascript"}),i=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(a),onerror(){l(new Error(`Failed to import: ${e}`)),n(i)},onload(){o(self[t].moduleMap[s]),n(i)}});document.head.appendChild(i)})),self[t].moduleMap={}}}("/grass-tree/assets/");const f=u("data-v-56e11f54");e("data-v-56e11f54");const x={class:"page"},T=a("h2",null,"Grass Tree Builder",-1),F=a("p",null,[c("Here's a web app to build a grass tree in scalable vector graphics (SVG). Change the inputs to build the tree trunk and spike, and then click the button to generate the fronds and flower. "),a("br"),c("Warning: some inputs break the SVG, refresh page if things go wrong.")],-1),M={class:"container"},I={class:"controls"},S=a("h6",null,"Dimensions",-1),$={key:0,style:{"{color":"red}"}},v=a("br",null,null,-1),b={class:"color"},B=a("h6",null,"Color Theme",-1),L=a("br",null,null,-1),H={class:"display"},A=a("defs",null,[a("linearGradient",{id:"frondColorUpper",gradientTransform:"rotate(90)"},[a("stop",{offset:"5%","stop-color":"darkgreen"}),a("stop",{offset:"95%","stop-color":"green"})]),a("linearGradient",{id:"frondColorLower",gradientTransform:"rotate(90)"},[a("stop",{offset:"5%","stop-color":"green"}),a("stop",{offset:"95%","stop-color":"yellowgreen"})]),a("linearGradient",{id:"trunkColor",gradientTransform:"rotate(0)",x1:"3%",y1:"4%",x2:"3%",y2:"8%",spreadMethod:"repeat"},[a("stop",{offset:"20%","stop-color":"grey"}),a("stop",{offset:"50%","stop-color":"black"})])],-1),C=a("p",null,"© Joe Crosby, 2021",-1);t();const O={expose:[],props:{msg:String},setup(e){const t=[{name:"Full Colour",value:"default"},{name:"White Silhouette",value:"white"},{name:"Black Silhouette",value:"black"}],u=["noFronds"],w=o({count:0,selectedStyle:"default"}),O=o({width:500,height:500,marginBottom:50,noFronds:300,trunkSwayMid:-10,trunkSwayTop:1,trunkHeight:150,spikeSwayMid:-15,spikeSwayTop:-5,spikeHeight:250,frondDroop:20,showGuideCircles:0,flowerStart:.5,flowerStop:.9,sprondRandom:20}),U=o({xInner:Array(O.noFronds).fill(250),yInner:Array(O.noFronds).fill(250),xMid:Array(O.noFronds).fill(250),yMid:Array(O.noFronds).fill(250),xOuter:Array(O.noFronds).fill(250),yOuter:Array(O.noFronds).fill(250)}),G=o({xFlowerTop:242,yFlowerTop:70,xFlowerMid:246,yFlowerMid:100,xFlowerBot:245,yFlowerBot:160}),R=r((()=>({xMid:O.width/2,yMid:O.height/2,trunkMid:parseFloat(O.trunkHeight/2),xTrunkMid:parseFloat(O.width/2-parseInt(O.trunkSwayMid)),yTrunkMid:parseFloat(O.height-parseInt(O.marginBottom)-parseInt(O.trunkHeight)/2),xTrunkTop:parseFloat(O.width/2+parseInt(O.trunkSwayTop)),yTrunkTop:parseFloat(O.height-parseInt(O.marginBottom)-parseInt(O.trunkHeight)),spikeMid:O.spikeHeight/2,xSpikeMid:parseFloat(O.width/2+parseInt(O.trunkSwayTop)+parseInt(O.spikeSwayMid)),ySpikeMid:parseFloat(O.height-parseInt(O.marginBottom)-parseInt(O.trunkHeight)-parseInt(O.spikeHeight)/2),xSpikeTop:parseFloat(O.width/2+parseInt(O.trunkSwayTop)+parseInt(O.spikeSwayTop)),ySpikeTop:parseFloat(O.height-parseInt(O.marginBottom)-parseInt(O.trunkHeight)-parseInt(O.spikeHeight))})));function j(e,t=O.noFronds){const o=document.getElementById(e),r=o.getTotalLength()/t,n=Array(t).fill({}).map(((e,t)=>o.getPointAtLength(t*r))),l=n.map((e=>e.x)),s=n.map((e=>e.y));if("inner"===e)return[n,l,s];return[n,l.map((e=>e+(Math.random()-.5)*parseInt(O.sprondRandom))),s.map((e=>e+(Math.random()-.5)*parseInt(O.sprondRandom)))]}function V(e){const t=O.noFronds;return parseInt(e)<=parseInt(1*t/8)?"mid":parseInt(e)<=parseInt(3*t/8)?"lower":parseInt(e)<=parseInt(5*t/8)?"mid":parseInt(e)<=parseInt(7*t/8)?"upper":"mid"}function _(){console.time("test"),function(e="spike",t=parseFloat(O.flowerStart),o=parseFloat(O.flowerStop)){const r=document.getElementById(e),n=r.getTotalLength(),l=r.getPointAtLength(t*n),s=r.getPointAtLength(parseFloat((t+o)/2)*n),a=r.getPointAtLength(o*n);G.xFlowerTop=l.x,G.xFlowerMid=s.x,G.xFlowerBot=a.x,G.yFlowerTop=l.y,G.yFlowerMid=s.y,G.yFlowerBot=a.y}();let e=j("inner");U.xInner=e[1],U.yInner=e[2],e=j("mid"),U.xMid=e[1],U.yMid=e[2],e=j("outer"),U.xOuter=e[1],U.yOuter=e[2],console.timeEnd("test")}return n((()=>{console.log("watch test",O.noFronds),setTimeout(_,100)})),f(((e,o)=>(l(),s("div",x,[T,F,a("div",M,[a("div",I,[S,(l(!0),s(i,null,p(Object.keys(O),(e=>(l(),s("div",{key:e,class:"item"},[a("p",null,[c(y(e),1),u.includes(e)?(l(),s("span",$,"*")):h("",!0),m(a("input",{"onUpdate:modelValue":t=>O[e]=t,type:"number"},null,8,["onUpdate:modelValue"]),[[g,O[e]]])])])))),128)),a("button",{onClick:_},"Generate Fronds & Flower"),v]),a("div",b,[B,(l(),s(i,null,p(t,(e=>a("div",{class:"radio",key:e},[m(a("input",{type:"radio",id:e.value,name:"color",value:e.value,"onUpdate:modelValue":o[1]||(o[1]=e=>w.selectedStyle=e)},null,8,["id","value"]),[[k,w.selectedStyle]]),a("label",{for:e.value},y(e.name),9,["for"]),L]))),64))]),a("div",H,[(l(),s("svg",{class:w.selectedStyle,xmlns:"http://www.w3.org/2000/svg",width:`${O.width}px`,height:`${O.height}px`,viewbox:"0 0 200px 200px"},[A,a("g",null,[a("path",{class:["trunk",w.selectedStyle],d:`\n      M ${d(R).xMid} ${O.height-O.marginBottom} \n      Q ${d(R).xTrunkMid} ${d(R).yTrunkMid}\n      ${d(R).xTrunkTop} ${d(R).yTrunkTop}`},null,10,["d"])]),a("g",null,[a("path",{id:"spike",class:w.selectedStyle,d:`M ${d(R).xTrunkTop} ${d(R).yTrunkTop} \n        Q ${d(R).xSpikeMid} ${d(R).ySpikeMid} \n        ${d(R).xSpikeTop} ${d(R).ySpikeTop}`},null,10,["d"]),a("path",{class:["flower",w.selectedStyle],d:`M ${G.xFlowerBot} ${G.yFlowerBot} \n        Q ${G.xFlowerMid} ${G.yFlowerMid} \n        ${G.xFlowerTop} ${G.yFlowerTop}`},null,10,["d"])]),a("g",null,[(l(!0),s(i,null,p(U.xInner,((e,t)=>(l(),s("path",{key:"point"+t,class:["fronds",V(t),w.selectedStyle],d:`M ${U.xInner[t]} ${U.yInner[t]}\n        Q ${U.xMid[t]} ${U.yMid[t]}\n        ${U.xOuter[t]} ${U.yOuter[t]}`},null,10,["d"])))),128))]),a("g",null,[a("ellipse",{id:"inner",class:"ellipse inner",style:`{stroke: ${O.showGuideCircles?"1px red":"0"}}`,cx:d(R).xTrunkTop,cy:d(R).yTrunkTop,rx:"1",ry:"1"},null,12,["cx","cy"]),a("ellipse",{id:"mid",class:"ellipse mid",cx:d(R).xTrunkTop,cy:d(R).yTrunkTop,rx:"60",ry:"60"},null,8,["cx","cy"]),a("ellipse",{id:"outer",class:"ellipse outer",cx:d(R).xTrunkTop,cy:d(R).yTrunkTop+parseInt(O.frondDroop),rx:"100",ry:"100"},null,8,["cx","cy"])])],10,["width","height"]))])]),C]))))},__scopeId:"data-v-56e11f54"};w({expose:[],setup:e=>(e,t)=>(l(),s(O,{msg:"Hello Vue 3 + Vite"}))}).mount("#app");
