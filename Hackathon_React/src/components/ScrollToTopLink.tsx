import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

const ScrollToTopLink: React.FC<LinkProps> = ({ children, ...props }) => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default ScrollToTopLink; 