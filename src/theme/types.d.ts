import { Custom_Storage_Event } from "@/theme/config";

declare global {
  interface WindowEventMap {
    'customStorageEvent': Custom_Storage_Event
  }
}