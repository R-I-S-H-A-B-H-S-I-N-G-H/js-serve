"use client";

import { getUserId } from "@/utils/userUtil";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();
	useEffect(() => {
		const userId = getUserId();
		console.log(userId);
		goTo(userId);
	}, []);

	function goTo(userId) {
		router.push(`/${userId}/newpage.txt`);
	}

	return <>Redirecting to user page</>;
}
