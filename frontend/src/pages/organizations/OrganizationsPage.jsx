import { useEffect, useState } from "react";
import { getOrganizations } from "@/services/organization.service";
// import CreateOrganizationDialog from "@/components/organizations/OrganizationDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteOrganization } from "@/services/organization.service";
import { toast } from "sonner";
import OrganizationDialog from "@/components/organizations/OrganizationDialog";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const data = await getOrganizations();
      setOrganizations(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this organization?",
    );

    if (!confirmed) return;

    try {
      await deleteOrganization(id);
      loadOrganizations();
      toast.success("Organization deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete organization");
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Organizations</h1>

        <OrganizationDialog mode="create" onSuccess={loadOrganizations} />
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Organizations Yet</h2>

          <p className="text-muted-foreground mt-2">
            Create your first organization to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((organization) => (
            <div key={organization._id}>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold">{organization.name}</h2>

                    <p className="text-sm text-muted-foreground">
                      {organization.industry || "No Industry"}
                    </p>
                  </div>

                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-semibold">Owner:</span>{" "}
                      {organization.owner?.name}
                    </p>

                    <p>
                      <span className="font-semibold">Created:</span>{" "}
                      {new Date(organization.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Link to={`/organizations/${organization._id}/projects`}>
                      <Button>View Projects</Button>
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate(`/organizations/${organization._id}/members`)
                      }
                    >
                      View Members
                    </Button>
                    <OrganizationDialog
                      mode="edit"
                      organization={organization}
                      onSuccess={loadOrganizations}
                    />

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(organization._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
