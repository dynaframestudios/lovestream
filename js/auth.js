/* ============================================================
   AUTH.JS — simple password gate for the login screen.

   ⚠️ IMPORTANT — READ THIS:
   This is a static site with no server, so this is NOT real
   security. Anyone who opens the browser dev tools can read
   this file. A genuinely determined person could find a way
   past this. Think of it as a curtain, not a lock — it keeps
   a random person who stumbles on the link from casually
   browsing in, nothing more. Your actual privacy here comes
   from the URL being unlisted, not from this gate.

   TO SET YOUR OWN PASSWORD:
   1. Open the site in a browser (even the current placeholder
      version works), open the console (F12 → Console tab).
   2. Run this, swapping in your real password:
        await hashPassword("your-new-password")
   3. It'll print a long string of letters/numbers — copy it.
   4. Paste it as the value of PASSWORD_HASH below, replacing
      the existing one.

   Default password right now is: ourlovestory
   (change it before you send the link!)
   ============================================================ */

const PASSWORD_HASH = "56f880ed866ee93e87de10e25115ee50a80b0951d659d4c00b6f02592c5002ee";

async function hashPassword(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
window.hashPassword = hashPassword; // exposed so you can hash a new password from the console

const UNLOCK_KEY = "lovestream_unlocked";

document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("screen-login");
  const profilesScreen = document.getElementById("screen-profiles");
  const form = document.getElementById("login-form");
  const input = document.getElementById("login-password");
  const error = document.getElementById("login-error");

  // Already unlocked on this device/browser — skip straight to profiles.
  if (localStorage.getItem(UNLOCK_KEY) === "1") {
    loginScreen.classList.add("hidden");
    profilesScreen.classList.remove("hidden");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const hash = await hashPassword(input.value);
    if (hash === PASSWORD_HASH) {
      localStorage.setItem(UNLOCK_KEY, "1");
      loginScreen.classList.add("hidden");
      profilesScreen.classList.remove("hidden");
    } else {
      error.textContent = "That's not it — try again.";
      input.value = "";
      input.focus();
    }
  });
});
