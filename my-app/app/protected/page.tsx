import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const stats = [
  { title: "Awaiting final decision", value: "2", details: "Stuff..." },
  { title: "Awaiting final decision", value: "2", details: "Stuff..." },
];

const reviews = [
  {
    protocol: "Stuff",
    pi: "Dr. A. Chen",
    path: "Expedited",
    recommendation: "Revision Required",
  },
  {
    protocol: "Stuff",
    pi: "Dr. A. Chen",
    path: "Expedited",
    recommendation: "Revision Required",
  },
];

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="orion-dashboard p-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold mb-1">Dashboard</h1>
        <p className="text-muted mb-0">
          Review recommendations, resolve disagreements, and issue final decisions.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat, index) => (
          <div className="col-12 col-md-6 col-xl-3" key={index}>
            <div className="card h-100 shadow-sm border-0 orion-stat-card">
              <div className="card-body">
                <h2 className="orion-stat-title text-uppercase text-muted fw-bold">
                  {stat.title}
                </h2>
                <p className="orion-stat-value fw-bold mb-2">{stat.value}</p>
                <p className="text-warning-emphasis mb-0">{stat.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="orion-info-banner d-flex align-items-center p-3 mb-4 rounded">
        <span className="me-3" aria-hidden="true">
          🚩
        </span>
        <span>
          Reviewer flags let reviewers raise a question directly with you—no email or
          Teams message required.
        </span>
      </div>

      <div className="card shadow-sm border-0">
        <h2 className="h5 fw-bold p-4 mb-0 border-bottom">
          Reviews ready for decision
        </h2>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 orion-table">
            <thead>
              <tr>
                <th>Protocol</th>
                <th>PI</th>
                <th>Path</th>
                <th>Recommendation</th>
                <th>
                  <span className="visually-hidden">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review, index) => (
                <tr key={index}>
                  <td className="fw-bold">{review.protocol}</td>
                  <td>{review.pi}</td>
                  <td>{review.path}</td>
                  <td className="text-muted">{review.recommendation}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-dark btn-sm rounded-pill px-4"
                    >
                      Decide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
