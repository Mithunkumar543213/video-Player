import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../component";

const TermsAndConditions = () => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="container mx-auto flex justify-center items-center h-screen">
            <div className="bg-black border border-slate-800 text-white rounded-lg p-8 shadow-lg max-w-2xl">
                <div className="mb-5">
                    <Logo />
                </div>
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Terms and Conditions
                </h1>

                <div className="mb-6 text-gray-300 text-sm space-y-4">
                    <p>
                        Welcome to our platform. Please read these terms carefully before proceeding. By continuing, you agree to comply with and be bound by the following terms.
                    </p>

                    <ul className="list-disc list-inside space-y-2">
                        <li>
                            This project is a demonstration of my web development skills and is intended for educational and portfolio purposes only.
                        </li>
                        <li>
                            The platform is currently under active development; features may change, be updated, or removed at any time without prior notice.
                        </li>
                        <li>
                            Users are strictly prohibited from uploading videos or content larger than 100 MB.
                        </li>
                        <li>
                            Uploading explicit, violent, or emotionally disturbing content is not permitted and may result in content removal or access restrictions.
                        </li>
                        <li>
                            Personal information provided during account creation will be used solely for login and user identification purposes; no data will be shared with third parties.
                        </li>
                        <li>
                            We reserve the right to suspend or terminate accounts that violate these terms or engage in unauthorized activities on the platform.
                        </li>
                        <li>
                            Users are responsible for the security of their login credentials. Any suspicious activity should be reported immediately.
                        </li>
                        <li>
                            By using this platform, you acknowledge that you understand and agree to these terms, and consent to any updates or changes made to them in the future.
                        </li>
                    </ul>
                </div>

                <div className="flex items-center mb-6">
                    <input
                        type="checkbox"
                        id="termsCheckbox"
                        checked={isChecked}
                        onChange={() => setIsChecked(!isChecked)}
                        className="mr-3 transform scale-125"
                    />
                    <label
                        htmlFor="termsCheckbox"
                        className="font-semibold text-white"
                    >
                        I have read and agree to the Terms and Conditions
                    </label>
                </div>

                <div className="text-center">
                    {isChecked && (
                        <Link
                            to="/"
                            className="bg-purple-600 hover:bg-purple-700 transition-colors text-white font-bold py-2 px-6 rounded-lg"
                        >
                            Continue
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
