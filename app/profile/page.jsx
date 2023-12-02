"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import {
	collection,
	getDoc,
	querySnapshot,
	query,
	where,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Image from "next/image";

const page = () => {
	const { user } = UserAuth();
	const [loading, setLoading] = useState(true);
	const [savedPokemon, setSavedPokemon] = useState([]);

	useEffect(() => {
		const checkAuthentication = async () => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setLoading(false);
		};
		checkAuthentication();
	}, [user]);

	useEffect(() => {
		const fetchSavedPokemon = async () => {
			const q = query(
				collection(db, "savedPokemon")
				// where("user", "==", user.uid)
			);
			const unsubscribe = onSnapshot(q, (querySnapshot) => {
				const pokemon = [];
				querySnapshot.forEach((doc) => {
					pokemon.push(doc.data());
				});
				setSavedPokemon(pokemon);
			});
			return unsubscribe;
		};

		fetchSavedPokemon();
	}, [user]);

	return (
		<div>
			{loading ? (
				<p> Loading...</p>
			) : user ? (
				<h1 className="p-4"> Welcome, {user.displayName} </h1>
			) : (
				<h1 className="p-4"> You must be logged in to view this page </h1>
			)}
			<div className="flex align-items">
				{savedPokemon.map((pokemon) => (
					<div key={pokemon.id}>
						<div>
							<Image src={pokemon.image} width={100} height={100} />
							<p>{pokemon.name}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default page;
