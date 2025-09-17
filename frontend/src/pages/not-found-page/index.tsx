import { ErrorPageComponent, PageWrapperComponent } from "components";
import image404 from "../../assets/images/404-not-found.png";

type TNotFoundPage = {
  title?: string;
  message?: string;
};

const NotFoundPage: React.FC<TNotFoundPage> = ({
  title = "Not Found",
  message = "This page does not exist",
}) => (
  <>
    <PageWrapperComponent title="404 | not found" content="Page not found at the Product Store" />

    <ErrorPageComponent title={title} message={message}>
      <img src={image404} alt="NOT_FOUND" width="800" height="600" />
    </ErrorPageComponent>
  </>
);

export default NotFoundPage;
