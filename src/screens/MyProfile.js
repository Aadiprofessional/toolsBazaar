import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskBar from "../components/TaskBar";
import userProfileImage from "../assets/human.png"; 
import { firestore, auth, storage } from "../firebaseConfig"; 
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Modal from "react-modal"; 
import { ToastContainer, toast } from 'react-toastify'; // Importing Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(collection(firestore, "users"), user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
            setNewName(userDoc.data().name);
          } else {
            setError("No such user!");
          }
        } catch (error) {
          setError(`Error fetching user data: ${error.message}`);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleImageUpload = async (file) => {
    if (!file) return;

    const storageRef = ref(storage, `profile-images/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Upload failed:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setNewProfileImage(downloadURL);
        setUploading(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!newName || newName.length > 30) {
      toast.error("Please fill in all fields and ensure the name is 30 characters or less.");
      return;
    }
    if (uploading) return;

    try {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        name: newName,
        profileImage: newProfileImage || userData.profileImage
      });
      setModalIsOpen(false);
      setUserData((prevData) => ({
        ...prevData,
        name: newName,
        profileImage: newProfileImage || prevData.profileImage
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-screen" style={styles.profileScreen}>
      <TaskBar />
      <div style={styles.whiteBox}>
        <div style={styles.grayBox}>
          <div style={styles.profileHeader}>
            <img
              src={userData.profileImage || userProfileImage}
              alt="User Profile"
              style={styles.profileImage}
            />
            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>{userData.name}</h2>
              <p style={styles.profilePhone}>{userData.phoneNumber}</p>
              <p style={styles.profileRewardPoints}>
                Reward Points: {userData.rewardPoints}
              </p>
            </div>
          </div>
        </div>
        <button
          style={styles.editProfileButton}
          onClick={() => setModalIsOpen(true)}
        >
          Edit Profile
        </button>
      </div>
      <p style={styles.termsText}>
        By using this site you agree to{" "}
        <a href="/terms" style={styles.linkText}>
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy" style={styles.linkText}>
          Privacy Policy
        </a>
        .
      </p>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={styles.modal}
        contentLabel="Edit Profile"
      >
        <h2>Edit Profile</h2>
        <div style={styles.modalContent}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name"
            style={styles.input}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            style={styles.input}
          />
          {uploading && <p>Uploading image...</p>}
          <button onClick={handleSubmit} disabled={uploading}>
            Save Changes
          </button>
        </div>
      </Modal>

      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </div>
  );
};

const styles = {
  profileScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  whiteBox: {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    borderRadius: "10px",
    marginTop: "100px",
    width: "100%",
    maxWidth: "600px",
  },
  grayBox: {
    backgroundColor: "#EEEEEE",
    padding: "20px",
    borderRadius: "10px",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    marginRight: "20px",
  },
  profileInfo: {
    textAlign: "left",
  },
  profileName: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#333333",
  },
  profilePhone: {
    fontSize: "16px",
    color: "#666666",
  },
  profileRewardPoints: {
    fontSize: "16px",
    color: "#666666",
  },
  editProfileButton: {
    marginTop: "20px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#FA832A",
    color: "#fff",
  },
  termsText: {
    marginTop: "20px",
    fontSize: "12px",
    color: "#777",
    textAlign: "center",
  },
  linkText: {
    color: "#007BFF",
    textDecoration: "none",
  },
  modal: {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "20px",
      borderRadius: "10px",
      width: "400px",
    },
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
  },
};

export default ProfileScreen;
