"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CodeEditor from "@/components/code-editor/code-editor";
import SideBarComponent from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { getFileData, getFileUrl, upload } from "@/utils/api-utils/s3util";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { fromExtension } from "@/utils/language-util";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserId } from "@/utils/userUtil";
import { getSizeInBytes } from "@/utils/util";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

export default function FilePage() {
	const router = useRouter();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	const [pathUserId, pathFileName] = pathname.split("/").filter((ele) => ele);

	const [userId, setUserId] = useState<null | string>(pathUserId);

	const [servePayload, setServePayload] = useState<servePayloadType>({
		fileName: pathFileName,
		fileBody: "",
	});

	const [indexData, setIndexData] = useState<{
		[key: string]: {
			name: string;
			size: number;
			lastUpdated: Date;
		};
	} | null>(null);

	const [debouncedFileName] = useDebounce(servePayload.fileName, 1000);
	const language = fromExtension(`.${pathFileName.split(".")[1]}`);

	if (getUserId() != userId) goTo(getUserId(), "hello.txt", true);

	useEffect(() => {
		populateUserIdAndFileName();
	}, []);

	useEffect(() => {
		if (userId) {
			goTo(userId, debouncedFileName, true);
		}
	}, [debouncedFileName]);

	interface servePayloadType {
		fileName: string;
		fileBody: string;
	}

	async function populateUserIdAndFileName() {
		const [userId, fileName] = pathname.split("/").filter((ele) => ele);
		setUserId(userId);
		updateServePayloadName(fileName);

		try {
			const fileData = await getFileData(`${userId}/${fileName}`);
			updateServePayloadBody(fileData);
		} catch (error: any) {
			toast.error(error.message);
		}

		try {
			const indexData = await getFileData(`${userId}.json`);
			setIndexData({ ...indexData });
		} catch (error) {
			await upload({ fileName: `${userId}.json`, fileBody: JSON.stringify({}) });
			setIndexData((prev) => ({ ...{} }));
		}
	}

	function updateServePayloadBody(updatedBody: string) {
		const newPayload = { ...servePayload, fileBody: updatedBody };
		updateServePayload(newPayload);
	}

	function updateServePayloadName(updatedName: string) {
		const newPayload = { ...servePayload, fileName: updatedName };
		updateServePayload(newPayload);
	}

	function updateServePayload(updatedServePayload: servePayloadType) {
		setServePayload(updatedServePayload);
	}

	async function upToS3() {
		try {
			if (!userId) throw Error("No userId");
			if (!servePayload) throw Error("No serve payload");
			if (!servePayload.fileName) throw Error("No file name");
			if (!servePayload.fileBody) throw Error("No file body");
			await upload({ fileName: `${userId}/${servePayload.fileName}`, fileBody: servePayload.fileBody });
			toast.success("Uploaded successfully");
			addFileToIndexData(servePayload.fileName, getSizeInBytes(servePayload.fileBody));
		} catch (error: any) {
			toast.error(error.message);
		}
	}

	async function addFileToIndexData(filename: string, fileSize: number) {
		const newIndexData = indexData;
		newIndexData[filename] = { name: filename, size: fileSize, lastUpdated: new Date() };
		try {
			await upload({ fileName: `${userId}.json`, fileBody: JSON.stringify(newIndexData) });
			setIndexData({ ...newIndexData });
			toast.success("Updated Index");
		} catch (error) {
			toast.warning("Failed to update Index");
		}
	}

	function goTo(userId: string, filename: string, pageReload = true) {
		router.push(`/${userId}/${filename}`, { scroll: pageReload });
	}

	async function copyToClipboard() {
		try {
			const fileUrl = getFileUrl(`${userId}/${servePayload?.fileName}`);

			if (fileUrl === null) throw Error("file url is null");

			navigator.clipboard
				.writeText(fileUrl)
				.then(() => {
					toast.success("Copied successfully");
				})
				.catch(() => {});
		} catch (error: any) {
			toast.error(error.message);
		}
	}

	function getIndexDataList() {
		return Object.keys(indexData).map((key) => {
			return { ...indexData[key] };
		});
	}

	return (
		<>
			<Toaster />
			<SideBarComponent groupLabel="History">
				{indexData ? (
					getIndexDataList().map(({ name, size, lastUpdated: lastUpdatedStr }) => {
						const lastUpdated = new Date(lastUpdatedStr);

						return (
							<SidebarMenuItem key={name}>
								<SidebarMenuButton asChild>
									<a className="h-20" href={`/${userId}/${name}`}>
										<div className="flex flex-col gap-1">
											<div className="font-bold">{name}</div>

											<div className="flex gap-1 text-gray-500">
												<div className="font-bold text-sm">{(size / 1024).toFixed(2)} kb</div>
												<div>|</div>
												<div className="font-bold text-sm">{lastUpdated.toLocaleDateString()} </div>
											</div>
										</div>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})
				) : (
					<>
						<Skeleton className="h-20 p-2" />
						<Skeleton className="h-16 p-2" />
						<Skeleton className="h-18 p-2" />
						<Skeleton className="h-20 p-2" />
						<Skeleton className="h-14 p-2" />
					</>
				)}
			</SideBarComponent>
			<SidebarTrigger />

			<div className="w-full flex justify-center">
				<div className="w-[90%] flex flex-col gap-2 p-2 m-2">
					<div className="flex  justify-between">
						<div className="font-extrabold text-3xl text-blue-600">JS Serve</div>
						<ThemeToggle />
					</div>
					<div className="flex gap-2">
						<div className="flex flex-grow">
							{/* <Input className="w-12 min-w-12 text-right " disabled value={(userId ?? "...") + " / "} /> */}
							<Input
								className="flex-grow min-w-15 w-15"
								onChange={(e) => {
									updateServePayloadName(e.target.value);
								}}
								value={servePayload?.fileName}
								placeholder="Enter file name"
							/>
						</div>
						<Button onClick={upToS3}>Sync</Button>
						<Button onClick={copyToClipboard} disabled={!servePayload.fileName} variant={"outline"}>
							Copy
						</Button>
					</div>

					<div className="flex-grow">
						<CodeEditor theme={theme} onChange={updateServePayloadBody} value={servePayload.fileBody} language={language} />
					</div>
				</div>
			</div>
		</>
	);
}
