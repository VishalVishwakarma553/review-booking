const roleMap = {
  ADMIN: { label: "Admin",       cls: "badge badge-admin" },
  USER:  { label: "User",        cls: "badge badge-user"  },
  OWNER: { label: "Store Owner", cls: "badge badge-owner" },
};

const Badge = ({ label, variant, className = "" }) => {
  const config = roleMap[variant] || roleMap[label] || { label: label, cls: "badge badge-user" };
  return (
    <span className={`${config.cls} ${className}`}>
      {config.label}
    </span>
  );
};

export default Badge;
