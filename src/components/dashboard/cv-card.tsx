"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreVertical, Copy, Trash, Download, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCv, duplicateCv, getCvData } from "@/app/actions/cv";
import { useRouter } from "next/navigation";
import { pdf } from "@react-pdf/renderer";
import { ProfessionalPdf } from "@/components/cv-builder/pdf/professional-pdf";
import { CvData } from "@/lib/cv/default-data";

interface CvCardProps {
  cv: {
    id: string;
    title: string;
    updatedAt: Date;
    templateId: string;
    atsScore: number | null;
  };
}

export function CvCard({ cv }: CvCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const getScoreColor = (score: number) => {
    if (score <= 40) return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
    if (score <= 70) return "bg-yellow-500 text-white hover:bg-yellow-600";
    return "bg-green-500 text-white hover:bg-green-600";
  };

  const formattedDate = formatDistanceToNow(new Date(cv.updatedAt), {
    addSuffix: true,
    locale: idLocale,
  });

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCv(cv.id);
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete CV:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true);
      await duplicateCv(cv.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to duplicate CV:", error);
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);

      // Fetch the full CV data from the server
      const { data, language, title } = await getCvData(cv.id);

      // Generate the PDF
      const doc = <ProfessionalPdf data={data as unknown as CvData} language={language as "id" | "en"} />;
      const asPdf = pdf(doc); // Initialize with document

      const blob = await asPdf.toBlob();

      // Create a download link and click it
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const sanitizedName = (title || "Untitled").replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `${sanitizedName}_CV.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <CardTitle className="line-clamp-1" title={cv.title}>{cv.title}</CardTitle>
              {cv.atsScore !== null && (
                <Badge className={`${getScoreColor(cv.atsScore)} mt-2`} variant="outline">
                  {cv.atsScore} ATS
                </Badge>
              )}
            </div>
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Menu CV">
                    <span className="sr-only">Buka menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/editor/${cv.id}`} className="flex items-center cursor-pointer w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating} className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" />
                    <span>{isDuplicating ? "Menduplikasi..." : "Duplikasi"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadPdf} disabled={isDownloading} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4" />
                    <span>{isDownloading ? "Menyiapkan PDF..." : "Download PDF"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Hapus</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <CardDescription>Diperbarui {formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-sm text-muted-foreground">
            Template: <span className="capitalize">{cv.templateId}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/editor/${cv.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              Buka Editor
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen menghapus CV
              &quot;{cv.title}&quot; dari server kami.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
