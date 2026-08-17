"use client";

import * as React from "react";
import { ResourceService, type FullResource } from "@services/resourceService";
import { DocumentPreviewer } from "@components/resources/document-previewer";
import { useAuth } from "@hooks/use-auth";

interface DocumentPreviewerContainerProps {
  resource: FullResource;
}

export function DocumentPreviewerContainer({ resource }: DocumentPreviewerContainerProps) {
  const { user } = useAuth();

  const handleDownload = async () => {
    await ResourceService.recordDownload(resource.id, user?.id);
    window.open(resource.file_url, "_blank");
  };

  return <DocumentPreviewer resource={resource} onDownload={handleDownload} />;
}
