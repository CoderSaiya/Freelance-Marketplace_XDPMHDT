import {
  YoutubeOutlined,
  GithubOutlined,
  LinkedinOutlined,
  FacebookOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-6">
          <img src="img/logo.png" alt="Logo" className="mx-auto h-12" />
        </div>

        {/* Navigation Links */}
        <ul className="flex justify-center space-x-8 mb-6 text-gray-700">
          <li>
            <a href="#" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Solutions
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Support
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Company
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Legal
            </a>
          </li>
        </ul>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" aria-label="Facebook">
            <FacebookOutlined />
          </a>
          <a href="#" aria-label="LinkedIn">
            <LinkedinOutlined />
          </a>
          <a href="https://github.com/CoderSaiya" aria-label="GitHub">
            <GithubOutlined />
          </a>
          <a href="#" aria-label="YouTube">
            <YoutubeOutlined />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-sm">
          © 2024 Freelance Marketplace Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
