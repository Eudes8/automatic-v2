"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Contract {
  id: string;
  title: string;
  status: "generated" | "signed" | "completed";
  createdAt: string;
  validUntil: string;
  proposal?: {
    projectName: string;
    price: number;
  };
}

export default function ContractsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/client/login");
    }
  }, [status, router]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/client/contracts");

      if (!response.ok) {
        throw new Error(`Failed to fetch contracts: ${response.status}`);
      }

      const data = await response.json();
      setContracts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("Error fetching contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchContracts();
    }
  }, [status]);

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contrats</h1>
          <p className="text-gray-600">Gérez vos contrats et signatures</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchContracts}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Rafraîchir
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/client/contracts/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contrat
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Liste des contrats ({contracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement des contrats...
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun contrat pour le moment
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Projet</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date création</TableHead>
                    <TableHead>Valide jusqu'au</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">
                        {contract.title}
                      </TableCell>
                      <TableCell>{contract.proposal?.projectName || "-"}</TableCell>
                      <TableCell>
                        {contract.proposal?.price
                          ? formatPrice(contract.proposal.price)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(contract.status)}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(contract.createdAt)}</TableCell>
                      <TableCell>{formatDate(contract.validUntil)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/client/contracts/${contract.id}`)
                          }
                        >
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
