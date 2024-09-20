import { useState } from 'react';
import axios from 'axios';

const SignUpForm = (props) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [ErrorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleFullnameChange = (e) => {
    setFullName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !fullName || !password || !avatar || !coverImage) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('fullName', fullName);
      formData.append('password', password);
      formData.append('avatar', avatar);
      formData.append('coverImage', coverImage);

      const response = await axios.post(
        'http://localhost:8000/api/v1/user/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Form submitted successfully', response.data);

      // Clear form fields after successful submission if needed
      setEmail('');
      setUsername('');
      setFullName('');
      setPassword('');
      setAvatar(null);
      setCoverImage(null);
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#121212] text-white">
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
        <div className="mx-auto inline-block w-40">
          {/* Your SVG */}
          <img  className="h-36 w-40  "  src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/15/e3/67/15e3677d-6f69-9bba-a566-dd6e1ce23430/AppIcon-1x_U007ephone-0-85-220-0.png/512x512bb.jpg"  alt="" />
        </div>
        {/* Email Field */}
        <label htmlFor="email" className="mb-1 inline-block text-gray-300">Email*</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2"
          value={email}
          onChange={handleEmailChange}
        />
        {/* Username Field */}
        <label htmlFor="username" className="mb-1 inline-block text-gray-300">Username*</label>
        <input
          id="username"
          type="text"
          placeholder="Enter your username"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2"
          value={username}
          onChange={handleUsernameChange}
        />
        {/* Fullname Field */}
        <label htmlFor="fullname" className="mb-1 inline-block text-gray-300">Fullname*</label>
        <input
          id="fullname"
          type="text"
          placeholder="Enter your fullname"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2"
          value={fullName}
          onChange={handleFullnameChange}
        />
        {/* Password Field */}
        <label htmlFor="password" className="mb-1 inline-block text-gray-300">Password*</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2"
          value={password}
          onChange={handlePasswordChange}
        />
        {/* Avatar Field */}
        <label htmlFor="avatar" className="mb-1 inline-block text-gray-300">Avatar</label>
        <input
          id="avatar"
          type="file"
          placeholder="Select the avatar"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2"
          onChange={handleAvatarChange}
        />
        {/* Cover Image Field */}
        <label htmlFor="coverImage" className="mb-1 inline-block text-gray-300">Cover Image</label>
        <input
          id="coverImage"
          type="file"
          placeholder="Select the cover image"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2"
          onChange={handleCoverImageChange}
        />
        {/* Submit Button */}
        <button className="bg-[#ae7aff] px-4 py-3 text-black" onClick={handleSubmit}>SignUp</button>
      </div>
    </div>
  );
};

export default SignUpForm;
