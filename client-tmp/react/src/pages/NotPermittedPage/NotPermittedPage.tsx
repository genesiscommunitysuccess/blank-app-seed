import React from 'react';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import './NotPermittedPage.css';

const NotPermittedPage: React.FC = () => {
  return (
    <ErrorMessage
      elementType="h1"
      message="You do not have permission to access this part of the application, please contact your administrator."
    />
  );
};

export default NotPermittedPage;