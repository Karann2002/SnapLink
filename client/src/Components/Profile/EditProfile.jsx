import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useUser } from "../../Context/UserContext";
import { UploadCloud } from "lucide-react";

export default function AccountSettings() {
  const token = localStorage.getItem("token");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    bio: "",
    gender: "",
    profilePicUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // trigger hidden file input
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData(res.data);
      setPreviewImage(res.data.profilePicUrl);
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("bio", formData.bio);
    data.append("gender", formData.gender);
    if (imageFile) {
      data.append("profilePic", imageFile); // must match backend multer field name
    }
    setLoading(true);
    await axios.put(`${import.meta.env.VITE_API_URL}/users/profile/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${token}`,
      },
    });

    alert("Profile updated!");
  };

  return (
    <div className="bg-white h-[98vh] ml-5 mb-5 mr-20 px-30 py-10">
      <form onSubmit={handleSubmit}>
        <div className="font-bold text-xl py-5">Edit profile</div>

        {/* Profile Image */}
        <div className="flex p-5 rounded-2xl bg-gray-100 justify-between items-center">
          <div className="flex gap-2">
            <img
              src={previewImage}
              alt="profile"
              className="rounded-full w-16 h-16 object-cover"
            />
            <div>
              <p className="font-bold">{user?.username}</p>
              <p className="font-light">{user?.fullName}</p>
            </div>
          </div>
          <div>
            <div>
              <button
                type="button"
                onClick={handleButtonClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
              >
                Change Profile
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="">
          <p className="font-bold text-lg py-4">Website</p>
          <div className=" border-slate-400 ">
            <input
              type="text"
              placeholder="Website"
              className="bg-gray-100 p-3 rounded-md w-full  outline-none  "
            />
            <p className="py-2 text-xs text-gray-800">
              Editing your links is only available on mobile. Visit the
              SnapLink app and edit your profile to change the websites in your
              bio.
            </p>
          </div>
        </div>

        {/* Bio */}
        <div>
          <p className="font-bold text-lg py-4">Bio</p>
          <input
            type="text"
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="p-3 border border-gray-200 rounded-md w-full outline-none"
          />
        </div>

        <div>
          <p className="font-bold text-lg  py-4">Show Threads badge</p>

          <div className="flex  justify-between px-5 py-5 border border-gray-200 p-3 max-h-20 overflow-x-auto rounded-3xl w-full outline-none ">
            <p>Show Threads badge</p>
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </div>
        </div>
        {/* Gender */}
        <div>
          <p className="font-bold text-lg py-4">Gender</p>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="px-5 py-5 border border-gray-200 rounded-md w-full outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <p className="font-bold text-lg  py-4">
            Show account suggestions on profiles
          </p>
          <div className="flex  justify-between items-center px-5 py-5 border border-gray-200 p-3 max-h-25 overflow-x-auto rounded-3xl w-full outline-none ">
            <div>
              <p>Show account suggestions on profiles</p>
              <p className="text-xs text-gray-800">
                Choose whether people can see similar account suggestions on
                your profile, and whether your account can be suggested on other
                profiles.
              </p>
            </div>
            <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </div>
        </div>
        <div className="py-20">
          <button
            type="submit"
            disabled={loading}
            className={`px-15 rounded-2xl py-3 bg-blue-700 text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white"
            }`}
          >
            {loading? "Submitting.." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
