import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, Video, Upload, Trash2, Search, X, Plus, 
  Image as ImageIcon, Youtube, CheckSquare, Square, AlertCircle 
} from "lucide-react";
import { useFlash } from "../../components/common/FlashMessage.jsx";
import { API_BASE_URL } from "./AdminLayout.jsx";

const CATEGORIES = [
  "Food Distribution", "Medical Camps", "Education Programs", 
  "Elder Care", "Women Empowerment", "Events", "Volunteer Activities", "Other"
];

const AdminGallery = () => {
  // --- State Management ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ images: 0, videos: 0 });
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState("image");
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({ title: "", description: "", category: "Other", url: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const token = localStorage.getItem("token");
  const flash = useFlash();
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // --- Effects & Fetching ---
  useEffect(() => {
    fetchGalleryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, category, search]);

  const fetchGalleryItems = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("type", activeTab);
      if (category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      params.set("page", page);
      params.set("limit", 20);

      const res = await fetch(`${API_BASE_URL}/api/gallery/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      const data = await res.json();
      
      if (data.success) {
        setItems(data.items);
        setCounts(data.counts);
        setPagination(data.pagination);
      }
    } catch (error) {
      flash.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleFileSelect = (e, isThumbnail = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return flash.error("Only JPEG, PNG, GIF, and WebP images are allowed");
    }
    if (file.size > 10 * 1024 * 1024) {
      return flash.error("File size must be less than 10MB");
    }
    
    const preview = URL.createObjectURL(file);
    if (isThumbnail) {
      setThumbnailFile(file);
      setThumbnailPreview(preview);
    } else {
      setSelectedFile(file);
      setPreviewUrl(preview);
    }
  };

  const handleAddMedia = async () => {
    if (!formData.title.trim()) return flash.error("Please enter a title");

    const isVideo = addType === "video";
    if (isVideo && !formData.url.trim()) return flash.error("Please enter a video URL");
    if (!isVideo && !selectedFile) return flash.error("Please select an image");

    if (isVideo) {
      const url = formData.url.trim();
      if (!url.includes("youtube.com") && !url.includes("youtu.be") && !url.includes("vimeo.com")) {
        return flash.error("Only YouTube and Vimeo URLs are supported");
      }
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description.trim());
      data.append("category", formData.category);
      
      if (isVideo) {
        data.append("url", formData.url.trim());
        if (thumbnailFile) data.append("thumbnail", thumbnailFile);
      } else {
        data.append("image", selectedFile);
      }

      const endpoint = isVideo ? "/api/gallery/admin/video" : "/api/gallery/admin/image";
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        body: data
      });
      
      const result = await res.json();
      if (result.success) {
        flash.success(`${isVideo ? 'Video' : 'Image'} added successfully!`);
        closeAddModal();
        fetchGalleryItems();
      } else {
        flash.error(result.message || "Upload failed");
      }
    } catch (error) {
      flash.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (id, type) => {
    if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      });
      const result = await res.json();
      if (result.success) {
        flash.success(result.message);
        fetchGalleryItems();
      } else {
        flash.error(result.message || "Failed to delete item");
      }
    } catch (error) {
      flash.error("Failed to delete item");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) return;
    if (!window.confirm(`Delete ${selectedItems.length} selected item(s)? This cannot be undone.`)) return;

    setBulkDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/admin/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ ids: selectedItems })
      });
      const result = await res.json();
      if (result.success) {
        flash.success(result.message);
        setSelectedItems([]);
        fetchGalleryItems();
      } else {
        flash.error(result.message || "Failed to delete items");
      }
    } catch (error) {
      flash.error("Failed to delete items");
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAllItems = () => {
    setSelectedItems(selectedItems.length === items.length ? [] : items.map(i => i._id));
  };

  const openAddModal = (type) => {
    setAddType(type);
    setFormData({ title: "", description: "", category: "Other", url: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setShowAddModal(true);
  };

  const closeAddModal = () => setShowAddModal(false);

  // --- UI Components ---
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px", color: "#1e293b", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "#0f172a" }}>Media Gallery</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "15px" }}>Manage your organization's photos and videos.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => openAddModal("image")} style={styles.primaryBtn}>
            <Camera size={18} /> Upload Image
          </button>
          <button onClick={() => openAddModal("video")} style={styles.secondaryBtn}>
            <Youtube size={18} /> Add Video
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div style={styles.statCard}>
          <div style={{...styles.iconWrapper, background: "#ecfdf5", color: "#10b981"}}>
            <Camera size={24} />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>{counts.images}</div>
            <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Total Images</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.iconWrapper, background: "#fef2f2", color: "#ef4444"}}>
            <Video size={24} />
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>{counts.videos}</div>
            <div style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Total Videos</div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={styles.controlBar}>
        <div style={{ display: "flex", gap: "8px", background: "#f1f5f9", padding: "4px", borderRadius: "8px" }}>
          {["all", "image", "video"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? styles.tabActive : styles.tabInactive}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{...styles.input, width: "100%", paddingLeft: "42px", boxSizing: "border-box"}}
          />
        </div>

        {selectedItems.length > 0 && (
          <button onClick={handleBulkDelete} disabled={bulkDeleting} style={styles.dangerBtn}>
            <Trash2 size={16} /> Delete Selected ({selectedItems.length})
          </button>
        )}
      </div>

      {/* Bulk Action Header */}
      {!loading && items.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <button onClick={selectAllItems} style={styles.textBtn}>
            {selectedItems.length === items.length ? <CheckSquare size={18} color="#3b82f6"/> : <Square size={18} color="#94a3b8"/>}
            <span style={{ fontWeight: "500" }}>Select All</span>
          </button>
          <span style={{ color: "#64748b", fontSize: "14px" }}>Showing {items.length} of {pagination.total} items</span>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div style={styles.emptyState}>Loading gallery...</div>
      ) : items.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{...styles.iconWrapper, width: "64px", height: "64px", margin: "0 auto 16px", background: "#f1f5f9", color: "#94a3b8"}}>
            <ImageIcon size={32} />
          </div>
          <h3 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>No media found</h3>
          <p style={{ margin: 0, color: "#64748b" }}>Upload images or videos to build your gallery.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map(item => (
            <div key={item._id} style={{...styles.card, borderColor: selectedItems.includes(item._id) ? "#3b82f6" : "#e2e8f0"}}>
              
              <div style={{ position: "relative", aspectRatio: "16/10", cursor: "pointer", overflow: "hidden" }} onClick={() => toggleSelectItem(item._id)}>
                <img
                  src={item.type === "image" ? `${API_BASE_URL}${item.url}` : (item.thumbnail ? (item.thumbnail.startsWith("http") ? item.thumbnail : `${API_BASE_URL}${item.thumbnail}`) : "https://via.placeholder.com/400x250?text=Video")}
                  alt={item.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                  onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                />
                
                <div style={styles.badge(item.type === "image" ? "#10b981" : "#ef4444")}>
                  {item.type === "image" ? <Camera size={12} /> : <Video size={12} />}
                  {item.type === "image" ? "Image" : "Video"}
                </div>

                <div style={{ position: "absolute", top: "12px", right: "12px", background: "white", borderRadius: "6px", display: "flex" }}>
                  {selectedItems.includes(item._id) ? <CheckSquare size={24} color="#3b82f6" fill="#eff6ff" /> : <Square size={24} color="#cbd5e1" />}
                </div>
              </div>

              <div style={{ padding: "16px" }}>
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "600", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.title}
                </h4>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={styles.categoryPill}>{item.category}</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <button onClick={() => handleDeleteItem(item._id, item.type)} style={styles.deleteBtn}>
                  <Trash2 size={16} /> Delete Media
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" }}>
          <button 
            disabled={pagination.page <= 1} 
            onClick={() => fetchGalleryItems(pagination.page - 1)}
            style={pagination.page <= 1 ? styles.paginationDisabled : styles.paginationBtn}
          >
            Previous
          </button>
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#475569" }}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button 
            disabled={pagination.page >= pagination.pages} 
            onClick={() => fetchGalleryItems(pagination.page + 1)}
            style={pagination.page >= pagination.pages ? styles.paginationDisabled : styles.paginationBtn}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, fontSize: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#0f172a" }}>
                {addType === "image" ? <Camera size={22} color="#10b981" /> : <Youtube size={22} color="#ef4444" />}
                Add New {addType === "image" ? "Image" : "Video"}
              </h2>
              <button onClick={closeAddModal} style={styles.iconBtn}><X size={20} /></button>
            </div>

            <div style={{ padding: "24px" }}>
              
              {/* Media Upload Area */}
              <div style={{ marginBottom: "24px" }}>
                <label style={styles.label}>Media Source <span style={{color: "#ef4444"}}>*</span></label>
                
                {addType === "image" ? (
                  <div 
                    onClick={() => fileInputRef.current.click()} 
                    style={{...styles.uploadBox, borderColor: previewUrl ? "#10b981" : "#cbd5e1"}}
                  >
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e, false)} style={{ display: "none" }} />
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" style={{ maxHeight: "200px", borderRadius: "6px" }} />
                    ) : (
                      <div style={{ color: "#64748b" }}>
                        <Upload size={32} style={{ margin: "0 auto 12px", color: "#94a3b8" }} />
                        <p style={{ margin: "0 0 4px", fontWeight: "500", color: "#0f172a" }}>Click to browse or drag file</p>
                        <p style={{ margin: 0, fontSize: "13px" }}>JPEG, PNG, WEBP up to 10MB</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      style={{...styles.input, width: "100%", boxSizing: "border-box", marginBottom: "16px"}}
                    />
                    <label style={styles.label}>Custom Thumbnail (Optional)</label>
                    <div onClick={() => thumbnailInputRef.current.click()} style={styles.uploadBox}>
                      <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e, true)} style={{ display: "none" }} />
                      {thumbnailPreview ? (
                        <div style={{ position: "relative" }}>
                          <img src={thumbnailPreview} alt="Thumbnail" style={{ maxHeight: "120px", borderRadius: "6px" }} />
                          <button onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); setThumbnailPreview(null); }} style={styles.removePreviewBtn}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Click to upload a custom thumbnail</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div style={{ marginBottom: "20px" }}>
                <label style={styles.label}>Title <span style={{color: "#ef4444"}}>*</span></label>
                <input type="text" placeholder="Enter media title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{...styles.input, width: "100%", boxSizing: "border-box"}} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{...styles.input, width: "100%", boxSizing: "border-box"}}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Description (Optional)</label>
                  <textarea placeholder="Brief context about this media..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} style={{...styles.input, width: "100%", boxSizing: "border-box", resize: "vertical"}} />
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
                <button onClick={closeAddModal} style={styles.cancelBtn}>Cancel</button>
                <button onClick={handleAddMedia} disabled={uploading} style={uploading ? styles.disabledBtn : styles.submitBtn}>
                  {uploading ? "Saving..." : "Save Media"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Unified Styles Object ---
const styles = {
  primaryBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500", fontSize: "14px", transition: "background 0.2s" },
  secondaryBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "white", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "500", fontSize: "14px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
  dangerBtn: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: "8px", cursor: "pointer", fontWeight: "500", fontSize: "14px", marginLeft: "auto" },
  textBtn: { display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#334155", fontSize: "14px" },
  
  statCard: { background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  iconWrapper: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  
  controlBar: { display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" },
  tabActive: { padding: "8px 16px", background: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", color: "#0f172a", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", fontSize: "14px" },
  tabInactive: { padding: "8px 16px", background: "transparent", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500", color: "#64748b", fontSize: "14px" },
  
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", color: "#1e293b", background: "white", outline: "none", transition: "border-color 0.2s" },
  label: { display: "block", marginBottom: "8px", fontWeight: "600", color: "#334155", fontSize: "14px" },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" },
  card: { background: "white", borderRadius: "12px", overflow: "hidden", border: "2px solid", transition: "all 0.2s ease", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  badge: (bg) => ({ position: "absolute", top: "12px", left: "12px", background: bg, color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }),
  categoryPill: { background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" },
  deleteBtn: { width: "100%", padding: "10px", background: "transparent", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s" },
  
  emptyState: { textAlign: "center", padding: "64px 20px", background: "white", borderRadius: "12px", border: "1px dashed #cbd5e1" },
  
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modalContent: { background: "white", borderRadius: "16px", width: "100%", maxWidth: "540px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" },
  modalHeader: { padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: "4px", display: "flex" },
  uploadBox: { border: "2px dashed", borderRadius: "12px", padding: "32px 20px", textAlign: "center", cursor: "pointer", background: "#f8fafc", transition: "all 0.2s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "160px" },
  removePreviewBtn: { position: "absolute", top: "-10px", right: "-10px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  
  submitBtn: { padding: "10px 20px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  disabledBtn: { padding: "10px 20px", background: "#94a3b8", color: "white", border: "none", borderRadius: "8px", cursor: "not-allowed", fontWeight: "600", fontSize: "14px" },
  cancelBtn: { padding: "10px 20px", background: "transparent", color: "#475569", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },

  paginationBtn: { padding: "8px 16px", background: "white", color: "#0f172a", border: "1px solid #cbd5e1", borderRadius: "6px", cursor: "pointer", fontWeight: "500", fontSize: "14px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
  paginationDisabled: { padding: "8px 16px", background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "not-allowed", fontWeight: "500", fontSize: "14px" }
};

// Explicit default export
export default AdminGallery;