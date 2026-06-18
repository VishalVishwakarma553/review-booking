import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

const Table = ({
  columns,
  data,
  onSort,
  sortField,
  sortOrder,
  emptyMessage = "No records found",
  loading = false,
  onRowClick,
}) => {
  if (loading) {
    return (
      <div className="data-table-wrap">
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ padding: "16px 20px", borderBottom: "1px solid var(--clr-border-light)", display: "flex", gap: 16 }}>
            {[...Array(columns.length)].map((_, j) => (
              <div key={j} className="skeleton" style={{ height: 14, flex: 1 }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="data-table-wrap" style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? "sortable" : ""}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {col.label}
                  {col.sortable && (
                    sortField === col.key
                      ? (sortOrder === "asc"
                          ? <ChevronUp size={13} style={{ color: "var(--clr-primary)" }} />
                          : <ChevronDown size={13} style={{ color: "var(--clr-primary)" }} />)
                      : <ChevronsUpDown size={13} style={{ color: "var(--clr-text-5)" }} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: "48px 20px", color: "var(--clr-text-4)" }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.18 }}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? "clickable" : ""}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? <span style={{ color: "var(--clr-text-5)" }}>—</span>)}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
