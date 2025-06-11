import React from "react";

type LayoutProps = {
  children: React.ReactNode;
  title?: string; // facultatif ou enlève le ? si c'est obligatoire
};

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div>
      <head>
        <title>{title || "My App"}</title>
      </head>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
