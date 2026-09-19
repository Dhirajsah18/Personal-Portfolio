const rawApiBase = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE = rawApiBase.endsWith("/") ? rawApiBase.slice(0, -1) : rawApiBase;

/**
 * Checks if a JWT token exists and has not expired (7-day validity check)
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    // Buffer by 5 seconds
    return payload.exp * 1000 <= Date.now() + 5000;
  } catch {
    return true;
  }
};

export const handleAuthExpired = () => {
  localStorage.removeItem("portfolio_admin_token");
  localStorage.removeItem("portfolio_admin_user");
  window.dispatchEvent(new CustomEvent("portfolio:auth-expired"));
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("portfolio_admin_token");
  if (isTokenExpired(token)) {
    if (token) handleAuthExpired();
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getAuthBearer = () => {
  const token = localStorage.getItem("portfolio_admin_token");
  if (isTokenExpired(token)) {
    if (token) handleAuthExpired();
    return {};
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401) {
    handleAuthExpired();
    throw new Error(data.message || "Session expired. Please log in again.");
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await handleResponse(res);
    return data.data;
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async updateProject(id, projectData) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async reorderProjects(projectIds) {
    const res = await fetch(`${API_BASE}/projects/reorder`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ projectIds }),
    });
    return handleResponse(res);
  },

  // Skills
  async getSkills() {
    const res = await fetch(`${API_BASE}/skills`);
    const data = await handleResponse(res);
    return data.data;
  },

  async createSkill(skillData) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async updateSkill(id, skillData) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async deleteSkill(id) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Contact
  async sendMessage(contactData) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    return handleResponse(res);
  },

  async getMessages() {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async markMessageRead(id, isRead = true) {
    const res = await fetch(`${API_BASE}/contact/${id}/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ isRead }),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  async deleteMessage(id) {
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Analytics
  async trackVisit(page = window.location.pathname, referrer = document.referrer || "direct") {
    try {
      await fetch(`${API_BASE}/analytics/visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, referrer }),
      });
    } catch {
      // Quiet fail if backend is restarting
    }
  },

  async trackResumeDownload() {
    try {
      await fetch(`${API_BASE}/analytics/resume-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Quiet fail
    }
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/analytics/stats`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(res);
    return data.data;
  },

  // Resume Management
  async getResume() {
    const res = await fetch(`${API_BASE}/resume`);
    const data = await handleResponse(res);
    return data.data;
  },

  async uploadResume(formData) {
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: "POST",
      headers: getAuthBearer(),
      body: formData,
    });
    return handleResponse(res);
  },

  async updateResumeUrl(customUrl) {
    const res = await fetch(`${API_BASE}/resume/url`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ customUrl }),
    });
    return handleResponse(res);
  },
};
