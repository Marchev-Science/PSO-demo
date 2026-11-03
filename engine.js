(function(root){
'use strict';
const surfaces={
 sphere:{name:'Sphere · smooth gradient',range:5,fn:(x,y)=>x*x+y*y,note:'A convex bowl. Both methods should reach the minimum at (0, 0). A useful baseline.'},
 rastrigin:{name:'Rastrigin · regular ripples',range:5.12,fn:(x,y)=>20+x*x+y*y-10*(Math.cos(2*Math.PI*x)+Math.cos(2*Math.PI*y)),note:'A regular grid of local minima surrounding the global minimum at (0, 0). Try several seeds.'},
 ackley:{name:'Ackley · flat & multimodal',range:5,fn:(x,y)=>-20*Math.exp(-.2*Math.sqrt((x*x+y*y)/2))-Math.exp((Math.cos(2*Math.PI*x)+Math.cos(2*Math.PI*y))/2)+20+Math.E,note:'A broad, rippled plateau with a narrow central basin. Small local gradients can slow descent.'},
 rosenbrock:{name:'Rosenbrock · distorted valley',range:3,fn:(x,y)=>(1-x)**2+100*(y-x*x)**2,note:'A curved, narrow valley with its minimum at (1, 1). Challenging for both methods; more iterations help.'},
 irregular:{name:'Warped ripples · irregular basins',range:5,fn:(x,y)=>{const u=x+.65*Math.sin(1.7*y),v=y+.5*Math.sin(1.3*x);return .45*(u*u+v*v)+3*(Math.sin(2.4*u)**2+Math.sin(3.1*v)**2);},note:'A deterministic warped landscape with irregular basins. Its known global minimum is 0 at (0, 0).'},
 terraces:{name:'Terraces · discontinuous steps',range:5,fn:(x,y)=>Math.floor(2*(x-1.1))**2+Math.floor(2*(y+.7))**2,note:'Flat terraces have zero local gradient almost everywhere. The minimum is a rectangular region, not a unique point.'}
};
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
class Simulation{
 constructor(key='rastrigin',params={},seed=42){this.surface=surfaces[key];this.params={count:50,w:.72,c1:1.49,c2:1.49,vmax:.15,lr:.08,...params};this.random=rng(seed);this.iteration=0;this.evals=0;this.gdEvals=0;this.best={x:0,y:0,f:Infinity};const r=this.surface.range;this.particles=Array.from({length:this.params.count},()=>{let x=(2*this.random()-1)*r,y=(2*this.random()-1)*r,f=this.evaluate(x,y);if(f<this.best.f)this.best={x,y,f};return{x,y,vx:(this.random()-.5)*r*.1,vy:(this.random()-.5)*r*.1,px:x,py:y,pf:f,trail:[]};});this.gd=this.particles.map(p=>({x:p.x,y:p.y,f:this.gEval(p.x,p.y),trail:[]}));this.gdBest=Math.min(...this.gd.map(p=>p.f));this.history=[];this.record();}
 evaluate(x,y){this.evals++;return this.surface.fn(x,y);}gEval(x,y){this.gdEvals++;return this.surface.fn(x,y);}
 record(){this.history.push({iteration:this.iteration,pso:this.best.f,gd:this.gdBest,psoEvaluations:this.evals,gdEvaluations:this.gdEvals});}
 step(compare=true){let p=this.params,r=this.surface.range,cap=p.vmax*2*r,guide={...this.best};for(const a of this.particles){a.trail.push([a.x,a.y]);if(a.trail.length>18)a.trail.shift();for(const [axis,v,b]of[['x','vx','px'],['y','vy','py']]){a[v]=Math.max(-cap,Math.min(cap,p.w*a[v]+p.c1*this.random()*(a[b]-a[axis])+p.c2*this.random()*(guide[axis]-a[axis])));a[axis]+=a[v];if(a[axis]<-r||a[axis]>r){a[axis]=Math.max(-r,Math.min(r,a[axis]));a[v]*=-.5;}}let f=this.evaluate(a.x,a.y);if(f<a.pf){a.pf=f;a.px=a.x;a.py=a.y;}if(f<this.best.f)this.best={x:a.x,y:a.y,f};}
 if(compare)for(const a of this.gd){a.trail.push([a.x,a.y]);if(a.trail.length>18)a.trail.shift();let h=1e-5,dx=(this.gEval(a.x+h,a.y)-this.gEval(a.x-h,a.y))/(2*h),dy=(this.gEval(a.x,a.y+h)-this.gEval(a.x,a.y-h))/(2*h);let rate=p.lr;for(let j=0;j<18;j++){let x=Math.max(-r,Math.min(r,a.x-rate*dx)),y=Math.max(-r,Math.min(r,a.y-rate*dy)),f=this.gEval(x,y);if(f<a.f){a.x=x;a.y=y;a.f=f;break;}rate*=.5;}this.gdBest=Math.min(this.gdBest,a.f);}
 this.iteration++;this.record();}
}
const api={surfaces,Simulation,rng};if(typeof module!=='undefined')module.exports=api;root.PSO=api;
})(typeof window!=='undefined'?window:globalThis);
