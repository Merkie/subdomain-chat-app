import { browser } from "$app/environment";
import { writable, type Writable } from "svelte/store";

export const Username: Writable<string> = writable("");

if(browser) {
  Username.set(localStorage.getItem("username") || "");
  Username.subscribe((value) => {
    localStorage.setItem("username", value);
  });
}