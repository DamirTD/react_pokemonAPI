import { useState, useEffect } from "react";
import axios from "axios";
import "./PockemonList.css";

interface Pokemon {
  name: string;
  imageUrl: string;
  types: string[];
}

function PockemonList() {
  const [pockemons, setPockemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon").then((response) => {
      const pokemonDetails: Promise<Pokemon>[] = response.data.results.map(
        (result: any) =>
          axios.get(result.url).then((res: any) => {
            return {
              name: res.data.name,
              imageUrl: res.data.sprites.front_default,
              types: res.data.types.map((type: any) => type.type.name),
            };
          })
      );
      Promise.all(pokemonDetails)
        .then((pokemonDetailsArray: Pokemon[]) => {
          setPockemons(pokemonDetailsArray);
        })
        .catch((error) => {
          console.error("Error", error);
        });
    });
  }, []);

  return (
    <div>
      <h1>Pokemon List</h1>
      <ul>
        {pockemons.map((pokemon: Pokemon) => (
          <li key={pokemon.name}>
            <img src={pokemon.imageUrl} alt={pokemon.name} />
            <div>Name: {pokemon.name}</div>
            <div>Types: {pokemon.types.join(",")}</div>
          </li>
        ))}
      </ul>
      <h2>Made by Damir TD</h2>
    </div>
  );
}

export default PockemonList;
