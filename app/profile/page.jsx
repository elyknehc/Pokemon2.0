"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import loadingGif from "../components/loading.gif";
import {
	collection,
	getDoc,
	querySnapshot,
	query,
	where,
	onSnapshot,
	doc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";
import PokemonItem from "../components/PokemonItem";

const page = () => {
	const { user } = UserAuth();
	const [loading, setLoading] = useState(true);
	const [savedPokemon, setSavedPokemon] = useState([]);

	const deletePokemon = async (id) => {
		try {
			await deleteDoc(doc(db, "savedPokemon", id));
		} catch (error) {
			console.error("Error deleting Pokemon:", error);
		}
	};

	useEffect(() => {
		const checkAuthentication = async () => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setLoading(false);
		};

		checkAuthentication();
	}, [user, savedPokemon]);

	useEffect(() => {
		const fetchSavedPokemon = async () => {
			try {
				if (user) {
					const q = query(
						collection(db, "savedPokemon"),
						where("user", "==", user.uid)
					);
					const unsubscribe = onSnapshot(q, (querySnapshot) => {
						const pokemon = [];
						querySnapshot.forEach((doc) => {
							const pokemonData = doc.data();
							const pokemonWithId = { ...pokemonData, id: doc.id };
							pokemon.push(pokemonWithId);
						});
						setSavedPokemon(pokemon);
					});
					return unsubscribe;
				}
			} catch (error) {
				console.error("Error fetching saved Pokemon:", error);
			}
		};

		fetchSavedPokemon();
	}, [user, savedPokemon]);

	return (
		<div>
			{loading ? (
				<div className="flex justify-center align-items">
					<Image
						height={500}
						width={500}
						src={loadingGif}
						alt="Loading"
						draggable={false}
					/>
				</div>
			) : user ? (
				<h1 className="p-4 bg-blue-400 h-screen">
					<div className="flex flex-wrap">
						{savedPokemon.map((pokemon) => (
							<div className="p-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
								<PokemonItem
									key={pokemon.id}
									id={pokemon.id}
									name={<span className="capitalize">{pokemon.name}</span>}
									image={pokemon.image}
									deletePokemon={deletePokemon}
								/>
							</div>
						))}
					</div>
				</h1>
			) : (
				<h1 className="p-4 bg-blue-300 h-screen">
					You must be logged in to view this page
				</h1>
			)}
		</div>
	);
};

export default page;
