import { cn } from "@/lib/utils";

type DataTableProps = {
  children: React.ReactNode;
  className?: string;
};

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn("admin-card admin-table-wrap", className)}>
      <table className="admin-table">{children}</table>
    </div>
  );
}

export function DataTableEmpty({ message }: { message: string }) {
  return (
    <div className="admin-card px-6 py-12 text-center text-sm text-muted">{message}</div>
  );
}
