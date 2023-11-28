"use client";
import Image from "next/image";
import Filter from "./components/Filter";
import PokemonCard from "./components/PokemonCard";
import { useState } from "react";

export default function Home() {
	const [filter, setFilter] = useState("");

	return (
		<main className="p-4">
			<div className="flex justify-center text-center">
				<div>
					<h1
						style={{
							color: "#FFCB05",
							fontFamily: "Arial",
							fontSize: "24px",
							fontWeight: "bold",
						}}
					>
						Who's that Pokemon?
					</h1>
					<div className="flex">
						<Filter setFilter={setFilter} />
						<PokemonCard filter={filter} />
					</div>
				</div>
			</div>
		</main>
	);
}
