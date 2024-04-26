// For bookmarks creation
import React from "react";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBm_qDRF7t6-6VYYw0zEZ2UmA3G1uN08Ms",
  authDomain: "web-project-storage.firebaseapp.com",
  projectId: "web-project-storage",
  storageBucket: "web-project-storage.appspot.com",
  messagingSenderId: "529105109859",
  appId: "1:529105109859:web:d193dd87759bfaf1790956",
  measurementId: "G-EQPYNTG8CB",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  increment,
  limit,
  getDocs,
} from "firebase/firestore";

chrome.bookmarks.onCreated.addListener((id, bookmarkNode) => {
  if (!bookmarkNode.url) return;

  chrome.tabs.query({ url: bookmarkNode.url }, (tabs) => {
    if (tabs.length === 0) return;

    const tab = tabs[0];
    promptUserForPreference(bookmarkNode.url);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    promptUserForFeedback(tab.url);
  }
});

const promptUserForFeedback = async (url) => {
  // console.log(JSON.stringify(url));
  const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    console.log(2);
    chrome.notifications.create({
      type: "basic",
      iconUrl:
        "https://res.cloudinary.com/dmpx9tjf3/image/upload/v1698571992/neoff/iftbzuq328fro5eovolr.png", // You can provide the path to your extension's icon or another relevant icon
      title: "NeOff wants to know...",
      message: "Do you like this recommendation?",
      buttons: [{ title: "Yes" }, { title: "No" }],
    });
  }
  // Add any other logic you want for this function
};

function showNotification(title, message) {
  chrome.notifications.create("Id", {
    type: "basic",
    iconUrl:
      "https://res.cloudinary.com/dmpx9tjf3/image/upload/v1698571992/neoff/iftbzuq328fro5eovolr.png", // Path to your extension's icon or any other asset
    title: title,
    message: message,
  });
}
const like = async function (url, name) {
  const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    let ref = querySnapshot.docs[0].ref;
    let ret = await updateDoc(ref, {
      like: increment(1),
    });
  } else {
    const docRef = await addDoc(collection(db, "urls"), {
      dislike: 0,
      iconUrl: `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=16`,
      like: 0,
      name: name,
      report: 0,
      url: url,
      totalViewed: 0,
    });
  }
};
function promptUserForPreference(url) {
  chrome.notifications.create({
    type: "basic",
    title: "NeOff wants to know...",
    message: `Do you like this website?`,
    iconUrl:
      "https://res.cloudinary.com/dmpx9tjf3/image/upload/v1698571992/neoff/iftbzuq328fro5eovolr.png",
    buttons: [{ title: "Share!" }, { title: "Never!" }],
  });
}

chrome.notifications.onButtonClicked.addListener((thisNoteId, buttonIndex) => {
  console.log(buttonIndex);
  console.log(20);
  switch (buttonIndex) {
    case 0:
      // Code for Button 1

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        like(currentTab.url, currentTab.title); // Log the URL of the current tab
      });

      break;
    case 1:
      // Code for Button 2
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        dislike(currentTab.url); // Log the URL of the current tab
      });
      break;
  }
});

const dislike = async function (url) {
  const q = query(collection(db, "urls"), where("url", "==", url), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    let ref = querySnapshot.docs[0].ref;
    let ret = await updateDoc(ref, {
      dislike: increment(1),
    });
  } else {
    return;
  }
};
