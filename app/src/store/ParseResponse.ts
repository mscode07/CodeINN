import { FileNode, Step } from "./promptStore";

export const parseBoltArtifact = (
  artifactString: string
): { files: FileNode[]; steps: Step[] } => {
  // console.log("Reaching here >>>>>>");
  console.log("Input artifactString:", artifactString);
  if (
    !artifactString ||
    typeof artifactString !== "string" ||
    !artifactString.trim()
  ) {
    console.error("Invalid or empty artifact string");
    return { files: [], steps: [] };
  }
  if (
    !artifactString.includes("<boltArtifact") &&
    !artifactString.includes("<BoltArtifact")
  ) {
    console.error("Input does not contain <boltArtifact> tag");
    return { files: [], steps: [] };
  }

  const processedString = artifactString.replace(
    /<boltAction[^>]*>([\s\S]*?)<\/boltAction>/g,
    (match, content) => {
      // If content already contains CDATA, leave it as-is
      if (content.trim().startsWith("<![CDATA[")) {
        return match;
      }

      // Extract type and filePath attributes safely
      const typeMatch = match.match(/type="[^"]*"/);
      const filePathMatch = match.match(/filePath="[^"]*"/);

      const type = typeMatch
        ? typeMatch[0].split('"')[1]
        : filePathMatch
        ? "file"
        : "shell";
      const filePath = filePathMatch ? filePathMatch[0].split('"')[1] : "";

      // Construct the new <boltAction> tag
      const newTag = `<boltAction type="${type}"${
        filePath ? ` filePath="${filePath}"` : ""
      }><![CDATA[${content}]]></boltAction>`;
      // console.log(`Transformed <boltAction>: ${newTag}`);
      return newTag;
    }
  );

  //console.log("Processed artifactString with CDATA:", processedString);

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedString, "text/xml");

    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      console.error("XML parsing error:", parserError.textContent);
      return { files: [], steps: [] };
    }

    //console.log("Parsed XML document:", doc.documentElement.outerHTML);

    let boltActions = Array.from(doc.querySelectorAll("*|boltAction"));

    if (boltActions.length === 0) {
      boltActions = Array.from(
        doc.querySelectorAll("*|BoltAction, *|boltaction")
      );
      console.warn("Tried fallback query for case sensitivity");
    }

    console.log("Found boltActions:", boltActions);
    // console.log("boltActions length:", boltActions.length);

    const artifactTitle =
      doc.querySelector("*|boltArtifact")?.getAttribute("title") ||
      "Generated Project";

    const files: FileNode[] = [];
    const steps: Step[] = [];
    let stepId = 1;

    const getLanguage = (filePath: string): string => {
      const extension = filePath.split(".").pop()?.toLowerCase();
      switch (extension) {
        case "js":
          return "javascript";
        case "html":
          return "html";
        case "css":
          return "css";
        case "json":
          return "json";
        default:
          return "text";
      }
    };

    const addToFileStructure = (
      filePath: string,
      content: string
    ): FileNode => {
      const segments = filePath.split("/").filter(Boolean);
      const id = Math.random().toString(36).substring(2, 9);

      if (segments.length === 1) {
        const fileNode: FileNode = {
          id,
          name: segments[0],
          type: "file",
          content,
          language: getLanguage(segments[0]),
          path: `/${segments[0]}`,
        };
        files.push(fileNode); // Add top-level file to files array
        return fileNode;
      }

      const folderName = segments[0];
      const subPath = segments.slice(1).join("/");
      const existingFolder = files.find(
        (f) => f.name === folderName && f.type === "folder"
      );

      const childNode = addToFileStructure(subPath, content);

      if (existingFolder) {
        existingFolder.children = [
          ...(existingFolder.children || []),
          childNode,
        ];
        return existingFolder;
      } else {
        const newFolder: FileNode = {
          id: Math.random().toString(36).substring(2, 9),
          name: folderName,
          type: "folder",
          path: `/${folderName}`,
          children: [childNode],
        };
        files.push(newFolder);
        return newFolder;
      }
    };

    // Group public files for a single step
    const publicFiles: string[] = [];

    // Process boltActions
    boltActions.forEach((action) => {
      const type = action.getAttribute("type");
      if (type === "file") {
        const filePath = action.getAttribute("filePath") || "";
        const content = action.textContent?.trim() || "";

        if (!filePath) {
          console.warn("Skipping file with empty filePath");
          return;
        }

        addToFileStructure(filePath, content);

        if (filePath.startsWith("public/")) {
          publicFiles.push(filePath);
        } else {
          // Individual step for non-public files
          const fileStepTitle = filePath.includes("server.js")
            ? "Set Up Server"
            : filePath.includes("package.json")
            ? "Configure Project"
            : `Create ${filePath.split("/").pop()}`;
          steps.push({
            id: stepId++,
            title: fileStepTitle,
            description: `Set up ${filePath
              .split("/")
              .pop()} for the ${artifactTitle.toLowerCase()}`,
            status: "completed",
          });
        }
      } else if (type === "shell") {
        const commands = action.textContent?.trim() || "";
        steps.push({
          id: stepId++,
          title: "Install Dependencies and Start Server",
          description: `Run \`${commands}\` to set up and start the ${artifactTitle.toLowerCase()}`,
          status: "completed",
        });
      }
    });

    if (publicFiles.length > 0) {
      steps.push({
        id: stepId++,
        title: "Create Testing Page",
        description: `Set up ${publicFiles.length} file${
          publicFiles.length > 1 ? "s" : ""
        } (e.g., ${publicFiles[0]
          .split("/")
          .pop()}) for the ${artifactTitle.toLowerCase()}`,
        status: "completed",
      });
    }

    // Remove duplicate folders
    const uniqueFiles: FileNode[] = [];
    const seenPaths = new Set<string>();
    files.forEach((file) => {
      if (!seenPaths.has(file.path)) {
        seenPaths.add(file.path);
        uniqueFiles.push(file);
      }
    });

    // Sort files alphabetically
    uniqueFiles.sort((a, b) => a.name.localeCompare(b.name));

    console.log("Parsed files:", uniqueFiles);

    return { files: uniqueFiles, steps };
  } catch (error) {
    console.error("Error parsing <boltArtifact>:", error);
    return { files: [], steps: [] };
  }
};
