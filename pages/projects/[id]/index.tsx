import { useRouter } from "next/router";
import IssueList from "../../../components/project/IssueList";
import ProjectHeader from "../../../components/project/ProjectHeader";

const Project = () => {
  const router = useRouter();

  const id = router.query.id;

  return (
    <>
      <ProjectHeader />

      <IssueList id={id} />
    </>
  );
};

export default Project;
