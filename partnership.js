const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reducedMotion && 'IntersectionObserver' in window){
 document.documentElement.classList.add('js-motion');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.06});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
const toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('mobile-nav');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');menu.hidden=true;}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.hidden=!open;});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const progress=document.querySelector('.scroll-progress');
function updateProgress(){document.querySelector(".site-header").classList.toggle("is-solid",document.querySelector(".partnership-opening").getBoundingClientRect().bottom<=document.querySelector(".site-header").offsetHeight);const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${range>0?Math.min(1,scrollY/range):0})`;}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
