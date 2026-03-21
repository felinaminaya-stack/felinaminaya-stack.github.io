document.getElementById("form-gato").addEventListener("submit",function(e){

e.preventDefault()

let gato = {

nombre: document.getElementById("nombre").value,
edad: document.getElementById("edad").value,
descripcion: document.getElementById("descripcion").value,
foto: document.getElementById("foto").value

}

console.log("Nuevo gato:",gato)

alert("Copia este objeto en gatos.json")

})