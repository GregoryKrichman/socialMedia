import React from "react";
import "./errorPage.scss";

const ErrorPage = () => {
  return (
    <div className="errorPage">
      <h1>Invalid Profile</h1>
      <p>
        The profile you are trying to view does not exist or the URL is
        incorrect.
      </p>
    </div>
  );
};

export default ErrorPage;
