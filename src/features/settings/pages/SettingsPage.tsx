import React, { useState, useRef, useEffect } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Camera, 
  Loader2, 
  Save, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen,
  KeyRound
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { userApi } from '../../../api/userApi';
import { authApi } from '../../../api/authApi';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, isAuthenticated, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || user?.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Avatar State
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || user?.avatar || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '#home';
      openAuthModal('login');
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Handle Avatar Change & Upload
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn một file ảnh hợp lệ (.png, .jpg, .jpeg, .webp)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB!');
      return;
    }

    // Live preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    setIsUploadingAvatar(true);
    const toastId = toast.loading('Đang tải ảnh đại diện lên Cloudinary...');

    try {
      const res = await userApi.uploadAvatar(file);
      toast.success(res.message || 'Tải ảnh đại diện thành công!', { id: toastId });
      
      // Update global AuthContext & LocalStorage
      if (res.user && user) {
        const updatedUser = { ...user, ...res.user };
        updateUser(updatedUser);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể tải ảnh đại diện lên máy chủ!', { id: toastId });
      setAvatarPreview(user?.avatarUrl || user?.avatar || null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle Update Profile Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Vui lòng nhập Họ và Tên!');
      return;
    }

    setIsUpdatingProfile(true);
    const toastId = toast.loading('Đang cập nhật thông tin cá nhân...');

    try {
      const res = await userApi.updateProfile({ fullName: fullName.trim() });
      toast.success(res.message || 'Cập nhật hồ sơ thành công!', { id: toastId });

      if (res.user && user) {
        const updatedUser = { ...user, ...res.user };
        updateUser(updatedUser);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Lỗi khi cập nhật thông tin cá nhân!', { id: toastId });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Change Password Submit
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword.trim() || !newPassword.trim()) {
      toast.error('Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới!');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp với mật khẩu mới!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu mới phải chứa ít nhất 6 ký tự!');
      return;
    }

    setIsChangingPassword(true);
    const toastId = toast.loading('Đang đổi mật khẩu...');

    try {
      const res = await authApi.changePassword({
        oldPassword,
        newPassword,
      });
      toast.success(res.message || 'Đổi mật khẩu thành công!', { id: toastId });

      // Reset form fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại. Mật khẩu hiện tại không chính xác!', { id: toastId });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsWrapper}>
        
        {/* Page Header */}
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Cài Đặt Tài Khoản</h1>
          <p className={styles.subtitle}>
            Quản lý thông tin hồ sơ cá nhân và thiết lập bảo mật cho tài khoản EduSphere của bạn.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabsList}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.activeTabBtn : ''}`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Hồ sơ cá nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`${styles.tabBtn} ${activeTab === 'security' ? styles.activeTabBtn : ''}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Bảo mật & Mật khẩu</span>
          </button>
        </div>

        {/* Tab 1: Profile Settings */}
        {activeTab === 'profile' && (
          <div className={styles.cardBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
              <p className={styles.sectionDesc}>Cập nhật ảnh đại diện và họ tên hiển thị của bạn trên hệ thống.</p>
            </div>

            {/* Avatar Section */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className={styles.avatarImg} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {(user?.fullName || user?.email || 'E').charAt(0).toUpperCase()}
                  </div>
                )}

                <label 
                  htmlFor="avatarFileInput" 
                  className={styles.avatarOverlay}
                  title="Tải ảnh mới"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold">ĐỔI ẢNH</span>
                </label>

                <input
                  id="avatarFileInput"
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className={styles.hiddenFileInput}
                  disabled={isUploadingAvatar}
                />
              </div>

              <div className={styles.avatarActions}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className={styles.uploadBtn}
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải lên Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Tải ảnh đại diện mới</span>
                    </>
                  )}
                </button>
                <span className={styles.uploadHint}>Hỗ trợ JPG, PNG, WEBP tối đa 5MB</span>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSubmit}>
              {/* Full Name */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Họ và tên</label>
                <div className={styles.inputWrapper}>
                  <UserIcon className={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên hiển thị"
                    className={styles.inputField}
                  />
                </div>
              </div>

              {/* Email (Read only) */}
              <div className={styles.formGroup}>
                <div className="flex items-center justify-between mb-1">
                  <label className={styles.label}>Địa chỉ Email</label>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Đã xác thực
                  </span>
                </div>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} />
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className={styles.inputField}
                  />
                </div>
              </div>

              {/* User Role Badge */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Vai trò tài khoản</label>
                <div>
                  {user?.role === 'INSTRUCTOR' ? (
                    <span className={`${styles.badge} ${styles.instructorBadge}`}>
                      <BookOpen className="w-3.5 h-3.5" /> Giảng viên
                    </span>
                  ) : (
                    <span className={`${styles.badge} ${styles.studentBadge}`}>
                      <GraduationCap className="w-3.5 h-3.5" /> Học viên
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className={styles.submitBtn}
              >
                {isUpdatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Lưu thay đổi</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Security & Password Settings */}
        {activeTab === 'security' && (
          <div className={styles.cardBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Bảo mật & Đổi Mật Khẩu</h2>
              <p className={styles.sectionDesc}>Đổi mật khẩu định kỳ để bảo vệ tài khoản EduSphere của bạn.</p>
            </div>

            <form onSubmit={handleChangePasswordSubmit}>
              {/* Old Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Mật khẩu hiện tại</label>
                <div className={styles.inputWrapper}>
                  <KeyRound className={styles.inputIcon} />
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang sử dụng"
                    className={styles.inputField}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className={styles.togglePasswordBtn}
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className={styles.inputField}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={styles.togglePasswordBtn}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Xác nhận mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className={styles.inputField}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isChangingPassword}
                className={styles.submitBtn}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đổi mật khẩu...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cập nhật mật khẩu mới</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
