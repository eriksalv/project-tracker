import React from "react";

type props = {
  id: string | string[] | undefined;
};

const IssueForm: React.FC<props> = ({ id }) => {
  return (
    <form>
      <input type="text" placeholder="Title" />
    </form>
  );
};

export default IssueForm;
