import { Helmet } from "react-helmet-async";

type TPageWrapperComponent = {
  title: string;
  content: string;
};

export const PageWrapperComponent: React.FC<TPageWrapperComponent> = ({ title, content }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={content} />
    </Helmet>
  );
};
