"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CodeEditor from "@/components/code-editor/code-editor";
import SideBarComponent from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getFileData, getFileUrl, upload } from "@/utils/api-utils/s3util";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import { fromExtension } from "@/utils/language-util";

export default function FilePage() {
	const router = useRouter();
	const pathname = usePathname();

	const [pathUserId, pathFileName] = pathname.split("/").filter((ele) => ele);

	const [userId, setUserId] = useState<null | string>(pathUserId);

	const [servePayload, setServePayload] = useState<servePayloadType>({
		fileName: pathFileName,
		fileBody: "",
	});

	const [debouncedFileName] = useDebounce(servePayload.fileName, 1000);
	const language = fromExtension(`.${pathFileName.split(".")[1]}`);

	useEffect(() => {
		populateUserIdAndFileName();
	}, []);

	useEffect(() => {
		console.log("file name changed to ", debouncedFileName);

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
		} catch (error: any) {
			toast.error(error.message);
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

	return (
		<>
			<Toaster />
			<SideBarComponent></SideBarComponent>
			<SidebarTrigger />

			<div className="w-full flex flex-col gap-2 p-2">
				<Label>FileName</Label>

				<div className="flex gap-2">
					<div className="flex flex-grow">
						<Input className="w-15 min-w-15 text-right " disabled value={(userId ?? "...") + " / "} />
						<Input
							className="flex-grow"
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
					<CodeEditor onChange={updateServePayloadBody} value={servePayload.fileBody} language={language} />
				</div>
			</div>
		</>
	);
}
