import React, { useEffect, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { useStudentAuthStore } from '../../../stores/useStudentAuthStore';
import { userAPI } from '../../../api/user';
import ProfileManager from '../../../components/profile/ProfileManager';

const ProfileTab = () => {
  const { user, setUser, isLoading, setLoading } = useStudentAuthStore();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      if (res.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin text-teal-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <ProfileManager user={user} onUpdate={(updatedUser) => setUser(updatedUser)} type="student" />
    </div>
  );
};

export default ProfileTab;
