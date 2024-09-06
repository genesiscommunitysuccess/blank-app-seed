import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import './NotPermittedPage.css';

const NotPermittedPage = () => {
  return (
    <ErrorMessage
    elementType="h1"
    message="You do not have permission to access this part of the application, please contact your administrator."
    ></ErrorMessage>
  );
};

export default NotPermittedPage;
