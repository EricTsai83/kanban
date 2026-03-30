import {
  createWorkItem,
  KanbanStoreError,
  updateWorkItem,
} from "@/lib/kanban/store";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof KanbanStoreError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  return Response.json({ error: "Unexpected kanban error." }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const board = await createWorkItem(body);
    return Response.json({ board }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const board = await updateWorkItem(body);
    return Response.json({ board });
  } catch (error) {
    return errorResponse(error);
  }
}
