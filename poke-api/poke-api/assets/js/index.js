// Paleta de colores
const typeColor = {
    bug: "#26de81",
    dragon: "#ffeaa7",
    electric: "#fed330",
    fairy: "#FF0069",
    fighting: "#30336b",
    fire: "#f0932b",
    flying: "#81ecec",
    grass: "#00b894",
    ground: "#EFB549",
    ghost: "#a55eea",
    ice: "#74b9ff",
    normal: "#95afc0",
    poison: "#6c5ce7",
    psychic: "#a29bfe",
    rock: "#2d3436",
    water: "#0190FF",
};

// Función para obtener los datos de la API
async function getData(url) {
    try {
        const response = await fetch(url);
        console.log("EL STATUS DE LA LLAMADA FUE: ", response.status); 
        const data = await response.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.error("ERROR: ", error);
    }  
};

let mergedPokemonData = [];

// Se obtienen los primeros 20 pokemon
const pkmnData = await getData("https://pokeapi.co/api/v2/pokemon?limit=20")
console.log(pkmnData);

// Se obtienen los detalles de cada pokemon
// Obtener los detalles de cada Pokémon y fusionarlos
mergedPokemonData = await Promise.all(
    pkmnData.results.map(async (pkmn) => {
        const pkmnDetails = await getData(pkmn.url);
        return {
            ...pkmn,
            stats: pkmnDetails.stats,
            types: pkmnDetails.types,
            sprites: pkmnDetails.sprites,
        };
    })
);

console.log(mergedPokemonData);


function generateCard(pkmn, index) {

    let img = pkmn.sprites.other['official-artwork'].front_default
    let name_first_letter = pkmn.name[0].toUpperCase()
    let rest_name = pkmn.name.slice(1)
    let name = name_first_letter + rest_name
    let type_first_letter = pkmn.types[0].type.name[0].toUpperCase()
    let type_rest_name = pkmn.types[0].type.name.slice(1)
    let type_name = type_first_letter + type_rest_name

    let hp = pkmn.stats[0]["base_stat"]
    let atk = pkmn.stats[1]["base_stat"]
    let def = pkmn.stats[2]["base_stat"]
    let spd = pkmn.stats[5]["base_stat"]

    
    
    return `
    
    <div id=contenedor class="container">
        <div id="card" class="card-${index}">

            <p class="hp">
                <span>HP</span>
                ${hp}
              </p>
              <img src='${img}' />
              <h2 class="poke-name">${name}</h2>
              <div class="types">
               <span>${type_name}</span>
              </div>
              <div class="stats">
                <div>
                  <h3>${atk}</h3>
                  <p>Attack</p>
                </div>
                <div>
                  <h3>${def}</h3>
                  <p>Defense</p>
                </div>
                <div>
                  <h3>${spd}</h3>
                  <p>Speed</p>
                </div>
              </div>

        </div>
       
    </div>`
};

// Esta función colorea cada una de las cards según tipo
function colorBackground(type, index){
    let color = typeColor[type]

    let nodo = document.querySelector(`.card-${index}`)
    nodo.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ebe4e4 20%)`
}

// Se apunta al nodo del documento que queremos modificar
let contenedorExt = document.querySelector('#cont-ext');

// Se genera un bucle para generar las 20 cards
for (let i=0 ; i <= mergedPokemonData.length ; i++) {
    
    // Se añade el elemento al contenedor
    contenedorExt.innerHTML = contenedorExt.innerHTML + generateCard(mergedPokemonData[i], i)

    //Se añade el color del background
    colorBackground(mergedPokemonData[i].types[0].type.name, i)


}

