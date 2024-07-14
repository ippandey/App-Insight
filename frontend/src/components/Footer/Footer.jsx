import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Subscribed!");
  };

  return (
    <footer className="text-center mt-28">
      <div>
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Designed & Developed by{" "}
          <span className="transition-colors duration-300 hover:text-blue-500 hover:underline">
            Priyanshu Pandey
          </span>
          . All rights reserved.
        </p>
        <div className="flex justify-center mt-4">
          <a
            href="https://www.instagram.com/priyanshu.28__"
            className="mx-2 text-gray-600 hover:text-blue-500"
          >
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a
            href="https://github.com/ippandey"
            className="mx-2 text-gray-600 hover:text-blue-500"
          >
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
          <a
            href="mailto:priyanshupandey2806@gmail.com"
            className="mx-2 text-gray-600 hover:text-blue-500"
          >
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </a>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Your email"
              required
              className="px-4 py-2 mr-2 border border-gray-300 rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default Footer;
