import React,{useEffect,useRef,useState} from 'react';
import{createRoot}from'react-dom/client';
import{createPortal}from'react-dom';
import * as THREE from 'three';
import{gsap}from'gsap';
import{ScrollTrigger}from'gsap/ScrollTrigger';
import{ArrowUpRight,ArrowRight,ChevronDown,X,Menu,Play,Sparkles,Hand,BookOpen,Orbit,Scan,Volume2,RotateCcw,Lock,Mail,Eye,EyeOff,CheckCircle2,MoveRight,MousePointer2}from'lucide-react';
import{createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,updateProfile,signOut,onAuthStateChanged}from'firebase/auth';
import{auth,isFirebaseConfigured}from'./firebase';
import './styles.css';
gsap.registerPlugin(ScrollTrigger);
const missions=[
 {id:'apollo',type:'MOON / 1969',name:'Apollo 11',title:'The part that stayed',tag:'LEFT ON THE MOON',photo:'https://images-assets.nasa.gov/image/AS11-40-5927/AS11-40-5927~orig.jpg',description:'The astronauts returned home. The Lunar Module’s lower stage stayed on the Moon.',fact:'Apollo 11 • July 20, 1969',link:'https://www.nasa.gov/mission/apollo-11/',accent:'#e4c9ff'},
 {id:'rover',type:'MOON / 1971',name:'Lunar Rover',title:'A car without roads',tag:'LEFT ON THE MOON',photo:'https://images-assets.nasa.gov/image/AS15-88-11901/AS15-88-11901~orig.jpg',description:'The first lunar rover helped Apollo 15 astronauts explore farther from their lander.',fact:'Apollo 15 • July 1971',link:'https://www.nasa.gov/mission/apollo-15/',accent:'#dfc8ff'},
 {id:'ingenuity',type:'MARS / 2021',name:'Ingenuity',title:'The helicopter that could',tag:'RETIRED ON MARS',photo:'https://images-assets.nasa.gov/image/PIA24547/PIA24547~orig.jpg',description:'A tiny helicopter proved that powered flight is possible on another planet.',fact:'Mars • 72 flights',link:'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',accent:'#e3abff'},
 {id:'voyager',type:'DEEP SPACE / 1977',name:'Voyager 1',title:'A message from Earth',tag:'TRAVELING FAR AWAY',photo:'https://images-assets.nasa.gov/image/PIA17046/PIA17046~orig.jpg',description:'A small spacecraft carries Earth’s music and messages into deep space.',fact:'Launched • September 1977',link:'https://science.nasa.gov/mission/voyager/',accent:'#c4b5fd'}
];
function useReveal(){useEffect(()=>{let ctx=gsap.context(()=>{gsap.utils.toArray('[data-reveal]').forEach(el=>{gsap.fromTo(el,{y:46,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 89%',once:true}})});gsap.utils.toArray('[data-parallax]').forEach(el=>{gsap.fromTo(el,{y:-25},{y:40,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:true}})})});return()=>ctx.revert()},[])}
function Globe({className=''}){const mount=useRef(null);useEffect(()=>{const host=mount.current;if(!host)return;let width=host.clientWidth,height=host.clientHeight;const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(42,width/height,.1,100);camera.position.z=4.4;const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(width,height);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);const geo=new THREE.SphereGeometry(1.35,64,48);const texture=new THREE.TextureLoader().load('/assets/earth_surface_2048.jpg');texture.colorSpace=THREE.SRGBColorSpace;const material=new THREE.MeshStandardMaterial({map:texture,roughness:1});const sphere=new THREE.Mesh(geo,material);sphere.rotation.z=.19;scene.add(sphere);scene.add(new THREE.AmbientLight(0xb9b1ff,1));const light=new THREE.DirectionalLight(0xffffff,2.3);light.position.set(-2,1.3,4);scene.add(light);const glow=new THREE.Mesh(new THREE.SphereGeometry(1.43,48,36),new THREE.MeshBasicMaterial({color:0x917dff,transparent:true,opacity:.055,side:THREE.BackSide}));scene.add(glow);let frame,alive=true,target=0,drag=false,px=0;const move=e=>{if(drag){sphere.rotation.y+=(e.clientX-px)*.006;px=e.clientX}else{target=(e.clientX/window.innerWidth-.5)*.12}};const down=e=>{drag=true;px=e.clientX};const up=()=>drag=false;host.addEventListener('pointermove',move);host.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;function tick(){if(!alive)return;if(!reduced)sphere.rotation.y+=.00125;sphere.rotation.x+=(target-sphere.rotation.x)*.025;renderer.render(scene,camera);frame=requestAnimationFrame(tick)}tick();const resize=new ResizeObserver(()=>{width=host.clientWidth;height=host.clientHeight;if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix()});resize.observe(host);return()=>{alive=false;cancelAnimationFrame(frame);resize.disconnect();host.removeEventListener('pointermove',move);host.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);texture.dispose();geo.dispose();material.dispose();glow.geometry.dispose();glow.material.dispose();renderer.dispose();if(host.contains(renderer.domElement))host.removeChild(renderer.domElement)}},[]);return <div className={'globe '+className} ref={mount} aria-label="Interactive rotating Earth"/>}
function Navbar({onAuth,user,onLogout,onAdventure}){const[menu,setMenu]=useState(false);return <header className="navwrap"><nav className="navbar glass"><a href="#top" className="brand" onClick={()=>setMenu(false)}><span className="brand-mark">✳</span> SPACE GEAR <span className="brand-extra">STORIES</span></a><div className={'navlinks '+(menu?'show':'')}><a href="#about" onClick={()=>setMenu(false)}>About</a><a href="#features" onClick={()=>setMenu(false)}>Features</a><a href="#stories" onClick={()=>setMenu(false)}>Our stories</a><a href="#how" onClick={()=>setMenu(false)}>How it works</a></div><div className="nav-actions">{user?<><button className="nav-sign" onClick={onAdventure}>My journey</button><button className="nav-login" onClick={onLogout}>Log out</button></>:<><button className="nav-login" onClick={()=>onAuth('login')}>Log in</button><button className="nav-sign" onClick={()=>onAuth('register')}>Create account <ArrowUpRight size={14}/></button></>}<button className="nav-menu" aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}><Menu size={19}/></button></div></nav></header>}
function Hero({onStart}){
 const hero=useRef(null),art=useRef(null),pointer=useRef({x:0,y:0});
 const [active, setActive]=useState(false);
 useEffect(()=>{
  const node=hero.current;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const move=e=>{const r=node.getBoundingClientRect();pointer.current={x:((e.clientX-r.left)/r.width-.5)*2,y:((e.clientY-r.top)/r.height-.5)*2}};
  const leave=()=>{pointer.current={x:0,y:0}};
  node.addEventListener('pointermove',move);node.addEventListener('pointerleave',leave);
  const xTo=gsap.quickTo(art.current,'x',{duration:1.25,ease:'power2.out'});
  const yTo=gsap.quickTo(art.current,'y',{duration:1.25,ease:'power2.out'});
  const rxTo=gsap.quickTo('.hero-orbit-arc','rotate',{duration:1.5,ease:'sine.out'});
  const update=()=>{if(reduced)return;xTo(pointer.current.x*24);yTo(pointer.current.y*17);rxTo(pointer.current.x*3)};
  gsap.ticker.add(update);
  const ctx=gsap.context(()=>{
   gsap.fromTo('.hero-content > *',{y:32,opacity:0},{y:0,opacity:1,stagger:.115,duration:.95,delay:.4,ease:'power3.out'});
   gsap.fromTo('.hero-cinema',{scale:1.14,opacity:.5},{scale:1,opacity:1,duration:3,ease:'power2.out'});
   gsap.fromTo('.hero-hotspot',{scale:.5,opacity:0},{scale:1,opacity:1,duration:1.1,delay:1.8,ease:'back.out(1.4)'});
   if(!reduced){gsap.to('.hero-cinema',{scale:1.14,y:-60,ease:'none',scrollTrigger:{trigger:node,start:'top top',end:'bottom top',scrub:true}});gsap.to('.hero-orbit-arc',{rotate:9,ease:'none',scrollTrigger:{trigger:node,start:'top top',end:'bottom top',scrub:true}});}
  },node);
  return()=>{ctx.revert();gsap.ticker.remove(update);node.removeEventListener('pointermove',move);node.removeEventListener('pointerleave',leave)};
 },[]);
 return <section className="hero hero-v8" id="top" ref={hero}>
   <div className="hero-cinema" ref={art} aria-hidden="true"/>
   <div className="hero-vignette" aria-hidden="true"/>
   <div className="hero-starfield" aria-hidden="true"/>
   <div className="hero-orbit-arc" aria-hidden="true"/>
   <div className="hero-content">
    <div className="eyebrow"><span className="dot"/> NASA SPACE APPS · A STORY YOU CAN EXPLORE</div>
    <h1>Every machine<br/>has <em>a story.</em></h1>
    <p>Travel across space. Meet extraordinary machines.<br/>Discover what they left behind.</p>
    <div className="hero-actions"><button className="btn-main" onClick={onStart}>Begin your journey <ArrowUpRight size={17}/></button><a className="btn-outline" href="#features">See how it works <ArrowRight size={16}/></a></div>
    <span className="micro">THE MOON <span>✦</span> MARS <span>✦</span> BEYOND</span>
   </div>
   <button className={'hero-hotspot '+(active?'is-active':'')} aria-expanded={active} aria-label="Discover Apollo 11 story" onClick={()=>setActive(v=>!v)}><span className="hotspot-ping"/><span className="hotspot-dot"/><span className="hotspot-text">TOUCH A STORY</span></button>
   {active&&<div className="hero-discovery glass"><div className="hero-discovery-heading"><Sparkles size={16}/> MISSION DETECTED <button onClick={()=>setActive(false)} aria-label="Close mission preview"><X size={16}/></button></div><strong>Apollo 11 · The Moon</strong><p>In 1969, part of a spacecraft stayed on the Moon. Want to find out why?</p><button className="text-link" onClick={onStart}>Explore the story <ArrowUpRight size={16}/></button></div>}
   <a href="#about" className="scroll-hint">SCROLL TO EXPLORE <ChevronDown size={15}/></a>
 </section>
}
function About(){return <section id="about" className="section about"><div className="section-shell about-layout"><div data-reveal><div className="section-kicker">01 / WHY WE MADE THIS</div><h2>Not forgotten.<br/><em>Still extraordinary.</em></h2><p className="section-lede">Some NASA machines never came home. Their stories are still waiting to be discovered.</p><a href="#stories" className="text-link">Meet the explorers <ArrowUpRight size={16}/></a></div><div className="about-visual" data-reveal><div className="about-lunar"/><div className="about-orbit"/><div className="about-caption glass"><span>APOLLO 11 · THE MOON</span><strong>A small step. A lasting story.</strong></div></div></div></section>}
const featureData=[{id:'story',icon:BookOpen,number:'01',title:'Watch stories unfold',desc:'See NASA missions come to life through cinematic animations.'},{id:'gesture',icon:Hand,number:'02',title:'Learn by moving',desc:'Inside the adventure, use your hand or mouse to explore equipment.'},{id:'discover',icon:Scan,number:'03',title:'Find the hidden details',desc:'Choose a machine, uncover clues, and see how it worked.'}];
function Features({onStart}){const[active,setActive]=useState(0);const activeFeature=featureData[active];return <section id="features" className="section features"><div className="section-shell"><div className="features-header" data-reveal><div className="section-kicker">02 / WHAT YOU CAN DO</div><h2>Don't just read it.<br/><em>Experience it.</em></h2><p>Stories you can see, explore, and interact with.</p></div><div className="feature-layout"><div className="feature-list">{featureData.map((f,i)=><button key={f.id} onClick={()=>setActive(i)} className={'feature-btn glass '+(active===i?'feature-active':'')}><span className="feature-index">{f.number}</span><div><strong>{f.title}</strong><small>{f.desc}</small></div><ArrowUpRight size={18}/></button>)}</div><div className={'feature-stage glass feature-'+activeFeature.id} data-reveal><div className="feature-grid"/><div className="feature-object" key={active}>{active===0?<><div className="story-moon"/><div className="story-orbit"/><div className="story-lander">✦</div></>:active===1?<><div className="hand-aura"/><Hand size={100} strokeWidth={1.15}/><span className="hand-guide">MOVE • ROTATE • DISCOVER</span></>:<><div className="scan-outer"><Scan size={88} strokeWidth={1}/></div><div className="scan-spark">✧</div></>}</div><div className="feature-stage-bottom"><span>INTERACTIVE STORY MODE · {activeFeature.number}</span><strong>{activeFeature.title}</strong></div></div></div><div className="feature-bottom"><span>THE HAND-GESTURE CONSOLE OPENS INSIDE THE ADVENTURE, NOT ON THIS PAGE.</span><button className="text-link" onClick={onStart}>Enter the experience <ArrowUpRight size={16}/></button></div></div></section>}
const timeline=[{year:'1969',headline:'The Moon landing',copy:'Apollo 11 landed on the Moon. Its descent stage remains there today.',name:'APOLLO 11'},{year:'1971',headline:'A vehicle on another world',copy:'Apollo 15 astronauts drove the first lunar rover—and left it on the Moon.',name:'LUNAR ROVER'},{year:'2021',headline:'A little flight on Mars',copy:'Ingenuity began a new chapter of exploration by flying above Mars.',name:'INGENUITY'}];
function Timeline(){const[active,setActive]=useState(0);const sec=useRef(null);useEffect(()=>{if(window.innerWidth<=830||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const st=ScrollTrigger.create({trigger:sec.current,start:'top top',end:'+=1500',pin:true,anticipatePin:1,onUpdate:s=>setActive(Math.min(2,Math.floor(s.progress*3)))});return()=>st.kill()},[]);return <section id="history" className="section timeline" ref={sec}><div className="timeline-photo"/><div className="timeline-shadow"/><div className="section-shell timeline-layout"><div className="timeline-intro" data-reveal><div className="section-kicker">03 / BEHIND THE MISSION</div><h2>History isn't<br/><em>standing still.</em></h2><p>Travel through the moments that changed space exploration.</p><div className="years">{timeline.map((t,i)=><button key={t.year} onClick={()=>setActive(i)} className={active===i?'selected':''}>{t.year}</button>)}</div></div><div className="timeline-story glass" key={active}><div className="timeline-head"><span>MISSION ARCHIVE / {timeline[active].name}</span><Orbit size={22}/></div><span className="timeline-year">{timeline[active].year}</span><h3>{timeline[active].headline}</h3><p>{timeline[active].copy}</p><div className="timeline-controls"><button onClick={()=>setActive((active+1)%3)}>Next moment <ArrowRight size={16}/></button><div className="progress-dots">{timeline.map((t,i)=><button aria-label={'Jump to '+t.year} key={t.year} className={i===active?'on':''} onClick={()=>setActive(i)}/>)}</div></div></div></div></section>}
const arcana=[['I','The Stayer','☾'],['II','The Wanderer','✧'],['III','The Aviator','✳'],['IV','The Messenger','✦']];
function TarotFaces({m,i}){return <><span className="tarot-face tarot-back"><span className="tb-frame"/><span className="tb-top">{arcana[i][0]}</span><span className="tb-sigil"><i className="r1"/><i className="r2"/><i className="r3"/><b>{arcana[i][2]}</b></span><span className="tb-title">{arcana[i][1]}</span><span className="tb-hint">{m.type}</span><span className="tb-tap">TAP TO REVEAL</span></span>
 <span className="tarot-face tarot-front"><span className="card-shine"/><span className="card-index">0{i+1} / {m.type}</span><span className={'card-illustration mission-'+m.id}><img src={m.photo} alt={m.name+' NASA mission imagery'} loading="lazy" onError={e=>e.currentTarget.style.display='none'}/><span>{arcana[i][2]}</span></span><span className="card-text"><strong>{m.name}</strong><small>{m.title}</small></span></span></>}
function ChosenStage({m,i,onClose,onStart}){
 const root=useRef(null),inner=useRef(null),card=useRef(null),tilt=useRef(null),info=useRef(null),arch=useRef(null),closing=useRef(false);
 const sparks=useRef(Array.from({length:26},()=>({l:Math.random()*100,s:Math.random()*5+2,d:Math.random()*8,t:Math.random()*6+7}))).current;
 const close=go=>{if(closing.current)return;closing.current=true;gsap.killTweensOf([card.current,inner.current,tilt.current]);const tl=gsap.timeline({onComplete:()=>{onClose();if(go===true)onStart()}});tl.to(info.current.children,{opacity:0,x:30,stagger:.04,duration:.3},0).to(inner.current,{rotateY:1080,duration:.9,ease:'power3.inOut'},0).to(card.current,{y:80,scale:.55,opacity:0,duration:.6,ease:'power3.in'},.4).to(arch.current,{opacity:0,scale:.9,duration:.5},.45).to(root.current,{opacity:0,duration:.4},.65)};
 useEffect(()=>{
  const was=document.body.style.overflow;document.body.style.overflow='hidden';
  const key=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',key);
  const c=card.current,n=inner.current,t=tilt.current;
  const ctx=gsap.context(()=>{
   const tl=gsap.timeline({defaults:{ease:'power3.out'}});
   tl.fromTo(root.current,{opacity:0},{opacity:1,duration:.45},0)
    .fromTo(arch.current,{scale:.82,opacity:0,y:40},{scale:1,opacity:1,y:0,duration:1},.1)
    .fromTo(c,{y:150,scale:.5,opacity:0},{y:0,scale:1,opacity:1,duration:1.1,ease:'back.out(1.3)'},.35)
    .fromTo(n,{rotateY:0},{rotateY:900,duration:1.8,ease:'power3.inOut'},.45)
    .fromTo('.stage-beam',{opacity:0,scaleY:.2,transformOrigin:'top center'},{opacity:1,scaleY:1,duration:1.1},1.3)
    .fromTo(info.current.children,{opacity:0,x:-40},{opacity:1,x:0,stagger:.09,duration:.7},1.5)
    .add(()=>{gsap.to(c,{y:-14,duration:2.6,ease:'sine.inOut',repeat:-1,yoyo:true})});
  },root);
  return()=>{ctx.revert();gsap.killTweensOf([c,n,t]);document.body.style.overflow=was;document.removeEventListener('keydown',key)};
 },[]);
 const move=e=>{const x=(e.clientX/window.innerWidth-.5)*2,y=(e.clientY/window.innerHeight-.5)*2;gsap.to(tilt.current,{rotateY:x*16,rotateX:-y*12,transformPerspective:1000,duration:.8,ease:'power2.out',overwrite:'auto'})};
 return <div className="stage" ref={root} role="dialog" aria-modal="true" aria-label={m.name+' card'} onMouseMove={move} onMouseDown={e=>{if(e.target===e.currentTarget)close()}} style={{'--card-accent':m.accent}}>
  <button className="stage-close" onClick={()=>close()} aria-label="Return the cards"><X size={20}/></button>
  <div className="stage-sky" aria-hidden="true"><span className="vortex v1"/><span className="vortex v2"/>{sparks.map((p,k)=><span key={k} className="spark" style={{left:p.l+'%',width:p.s,height:p.s,animationDelay:p.d+'s',animationDuration:p.t+'s'}}/>)}</div>
  <div className="stage-layout">
   <div className="stage-arch-wrap"><div className="stage-arch" ref={arch}>
    <span className="arch-pillar l"/><span className="arch-pillar r"/><span className="arch-crown">✦</span>
    <span className="arch-vortex"><i/><i/><i/><span className="stage-beam"><i/><i/><i/></span></span>
    <span className="arch-floor"/>
    <div className="stage-card" ref={card}><div className="stage-tilt" ref={tilt}><span className="tarot-inner" ref={inner}><TarotFaces m={m} i={i}/></span></div></div>
   </div></div>
   <div className="stage-info" ref={info}>
    <span className="stage-tag">{m.tag}</span>
    <h2>{m.name}</h2>
    <h3 className="stage-sub">{m.title}</h3>
    <p>{m.description}</p>
    <span className="stage-fact">{m.fact}</span>
    <div className="stage-actions"><button className="btn-main" onClick={()=>close(true)}>Explore this story <ArrowRight size={16}/></button><button className="btn-outline" onClick={()=>close()}>Return the cards</button><a className="text-link" href={m.link} target="_blank" rel="noopener noreferrer">Verified NASA mission <ArrowUpRight size={15}/></a></div>
   </div>
  </div>
 </div>}
function Cards({onStart}){
 const[selected,setSelected]=useState(null);const grid=useRef(null);
 const pick=i=>{if(selected!==null)return;setSelected(i);gsap.to(grid.current.querySelectorAll('.tarot'),{opacity:0,y:30,scale:.92,duration:.55,stagger:.06,ease:'power2.in',overwrite:true})};
 const closeStage=()=>{setSelected(null);gsap.fromTo(grid.current.querySelectorAll('.tarot'),{opacity:0,y:60,scale:.92,rotateX:-20,transformPerspective:900},{opacity:1,y:0,scale:1,rotateX:0,duration:.9,stagger:.12,ease:'power3.out',clearProps:'transform,opacity',overwrite:true})};
 return <section id="stories" className="section stories"><div className="section-shell"><div className="cards-header" data-reveal><div><div className="section-kicker">04 / DISCOVER THE MACHINES</div><h2>Pick a card.<br/><em>Meet the chosen one.</em></h2></div><p>Each card hides a mission. Choose one and let it reveal itself.</p></div>
 <div className={'cards-grid'+(selected!==null?' is-away':'')} ref={grid}>{missions.map((m,i)=><div key={m.id} className="tarot" style={{'--card-accent':m.accent}}>
  <button className="tarot-btn" onClick={()=>pick(i)} aria-label={'Reveal '+m.name+' card'}><span className="tarot-inner"><TarotFaces m={m} i={i}/></span></button>
 </div>)}</div>
 <div className="selected-story glass" aria-live="polite"><Sparkles size={21}/><span>Choose a card. A new story is waiting.</span></div></div>
 {selected!==null&&createPortal(<ChosenStage key={selected} m={missions[selected]} i={selected} onClose={closeStage} onStart={onStart}/>,document.body)}</section>}
function How({onStart}){const steps=[['01','Choose a story','Pick a real NASA machine.'],['02','Watch it come alive','See what happened through animation.'],['03','Explore with your hands','Move, select, and discover in the adventure.'],['04','Learn what stayed','Finish the story with a new discovery.']];return <section id="how" className="section how"><div className="section-shell"><div className="how-intro" data-reveal><div className="section-kicker">05 / YOUR STORY ADVENTURE</div><h2>You're not just<br/><em>watching history.</em></h2><p>You're part of the story.</p></div><div className="how-flow">{steps.map(([num,title,desc],i)=><div key={num} className="how-step glass" data-reveal><div className="how-top"><span>{num}</span><span className="how-symbol">{['✧','◌','⌁','✳'][i]}</span></div><h3>{title}</h3><p>{desc}</p>{i<3&&<span className="flow-line"/>}</div>)}</div><div className="how-cta"><button className="btn-main" onClick={onStart}>Start my story <ArrowUpRight size={16}/></button></div></div></section>}
function FinalCTA({onStart}){return <section className="closing" id="join"><div className="closing-aura"/><div className="section-shell closing-content" data-reveal><span className="section-kicker">YOUR ADVENTURE AWAITS</span><h2>The universe has<br/><em>so much to tell you.</em></h2><p>Create your Explorer account and begin discovering.</p><button className="btn-main" onClick={onStart}>Create your account <ArrowUpRight size={17}/></button><span className="closing-hint">MOON · MARS · BEYOND</span></div></section>}
function Footer(){return <footer className="footer"><div className="section-shell footer-grid"><div><a className="brand" href="#top"><span className="brand-mark">✳</span> SPACE GEAR STORIES</a><p>Discover the machines that helped us explore farther.</p><small>An independent NASA Space Apps educational project. Not affiliated with or endorsed by NASA.</small></div><div><h4>EXPLORE</h4><a href="#about">About</a><a href="#features">Features</a><a href="#stories">Our stories</a><a href="#how">How it works</a></div><div><h4>NASA SOURCES</h4><a href="https://www.nasa.gov/mission/apollo-11/" target="_blank" rel="noreferrer">Apollo 11</a><a href="https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/" target="_blank" rel="noreferrer">Ingenuity</a><a href="https://science.nasa.gov/mission/voyager/" target="_blank" rel="noreferrer">Voyager</a></div></div><div className="section-shell footer-end">© 2026 Space Gear Stories <span>Made for curious minds ✳</span></div></footer>}
function AuthModal({mode,setMode,onClose,onComplete}){const[name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[show,setShow]=useState(false),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);useEffect(()=>{const handler=e=>{if(e.key==='Escape')onClose()};document.addEventListener('keydown',handler);const was=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',handler);document.body.style.overflow=was}},[onClose]);async function submit(e){e.preventDefault();setMsg('');if(!isFirebaseConfigured){setMsg('Account creation requires Firebase configuration. Follow README.md to connect your project.');return}if(mode==='register'&&password!==confirm){setMsg('Passwords do not match.');return}if(password.length<6){setMsg('Password must contain at least 6 characters.');return}setBusy(true);try{if(mode==='register'){const cred=await createUserWithEmailAndPassword(auth,email,password);await updateProfile(cred.user,{displayName:name.trim()})}else await signInWithEmailAndPassword(auth,email,password);onComplete()}catch(err){setMsg(err.code==='auth/email-already-in-use'?'This email already has an account.':err.code==='auth/invalid-credential'?'Incorrect email or password.':err.message)}finally{setBusy(false)}}async function forgot(){if(!email){setMsg('Enter your email first.');return}if(!isFirebaseConfigured){setMsg('Firebase is not configured yet.');return}try{await sendPasswordResetEmail(auth,email);setMsg('Password reset email sent.')}catch(err){setMsg(err.message)}}return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="auth-modal glass" role="dialog" aria-modal="true" aria-label={mode==='register'?'Create Explorer account':'Log in'}><button className="modal-close" aria-label="Close" onClick={onClose}><X size={18}/></button><span className="section-kicker">WELCOME, EXPLORER</span><h2>{mode==='register'?'Your story starts here.':'Welcome back.'}</h2><p>{mode==='register'?'Create an account to begin your adventure.':'Continue your space exploration.'}</p><div className="auth-switch"><button className={mode==='register'?'active':''} onClick={()=>{setMode('register');setMsg('')}}>Create account</button><button className={mode==='login'?'active':''} onClick={()=>{setMode('login');setMsg('')}}>Log in</button></div><form onSubmit={submit}>{mode==='register'&&<label>Your name<input value={name} onChange={e=>setName(e.target.value)} required autoComplete="name" placeholder="Explorer name"/></label>}<label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com"/></label><label>Password<div className="password-wrap"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required autoComplete={mode==='register'?'new-password':'current-password'} placeholder="At least 6 characters"/><button type="button" aria-label="Show password" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>{mode==='register'&&<label>Confirm password<input type={show?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} required autoComplete="new-password"/></label>}{mode==='login'&&<button type="button" className="forgot" onClick={forgot}>Forgot password?</button>}<div className="auth-error" role="status">{msg}</div><button disabled={busy} type="submit" className="btn-main auth-submit">{busy?'Working…':mode==='register'?'Create my account':'Log in'} <ArrowRight size={16}/></button></form><div className="auth-privacy"><Lock size={13}/> Accounts use Firebase Authentication when configured. No simulated logins.</div></div></div>}
function AdventurePreview({user,onClose}){return <div className="modal-backdrop adventure-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="adventure-panel glass" role="dialog" aria-modal="true" aria-label="Your NASA story"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={20}/></button><span className="section-kicker">WELCOME TO YOUR JOURNEY</span><h2>Ready to discover<br/><em>the Moon?</em></h2><p>Your account is ready. Your first story is Apollo 11: the machine that stayed behind.</p><div className="adventure-options"><span><CheckCircle2 size={18}/> Account active</span><span><Hand size={18}/> Hand controls belong inside the full story game</span></div><div className="coming-note">The complete hand-controlled game environment is a separate development module and is not included in this welcome-page build. Your login is real when Firebase is configured.</div><button className="btn-main" onClick={onClose}>Return to the website <ArrowRight size={16}/></button></div></div>}
/* ===== Cosmic scroll experience ===== */
function Cosmos(){
 const ref=useRef(null);
 useEffect(()=>{
  const c=ref.current;if(!c)return;const ctx=c.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,raf=0,t=0,vel=0,last=window.scrollY,tx=0,ty=0,gx=0,gy=0,nextShot=200,spawn=0,stars=[],blobs=[],shots=[];
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const launch=()=>shots.push({x:rnd(w*.2,w*1.1),y:rnd(-30,h*.55),vx:-rnd(12,19),vy:rnd(6,10),life:1,len:rnd(7,12)});
  const build=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);w=window.innerWidth;h=window.innerHeight;c.width=w*dpr;c.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
   const n=Math.min(480,Math.floor(w*h/4200));
   stars=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,z:rnd(.15,1),tw:rnd(0,6.28),hue:Math.random()<.3?rnd(255,290):0}));
   blobs=[{x:.15,y:.2,r:.55,hue:268,d:.35,p:0},{x:.85,y:.45,r:.6,hue:285,d:.5,p:1.7},{x:.4,y:.8,r:.65,hue:250,d:.25,p:3.1},{x:.75,y:.95,r:.5,hue:300,d:.6,p:4.4},{x:.1,y:.65,r:.45,hue:275,d:.45,p:5.2}];
   if(reduced)draw()};
  function draw(){
   const sy=window.scrollY,max=Math.max(1,document.documentElement.scrollHeight-h),p=Math.min(1,sy/max);
   vel=vel*.88+(sy-last)*.12;last=sy;gx+=(tx-gx)*.04;gy+=(ty-gy)*.04;
   ctx.globalCompositeOperation='source-over';
   const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0c0620');bg.addColorStop(1,'#1a0d38');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
   ctx.globalCompositeOperation='lighter';
   blobs.forEach(b=>{const span=h*1.6;const cy=((((b.y*span)-sy*b.d*.35)%span)+span)%span-h*.3;const cx=b.x*w+Math.sin(t*.0004+b.p)*70+gx*b.d*60;const r=b.r*Math.max(w,h)*.6;const hue=b.hue+p*50;const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`hsla(${hue},85%,55%,.17)`);g.addColorStop(.5,`hsla(${hue+15},80%,40%,.07)`);g.addColorStop(1,'hsla(260,80%,30%,0)');ctx.fillStyle=g;ctx.fillRect(cx-r,cy-r,r*2,r*2)});
   const ad=Math.abs(vel);if(!reduced&&ad>7&&shots.length<3){spawn+=Math.min(.04,ad*.001);while(spawn>=1){spawn-=1;launch()}}
   stars.forEach(s=>{const y=(((s.y-sy*s.z*.45)%h)+h)%h;const x=s.x+gx*s.z*28;const a=.35+.65*(.5+.5*Math.sin(t*.003*s.z+s.tw));const col=s.hue?`hsla(${s.hue},90%,85%,${a})`:`rgba(255,255,255,${a})`;const r=s.z*1.5;
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill()});
   if(!reduced){nextShot--;if(nextShot<=0){nextShot=rnd(900,1700);launch()}
    shots.forEach(s=>{const tx2=s.x-s.vx*s.len,ty2=s.y-s.vy*s.len;const g=ctx.createLinearGradient(s.x,s.y,tx2,ty2);g.addColorStop(0,`rgba(255,246,255,${s.life})`);g.addColorStop(.25,`rgba(214,180,255,${s.life*.6})`);g.addColorStop(1,'rgba(150,110,255,0)');ctx.strokeStyle=g;ctx.lineWidth=2.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(tx2,ty2);ctx.stroke();const hg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,7);hg.addColorStop(0,`rgba(255,255,255,${s.life})`);hg.addColorStop(1,'rgba(190,150,255,0)');ctx.fillStyle=hg;ctx.fillRect(s.x-7,s.y-7,14,14);s.x+=s.vx;s.y+=s.vy;s.life-=.012});
    shots=shots.filter(s=>s.life>0)}
  }
  const loop=()=>{t+=16;if(!document.hidden)draw();raf=requestAnimationFrame(loop)};
  const move=e=>{tx=(e.clientX/w-.5)*2;ty=(e.clientY/h-.5)*2};
  build();window.addEventListener('resize',build);
  if(!reduced){window.addEventListener('pointermove',move);loop()}
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',build);window.removeEventListener('pointermove',move)};
 },[]);
 return <canvas ref={ref} className="cosmos" aria-hidden="true"/>
}
const rail=[['top','Hero'],['about','About'],['features','Features'],['history','Timeline'],['stories','Stories'],['how','How it works'],['join','Join']];
function ScrollUI(){
 const bar=useRef(null),ship=useRef(null);const[active,setActive]=useState(0);
 useEffect(()=>{let raf=0;
  const upd=()=>{raf=0;const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);const p=Math.min(1,Math.max(0,window.scrollY/max));if(bar.current)bar.current.style.transform='scaleX('+p+')';if(ship.current)ship.current.style.top=(p*100)+'%';let a=0;rail.forEach(([id],i)=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<window.innerHeight*.5)a=i});setActive(a)};
  const on=()=>{if(!raf)raf=requestAnimationFrame(upd)};
  upd();window.addEventListener('scroll',on,{passive:true});window.addEventListener('resize',on);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',on);window.removeEventListener('resize',on)};
 },[]);
 return <><div className="scroll-progress" aria-hidden="true"><span ref={bar}/></div><nav className="scroll-rail" aria-label="Page sections"><span className="rail-line"/><span className="rail-ship" ref={ship} aria-hidden="true">✦</span>{rail.map(([id,l],i)=><a key={id} href={'#'+id} className={i===active?'on':''} aria-label={l}><span>{l}</span></a>)}</nav></>
}
function CursorGlow(){
 const ref=useRef(null);
 useEffect(()=>{if(!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const el=ref.current;const xt=gsap.quickTo(el,'x',{duration:.6,ease:'power3'}),yt=gsap.quickTo(el,'y',{duration:.6,ease:'power3'});const mv=e=>{xt(e.clientX);yt(e.clientY);el.style.opacity=1};window.addEventListener('pointermove',mv);return()=>window.removeEventListener('pointermove',mv)},[]);
 return <div className="cursor-glow" ref={ref} aria-hidden="true"/>
}
function useTilt(){
 useEffect(()=>{
  if(matchMedia('(pointer:coarse)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const sel='.tarot-btn,.how-step,.feature-btn,.timeline-story,.about-caption,.stat';
  const mv=e=>{const el=e.target.closest&&e.target.closest(sel);if(!el)return;const r=el.getBoundingClientRect();const px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;el.style.setProperty('--mx',px*100+'%');el.style.setProperty('--my',py*100+'%');const big=el.classList.contains('tarot-btn')||el.classList.contains('how-step');gsap.to(el,{rotateY:(px-.5)*(big?14:6),rotateX:(.5-py)*(big?14:6),y:big?-10:0,transformPerspective:900,duration:.45,ease:'power2.out',overwrite:'auto'})};
  const lv=e=>{const el=e.target.closest&&e.target.closest(sel);if(!el||el.contains(e.relatedTarget))return;gsap.to(el,{rotateX:0,rotateY:0,y:0,duration:.6,ease:'power3.out',overwrite:'auto',onComplete:()=>gsap.set(el,{clearProps:'transform'})})};
  document.addEventListener('pointermove',mv);document.addEventListener('pointerout',lv);
  return()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerout',lv)};
 },[]);
}
function useScrollFX(){
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=gsap.context(()=>{
   const scrub=(trigger,start='top bottom',end='bottom top')=>({trigger,start,end,scrub:.8});
   gsap.to('.hero-content',{y:-90,opacity:0,ease:'none',scrollTrigger:{trigger:'#top',start:'top top',end:'80% top',scrub:true}});
   gsap.fromTo('.about-lunar',{scale:.7,rotate:-25},{scale:1.05,rotate:20,ease:'none',scrollTrigger:scrub('#about')});
   gsap.fromTo('.about-orbit',{rotate:-60},{rotate:10,ease:'none',scrollTrigger:scrub('#about')});
   gsap.fromTo('.about-caption',{y:70},{y:-40,ease:'none',scrollTrigger:scrub('#about')});
   gsap.fromTo('.feature-stage',{scale:.9,rotateX:12,transformPerspective:900},{scale:1,rotateX:0,ease:'none',scrollTrigger:scrub('#features','top 95%','top 40%')});
   gsap.fromTo('.feature-btn',{x:-70,opacity:0},{x:0,opacity:1,stagger:.12,duration:.9,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:'.feature-list',start:'top 85%',once:true}});
   gsap.fromTo('.timeline-photo',{yPercent:-8,scale:1.12},{yPercent:8,scale:1.12,ease:'none',scrollTrigger:scrub('#history')});
   gsap.fromTo('.tarot',{y:90,opacity:0,rotateX:-25,transformPerspective:900},{y:0,opacity:1,rotateX:0,stagger:.14,duration:1.1,ease:'power3.out',clearProps:'transform',scrollTrigger:{trigger:'.cards-grid',start:'top 85%',once:true}});
   gsap.fromTo('.flow-line',{scaleX:0,transformOrigin:'left center'},{scaleX:1,stagger:.25,duration:.8,ease:'power2.out',scrollTrigger:{trigger:'.how-flow',start:'top 75%',once:true}});
   gsap.fromTo('.how-symbol',{rotate:-90},{rotate:180,ease:'none',scrollTrigger:scrub('.how-flow')});
   gsap.fromTo('.marquee-row.r1',{xPercent:0},{xPercent:-25,ease:'none',scrollTrigger:scrub('.marquee')});
   gsap.fromTo('.marquee-row.r2',{xPercent:-25},{xPercent:0,ease:'none',scrollTrigger:scrub('.marquee')});
   gsap.fromTo('.closing-aura',{scale:.7,opacity:.4},{scale:1.2,opacity:1,ease:'none',scrollTrigger:scrub('#join')});
  });
  const id=setTimeout(()=>ScrollTrigger.refresh(),300);
  return()=>{clearTimeout(id);ctx.revert()};
 },[]);
}
function Marquee(){const words=['THE MOON','MARS','VOYAGER','APOLLO 11','INGENUITY','LUNAR ROVER','BEYOND'];const row=k=><div className={'marquee-row '+k}>{[...words,...words,...words].map((w,i)=><span key={k+i}>{w}<em>✦</em></span>)}</div>;return <div className="marquee" aria-hidden="true">{row('r1')}{row('r2')}</div>}
function Stats(){
 const ref=useRef(null);const yrs=new Date().getFullYear()-1969;
 const data=[[72,'Flights flown by Ingenuity on Mars'],[yrs,'Years since Apollo 11 landed'],[4,'Machines in the collection'],[3,'Destinations: Moon, Mars, deep space']];
 useEffect(()=>{const nums=ref.current.querySelectorAll('.stat-num');if(matchMedia('(prefers-reduced-motion: reduce)').matches){nums.forEach(n=>{n.textContent=n.dataset.to});return}
  const ctx=gsap.context(()=>{nums.forEach(n=>{const o={v:0};gsap.to(o,{v:+n.dataset.to,duration:1.8,ease:'power2.out',scrollTrigger:{trigger:n,start:'top 92%',once:true},onUpdate:()=>{n.textContent=Math.round(o.v)}})})},ref);return()=>ctx.revert()},[]);
 return <section className="stats" ref={ref}><div className="section-shell stats-grid">{data.map(([n,l],i)=><div className="stat glass" key={i} data-reveal><b className="stat-num" data-to={n}>0</b><span>{l}</span></div>)}</div></section>}
function App(){useReveal();useScrollFX();useTilt();const[user,setUser]=useState(null),[authMode,setAuthMode]=useState(null),[adventure,setAdventure]=useState(false);useEffect(()=>{if(!auth)return;return onAuthStateChanged(auth,setUser)},[]);const start=()=>{if(user)setAdventure(true);else setAuthMode('register')};const closeAuth=()=>setAuthMode(null);const completed=()=>{closeAuth();setAdventure(true)};const logout=async()=>{if(auth)await signOut(auth);setUser(null);setAdventure(false)};return <><Cosmos/><ScrollUI/><CursorGlow/><Navbar onAuth={setAuthMode} user={user} onLogout={logout} onAdventure={()=>setAdventure(true)}/><main><Hero onStart={start}/><Marquee/><About/><Stats/><Features onStart={start}/><Timeline/><Cards onStart={start}/><How onStart={start}/><FinalCTA onStart={start}/></main><Footer/>{authMode&&<AuthModal mode={authMode} setMode={setAuthMode} onClose={closeAuth} onComplete={completed}/>}{adventure&&<AdventurePreview user={user} onClose={()=>setAdventure(false)}/>}</>}
createRoot(document.getElementById('root')).render(<App/>);