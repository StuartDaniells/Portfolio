import { useEffect } from "react";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  useEffect(() => {
    document.title = `${title} - Stuart Daniells Portfolio`;
  }, [title]);

  return null;
};

export default PageTitle;
