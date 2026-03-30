import { KanbanStoreError, saveColumns } from "@/lib/kanban/store";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof KanbanStoreError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  return Response.json({ error: "Unexpected kanban error." }, { status: 500 });
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      columns?: Array<{
        id?: string;
        name: string;
      }>;
    };
    const board = await saveColumns(body.columns ?? []);
    return Response.json({ board });
  } catch (error) {
    return errorResponse(error);
  }
}
