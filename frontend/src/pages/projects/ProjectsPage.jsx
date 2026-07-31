import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import ProjectDialog from "@/components/projects/ProjectDialog";
import {
  getProjects,
  archiveProject,
} from "@/services/project.service";

import { Card, CardContent, Button } from "@/components/ui";
import { toast } from "sonner";

export default function ProjectsPage() {
  const { organizationId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Dialog
  const [openCreate, setOpenCreate] = useState(false);

  // Edit Dialog
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [organizationId]);

  const loadProjects = async () => {
    try {
      const data = await getProjects(organizationId);
      setProjects(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (projectId) => {
    if (!window.confirm("Archive this project?")) return;

    try {
      await archiveProject(projectId);

      toast.success("Project archived");

      loadProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to archive project");
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>

        <Button onClick={() => setOpenCreate(true)}>
          Create Project
        </Button>
      </div>


      {/* Create Dialog */}
      <ProjectDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        mode="create"
        onSuccess={() => {
          loadProjects();
          setOpenCreate(false);
        }}
      />

      {/* Edit Dialog */}
      <ProjectDialog
        open={!!editingProject}
        onOpenChange={(open) => {
          if (!open) setEditingProject(null);
        }}
        mode="edit"
        project={editingProject}
        onSuccess={() => {
          loadProjects();
          setEditingProject(null);
        }}
      />

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">
            No Projects Yet
          </h2>

          <p className="text-muted-foreground mt-2">
            Create your first project.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold">
                    {project.name}
                  </h2>

                  <p className="text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div>
                  <p>Status: {project.status}</p>
                  <p>Members: {project.members.length}</p>
                </div>

                {/* <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() =>
                      navigate(
                        `/organizations/${organizationId}/projects/${project._id}/tasks`
                      )
                    }
                  >
                    View Tasks
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setEditingProject(project)}
                  >
                    Edit
                  </Button>

                  {project.status !== "Archived" ? (
                    <Button
                      variant="destructive"
                      onClick={() => handleArchive(project._id)}
                    >
                      Archive
                    </Button>
                  ) : (
                    <Button disabled>Archived</Button>
                  )}
                </div> */}

                <div className="flex gap-2 flex-wrap">
  <Button
    onClick={() =>
      navigate(
        `/organizations/${organizationId}/projects/${project._id}/tasks`
      )
    }
  >
    View Tasks
  </Button>

  <Button
    variant="secondary"
    onClick={() =>
      navigate(
        `/organizations/${organizationId}/projects/${project._id}/analytics`
      )
    }
  >
    Analytics
  </Button>

  <Button
    variant="outline"
    onClick={() => setEditingProject(project)}
  >
    Edit
  </Button>

  {project.status !== "Archived" ? (
    <Button
      variant="destructive"
      onClick={() => handleArchive(project._id)}
    >
      Archive
    </Button>
  ) : (
    <Button disabled>Archived</Button>
  )}
</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}