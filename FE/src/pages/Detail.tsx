import React from "react";
import Form from "../components/Detail/Form";
import { useParams } from "react-router-dom";
import { useProjectByIdQuery } from "../apis/graphqlApi";

const Detail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, error, isLoading, refetch } = useProjectByIdQuery(Number(projectId));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading project details.</p>;

  console.log(data);
  const project = data?.data.projectById;

  return (
    <div>
      <Form
        projectId={Number(projectId)}
        projectName={String(project?.projectName)}
        projectDescription={String(project?.projectDescription)}
        deadline={String(project?.deadline)}
        createAt={String(project?.createAt)}
        budget={Number(project?.budget)}
        skillRequire={String(project?.skillRequire)}
        status={String(project?.status)}
        users={project?.users}
        category={project?.category}
        applies={project?.applies || []}
        refetch={refetch}
      />
    </div>
  );
};

export default Detail;
