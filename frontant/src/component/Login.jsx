import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign-in logic here
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-900 text-white flex items-center justify-center">
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
        <div className="mx-auto w-16">
          <svg
            className="w-full"
            viewBox="0 0 63 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            {/* SVG paths */}
          </svg>
        </div>
        <div className="mb-6 w-full text-center text-2xl font-semibold uppercase">Play</div>
        <label htmlFor="email" className="mb-1 inline-block text-gray-300">Email*</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2 text-white"
        />
        <label htmlFor="password" className="mb-1 inline-block text-gray-300">Password*</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="mb-4 rounded-lg border bg-transparent px-3 py-2 text-white"
        />
        <button className="bg-purple-700 px-4 py-3 rounded-lg text-white">Sign in with Email</button>
      </div>
    </div>
  );
}

export default LoginForm;