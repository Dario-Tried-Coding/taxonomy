import { auth } from "@/lib/next-auth";
import { cache } from "react";

export const getSession = cache(auth)