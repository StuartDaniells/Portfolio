interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  // Footer section commented out.
  return (
    <footer className={`overflow-hidden rounded-b-2xl ${className ?? ""}`}>
      <p className="text-center py-6 text-gray-lite dark:text-color-910">
        {/* © 2026 Stuart Daniells. All rights reserved. */}
      </p>
    </footer>
  );
  return null;
};

export default Footer;
