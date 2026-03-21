document.addEventListener('DOMContentLoaded', function(){
  const btn = document.querySelector('.nav-toggle')
  const nav = document.getElementById('main-navigation')
  if(!btn || !nav) return
  btn.addEventListener('click', ()=>{
    const isOpen = nav.classList.toggle('open')
    btn.setAttribute('aria-expanded', String(isOpen))
  })
})
