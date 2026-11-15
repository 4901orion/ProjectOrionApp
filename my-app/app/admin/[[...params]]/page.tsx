"use client";

// Registers the form builder's drag-and-drop editor and submissions views.
// Without this side-effect import the admin falls back to a raw JSON editor.
import "@nextlyhq/plugin-form-builder/admin"
import "@nextlyhq/admin/style.css";
import { RootLayout, QueryProvider, ErrorBoundary } from "@nextlyhq/admin";

export default function AdminPage() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("Admin error:", error, errorInfo);
      }}
    >
      <QueryProvider>
        <RootLayout />
      </QueryProvider>
    </ErrorBoundary>
  );
}