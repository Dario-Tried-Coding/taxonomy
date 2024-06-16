import { Locale } from "@/lib/next-intl/config";
import { z } from "zod";

export const Route = {
  name: 'Locale',
  params: z.object({
    lang: z.custom<Locale>(),
  }),
}

export const PATH = '/docs/[lang]'