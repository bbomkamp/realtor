import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";

export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocationEnabled, setGeolocationEnbled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "sell",
    name: "",
    bedroom: 1,
    bathroom: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });

  const {
    type,
    name,
    bedroom,
    bathroom,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountPrice,
    latitude,
    longitude,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // For Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  // Submit Everything to the firbase
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discount should be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("6 images maximum");
      return;
    }

    // Fetching Google Geolocation API
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );

      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined || location.includes("underfined")) {
        setLoading(false);
        toast.error("Please enter correct location");
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
            return null;
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            reject(error);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images could not be uploaded!");
      return [];
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formData.offer && delete formDataCopy.discountPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listings created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  // Insert Loading Component to Create Listing Page
  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex">
          <button
            type="button"
            id="type"
            value="sell"
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              type === "rent" ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              type === "sell" ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="50"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
          transition duration-200 ease-in-out focus:text-gray-700 focus:gb-white focus:border-slate-600
          mb-6"
        />
        <div className="flex space-x-6 justify-start mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              placeholder="1"
              id="bedroom"
              value={bedroom}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border 
              border-gray-300 rounded transition duration-200 ease-in-out 
              focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              onChange={onChange}
              min="1"
              max="10"
              required
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              placeholder="1"
              id="bathroom"
              value={bathroom}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border 
              border-gray-300 rounded transition duration-200 ease-in-out 
              focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
              onChange={onChange}
              min="1"
              max="10"
              required
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              !parking ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              parking ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              !furnished ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              furnished ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
          transition duration-200 ease-in-out focus:text-gray-700 focus:gb-white focus:border-slate-600
          mb-6"
        />
        {!geolocationEnabled && (
          <div className="flex space-x-6 justify-start mb-6">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700
                bg-white border border-gray-300 rounded transition duration-200 ease-in-out
                focus:bg-white focus:text-gray-700 focus:border-slate-600
                text-center"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700
                bg-white border border-gray-300 rounded transition duration-200 ease-in-out
                focus:bg-white focus:text-gray-700 focus:border-slate-600
                text-center"
              />
            </div>
          </div>
        )}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
          transition duration-200 ease-in-out focus:text-gray-700 focus:gb-white focus:border-slate-600
          mb-6"
        />

        <p className="text-lg font-semibold">Offer</p>
        <div className="flex">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              !offer ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase
            shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg
            transition duration-200 ease-in-out w-full ${
              offer ? "bg-white" : "bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>
        <div className="mt-6 flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div>
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="mt-6 flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discount price</p>
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountPrice"
                  value={discountPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white
                border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white
                focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">The first image will be cover (max 6)</p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png, .jpeg"
            multiple
            required
            className="w-full px-3 py-2 text-gray-700 border border-gray-300 bg-white
                      transition duration-200 ease-in-out rounded focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="my-6 w-full px-7 p-3 bg-blue-600 text-white
               font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700
               hover:shadow-lg focus:bg-blue-700 focus:shadow-lg
               active:bg-blue-800 active:shadow:shadow-700 transition duration-200
               ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}