import { KanbanApp } from "@/components/kanban-app";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function Home() {
  return (
    <AuthGuard>
      <KanbanApp />
    </AuthGuard>
  );
}
