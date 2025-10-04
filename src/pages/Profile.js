import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles.css";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Handle avatar update
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      // Save avatar in Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { photoURL: base64String });

      setUserData((prev) => ({ ...prev, photoURL: base64String }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <p className="loading-text">Loading profile...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Avatar with edit pencil */}
        <div className="avatar-wrapper">
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="Profile" className="profile-pic" />
          ) : (
            <div className="profile-pic-placeholder">
              {userData?.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          {/* ✏️ Pencil overlay */}
          <label htmlFor="avatarUpload" className="edit-avatar">
            ✏️
          </label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Username + Status */}
        <h2 className="username">👤 {userData?.username}</h2>
        <p className="status"><strong>Status:</strong> 🟢 Online</p>
      </div>
    </div>
  );
}

export default Profile;
