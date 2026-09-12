import { useState, useEffect, useRef } from "react";
import {
  FiFileText,
  FiUploadCloud,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiLink,
  FiClock,
  FiHardDrive,
  FiExternalLink,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { api } from "../../services/api";

const ResumeManager = ({ onResumeUpdated, refreshTrigger }) => {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [previewKey, setPreviewKey] = useState(Date.now());
  const fileInputRef = useRef(null);

  const fetchResumeData = async () => {
    setLoading(true);
    try {
      const data = await api.getResume();
      setResumeInfo(data);
      setCustomUrl(data.customUrl || "");
      setPreviewKey(Date.now());
    } catch (err) {
      console.error("Error fetching resume data:", err);
      setFeedback({ type: "error", message: "Failed to load resume details." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, [refreshTrigger]);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: "", message: "" });
    }, 4000);
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      showToast("error", "Please select a valid PDF file (.pdf)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("error", "File size exceeds 10 MB limit");
      return;
    }

    setSelectedFile(file);
    setFeedback({ type: "", message: "" });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await api.uploadResume(formData);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("success", response.message || "Resume updated and published live!");
      await fetchResumeData();
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      console.error("Upload error:", err);
      showToast("error", err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCustomUrl = async (e) => {
    e.preventDefault();
    setSavingUrl(true);
    try {
      const response = await api.updateResumeUrl(customUrl);
      showToast("success", response.message || "Resume link updated successfully!");
      await fetchResumeData();
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      console.error("Error updating custom URL:", err);
      showToast("error", err.message || "Failed to update link");
    } finally {
      setSavingUrl(false);
    }
  };

  const handleResetToPdf = async () => {
    setSavingUrl(true);
    try {
      await api.updateResumeUrl("");
      setCustomUrl("");
      showToast("success", "Reset to uploaded PDF resume!");
      await fetchResumeData();
      if (onResumeUpdated) onResumeUpdated();
    } catch (err) {
      console.error("Error resetting resume:", err);
      showToast("error", err.message || "Failed to reset");
    } finally {
      setSavingUrl(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Toast Feedback Alert */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-3 transition-all duration-300 animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <FiCheckCircle size={18} className="shrink-0 text-emerald-400" />
          ) : (
            <FiAlertCircle size={18} className="shrink-0 text-rose-400" />
          )}
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Active Resume Info & Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Resume Status (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className="glass rounded-3xl p-6 border flex flex-col justify-between relative overflow-hidden"
            style={{ borderColor: "var(--glass-border)" }}
          >
            {/* Ambient Background Accent */}
            <div
              className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
              style={{ background: "var(--accent)" }}
            />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Live Portfolio Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 radar-beacon" />
                  Live on Portfolio
                </span>
              </div>

              {/* Document Icon & File Name */}
              <div className="flex items-start gap-4 p-4 rounded-2xl glass border mb-5" style={{ borderColor: "var(--glass-border)" }}>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md"
                  style={{ background: "var(--accent-gradient)" }}
                >
                  <FiFileText size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm truncate font-display" style={{ color: "var(--text-primary)" }}>
                    {resumeInfo?.filename || "Dhiraj_Kumar_Sah_Resume.pdf"}
                  </h3>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-2xl glass border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">
                    <FiHardDrive size={12} style={{ color: "var(--accent)" }} /> File Size
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                      {resumeInfo?.sizeFormatted || "130.6 KB"}
                    </span>
                    {resumeInfo?.compressedSizeFormatted && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30"
                        title="Stored in MongoDB with Level 9 Gzip compression"
                      >
                        ⚡ {resumeInfo.compressedSizeFormatted} DB
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-2xl glass border" style={{ borderColor: "var(--glass-border)" }}>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)] uppercase mb-1">
                    <FiDownload size={12} style={{ color: "var(--accent)" }} /> Downloads
                  </div>
                  <span className="text-sm font-bold font-mono" style={{ color: "var(--accent)" }}>
                    {resumeInfo?.totalDownloads ?? 0} times
                  </span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-5">
                <FiClock size={13} style={{ color: "var(--accent)" }} />
                <span>
                  Last updated:{" "}
                  {resumeInfo?.updatedAt
                    ? new Date(resumeInfo.updatedAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Default file"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="/api/resume/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <FiExternalLink size={14} /> Preview
                </a>

                <a
                  href="/api/resume/download?download=true"
                  download
                  className="glass pill-hover py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all text-center"
                  style={{ borderColor: "var(--glass-border)", color: "var(--text-primary)" }}
                >
                  <FiDownload size={14} style={{ color: "var(--accent)" }} /> Download
                </a>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5"
              >
                <FiEye size={13} />
                <span>{showPreview ? "Hide In-App Preview" : "Show In-App Document Viewer"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Upload New File & Optional External Link (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* File Upload Card */}
          <div
            className="glass rounded-3xl p-6 border"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <div className="mb-4">
              <h3 className="font-bold text-sm font-display flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiUploadCloud style={{ color: "var(--accent)" }} /> Upload Updated Resume (PDF)
              </h3>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragOver
                  ? "border-[var(--accent)] bg-[var(--accent)]/5 scale-[0.99]"
                  : "border-[var(--glass-border)] hover:border-[var(--accent)] hover:bg-white/[0.02]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                style={{ background: "var(--accent-gradient)" }}
              >
                <FiUploadCloud size={28} />
              </div>

              <div>
                <p className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>
                  Click to browse or drag and drop PDF here
                </p>
                <p className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                  PDF only (Max 10 MB)
                </p>
              </div>
            </div>

            {/* Selected File Details & Upload Action */}
            {selectedFile && (
              <div className="mt-4 p-4 rounded-2xl glass border flex items-center justify-between gap-3 animate-fade-in" style={{ borderColor: "var(--accent)" }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: "var(--accent-gradient)" }}
                  >
                    <FiFileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready to save
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-2 rounded-xl glass text-[var(--text-muted)] hover:text-rose-400 hover:border-rose-500/30 transition-all border"
                    style={{ borderColor: "var(--glass-border)" }}
                    title="Remove selected file"
                  >
                    <FiX size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
                  >
                    {uploading ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiCheck size={14} /> Publish Resume
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Optional: External Link Override */}
          <div
            className="glass rounded-3xl p-6 border"
            style={{ borderColor: "var(--glass-border)" }}
          >
            <div className="mb-3">
              <h3 className="font-bold text-sm font-display flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <FiLink style={{ color: "var(--accent)" }} /> Optional: External Resume Link
              </h3>
            </div>

            <form onSubmit={handleSaveCustomUrl} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/your-resume-link/view"
                  className="flex-1 px-4 py-2.5 rounded-2xl glass border text-xs focus:outline-none transition-all"
                  style={{
                    borderColor: "var(--glass-border)",
                    color: "var(--text-primary)",
                  }}
                />

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={savingUrl}
                    className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    {savingUrl ? "Saving..." : "Save Link"}
                  </button>

                  {resumeInfo?.customUrl && (
                    <button
                      type="button"
                      onClick={handleResetToPdf}
                      disabled={savingUrl}
                      className="glass pill-hover px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                      title="Reset to uploaded PDF"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* In-App Live PDF Preview Viewer */}
      {showPreview && (
        <div
          className="glass rounded-3xl p-6 border animate-fade-in"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm font-display flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <FiEye style={{ color: "var(--accent)" }} /> In-App Live Resume Viewer
            </h3>
            <button
              onClick={() => setShowPreview(false)}
              className="glass p-2 rounded-xl text-xs border"
              style={{ borderColor: "var(--glass-border)", color: "var(--text-muted)" }}
            >
              <FiX size={15} />
            </button>
          </div>
          <div className="w-full h-[600px] rounded-2xl overflow-hidden border bg-neutral-900" style={{ borderColor: "var(--glass-border)" }}>
            <iframe
              key={previewKey}
              src={`/api/resume/download#toolbar=0&navpanes=0`}
              title="Live Resume Document Preview"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
