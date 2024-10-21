const ProjectManagementTab = ({ role }: { role: string }) => {
    return (
      <div>
        {role === 'Client' ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Posted Projects</h2>
            <p>List of projects posted by the client...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Applied Projects</h2>
            <p>List of projects the freelancer has applied to...</p>
          </div>
        )}
      </div>
    );
  };
  
  export default ProjectManagementTab;