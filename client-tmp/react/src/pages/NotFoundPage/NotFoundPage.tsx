import React from 'react';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <ErrorMessage
      elementType="h1"
      message="Page Not Found 404"
    />
  );
};

export default NotFoundPage;