# Realtor Web App
<div align="center">
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
</div>

This is a web application built for real estate agents to manage their property listings and client information. The app allows agents to add, edit, and delete property listings, as well as view and manage client information.

## Technologies Used
The app is built using the following technologies:
* Node.js
* Vite
* React
* TailwindCSS
* Firebase

## Getting Started

To run the app on your machine, follow these steps:
1. Clone the repository to your local machine:

```
git clone https://github.com/bbomkamp/realtor-web-app.git
```
2. Install the dependencies:
```
cd realtor-web-app
npm install
```

3. Create a .env file in the root directory and add the following environment variables:
```
VITE_REACT_APP_GEOCODE_API_KEY=<Your Google Cloud Geocoding Api Key>
```

4. Create a "firebase.js" file in the src directory and add the following environment variables:
```
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "<Your Firebase apiKey>",
  authDomain: "<Your Firebase authDomain>",
  projectId: "<Your FirebaseprojectId >",
  storageBucket: "<Your Firebase storageBucket>",
  messagingSenderId: "<Your Firebase messagingSenderId>",
  appId: "<Your Firebase appId>"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
```

## Development
```
npm run dev
```





