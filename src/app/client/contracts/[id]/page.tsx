"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Signature {
  name?: string;
  title?: string;
  date?: string;
  image?: string;
}

interface ContractDetails {
  id: string;
  title: string;
  status: "generated" | "signed" | "completed";
  createdAt: string;
  validUntil: string;
  clientInfo: Record<string, any>;
  projectInfo: Record<string, any>;
  terms: Record<string, any>;
  signature?: Signature;
  proposal?: {
    id: string;
    projectName: string;
    price: number;
    description: string;
    timeline: string;
  };
}

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const contractId = params.id as string;

  const [contract, setContract] = useState<ContractDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [signingData, setSigningData] = useState({
    name: "",
    title: "",
  });
  const [isSigning, setIsSigning] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/client/login");
    }
  }, [status, router]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/client/contracts/${contractId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch contract: ${response.status}`);
      }

      const data = await response.json();
      setContract(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching contract:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && contractId) {
      fetchContract();
    }
  }, [status, contractId]);

  const handleSign = async () => {
    try {
      setIsSigning(true);

      const response = await fetch(`/api/client/contracts/${contractId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "signed",
          signature: {
            name: signingData.name,
            title: signingData.title,
            date: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to sign contract: ${response.status}`);
      }

      const data = await response.json();
      setContract(data);
      setIsSigningOpen(false);
      setSigningData({ name: "", title: "" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error signing contract:", err);
    } finally {
      setIsSigning(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      return;
    }

    try {
      const response = await fetch(`/api/client/contracts/${contractId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contract: ${response.status}`);
      }

      router.push("/client/contracts");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error deleting contract:", err);
    }
  };

  const getStatusBadgeVariant = (
    status: "generated" | "signed" | "completed"
  ) => {
    switch (status) {
      case "generated":
        return "outline";
      case "signed":
        return "default";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: "generated" | "signed" | "completed") => {
    switch (status) {
      case "generated":
        return "En attente";
      case "signed":
        return "Signé";
      case "completed":
        return "Complété";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  };

  if (status === "loading") {
    return <div className="p-6">Chargement...</div>;
  }

  if (loading) {
    return <div className="p-6">Chargement du contrat...</div>;
  }

  if (!contract) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Contrat non trouvé</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{contract.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getStatusBadgeVariant(contract.status)}>
                {getStatusLabel(contract.status)}
              </Badge>
              <span className="text-sm text-gray-600">
                Créé le {formatDate(contract.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Projet
                </label>
                <p className="text-lg">
                  {contract.proposal?.projectName || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <p className="text-sm text-gray-700">
                  {contract.proposal?.description || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Timeline
                  </label>
                  <p>{contract.proposal?.timeline || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Montant
                  </label>
                  <p className="font-semibold">
                    {contract.proposal?.price
                      ? formatPrice(contract.proposal.price)
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Entreprise
                  </label>
                  <p>{contract.clientInfo?.company || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Contact
                  </label>
                  <p>{contract.clientInfo?.contact || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Email
                  </label>
                  <p>{contract.clientInfo?.email || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Téléphone
                  </label>
                  <p>{contract.clientInfo?.phone || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signature Info */}
          {contract.signature && (
            <Card>
              <CardHeader>
                <CardTitle>Signature</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Signataire
                    </label>
                    <p>{contract.signature.name || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Titre
                    </label>
                    <p>{contract.signature.title || "-"}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Date de signature
                  </label>
                  <p>
                    {contract.signature.date
                      ? formatDate(contract.signature.date)
                      : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Détails du contrat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <label className="font-medium text-gray-600">ID</label>
                <p className="text-xs text-gray-500 break-all">{contract.id}</p>
              </div>
              <div>
                <label className="font-medium text-gray-600">
                  Date de création
                </label>
                <p>{formatDate(contract.createdAt)}</p>
              </div>
              <div>
                <label className="font-medium text-gray-600">
                  Valide jusqu'au
                </label>
                <p>{formatDate(contract.validUntil)}</p>
              </div>
              <div>
                <label className="font-medium text-gray-600">Statut</label>
                <Badge
                  variant={getStatusBadgeVariant(contract.status)}
                  className="mt-2"
                >
                  {getStatusLabel(contract.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {contract.status === "generated" && (
                <Button
                  className="w-full"
                  onClick={() => setIsSigningOpen(true)}
                >
                  Signer le contrat
                </Button>
              )}

              {contract.status === "generated" && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  Supprimer
                </Button>
              )}

              {(contract.status === "signed" ||
                contract.status === "completed") && (
                <Button variant="outline" className="w-full" disabled>
                  Signé le {contract.signature?.date ? formatDate(contract.signature.date) : ""}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Signing Dialog */}
      {isSigningOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Signer le contrat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Votre nom</label>
                <input
                  type="text"
                  placeholder="Nom complet"
                  value={signingData.name}
                  onChange={(e) =>
                    setSigningData({ ...signingData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Votre titre</label>
                <input
                  type="text"
                  placeholder="ex: Directeur Général"
                  value={signingData.title}
                  onChange={(e) =>
                    setSigningData({ ...signingData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSigningOpen(false)}
                  disabled={isSigning}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSign}
                  disabled={isSigning || !signingData.name}
                  className="flex-1"
                >
                  {isSigning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signature...
                    </>
                  ) : (
                    "Signer"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
