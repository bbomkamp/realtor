# Realtor Web App
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

his is a web application built for real estate agents to manage their property listings and client information. The app allows agents to add, edit, and delete property listings, as well as view and manage client information.
<br />
## Technologies Used
The app is built using the following technologies:
* Node.js
* Express
* MongoDB
* React
* Redux
* Bootstrap
<br />

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

## Build
```





