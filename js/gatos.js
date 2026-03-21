async function cargarGatos(){

  // Load static JSON data
  let respuesta = await fetch("Data/gatos.json")
  let gatos = await respuesta.json()

  let contenedor = document.getElementById("gatos")

  if(!contenedor) contenedor = document.getElementById("lista-gatos")

  gatos.forEach(g => {

    let tarjeta = document.createElement("div")
    tarjeta.className = "card"

    tarjeta.innerHTML = `
      <img src="${g.foto}" alt="Foto de ${g.nombre || 'gato'}" loading="lazy">
      <h3>${g.nombre}</h3>
      <p class="meta">${g.edad || ''}</p>
      <p class="desc">${g.descripcion || ''}</p>
    `

    // data attributes for filtering/search
    if(g.nombre) tarjeta.dataset.nombre = g.nombre.toString().toLowerCase()
    if(g.edad) tarjeta.dataset.edad = g.edad.toString().toLowerCase()

    contenedor.appendChild(tarjeta)

  })

  // after rendering, initialize client-side filters if toolbar exists
  setTimeout(() => {
    initGatosFilters()
  }, 60)

}

function initGatosFilters(){
  const search = document.getElementById('search-gatos')
  const filterEdad = document.getElementById('filter-edad')
  const noResults = document.getElementById('no-results')

  function filterCards(){
    const cards = document.querySelectorAll('#gatos .card')
    const q = search && search.value.trim().toLowerCase()
    const edad = filterEdad && filterEdad.value
    let visible = 0

    cards.forEach(c => {
      let textMatch = true
      let edadMatch = true

      if(q){
        const nombre = c.dataset.nombre || ''
        const desc = (c.querySelector('.desc') && c.querySelector('.desc').textContent) || ''
        textMatch = nombre.includes(q) || desc.toLowerCase().includes(q)
      }

      if(edad){
        edadMatch = (c.dataset.edad || '').includes(edad.toLowerCase())
      }

      if(textMatch && edadMatch){
        c.hidden = false
        visible++
      } else {
        c.hidden = true
      }
    })

    if(noResults) noResults.hidden = visible > 0
  }

  if(search) search.addEventListener('input', filterCards)
  if(filterEdad) filterEdad.addEventListener('change', filterCards)
  // initial filter pass
  filterCards()
}

cargarGatos()
