
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 px-6 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          © {currentYear} All rights reserved to TeamCoders
        </div>
        <div>
          Contact: <a href="mailto:Teamcoders03@gmail.com" className="text-brand-blue hover:underline">Teamcoders03@gmail.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
