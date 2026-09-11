const API_BASE = "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("portfolio_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
    return data;
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch projects");
    return data.data;
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create project");
    return data.data;
  },

  async updateProject(id, projectData) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update project");
    return data.data;
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete project");
    return data;
  },

  // Skills
  async getSkills() {
    const res = await fetch(`${API_BASE}/skills`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch skills");
    return data.data;
  },

  async createSkill(skillData) {
    const res = await fetch(`${API_BASE}/skills`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create skill");
    return data.data;
  },

  async updateSkill(id, skillData) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(skillData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update skill");
    return data.data;
  },

  async deleteSkill(id) {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete skill");
    return data;
  },

  // Contact
  async sendMessage(contactData) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send message");
    return data;
  },

  async getMessages() {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch messages");
    return data;
  },

  async markMessageRead(id, isRead = true) {
    const res = await fetch(`${API_BASE}/contact/${id}/read`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ isRead }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update status");
    return data.data;
  },

  async deleteMessage(id) {
    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete message");
    return data;
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
    return data.data;
  },
};
