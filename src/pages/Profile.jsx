// Import necessary Firebase and React libraries
import { getAuth, updateProfile } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FcHome } from "react-icons/fc"
import ListingItem from '../components/ListingItem';

// Define the Profile component
export default function Profile() {

  // Get the authentication object and the navigate hook from the React Router library
  const auth = getAuth();
  const navigate = useNavigate();

  // Set up state for the form data, user listings, and loading state
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Destructure the form data object to access the name and email fields
  const { name, email } = formData;

  // Set up state to determine whether to show the change detail form
  const [changeDetail, setChangeDetail] = useState(false);

  // Function to log out the user
  function onLogout() {
    auth.signOut();
    navigate("/")
  }

  // Function to update the form data whenever a field is changed
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  // Function to handle the form submission
  async function onSubmit() {
    try {
      // Check if the display name has been changed
      if (auth.currentUser.displayName !== name) {
        // Update displayName in Firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        // Update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      // Show a success message if the profile was updated successfully
      toast.success("Profile successfully updated");
    } catch (error) {
      // Show an error message if the profile could not be updated
      toast.error("Could not update profile details")
    }
  }

  // Use an effect to fetch the user's listings when the component mounts
  useEffect(() => {
    async function fetchUserListings() {
      // Create a query to fetch the user's listings
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
      // Fetch the listings and convert the query snapshot into an array of objects
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // Set the listings state and hide the loading spinner
      setListings(listings);
      setLoading(false);
    }

    fetchUserListings();
  }, [auth.currentUser.uid]);// Only re-run the effect when the current user ID changes

  async function onDelete(listingID){
    if(window.confirm("Are you sure you want to delete this listing?")){
      await deleteDoc(doc(db, "listings", listingID))
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };
  function onEdit(listingID){
    navigate(`/edit-listing/${listingID}`);
  };




  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail} onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-red-200 focus:bg-red-200"}`} />
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out' />
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg  mb-6'>
              <p className='flex items-center'>Do you want to change your name?
                <span onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }
                } className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'> {changeDetail ? "Apply change" : "Edit"}</span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>Sign Out</p>
            </div>
          </form>
          <button type="submit" className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>
            <Link to="/create-listing" className='flex justify-center items-center '>
              <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2' />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6'>My listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data} 
                  onDelete={()=>onDelete(listing.id)}
                  onEdit={()=>onEdit(listing.id)}
                  />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
