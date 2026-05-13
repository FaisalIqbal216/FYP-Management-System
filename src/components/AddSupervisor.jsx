import { useState, useEffect } from "react";

const departments = ["Computer Science", "Software Engineering", "Information Technology", "Electrical Engineering"];
const specializations = ["Mobile Application Development", "AI & Machine Learning", "Web Technologies", "Cybersecurity", "Database Systems", "Cloud Computing"];
const empty = { name: "", email: "", phone: "", department: "", specialization: "", designation: "", maxProjects: "", bio: "", status: "Active" };

export default function AddSupervisor({ onSave, editData, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) setForm({ ...editData, maxProjects: String(editData.maxProjects) });
    else setForm(empty);
  }, [editData]);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.department) e.department = "Select a department";
    if (!form.specialization) e.specialization = "Select a specialization";
    if (!form.designation.trim()) e.designation = "Designation is required";
    if (!form.maxProjects || isNaN(form.maxProjects) || +form.maxProjects < 1) e.maxProjects = "Enter a valid number (min 1)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, maxProjects: +form.maxProjects, education: editData?.education || [], roles: editData?.roles || [], id: editData?.id || Date.now() });
  };

  const inp = (k, label, type = "text", required = true) => (
    <section className="form-group">
      <label className="form-label">
        {label}{required && <span className="text-red"> *</span>}
      </label>
      <input 
        type={type} 
        value={form[k]} 
        onChange={e => set(k, e.target.value)}
        className={`form-input ${errors[k] ? "input-error" : ""}`}
      />
      {errors[k] && <p className="error-text">{errors[k]}</p>}
    </section>
  );

  const sel = (k, label, options) => (
    <section className="form-group">
      <label className="form-label">{label} <span className="text-red">*</span></label>
      <select 
        value={form[k]} 
        onChange={e => set(k, e.target.value)}
        className={`form-select ${errors[k] ? "input-error" : ""} ${!form[k] ? "select-placeholder" : ""}`}
      >
        <option value="">Select {label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[k] && <p className="error-text">{errors[k]}</p>}
    </section>
  );

  return (
    <main className="form-container">
      <header>
        <h2 className="form-title">{editData ? "Edit Supervisor" : "Add Supervisor"}</h2>
        <p className="form-subtitle">{editData ? "Update supervisor details below." : "Register a new supervisor in the system."}</p>
      </header>

      <form onSubmit={(e) => e.preventDefault()} className="form-card">
        <fieldset className="form-fieldset">
          <article className="form-grid">
            {inp("name", "Full Name")}
            {inp("email", "Email Address", "email")}
          </article>
          <article className="form-grid">
            {inp("phone", "Phone Number")}
            {inp("designation", "Designation")}
          </article>
          <article className="form-grid">
            {sel("department", "Department", departments)}
            {sel("specialization", "Specialization", specializations)}
          </article>
          <article className="form-grid">
            {inp("maxProjects", "Max Projects", "number")}
            <section className="form-group">
              <label className="form-label">Status</label>
              <article className="radio-group">
                {["Active", "Inactive"].map(s => (
                  <label key={s} className="radio-label">
                    <input type="radio" value={s} checked={form.status === s} onChange={() => set("status", s)} className="radio-input" />
                    {s}
                  </label>
                ))}
              </article>
            </section>
          </article>

          <section className="bio-section">
            <label className="form-label">Bio / Description</label>
            <textarea 
              value={form.bio} 
              onChange={e => set("bio", e.target.value)} 
              rows={4}
              className="form-textarea"
            />
          </section>
        </fieldset>

        <footer className="form-footer">
          <button type="button" onClick={handleSubmit} className="btn-primary">
            <i className={`ti ${editData ? "ti-check" : "ti-user-plus"}`} />
            {editData ? "Save Changes" : "Add Supervisor"}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </footer>
      </form>
    </main>
  );
}