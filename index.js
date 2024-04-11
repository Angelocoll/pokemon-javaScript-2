let selectElement = document.getElementById("dropdown1");
let selectElement2 = document.getElementById("dropdown2");
let pokemonInfoElement = document.getElementById("pokemonInfo1");
let pokemonInfoElement2 = document.getElementById("pokemonInfo2");
let compareBtn = document.getElementById("compareBtn");
let startBattleBtn = document.getElementById("startBattleBtn");
let pokemonBattleLog = document.getElementById("pokemonBattleInfo");
//skapar en array för att lägga den hämtade datan nånstans
let pokemons = [];

class Pokemon {
  constructor(name, image, types, weight, height, stats, moves) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
    this.moves = moves;
  }
  //skriv ut allt på sidan funktion
  //Objekt.entires tar in ett objekt och returnerar arrayer per key och value må säga att vi har ett objekt {namn:angelo, age:24 hp:12} så skapas det en array för varje key och value ["namn","angelo"] , ["age", 24]
  //sedan använder vi map() för att skapa en ny array kopia av den gamla
  //join() functionen används för att dra alla värden från en array och skapa en string utav dom i detta fall drar den från arrayen vid namn types.
  displayInfo(container) {
    container.innerHTML = `
      <h2>${this.name}</h2>
      <img src="${this.image}">
      <p>Types: ${this.types.join(", ")}</p>
      <p>Weight: ${this.weight}</p>
      <p>Height: ${this.height}</p>
      <p>Stats:</p>
      <ul>
        ${Object.entries(this.stats)
          .map(
            ([stat, value]) => `<li data-stat="${stat}">${stat}: ${value}</li>`
          )
          .join("")}
      </ul>
    `;
  }

  //jämnför pokemon funktionen
  compare(otherPokemon) {
    try {
      let thisBetterStatsCount = 0;
      let otherBetterStatsCount = 0;

      for (let stat in this.stats) {
        let stat1Value = this.stats[stat];
        let stat2Value = otherPokemon.stats[stat];

        if (stat1Value > stat2Value) {
          thisBetterStatsCount++;
          pokemonInfoElement.querySelector(
            `li[data-stat="${stat}"]`
          ).style.backgroundColor = "green";
          pokemonInfoElement2.querySelector(
            `li[data-stat="${stat}"]`
          ).style.backgroundColor = "red";
        } else if (stat1Value < stat2Value) {
          otherBetterStatsCount++;
          pokemonInfoElement.querySelector(
            `li[data-stat="${stat}"]`
          ).style.backgroundColor = "red";
          pokemonInfoElement2.querySelector(
            `li[data-stat="${stat}"]`
          ).style.backgroundColor = "green";
        } else {
          pokemonInfoElement.querySelector(
            `li[data-stat="${stat}"]`
          ).style.backgroundColor = "orange";
          pokemonInfoElement2.querySelector(
            `li[data-stat="${stat}"]`
          ).style.backgroundColor = "orange";
        }
      }

      // Compare weight
      let weightStat1Value = parseFloat(this.weight);
      let weightStat2Value = parseFloat(otherPokemon.weight);

      let weightParagraphs1 = pokemonInfoElement.querySelectorAll("p");
      let weightParagraphs2 = pokemonInfoElement2.querySelectorAll("p");

      if (weightStat1Value > weightStat2Value) {
        weightParagraphs1[1].style.backgroundColor = "green";
        weightParagraphs2[1].style.backgroundColor = "red";
      } else if (weightStat1Value < weightStat2Value) {
        weightParagraphs1[1].style.backgroundColor = "red";
        weightParagraphs2[1].style.backgroundColor = "green";
      } else {
        weightParagraphs1[1].style.backgroundColor = "orange";
        weightParagraphs2[1].style.backgroundColor = "orange";
      }

      // Compare height
      let heightStat1Value = parseFloat(this.height);
      let heightStat2Value = parseFloat(otherPokemon.height);

      let heightParagraphs1 = pokemonInfoElement.querySelectorAll("p");
      let heightParagraphs2 = pokemonInfoElement2.querySelectorAll("p");

      if (heightStat1Value > heightStat2Value) {
        heightParagraphs1[2].style.backgroundColor = "green";
        heightParagraphs2[2].style.backgroundColor = "red";
      } else if (heightStat1Value < heightStat2Value) {
        heightParagraphs1[2].style.backgroundColor = "red";
        heightParagraphs2[2].style.backgroundColor = "green";
      } else {
        heightParagraphs1[2].style.backgroundColor = "orange";
        heightParagraphs2[2].style.backgroundColor = "orange";
      }

      let winnerName;
      if (thisBetterStatsCount > otherBetterStatsCount) {
        winnerName = this.name;
      } else if (thisBetterStatsCount < otherBetterStatsCount) {
        winnerName = otherPokemon.name;
      } else {
        winnerName = "Jämnt";
      }

      let heading = document.querySelector("h1");
      heading.textContent = winnerName;
    } catch (error) {
      console.error("error", error);
    }
  }
}

// Fetcha Pokemon datan
let GetData = async () => {
  try {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    let data = await response.json();
    let pokemonResults = data.results;

    for (let pokemonResult of pokemonResults) {
      let response = await fetch(pokemonResult.url);
      let pokemonData = await response.json();
      //med map hittar vi även pokemonens moves genom att lägga in keyn move och lägger in dom i en instans med pokemonens namn sedan pushar vi in infon i arrayen för att ha en fullt fungerade array
      let moves = pokemonData.moves.map((move) => ({ name: move.move.name }));
      //skapar en instans av dom sedan pushar in dom i min array för att lättare få ut infon
      let newPokemon = new Pokemon(
        pokemonData.name,
        pokemonData.sprites.front_default, //hämtar pokemonens första framside bild fanns back_default för en backshot
        // pokemonData.sprites.back_default, backshoten finns i denna kodraden to see ass
        pokemonData.types.map((type) => type.type.name),
        pokemonData.weight,
        pokemonData.height,
        {
          HP: pokemonData.stats[0].base_stat,
          Attack: pokemonData.stats[1].base_stat,
          Defense: pokemonData.stats[2].base_stat,
          "Special Attack": pokemonData.stats[3].base_stat,
          "Special Defense": pokemonData.stats[4].base_stat,
          Speed: pokemonData.stats[5].base_stat,
        },
        moves
      );

      pokemons.push(newPokemon);
      console.log(pokemons);
      let option = document.createElement("option");
      option.text = pokemonData.name;
      selectElement.add(option);

      let option2 = document.createElement("option");
      option2.text = pokemonData.name;
      selectElement2.add(option2);
    }
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
};

// Eventlistener för dropdownmenyn1 change, change är att den ändras så snabbt den selected i select ändras så snabbt den används så lyssnar den får ett nytt value så lyssnar den till selecten och gör det som ska göras
selectElement.addEventListener("change", (event) => {
  //musik tillägg
  let audio = document.querySelector("audio");
  audio.play();
  try {
    let selectedPokemonName = event.target.value;
    //find letar igenom min array efter pokemonen med samma namn som value av den valda optionen, då jag har pushat in all data från min getdata funtion så ska alla 151 pokemons finnas där med all data
    let selectedPokemon = pokemons.find(
      (pokemon) => pokemon.name === selectedPokemonName
    );
    selectedPokemon.displayInfo(pokemonInfoElement);
  } catch (error) {
    console.error("Error displaying Pokémon info:", error);
  }
});

// Eventlistener för dropdownmenyn2
selectElement2.addEventListener("change", (event) => {
  //musik tillägg
  let audio = document.querySelector("audio");
  audio.play();
  try {
    let selectedPokemonName = event.target.value;
    let selectedPokemon = pokemons.find(
      (pokemon) => pokemon.name === selectedPokemonName
    );
    selectedPokemon.displayInfo(pokemonInfoElement2);
  } catch (error) {
    console.error("Error displaying Pokémon info:", error);
  }
});

// Eventlister för jämnföra
compareBtn.addEventListener("click", () => {
  try {
    let pokemon1Name = selectElement.value;
    let pokemon2Name = selectElement2.value;

    //find() tar emot ett värde och letar igenom arrayen efter det värdet tills den ger tillbaka true i detta fallet letar den efter pokemonens namn
    let pokemon1 = pokemons.find((pokemon) => pokemon.name === pokemon1Name);
    let pokemon2 = pokemons.find((pokemon) => pokemon.name === pokemon2Name);

    if (pokemon1 && pokemon2) {
      pokemon1.compare(pokemon2);
    }
  } catch (error) {
    console.error("Error comparing Pokémon:", error);
  }
});

// Eventlistener för fighten
startBattleBtn.addEventListener("click", () => {
  try {
    let pokemon1Name = selectElement.value;
    let pokemon2Name = selectElement2.value;
    //find() tar emot ett värde och letar igenom arrayen efter det värdet tills den ger tillbaka true i detta fallet letar den efter pokemonens namn
    let pokemon1 = pokemons.find((pokemon) => pokemon.name === pokemon1Name);
    let pokemon2 = pokemons.find((pokemon) => pokemon.name === pokemon2Name);

    if (pokemon1 && pokemon2) {
      startBattle(pokemon1, pokemon2);
    }
  } catch (error) {
    console.error("Error starting Pokémon battle:", error);
  }
});

let startBattle = async (pokemon1, pokemon2) => {
  try {
    pokemonBattleLog.innerHTML = ""; // rensa

    let attacker, defender;
    let attackerName, defenderName;
    let attackerHP = pokemon1.stats.HP;
    let defenderHP = pokemon2.stats.HP;

    // högst speed börjar
    if (pokemon1.stats.Speed > pokemon2.stats.Speed) {
      attacker = pokemon1;
      defender = pokemon2;
      attackerName = pokemon1.name;
      defenderName = pokemon2.name;
    } else {
      attacker = pokemon2;
      defender = pokemon1;
      attackerName = pokemon2.name;
      defenderName = pokemon1.name;
    }

    // fortsätt i en loop tills nån utav dom har 0 i hp
    while (attackerHP > 0 && defenderHP > 0) {
      //väljer pokemonens första move i move set hade kunnat välja move 4 då den är thunder bolt på picachu
      let attackName = attacker.moves[0].name;

      let baseDamage =
        attacker.stats.Attack +
        attacker.stats["Special Attack"] -
        (defender.stats.Defense + defender.stats["Special Defense"] * 0.8);

      let damage;

      if (baseDamage < 10) {
        damage = 10;
      } else {
        damage = baseDamage;
      }

      defenderHP -= damage;

      let battleMessage = `${attackerName} använde ${attackName} och gjorde ${damage} skada. ${defenderName} kvarstående HP: ${defenderHP}.`;

      let logEntry = document.createElement("p");
      logEntry.textContent = battleMessage;
      pokemonBattleLog.appendChild(logEntry);

      //byt roll på vems tur som attackerar
      [attacker, defender] = [defender, attacker];
      [attackerName, defenderName] = [defenderName, attackerName];
      [attackerHP, defenderHP] = [defenderHP, attackerHP];

      await new Promise((resolve) => setTimeout(resolve, 2000)); // vänta 2 sekunder innan nästa rond
    }

    // skriv ut resultatet när nån når 0 hp
    let winner = attackerHP > 0 ? attackerName : defenderName;
    let battleResult = `${winner} vinner fighten!`;
    let resultEntry = document.createElement("p");
    resultEntry.textContent = battleResult;
    pokemonBattleLog.appendChild(resultEntry);
  } catch (error) {
    console.error("Error during Pokémon battle:", error);
  }
};
//starta hämtningen av pokemon
GetData();
