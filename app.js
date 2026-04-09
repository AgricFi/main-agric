// ================= FIREBASE SETUP =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= LOGIN =================
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

window.loginGoogle = async () => {
  const res = await signInWithPopup(auth, googleProvider);
  const user = res.user;

  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    points: 0,
    tasks: {}
  }, { merge: true });

  showDashboard(user);
};

window.loginTwitter = async () => {
  const res = await signInWithPopup(auth, twitterProvider);
  const user = res.user;

  await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    provider: "twitter",
    points: 0,
    tasks: {}
  }, { merge: true });

  showDashboard(user);
};

// ================= UI SWITCH =================
function showDashboard(user) {
  document.getElementById("inc-auth-gate").style.display = "none";
  document.getElementById("inc-dashboard").classList.add("show");

  document.querySelector(".inc-uname").innerText = user.displayName || "User";
}

// ================= TASK SYSTEM =================
window.performTask = async (task) => {
  const user = auth.currentUser;
  if (!user) return alert("Login first");

  window.open("https://x.com/agricfi", "_blank");

  await setDoc(doc(db, "users", user.uid), {
    [`tasks.${task}`]: "in_progress"
  }, { merge: true });

  alert("Task started. Now verify.");
};

window.verifyTask = async (task) => {
  const user = auth.currentUser;
  if (!user) return alert("Login first");

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  if (data.tasks?.[task] === "verified") {
    return alert("Already done");
  }

  if (data.tasks?.[task] !== "in_progress") {
    return alert("Click perform first");
  }

  alert("Verifying...");

  setTimeout(async () => {
    await setDoc(ref, {
      [`tasks.${task}`]: "verified",
      points: (data.points || 0) + 10
    }, { merge: true });

    alert("+10 points earned");
  }, 2000);
};
