"use client";
import CodeEditor from "@/components/code-editor/code-editor";
import SideBarComponent from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { upload } from "@/utils/api-utils/s3util";
import { generateUUID } from "@/utils/uuid";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { useSearchParams } from "next/navigation";

export default function Home() {

}
