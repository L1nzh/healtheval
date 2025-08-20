'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PersonalInfo, Gender, AgeGroup, EducationLevel } from '@/types';
import Image from 'next/image';
export default function PersonalInfoPage() {
  const router = useRouter();
  const { setPersonalInfo, submissions } = useApp();
  const [formData, setFormData] = useState<PersonalInfo>({
    annotatorId: '',
    gender: null,
    ageGroup: null,
    educationLevel: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.annotatorId || !formData.gender || !formData.ageGroup || !formData.educationLevel) {
      alert('Please fill in all fields before saving.');
      return;
    }

    setPersonalInfo(formData);
    alert('Personal information saved!');
  };

  const handleStart = () => {
    // Validate all fields are filled
    if (!formData.annotatorId || !formData.gender || !formData.ageGroup || !formData.educationLevel) {
      alert('Please fill in all fields before starting.');
      return;
    }

    setPersonalInfo(formData);
    router.push('/evaluation');
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      {/* admin portal */}
      <div className="absolute top-4 right-4">
        <a href="/admin" title="Admin Portal">
          <Image 
            src="/icons/admin-lock.svg" 
            alt="Admin Portal" 
            width={48}
            height={48}
            className="hover:opacity-80 transition-opacity"          />
        </a>
      </div>

      {/* personal information */}
      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-3xl font-bold mb-8">Personal Information</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Annotator ID</label>
            <input
              type="text"
              value={formData.annotatorId}
              onChange={(e) => setFormData({ ...formData, annotatorId: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              value={formData.gender || ''}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age Group</label>
            <select
              value={formData.ageGroup || ''}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as AgeGroup })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select age group</option>
              {['10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79'].map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Educational Level</label>
            <select
              value={formData.educationLevel || ''}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Start
            </button>
          </div>
        </form>

        {submissions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Completed Forms</h2>
            <ul className="space-y-2">
              {submissions.map((submission, index) => (
                <li key={index} className="p-2 bg-gray-100 rounded">
                  Annotator ID: {submission.personalInfo.annotatorId}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </main>
  );
}
