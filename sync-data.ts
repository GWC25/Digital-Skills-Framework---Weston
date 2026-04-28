// netlify/edge-functions/sync-data.ts
// Netlify Edge Function — GitHub API Proxy with Passcode Validation

import { Context } from "https://edge.netlify.com";

const GITHUB_PAT = Deno.env.get("GITHUB_PAT");
const GITHUB_REPO = "GWC25/Digital-Skills-Framework---Weston";
const GITHUB_BRANCH = "main";
const GITHUB_FILENAME = "areas-data.json";

interface SyncRequest {
  dataType: string;
  data: Record<string, unknown> | Array<unknown>;
  timestamp: string;
}

interface GitHubResponse {
  sha: string;
  url: string;
  message?: string;
}

export default async (request: Request, context: Context) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as SyncRequest;

    if (!body.dataType || !body.data) {
      return new Response(
        JSON.stringify({ error: "Missing dataType or data" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch current file from GitHub
    const currentFileResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILENAME}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: "application/vnd.github.v3.raw",
        },
      }
    );

    if (!currentFileResponse.ok) {
      return new Response(
        JSON.stringify({
          error: `Failed to fetch current file: ${currentFileResponse.statusText}`,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const currentContent = await currentFileResponse.text();
    let currentData = JSON.parse(currentContent);

    // Update the data based on dataType
    if (body.dataType === "digitalLeads") {
      currentData.digitalLeads = body.data;
    } else if (body.dataType === "areas") {
      currentData.areas = body.data;
    } else if (body.dataType === "industrySkills") {
      currentData.industrySkills = body.data;
    } else if (body.dataType === "sendProvisions") {
      currentData.sendProvisions = body.data;
    }

    // Update metadata
    currentData.lastUpdated = new Date().toISOString();
    currentData.lastEditedBy = "Graeme Wright";
    currentData.lastEditDate = new Date().toISOString().split("T")[0];

    const newContent = JSON.stringify(currentData, null, 2);
    const encodedContent = btoa(newContent); // Base64 encode

    // Get the current SHA (required for updating)
    const shaResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILENAME}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!shaResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to get file SHA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const shaData = (await shaResponse.json()) as { sha: string };
    const currentSha = shaData.sha;

    // Commit the updated file to GitHub
    const commitResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILENAME}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_PAT}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update ${body.dataType} via Netlify Edge Function [${new Date().toISOString()}]`,
          content: encodedContent,
          sha: currentSha,
          branch: GITHUB_BRANCH,
        }),
      }
    );

    if (!commitResponse.ok) {
      const errorText = await commitResponse.text();
      return new Response(
        JSON.stringify({
          error: `Failed to commit to GitHub: ${commitResponse.statusText}`,
          details: errorText,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const commitData = (await commitResponse.json()) as GitHubResponse;

    return new Response(
      JSON.stringify({
        success: true,
        message: `${body.dataType} updated successfully`,
        commit: commitData.sha,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};
