import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ICON_OPTIONS, COLOR_OPTIONS } from "../data/defaultData";
import styles from "./AdminDashboard.module.css";

/**
 * لوحة التحكم الإدارية
 * أقسام: الرئيسية، وسائل الدفع، الإعدادات
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    paymentMethods,
    siteSettings,
    addPayment,
    editPayment,
    deletePayment,
    togglePaymentStatus,
    updateSettings,
    logout,
    addToast,
  } = useApp();

  const [activeSection, setActiveSection] = useState("dashboard");

  // Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showConfirm, setShowConfirm] = useState({ open: false, id: null });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    accountName: "",
    description: "",
    icon: "fa-mobile",
    color: "purple",
  });

  // Settings state
  const [settingsData, setSettingsData] = useState({ ...siteSettings });

  const handleLogout = useCallback(() => {
    logout();
    navigate("/control-panel", { replace: true });
  }, [logout, navigate]);

  // ===== Payment Modal =====
  const openAddModal = useCallback(() => {
    setEditingPayment(null);
    setFormData({
      name: "",
      accountNumber: "",
      accountName: "",
      description: "",
      icon: "fa-mobile",
      color: "purple",
    });
    setShowPaymentModal(true);
  }, []);

  const openEditModal = useCallback((pm) => {
    setEditingPayment(pm);
    setFormData({
      name: pm.name,
      accountNumber: pm.accountNumber,
      accountName: pm.accountName,
      description: pm.description || "",
      icon: pm.icon,
      color: pm.color,
    });
    setShowPaymentModal(true);
  }, []);

  const handleSavePayment = useCallback(() => {
    if (
      !formData.name.trim() ||
      !formData.accountNumber.trim() ||
      !formData.accountName.trim()
    ) {
      addToast("يرجى ملء جميع الحقول المطلوبة", "error");
      return;
    }
    if (editingPayment) {
      editPayment(editingPayment.id, formData);
    } else {
      addPayment(formData);
    }
    setShowPaymentModal(false);
    setEditingPayment(null);
  }, [formData, editingPayment, addPayment, editPayment, addToast]);

  const handleDelete = useCallback(() => {
    if (showConfirm.id) {
      deletePayment(showConfirm.id);
      setShowConfirm({ open: false, id: null });
    }
  }, [showConfirm, deletePayment]);

  // ===== Settings =====
  const handleSaveSettings = useCallback(
    (e) => {
      e.preventDefault();
      updateSettings(settingsData);
    },
    [settingsData, updateSettings],
  );

  // ===== Stats =====
  const totalDonations = siteSettings.currentAmount || 0;
  const daysLeft = siteSettings.daysLeft || 0;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <i className="fa-solid fa-leaf"></i>
          </div>
          <h3>لوحة التحكم</h3>
        </div>
        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeSection === "dashboard" ? styles.navActive : ""}`}
            onClick={() => setActiveSection("dashboard")}
          >
            <i className="fa-solid fa-gauge-high"></i> لوحة المعلومات
          </button>
          <button
            className={`${styles.navItem} ${activeSection === "payments" ? styles.navActive : ""}`}
            onClick={() => setActiveSection("payments")}
          >
            <i className="fa-solid fa-credit-card"></i> وسائل الدفع
          </button>
          <button
            className={`${styles.navItem} ${activeSection === "settings" ? styles.navActive : ""}`}
            onClick={() => setActiveSection("settings")}
          >
            <i className="fa-solid fa-gear"></i> الإعدادات
          </button>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* ===== Dashboard Section ===== */}
        {activeSection === "dashboard" && (
          <div className={styles.section}>
            <h1 className={styles.pageTitle}>مرحباً بك في لوحة التحكم</h1>
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.statPurple}`}>
                <div className={styles.statIcon}>
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <div>
                  <div className={styles.statNum}>{paymentMethods.length}</div>
                  <div className={styles.statLabel}>وسائل الدفع</div>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statTeal}`}>
                <div className={styles.statIcon}>
                  <i className="fa-solid fa-sack-dollar"></i>
                </div>
                <div>
                  <div className={styles.statNum}>
                    {totalDonations.toLocaleString("ar-SY")}
                  </div>
                  <div className={styles.statLabel}>إجمالي التبرعات (ل.س)</div>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statGreen}`}>
                <div className={styles.statIcon}>
                  <i className="fa-solid fa-users"></i>
                </div>
                <div>
                  <div className={styles.statNum}>
                    {siteSettings.donorsCount}
                  </div>
                  <div className={styles.statLabel}>عدد المتبرعين</div>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statBlue}`}>
                <div className={styles.statIcon}>
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <div>
                  <div className={styles.statNum}>{daysLeft}</div>
                  <div className={styles.statLabel}>أيام متبقية</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Payments Section ===== */}
        {activeSection === "payments" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h1 className={styles.pageTitle}>إدارة وسائل الدفع</h1>
              <button className={styles.addBtn} onClick={openAddModal}>
                <i className="fa-solid fa-plus"></i> إضافة وسيلة جديدة
              </button>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>الأيقونة</th>
                    <th>الاسم</th>
                    <th>رقم الحساب</th>
                    <th>المالك</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((pm, i) => (
                      <tr key={pm.id} className={styles.tableRow}>
                        <td>{i + 1}</td>
                        <td>
                          <span
                            className={`${styles.tableIcon} ${styles["ti_" + pm.color]}`}
                          >
                            <i className={`fa-solid ${pm.icon}`}></i>
                          </span>
                        </td>
                        <td>
                          <strong>{pm.name}</strong>
                        </td>
                        <td dir="ltr">{pm.accountNumber}</td>
                        <td>{pm.accountName}</td>
                        <td>
                          <div className={styles.tableActions}>
                            <button
                              className={styles.editBtn}
                              onClick={() => openEditModal(pm)}
                              title="تعديل"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              className={styles.visibilityBtn}
                              onClick={() =>
                                togglePaymentStatus(pm.id, !pm.isActive)
                              }
                              title={pm.isActive ? "إخفاء" : "إظهار"}
                            >
                              <i
                                className={`fa-solid ${pm.isActive ? "fa-eye-slash" : "fa-eye"}`}
                              ></i>
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() =>
                                setShowConfirm({ open: true, id: pm.id })
                              }
                              title="حذف"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.emptyRow}>
                        <i className="fa-solid fa-inbox"></i> لا توجد وسائل دفع
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== Settings Section ===== */}
        {activeSection === "settings" && (
          <div className={styles.section}>
            <h1 className={styles.pageTitle}>الإعدادات العامة</h1>
            <form className={styles.settingsForm} onSubmit={handleSaveSettings}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>اسم الفريق</label>
                  <input
                    type="text"
                    value={settingsData.teamName || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        teamName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>وصف الفريق</label>
                  <textarea
                    value={settingsData.teamDescription || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        teamDescription: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>هدف التبرع (ل.س)</label>
                  <input
                    type="number"
                    value={settingsData.goalAmount || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        goalAmount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>المبلغ المجموع حالياً (ل.س)</label>
                  <input
                    type="number"
                    value={settingsData.currentAmount || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        currentAmount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>عدد المتبرعين</label>
                  <input
                    type="number"
                    value={settingsData.donorsCount || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        donorsCount: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>أيام الحملة المتبقية</label>
                  <input
                    type="number"
                    value={settingsData.daysLeft || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        daysLeft: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>رقم واتساب</label>
                  <input
                    type="text"
                    placeholder="9639XXXXXXXX"
                    value={settingsData.whatsapp || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        whatsapp: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>رقم الهاتف</label>
                  <input
                    type="text"
                    placeholder="9639XXXXXXXX"
                    value={settingsData.phone || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={settingsData.email || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>رابط الشعار (URL) — اختياري</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={settingsData.logoUrl || ""}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        logoUrl: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <button type="submit" className={styles.saveBtn}>
                <i className="fa-solid fa-check"></i> حفظ الإعدادات
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={styles.bottomNav}>
        <button
          className={`${styles.bottomNavItem} ${activeSection === "dashboard" ? styles.bottomNavActive : ""}`}
          onClick={() => setActiveSection("dashboard")}
        >
          <i className="fa-solid fa-gauge-high"></i> الرئيسية
        </button>
        <button
          className={`${styles.bottomNavItem} ${activeSection === "payments" ? styles.bottomNavActive : ""}`}
          onClick={() => setActiveSection("payments")}
        >
          <i className="fa-solid fa-credit-card"></i> الدفع
        </button>
        <button
          className={`${styles.bottomNavItem} ${activeSection === "settings" ? styles.bottomNavActive : ""}`}
          onClick={() => setActiveSection("settings")}
        >
          <i className="fa-solid fa-gear"></i> الإعدادات
        </button>
      </nav>

      {/* ===== Payment Add/Edit Modal ===== */}
      {showPaymentModal && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPaymentModal(false);
          }}
        >
          <div className={styles.modal}>
            <h2>
              {editingPayment ? "تعديل وسيلة الدفع" : "إضافة وسيلة دفع جديدة"}
            </h2>

            <div className={styles.formGroup}>
              <label>اسم الوسيلة *</label>
              <input
                type="text"
                placeholder="مثال: سيرياتيل كاش"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>رقم الحساب *</label>
              <input
                type="text"
                placeholder="0933123456"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>اسم صاحب الحساب *</label>
              <input
                type="text"
                placeholder="فريق أثرالتطوعي"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData({ ...formData, accountName: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>وصف / ملاحظات</label>
              <textarea
                placeholder="اكتب تبرع في الوصف"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>نوع الأيقونة</label>
              <div className={styles.iconPicker}>
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.iconOption} ${formData.icon === opt.value ? styles.iconSelected : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, icon: opt.value })
                    }
                    title={opt.label}
                  >
                    <i className={`fa-solid ${opt.value}`}></i>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>لون البطاقة</label>
              <div className={styles.colorPicker}>
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.colorOption} ${formData.color === opt.value ? styles.colorSelected : ""}`}
                    onClick={() =>
                      setFormData({ ...formData, color: opt.value })
                    }
                    title={opt.label}
                    style={{ background: opt.hex }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowPaymentModal(false)}
              >
                إلغاء
              </button>
              <button className={styles.submitBtn} onClick={handleSavePayment}>
                <i className="fa-solid fa-check"></i> حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Confirm Delete Dialog ===== */}
      {showConfirm.open && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget)
              setShowConfirm({ open: false, id: null });
          }}
        >
          <div className={styles.confirmBox}>
            <i
              className="fa-solid fa-triangle-exclamation"
              style={{ fontSize: 48, color: "#EF4444", marginBottom: 16 }}
            ></i>
            <h3>هل أنت متأكد من الحذف؟</h3>
            <p>لا يمكن التراجع عن هذا الإجراء</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirm({ open: false, id: null })}
              >
                إلغاء
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={handleDelete}
              >
                <i className="fa-solid fa-trash"></i> حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
