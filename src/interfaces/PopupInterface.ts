export interface AppSettings {
  isDarkMode: boolean;
  tags: string[];
}


export interface AppProfile {
  id: string;
  name: string;
  status: boolean;
  lastRun: Date | null;
  actions: AppAction[];
}

export interface AppAction {
  name: string;
  method: "GET" | "POST" | "PUT";
  url: string;
  headers: Record<string, string>;
  data: Record<string, string>;
}
