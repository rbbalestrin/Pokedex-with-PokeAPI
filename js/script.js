const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonTypes = document.querySelector('.poke-types');
const pokemonDesc = document.querySelector('.poke-desc');


const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fairy: '#ffdcff',
    fighting: '#2F2F2F',
    default: '#2A1A1F',
};



const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    const description = await fetchPokemonDescription(data.species.url);
    return { ...data, description };
  }
}

const fetchPokemonDescription = async (url) => {
  const APIResponse = await fetch(url);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    const englishDescription = data.flavor_text_entries.find(entry => entry.language.name === 'en');
    return englishDescription.flavor_text;
  }
}


const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';
  pokemonImage.innerHTML = '';
  pokemonTypes.innerHTML = '';
  pokemonDesc.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) { 
    const { types, description } = data;
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    renderPokemonTypes(types);
    pokemonDesc.innerHTML = description;
    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
    pokemonImage.setAttribute('src', 'poke-shadow.png');
    pokemonImage.style.background =  '#fff';
    pokemonTypes.innerHTML = '';
    pokemonStats.innerHTML = '';
    pokemonDesc.innerHTML = '';
  }
}


const renderPokemonTypes = types => {
    types.forEach(type => {
        const typeTextElement = document.createElement("div");
        typeTextElement.style.color = typeColors[type.type.name];
        typeTextElement.textContent = type.type.name;
        pokemonTypes.appendChild(typeTextElement);
    });
}

const renderPokemonStats = stats => {
    stats.forEach(stat => {
        const statElement = document.createElement("div");
        const statElementName = document.createElement("div");
        const statElementAmount = document.createElement("div");
        statElementName.textContent = stat.stat.name;
        statElementAmount.textContent = stat.base_stat;
        statElement.appendChild(statElementName);
        statElement.appendChild(statElementAmount);
        pokemonStats.appendChild(statElement);
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});
  
buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
      searchPokemon -= 1;
      renderPokemon(searchPokemon);
    }
});
  
buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});
  
renderPokemon(searchPokemon);