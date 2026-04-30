// ================================================================
// AgricFi — Firebase Integration (app.js)
// Replace placeholder values below with your actual Firebase config
// ================================================================

import { initializeApp }       from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment }
  from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ── CONFIG (replace with your Firebase project values) ──
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── PROVIDERS ──
const googleProvider  = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// ── AUTH STATE ──
onAuthStateChanged(auth, (user) => {
  if (user) {
    showDashboard(user);
  } else {
    const gate = document.getElementById('inc-gate');
    if (gate) gate.style.display = 'flex';
    const dash = document.getElementById('inc-dash');
    if (dash) dash.style.display = 'none';
  }
});

// ── LOGIN ──
window.loginGoogle = async () => {
  try {
    const res  = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName, email: user.email, points: 0, tasks: {}
    }, { merge: true });
    showDashboard(user);
  } catch (err) { console.error('Google login error:', err); }
};

window.loginTwitter = async () => {
  try {
    const res  = await signInWithPopup(auth, twitterProvider);
    const user = res.user;
    await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName, provider: 'twitter', points: 0, tasks: {}
    }, { merge: true });
    showDashboard(user);
  } catch (err) { console.error('Twitter login error:', err); }
};

window.logoutUser = async () => {
  await signOut(auth);
};

// ── DASHBOARD ──
function showDashboard(user) {
  const gate = document.getElementById('inc-gate');
  const dash = document.getElementById('inc-dash');
  if (gate) gate.style.display = 'none';
  if (dash) dash.style.display = 'block';
  const uname = document.querySelector('.inc-uname');
  if (uname) uname.textContent = user.displayName || 'User';
}

// ── TASK SYSTEM ──
window.performTask = async (taskId, taskUrl) => {
  const user = auth.currentUser;
  if (!user) { alert('Please sign in first.'); return; }
  window.open(taskUrl || 'https://x.com/agric_fi', '_blank');
  await setDoc(doc(db, 'users', user.uid), {
    [`tasks.${taskId}`]: 'in_progress'
  }, { merge: true });
};

window.verifyTask = async (taskId, taskPoints) => {
  const user = auth.currentUser;
  if (!user) { alert('Please sign in first.'); return; }

  const ref  = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();

  if (!data) return;
  if (data.tasks?.[taskId] === 'verified') { alert('Task already verified!'); return; }
  if (data.tasks?.[taskId] !== 'in_progress') { alert('Please click the task button first.'); return; }

  setTimeout(async () => {
    await updateDoc(ref, {
      [`tasks.${taskId}`]: 'verified',
      points: increment(taskPoints || 10)
    });
    alert(`+${taskPoints || 10} points earned! Task verified.`);
  }, 2000);
};
