export const apps = ["gTasks", "gCalendar", "chatGpt"] as const;

export function assertApps(obj: Record<string, any>, ignore: string[] = []) {
  for (const app of apps) {
    if (!(app in obj) && !ignore.includes(app)) {
      throw new Error(`Missing app ${app}`);
    }
  }
}
