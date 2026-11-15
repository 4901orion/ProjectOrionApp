"use client";

import { useEffect, useMemo, useState } from "react";

// Renders a form built in the Nextly drag-and-drop builder (Admin → Forms)
// and sends answers to the plugin's public submit endpoint. Submissions show
// up in Admin → Forms → Submissions.
//
// Usage: <NextlyForm slug="my-form-slug" />
//
// File upload fields send each file to /api/form-upload as soon as it is
// picked. That route stores it in Nextly's media library ("Form uploads"
// folder) and returns a media ID, which is what the submission saves.

const API = "/admin/api/forms";
const UPLOAD_API = "/api/form-upload";

type Uploaded = { id: string; filename: string };

type Option = { label: string; value: string };

type Condition = {
  field: string;
  comparison:
    | "equals"
    | "notEquals"
    | "contains"
    | "isEmpty"
    | "isNotEmpty"
    | "greaterThan"
    | "lessThan";
  value?: unknown;
};

type Field = {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  defaultValue?: unknown;
  required?: boolean;
  options?: Option[];
  allowMultiple?: boolean;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number;
  min?: string;
  max?: string;
  conditionalLogic?: {
    enabled: boolean;
    action: "show" | "hide";
    operator: "AND" | "OR";
    conditions: Condition[];
  };
  admin?: { width?: string };
};

type FormDoc = {
  name?: string;
  title?: string;
  description?: string | null;
  status?: string;
  closedMessage?: string;
  fields?: Field[];
  settings?: {
    submitButtonText?: string;
    successMessage?: string;
    confirmationType?: string;
    redirectUrl?: string;
  };
};

type Values = Record<string, unknown>;

function isEmpty(v: unknown) {
  return (
    v === undefined ||
    v === null ||
    v === "" ||
    v === false ||
    (Array.isArray(v) && v.length === 0)
  );
}

function checkCondition(c: Condition, values: Values) {
  const v = values[c.field];
  switch (c.comparison) {
    case "equals":
      return String(v ?? "") === String(c.value ?? "");
    case "notEquals":
      return String(v ?? "") !== String(c.value ?? "");
    case "contains":
      return Array.isArray(v)
        ? v.map(String).includes(String(c.value))
        : String(v ?? "").includes(String(c.value ?? ""));
    case "isEmpty":
      return isEmpty(v);
    case "isNotEmpty":
      return !isEmpty(v);
    case "greaterThan":
      return Number(v) > Number(c.value);
    case "lessThan":
      return Number(v) < Number(c.value);
    default:
      return true;
  }
}

function isVisible(field: Field, values: Values) {
  const logic = field.conditionalLogic;
  if (!logic?.enabled || !logic.conditions?.length) return true;
  const results = logic.conditions.map((c) => checkCondition(c, values));
  const matched =
    logic.operator === "OR" ? results.some(Boolean) : results.every(Boolean);
  return logic.action === "hide" ? !matched : matched;
}

function initialValues(fields: Field[]): Values {
  const out: Values = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined) out[f.name] = f.defaultValue;
    else if (f.type === "checkbox") out[f.name] = false;
    else if (f.type === "select" && f.allowMultiple) out[f.name] = [];
    else if (f.type === "file") out[f.name] = f.multiple ? [] : "";
    else out[f.name] = "";
  }
  return out;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400";

export default function NextlyForm({ slug }: { slug: string }) {
  const [form, setForm] = useState<FormDoc | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, Uploaded[]>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (res.status === 404) throw new Error("This form doesn't exist or isn't published yet.");
        if (!res.ok) throw new Error(`Couldn't load the form (${res.status}).`);
        return res.json();
      })
      .then((doc: FormDoc) => {
        if (cancelled) return;
        setForm(doc);
        setValues(initialValues(doc.fields ?? []));
      })
      .catch((e: Error) => !cancelled && setLoadError(e.message));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const fields = useMemo(() => form?.fields ?? [], [form]);

  function setValue(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleFiles(field: Field, picked: FileList | null) {
    if (!picked || picked.length === 0) return;
    const list = field.multiple ? Array.from(picked) : [picked[0]];
    setUploading((prev) => ({ ...prev, [field.name]: true }));
    setErrors((prev) => ({ ...prev, [field.name]: "" }));
    try {
      const done: Uploaded[] = [];
      for (const file of list) {
        const body = new FormData();
        body.append("file", file);
        body.append("form", slug);
        body.append("field", field.name);
        const res = await fetch(UPLOAD_API, { method: "POST", body });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.message ?? `Upload failed (${res.status}).`);
        done.push({ id: json.id, filename: json.filename ?? file.name });
      }
      const next = field.multiple ? [...(files[field.name] ?? []), ...done] : done;
      setFiles((prev) => ({ ...prev, [field.name]: next }));
      setValue(field.name, field.multiple ? next.map((u) => u.id) : next[0]?.id ?? "");
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field.name]: (err as Error).message }));
    } finally {
      setUploading((prev) => ({ ...prev, [field.name]: false }));
    }
  }

  function removeFile(field: Field, id: string) {
    const next = (files[field.name] ?? []).filter((u) => u.id !== id);
    setFiles((prev) => ({ ...prev, [field.name]: next }));
    setValue(field.name, field.multiple ? next.map((u) => u.id) : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.values(uploading).some(Boolean)) {
      setErrors((prev) => ({ ...prev, _form: "Please wait for your files to finish uploading." }));
      return;
    }
    const visible = fields.filter((f) => isVisible(f, values));

    const missing: Record<string, string> = {};
    for (const f of visible) {
      if (f.required && isEmpty(values[f.name])) missing[f.name] = "This field is required.";
    }
    if (Object.keys(missing).length) {
      setErrors(missing);
      return;
    }

    // Only send answers for fields the visitor could actually see.
    const data: Values = {};
    for (const f of visible) {
      if (f.type === "file" && isEmpty(values[f.name])) continue;
      data[f.name] = values[f.name];
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/${encodeURIComponent(slug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const fieldErrors: Record<string, string> = {};
        for (const err of body?.errors ?? body?.error?.errors ?? []) {
          const key = String(err.path ?? "").replace(/^data\./, "");
          if (key) fieldErrors[key] = err.message;
        }
        setErrors(fieldErrors);
        if (!Object.keys(fieldErrors).length) {
          setErrors({ _form: body?.message ?? body?.error?.message ?? "Something went wrong. Please try again." });
        }
        return;
      }
      if (body?.redirect) {
        window.location.href = typeof body.redirect === "string" ? body.redirect : body.redirect.url;
        return;
      }
      setDone(body?.message ?? form?.settings?.successMessage ?? "Thank you for your submission!");
    } catch {
      setErrors({ _form: "Couldn't reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) return <p className="text-sm text-red-600">{loadError}</p>;
  if (!form) return <p className="text-sm text-gray-500">Loading form…</p>;
  if (form.status === "closed") {
    return <p className="text-sm text-gray-700">{form.closedMessage ?? "This form is closed."}</p>;
  }
  if (done) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
        <p className="text-sm font-semibold text-gray-800">{done}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4"
    >
      <h1 className="text-2xl font-bold text-gray-900">{form.name ?? form.title}</h1>
      {form.description && <p className="text-sm text-gray-600">{form.description}</p>}

      {fields.map((f) => {
        if (!isVisible(f, values)) return null;
        if (f.type === "hidden") return null;
        const id = `f_${f.name}`;
        const err = errors[f.name];
        const label = (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {f.label}
            {f.required && <span className="text-red-600"> *</span>}
          </label>
        );
        const help = f.helpText && <p className="text-xs text-gray-500 mt-1">{f.helpText}</p>;
        const errorText = err && <p className="text-xs text-red-600 mt-1">{err}</p>;
        const v = values[f.name];

        let control: React.ReactNode;
        switch (f.type) {
          case "textarea":
            control = (
              <textarea id={id} rows={f.rows ?? 4} className={inputClass} placeholder={f.placeholder}
                value={String(v ?? "")} onChange={(e) => setValue(f.name, e.target.value)} />
            );
            break;
          case "select":
            control = (
              <select id={id} className={inputClass} multiple={f.allowMultiple}
                value={f.allowMultiple ? (v as string[]) ?? [] : String(v ?? "")}
                onChange={(e) =>
                  setValue(
                    f.name,
                    f.allowMultiple
                      ? Array.from(e.target.selectedOptions).map((o) => o.value)
                      : e.target.value,
                  )
                }>
                {!f.allowMultiple && <option value="">{f.placeholder ?? "Select…"}</option>}
                {(f.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            );
            break;
          case "radio":
            control = (
              <div className="flex flex-col gap-1">
                {(f.options ?? []).map((o) => (
                  <label key={o.value} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={f.name} value={o.value} checked={v === o.value}
                      onChange={() => setValue(f.name, o.value)} />
                    {o.label}
                  </label>
                ))}
              </div>
            );
            break;
          case "checkbox":
            return (
              <div key={f.name}>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input id={id} type="checkbox" checked={Boolean(v)}
                    onChange={(e) => setValue(f.name, e.target.checked)} />
                  {f.label}
                  {f.required && <span className="text-red-600">*</span>}
                </label>
                {help}
                {errorText}
              </div>
            );
          case "file":
            control = (
              <div className="space-y-2">
                <input id={id} type="file" accept={f.accept} multiple={f.multiple}
                  disabled={uploading[f.name]}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-sm file:font-medium hover:file:bg-gray-200"
                  onChange={(e) => {
                    handleFiles(f, e.target.files);
                    e.target.value = "";
                  }} />
                {uploading[f.name] && <p className="text-xs text-gray-500">Uploading…</p>}
                {(files[f.name] ?? []).map((u) => (
                  <div key={u.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-md px-3 py-1.5">
                    <span className="truncate">✓ {u.filename}</span>
                    <button type="button" className="text-xs text-red-600 ml-3" onClick={() => removeFile(f, u.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            );
            break;
          default: {
            const htmlType =
              { email: "email", number: "number", phone: "tel", url: "url", date: "date", time: "time" }[f.type] ??
              "text";
            control = (
              <input id={id} type={htmlType} className={inputClass} placeholder={f.placeholder}
                min={f.min} max={f.max} value={String(v ?? "")}
                onChange={(e) =>
                  setValue(f.name, f.type === "number" && e.target.value !== "" ? Number(e.target.value) : e.target.value)
                } />
            );
          }
        }

        return (
          <div key={f.name}>
            {label}
            {control}
            {help}
            {errorText}
          </div>
        );
      })}

      {errors._form && <p className="text-sm text-red-600">{errors._form}</p>}

      <div className="flex justify-end">
        <button type="submit" disabled={submitting}
          className="text-white py-2 px-5 rounded-lg font-semibold transition disabled:opacity-60"
          style={{ background: "#0E8388" }}>
          {submitting ? "Sending…" : form.settings?.submitButtonText ?? "Submit"}
        </button>
      </div>
    </form>
  );
}
