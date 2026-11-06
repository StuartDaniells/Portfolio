interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  return (
    <footer className={`overflow-hidden rounded-b-2xl ${className ?? ""}`}>
      <p className="text-center py-6 text-gray-lite dark:text-color-910">
        {/* © 2026 Stuart Daniells. All rights reserved. */}
      </p>
    </footer>
  );
};

export default Footer;
