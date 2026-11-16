(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const B=document.body,secs=$$('main>section'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
let M=innerWidth<780,tops=[];
const measure=()=>{tops=secs.map(s=>s.offsetTop)};
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),sm=x=>x*x*(3-2*x);

/* ---------- UI (works with or without WebGL) ---------- */
$$('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();B.classList.remove('menu');const t=document.getElementById(a.dataset.go);if(t)scrollTo({top:t.offsetTop,behavior:RM?'auto':'smooth'})}));
$('#mb').onclick=()=>B.classList.toggle('menu');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('[data-r]').forEach(el=>{const sib=[...el.parentNode.children].filter(c=>c.hasAttribute('data-r'));el.style.transitionDelay=(sib.indexOf(el)*.08)+'s';io.observe(el)});
const navMap=[0,1,2,3,3,4,4],links=$$('#nv a');let navI=-1;
function chrome(){const y=scrollY+innerHeight*.4;let i=0;tops.forEach((t,k)=>{if(y>=t)i=k});if(navMap[i]!==navI){navI=navMap[i];links.forEach((a,k)=>a.classList.toggle('on',k===navI))}
 $('#bar').style.transform='scaleX('+cl(scrollY/(document.documentElement.scrollHeight-innerHeight||1))+')'}
addEventListener('scroll',chrome,{passive:true});
const info=['Autonomous bots, manipulators and fabrication. Build it, tune it, race it.','Models that see, read and decide — from vision hackathons to generative systems.','Satellites, rovers and mission design: engineering for places where gravity wins.'];
let listI=-1,hsI=-1;
$$('.tl button').forEach((b,k)=>{b.onmouseenter=()=>listI=k;b.onmouseleave=()=>listI=-1;b.onclick=()=>listI=k});
const ready=()=>{measure();chrome();setTimeout(()=>B.classList.add('go'),500)};

/* ---------- WebGL ---------- */
let R;const cv=$('#gl');
try{R=new THREE.WebGLRenderer({canvas:cv,antialias:!M,powerPreference:'high-performance'});if(!R.getContext())throw 0}catch(e){R=null}
function nogl(){B.classList.add('nogl');addEventListener('load',ready);ready()}
if(!R){nogl();return}
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();B.classList.add('nogl')});

R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(42,1,.1,140);scene.add(cam);
scene.background=new THREE.Color(0x07080a);scene.fog=new THREE.Fog(0x07080a,7,38);

/* studio environment for believable metal reflections */
{const pm=new THREE.PMREMGenerator(R),es=new THREE.Scene();
 es.add(new THREE.Mesh(new THREE.BoxGeometry(24,24,24),new THREE.MeshBasicMaterial({color:0x0a0c10,side:THREE.BackSide})));
 [[0,10,0,14,.3,7,3.2,0],[-10,2,3,.3,6,9,1.5,1],[9,-1,-4,.3,7,4,1.3,0],[0,-3,10,12,.3,.3,.7,0]].forEach(([x,y,z,w,h,d,i,c])=>{
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:new THREE.Color(c?.35*i:i,c?.85*i:i,i)}));m.position.set(x,y,z);es.add(m)});
 scene.environment=pm.fromScene(es,.03).texture;pm.dispose();es.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose()}})}

const steel=new THREE.MeshStandardMaterial({color:0xb9bec5,metalness:1,roughness:.28});
const flat=new THREE.MeshStandardMaterial({color:0xaeb4bb,metalness:1,roughness:.32,flatShading:true});
const dark=new THREE.MeshStandardMaterial({color:0x1b1e23,metalness:.9,roughness:.42});
const accM=new THREE.MeshStandardMaterial({color:0x08141b,emissive:0x5cc8ff,emissiveIntensity:1.8,roughness:.5});accM.userData.acc=1;
const acl=new THREE.Color(0x5cc8ff);
const tr=m=>{m=m.clone();m.transparent=true;return m};
const mesh=(g,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);return o};
const SEG=M?24:48;

function core(r){const g=new THREE.Group();g.add(mesh(new THREE.IcosahedronGeometry(r,M?1:2),flat.clone()));
 g.userData.rings=[[1.55,0,0],[1.85,1.2,.4],[2.2,.5,1.3]].map(([k,x,z],n)=>{const t=mesh(new THREE.TorusGeometry(r*k,r*.012,8,SEG*2),n==1?accM:steel);t.rotation.set(x,0,z);g.add(t);return t});return g}

/* world layout along -z: hero → innovation → technology → (dust) → showcase → tunnel → portal */
const hero=core(1.3);scene.add(hero);

const cubeG=new THREE.Group(),cubes=[];cubeG.position.set(0,0,-14);cubeG.scale.setScalar(1.5);
for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){
 if(!x&&!y&&!z){cubeG.add(mesh(new THREE.SphereGeometry(.24,24,16),accM));continue}
 const c=mesh(new THREE.BoxGeometry(.5,.5,.5),(x+y+z)%2?steel:dark);c.userData.base=new THREE.Vector3(x,y,z).multiplyScalar(.62);c.userData.dir=c.userData.base.clone().normalize();c.position.copy(c.userData.base);cubeG.add(c);cubes.push(c)}
cubeG.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.95,1.95,1.95)),new THREE.LineBasicMaterial({color:0x5cc8ff,transparent:true,opacity:.3})));
scene.add(cubeG);

function gear(){const g=new THREE.Group(),m=tr(steel);const b=mesh(new THREE.CylinderGeometry(.5,.5,.26,SEG),m);b.rotation.x=Math.PI/2;g.add(b);
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2,t=mesh(new THREE.BoxGeometry(.18,.2,.26),m,Math.cos(a)*.56,Math.sin(a)*.56,0);t.rotation.z=a;g.add(t)}
 const h=mesh(new THREE.CylinderGeometry(.2,.2,.32,24),tr(dark));h.rotation.x=Math.PI/2;g.add(h);g.userData.spin=1;return g}
function neural(){const g=new THREE.Group(),ico=new THREE.IcosahedronGeometry(.62,0),p=ico.attributes.position,seen={},m=tr(steel);
 const ln=new THREE.LineSegments(new THREE.EdgesGeometry(ico),new THREE.LineBasicMaterial({color:0xdfe6ee,transparent:true,opacity:.7}));ln.userData.base=.7;g.add(ln);
 for(let i=0;i<p.count;i++){const k=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>v.toFixed(3)).join();if(seen[k])continue;seen[k]=1;g.add(mesh(new THREE.SphereGeometry(.07,16,12),m,p.getX(i),p.getY(i),p.getZ(i)))}
 g.add(mesh(new THREE.SphereGeometry(.17,20,14),tr(accM)));return g}
function planet(){const g=new THREE.Group();g.add(mesh(new THREE.SphereGeometry(.46,SEG,SEG/2),tr(dark)));
 const r=mesh(new THREE.TorusGeometry(.78,.014,8,SEG*2),tr(steel));r.rotation.set(1.2,0,.3);g.add(r);
 const mo=new THREE.Group(),moon=mesh(new THREE.SphereGeometry(.08,16,12),tr(steel),.95,0,0);mo.add(moon);mo.rotation.x=1.2;mo.rotation.z=.3;g.add(mo);g.userData.moon=mo;return g}

const techG=new THREE.Group();techG.position.set(0,0,-28);const tc=core(.5);techG.add(tc);
const items=[gear(),neural(),planet()],TR=M?1.75:2.5,TA=[210,330,90];
items.forEach((it,k)=>{const a=TA[k]*Math.PI/180;it.userData.home=new THREE.Vector3(Math.cos(a)*TR,Math.sin(a)*TR,0);it.userData.idx=k;it.position.copy(it.userData.home);it.userData.o=1;it.userData.op=-1;
 const hit=mesh(new THREE.SphereGeometry(.95,8,6),new THREE.MeshBasicMaterial());hit.visible=false;hit.userData.item=it;it.add(hit);techG.add(it)});
scene.add(techG);

/* showcase machine */
const mach=new THREE.Group();mach.position.set(0,-.1,-48);const mods=[],modMeshes=[];
mach.add(mesh(new THREE.CylinderGeometry(.32,.42,3.2,SEG),steel));
[[-1.1,1.15],[-.1,1],[.9,.8]].forEach(([y,r],n)=>{mach.add(mesh(new THREE.CylinderGeometry(r,r,.07,SEG*2),dark,0,y,0));if(!n){const t=mesh(new THREE.TorusGeometry(r,.015,8,SEG*2),accM,0,y+.04,0);t.rotation.x=Math.PI/2;mach.add(t)}});
function mod(name,desc,g,x,y,z){g.position.set(x,y,z);g.userData={name,desc};g.traverse(o=>{if(o.isMesh){o.userData.mod=mods.length;modMeshes.push(o);if(!o.material.userData.acc)o.material=o.material.clone()}});mods.push(g);mach.add(g)}
{const g=new THREE.Group();g.add(mesh(new THREE.SphereGeometry(.42,SEG,SEG/2),steel));const r=mesh(new THREE.TorusGeometry(.66,.02,8,SEG*2),steel);r.rotation.x=1.1;g.add(r);
 mod('AI SYSTEM','Models that perceive, reason and act — trained and tested live by festival teams.',g,0,1.95,0)}
{const g=new THREE.Group();g.add(mesh(new THREE.TorusKnotGeometry(.28,.085,M?64:110,10),steel));mod('NEURAL ENGINE','The compute layer, where datasets turn into decisions in milliseconds.',g,1.45,.35,0)}
{const g=new THREE.Group(),b=mesh(new THREE.BoxGeometry(.62,.62,.62),steel);g.add(b);const a=mesh(new THREE.CylinderGeometry(.07,.07,.9,12),dark,.55,.4,0);a.rotation.z=-.7;g.add(a);
 mod('ROBOTICS CORE','Actuators, sensors and control loops, engineered by student robotics teams.',g,-.72,-.5,1.26)}
{const g=new THREE.Group();g.add(mesh(new THREE.CylinderGeometry(.16,.16,.8,20),steel));g.add(mesh(new THREE.ConeGeometry(.16,.34,20),dark,0,.57,0));
 [-1,1].forEach(s=>g.add(mesh(new THREE.BoxGeometry(.7,.02,.3),dark,s*.5,-.05,0)));
 mod('SPACE MODULE','Orbital thinking: satellites, payloads and mission design.',g,-.72,.6,-1.26)}
{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);
 const f=mesh(new THREE.CircleGeometry(3,32),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}),0,-1.75,-48);f.rotation.x=-Math.PI/2;scene.add(f)}
scene.add(mach);
const hsBox=$('#hs');const hs=mods.map((m,k)=>{const b=document.createElement('button');b.className='hs';b.innerHTML='<span>'+m.userData.name+'</span>';b.onmouseenter=()=>hsI=k;b.onmouseleave=()=>hsI=-1;b.onclick=()=>hsI=k;hsBox.appendChild(b);return b});

/* tunnel + portal */
const rings=[];for(let i=0;i<12;i++){const t=mesh(new THREE.TorusGeometry(3.4,i%4?.03:.045,8,SEG*2),i%4?steel:accM,0,0,-60-i*3);t.rotation.z=i*.35;scene.add(t);rings.push(t)}
const portal=core(1.4);portal.position.set(0,0,-98);scene.add(portal);

/* dust */
{const n=M?450:1300,p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=(Math.random()-.5)*28;p[i*3+1]=(Math.random()-.5)*16;p[i*3+2]=4-Math.random()*108}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({size:.05,color:0x9aa7b4,transparent:true,opacity:.55,depthWrite:false})))}

/* lights ride the camera so the look stays consistent while we travel */
cam.add(new THREE.HemisphereLight(0x9fb4c8,0x050607,.35));
const key=new THREE.DirectionalLight(0xffffff,1);key.position.set(3,4,3);cam.add(key);
const fill=new THREE.PointLight(0x5cc8ff,1.2,16);fill.position.set(-3,-1,2);cam.add(fill);

/* ---------- scroll → camera ---------- */
const KF=[{p:[-1.9,0,6.4],l:[-1.9,0,0]},{p:[2.1,0,-7.6],l:[2.1,0,-14]},{p:[-1.7,.2,-19.2],l:[-1.7,0,-28]},{p:[0,0,-33],l:[0,0,-40]},{p:[0,.5,-41.2],l:[0,0,-48]},{p:[0,0,-56],l:[0,0,-68]},{p:[0,0,-86],l:[0,0,-97]}];
const MY=[1.1,1.1,1,0,.8,0,0],ACC=[1.2,.8,1.4,.5,1.1,.9,1.9],KEY=[1.1,1,.9,.6,1,.8,1.1];
const BG=[0x07080a,0x0a0b0d,0x06080b,0x050506,0x08090c,0x04070a,0x06080b].map(c=>new THREE.Color(c));
function target(){const v=innerHeight,y=scrollY;let s=0;for(let k=1;k<7;k++){let a=tops[k]-v*.9,b=tops[k];if(k==6){a=tops[5]+v*.3;b=tops[6]-v*.1}s+=sm(cl((y-a)/(b-a)))}return s}

/* ---------- input ---------- */
let mx=0,my=0,px=0,py=0,hovT=-1,hovM=-1,hovC=null,drag=false,lx=0,vel=0,cur=0;
const ndc=new THREE.Vector2(),ray=new THREE.Raycaster();
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;if(drag){vel=(e.clientX-lx)*.008;lx=e.clientX;mach.rotation.y+=vel}});
addEventListener('pointerdown',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;if(cur>3.4&&cur<4.7&&!e.target.closest('a,button,nav')){drag=true;lx=e.clientX;vel=0;B.classList.add('grab')}});
['pointerup','pointercancel'].forEach(t=>addEventListener(t,()=>{drag=false;B.classList.remove('grab')}));

function size(){M=innerWidth<780;const w=innerWidth,h=innerHeight;R.setPixelRatio(Math.min(devicePixelRatio||1,M?1.25:1.75));R.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<1?60:42;cam.updateProjectionMatrix();measure()}
let rz=0;addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(size)});size();

let lastT=-2,lastM=-2;const clock=new THREE.Clock(),V=new THREE.Vector3(),W=new THREE.Vector3(),W2=new THREE.Vector3(),W3=new THREE.Vector3(),W4=new THREE.Vector3(),bgT=new THREE.Color(),k0=RM?.25:1;let lastCu='',lastVis=-1;
function setOp(g,o){g.traverse(c=>{const m=c.material;if(m){m.opacity=o*(c.userData.base||1);m.transparent=true}})}
function glow(g,on){g.traverse(c=>{if(c.isMesh&&!c.material.userData.acc){c.material.emissive.setHex(on?0x14506b:0);c.material.emissiveIntensity=1}})}

function frame(){requestAnimationFrame(frame);if(document.hidden)return;
 const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
 cur+=(target()-cur)*(RM?1:1-Math.exp(-dt*4.5));
 px+=(mx-px)*.06;py+=(my-py)*.06;
 const i=Math.min(Math.floor(cur),6),j=Math.min(i+1,6),f=cur-i,a=KF[i],b=KF[j],L=(u,v)=>u+(v-u)*f,sx=M?0:1,ys=M?L(MY[i],MY[j]):0;
 cam.position.set(L(a.p[0],b.p[0])*sx+px*.35,L(a.p[1],b.p[1])-ys-py*.2,L(a.p[2],b.p[2]));
 cam.lookAt(L(a.l[0],b.l[0])*sx,L(a.l[1],b.l[1])-ys,L(a.l[2],b.l[2]));
 /* atmosphere */
 bgT.copy(BG[i]).lerp(BG[j],f);scene.background.copy(bgT);scene.fog.color.copy(bgT);
 key.intensity=KEY[i]+(KEY[j]-KEY[i])*f;
 /* hero core */
 hero.rotation.set(py*.25+cur*.3,t*.12*k0+cur*1.4+px*.4,0);
 hero.userData.rings.forEach((r,n)=>{r.rotation.y+=dt*(.15+n*.1)*k0});hero.children[0].scale.setScalar(1+Math.min(cur,1)*.05);
 hero.scale.setScalar(1+Math.min(cur,1)*.25);
 /* innovation cube */
 ndc.set(mx,-my);ray.setFromCamera(ndc,cam);
 cubeG.rotation.set(py*.3+Math.sin(t*.3)*.08,t*.1*k0+px*.5,0);
 hovC=null;if(cur>.5&&cur<1.7&&!drag){const h=ray.intersectObjects(cubes,false)[0];if(h)hovC=h.object}
 cubes.forEach(c=>{const d=hovC?Math.max(0,1-c.userData.base.distanceTo(hovC.userData.base)/1.4):0;V.copy(c.userData.base).addScaledVector(c.userData.dir,d*.3+Math.sin(t+c.userData.base.x*3)*.015);c.position.lerp(V,.12);c.rotation.x+=(d*.5-c.rotation.x)*.1});
 /* technology */
 hovT=-1;if(cur>1.5&&cur<2.7){const h=ray.intersectObjects(items,true).find(x=>x.object.userData.item);if(h)hovT=h.object.userData.item.userData.idx}
 const act=hovT>=0?hovT:(cur>1.5&&cur<2.7?listI:-1);
 techG.rotation.set(py*.12,px*.2,0);tc.rotation.y=t*.4*k0;
 items.forEach((it,k)=>{const on=act===k,u=it.userData;V.copy(u.home);V.z=on?1.2:0;it.position.lerp(V,.08);it.scale.lerp(W.setScalar(on?1.3:act>=0?.85:1),.1);
  u.o+=((act>=0&&!on?.3:1)-u.o)*.1;if(Math.abs(u.o-u.op)>.003){u.op=u.o;setOp(it,u.o)}it.rotation.y+=dt*.3*k0;if(u.spin)it.rotation.z+=dt*.4*k0;if(u.moon)u.moon.rotation.y+=dt*.8*k0});
 if(act!==lastT){lastT=act;$$('.tl button').forEach((bt,k)=>bt.classList.toggle('on',k===act));$('#ti').textContent=act>=0?info[act]:'Hover an object — or pick a field.'}
 /* showcase */
 const inS=cur>3.3&&cur<4.8;
 hovM=-1;if(inS&&!drag){const h=ray.intersectObjects(modMeshes,false)[0];if(h)hovM=h.object.userData.mod}
 const am=inS?(hovM>=0?hovM:hsI):-1;
 if(!drag){mach.rotation.y+=vel+dt*.12*k0;vel*=.94}mach.rotation.x=py*.1;
 mods.forEach((m,k)=>m.rotation.y+=dt*.4*k0);
 if(am!==lastM){lastM=am;mods.forEach((m,k)=>glow(m,k===am));hs.forEach((h,k)=>h.classList.toggle('on',k===am));
  $('#cap').innerHTML=am>=0?'<b>'+mods[am].userData.name+'</b><p>'+mods[am].userData.desc+'</p>':'<b>Drag to rotate</b><p>Hover or tap a module to inspect it.</p>'}
 const vis=cl(1-Math.abs(cur-4)*2.2);if(vis!==lastVis){lastVis=vis;hsBox.style.opacity=vis}
 if(vis>.01){mach.getWorldPosition(W2);mods.forEach((m,k)=>{m.getWorldPosition(W);V.copy(W).project(cam);const face=W3.copy(W).sub(W2).dot(W4.copy(cam.position).sub(W))>-.3?1:.25;
  hs[k].style.transform='translate3d('+((V.x*.5+.5)*innerWidth)+'px,'+((-V.y*.5+.5)*innerHeight)+'px,0)';hs[k].style.opacity=face;hs[k].style.pointerEvents=vis>.5&&face>.5?'auto':'none'})}
 /* tunnel + portal */
 rings.forEach((r,n)=>r.rotation.z+=dt*(n%2?.08:-.08)*k0);
 portal.rotation.set(0,t*.2*k0,0);portal.userData.rings.forEach((r,n)=>r.rotation.y+=dt*(.2+n*.1)*k0);
 /* accent light follows the story */
 fill.intensity+=((ACC[i]+(ACC[j]-ACC[i])*f+(act>=0||am>=0?.8:0))-fill.intensity)*.08;
 const cu=hovC||hovT>=0||hovM>=0?'pointer':'';if(cu!==lastCu){lastCu=cu;cv.style.cursor=cu}
 R.render(scene,cam)}
frame();
ready();addEventListener('load',()=>{measure()});
})();
