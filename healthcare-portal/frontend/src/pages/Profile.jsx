import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProfileData, updateProfileInfo } from '../services/profileService';
import { fetchAppointments, categorizeAppointments } from '../services/appointmentService';
import VitalsChart from '../components/VitalsChart';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);
  const queryClient = useQueryClient();

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfileData,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch appointments
  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    staleTime: 2 * 60 * 1000,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setIsEditMode(false);
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      alert('Failed to update profile: ' + error.message);
    }
  });

  const handleEditClick = () => {
    setEditedInfo({ ...profileData.personalInfo });
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    updateMutation.mutate(editedInfo);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedInfo(null);
  };

  const handleInputChange = (field, value) => {
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#7f8c8d' }}>Loading profile...</p>
      </div>
    );
  }

  if (isError || !profileData) {
    return (
      <div style={{ padding: '30px' }}>
        <div style={{
          backgroundColor: '#fadbd8',
          padding: '20px',
          borderRadius: '8px',
          color: '#e74c3c'
        }}>
          Error loading profile data
        </div>
      </div>
    );
  }

  const { personalInfo, medicalSummary, labResults, vitals } = profileData;

  // Safety checks for required data
  if (!personalInfo || !vitals || !vitals.current) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#7f8c8d' }}>Loading profile data...</p>
      </div>
    );
  }
  const displayInfo = isEditMode ? editedInfo : personalInfo;
  
  // Get upcoming appointments
  const upcomingAppointments = appointments ? categorizeAppointments(appointments).upcoming.slice(0, 3) : [];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'normal':
      case 'controlled':
      case 'managed':
        return { bg: '#d5f4e6', color: '#27ae60' };
      case 'high':
      case 'elevated':
        return { bg: '#fadbd8', color: '#e74c3c' };
      case 'low':
        return { bg: '#fff3cd', color: '#f39c12' };
      default:
        return { bg: '#f8f9fa', color: '#7f8c8d' };
    }
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: 'Underweight', color: '#f39c12' };
    if (bmi < 25) return { status: 'Normal', color: '#27ae60' };
    if (bmi < 30) return { status: 'Overweight', color: '#e67e22' };
    return { status: 'Obese', color: '#e74c3c' };
  };

  const bmiInfo = getBMIStatus(vitals.current.bmi.value);

  return (
    <div style={{ padding: '20px', maxWidth: '100%', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '15px',
        padding: '30px',
        marginBottom: '30px',
        color: 'white',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}>
            👤
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px', fontWeight: '700' }}>
              {displayInfo.fullName}
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>
              📧 {displayInfo.email}
            </p>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>
              📱 {displayInfo.phone}
            </p>
          </div>
          <div style={{
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 20px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{personalInfo.bloodType}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Blood Type</div>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 20px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>
                {new Date().getFullYear() - new Date(personalInfo.dateOfBirth).getFullYear()}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Years Old</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '4px',
          flexWrap: 'wrap'
        }}>
          {['overview', 'medical', 'labs', 'vitals'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: activeTab === tab ? '#3498db' : 'transparent',
                color: activeTab === tab ? 'white' : '#7f8c8d',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Quick Health Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '10px'
          }}>
            <StatCard
              icon="🩺"
              label="Active Conditions"
              value={medicalSummary.conditions.filter(c => c.status !== 'resolved').length}
              color="#e74c3c"
            />
            <StatCard
              icon="💊"
              label="Current Medications"
              value={medicalSummary.medications.length}
              color="#3498db"
            />
            <StatCard
              icon="⚠️"
              label="Known Allergies"
              value={medicalSummary.allergies.length}
              color="#f39c12"
            />
            <StatCard
              icon="🧪"
              label="Recent Lab Tests"
              value={labResults.filter(l => {
                const testDate = new Date(l.date);
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - 3);
                return testDate >= monthsAgo;
              }).length}
              color="#27ae60"
            />
          </div>

          {/* Personal Information */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', color: '#2c3e50', margin: 0 }}>
                👤 Personal Information
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                {!isEditMode ? (
                  <button 
                    onClick={handleEditClick}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}>
                    ✏️ Edit
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleSaveClick}
                      disabled={updateMutation.isLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: updateMutation.isLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        opacity: updateMutation.isLoading ? 0.6 : 1
                      }}>
                      {updateMutation.isLoading ? '💾 Saving...' : '💾 Save'}
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      disabled={updateMutation.isLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#95a5a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: updateMutation.isLoading ? 'not-allowed' : 'pointer',
                        fontWeight: '600'
                      }}>
                      ✖️ Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {isEditMode ? (
                <>
                  <EditableField label="Full Name" value={editedInfo.fullName} onChange={(v) => handleInputChange('fullName', v)} />
                  <EditableField label="Email" value={editedInfo.email} onChange={(v) => handleInputChange('email', v)} type="email" />
                  <EditableField label="Phone" value={editedInfo.phone} onChange={(v) => handleInputChange('phone', v)} />
                  <InfoItem label="Date of Birth" value={new Date(displayInfo.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                  <InfoItem label="Gender" value={displayInfo.gender} />
                  <InfoItem label="Blood Type" value={displayInfo.bloodType} />
                  <EditableField label="Address" value={editedInfo.address} onChange={(v) => handleInputChange('address', v)} fullWidth />
                </>
              ) : (
                <>
                  <InfoItem label="Full Name" value={displayInfo.fullName} />
                  <InfoItem label="Email" value={displayInfo.email} />
                  <InfoItem label="Phone" value={displayInfo.phone} />
                  <InfoItem label="Date of Birth" value={new Date(displayInfo.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                  <InfoItem label="Gender" value={displayInfo.gender} />
                  <InfoItem label="Blood Type" value={displayInfo.bloodType} />
                  <InfoItem label="Address" value={displayInfo.address} fullWidth />
                </>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', color: '#2c3e50', margin: 0 }}>
                  📅 Upcoming Appointments
                </h2>
                <a 
                  href="/appointments" 
                  style={{
                    color: '#3498db',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                  View All →
                </a>
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    borderLeft: '4px solid #3498db',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1, minWidth: '200px' }}>
                      <img
                        src={apt.doctorImage}
                        alt={apt.doctorName}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#2c3e50', marginBottom: '4px' }}>
                          {apt.doctorName}
                        </div>
                        <div style={{ fontSize: '13px', color: '#7f8c8d' }}>
                          {apt.specialty}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>📅 Date</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                          {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>🕐 Time</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                          {apt.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              🚨 Emergency Contact
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <InfoItem label="Name" value={personalInfo.emergencyContact.name} />
              <InfoItem label="Relationship" value={personalInfo.emergencyContact.relationship} />
              <InfoItem label="Phone" value={personalInfo.emergencyContact.phone} />
            </div>
          </div>

          {/* Insurance Information */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              🏥 Insurance Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <InfoItem label="Provider" value={personalInfo.insurance?.provider || 'Blue Cross Blue Shield'} />
              <InfoItem label="Policy Number" value={personalInfo.insurance?.policyNumber || 'BCBS-123456789'} />
              <InfoItem label="Group Number" value={personalInfo.insurance?.groupNumber || 'GRP-456789'} />
              <InfoItem label="Coverage Type" value={personalInfo.insurance?.coverageType || 'PPO - Comprehensive'} />
            </div>
          </div>

          {/* Health Summary Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', fontWeight: '700' }}>
              📋 Quick Health Summary
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px' }}>Last Checkup</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>
                  {new Date(labResults[0]?.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px' }}>Current BMI</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>
                  {vitals.current.bmi.value} - {bmiInfo.status}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px' }}>Blood Pressure</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>
                  {vitals.current.bloodPressure.systolic}/{vitals.current.bloodPressure.diastolic} mmHg
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Summary Tab */}
      {activeTab === 'medical' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Medical Overview Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px',
            marginBottom: '10px'
          }}>
            <MiniStatCard icon="🩺" label="Conditions" value={medicalSummary.conditions.length} bgColor="#e8f4f8" />
            <MiniStatCard icon="⚠️" label="Allergies" value={medicalSummary.allergies.length} bgColor="#fff3e0" />
            <MiniStatCard icon="💊" label="Medications" value={medicalSummary.medications.length} bgColor="#e8f5e9" />
            <MiniStatCard icon="🏥" label="Surgeries" value={medicalSummary.surgeries.length} bgColor="#f3e5f5" />
          </div>

          {/* Conditions */}
          <MedicalSection
            title="🩺 Medical Conditions"
            icon="🩺"
            data={medicalSummary.conditions}
            renderItem={(condition) => (
              <div key={condition.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #3498db'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{condition.name}</h4>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <span>Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}</span>
                  <span style={{ 
                    marginLeft: '15px',
                    padding: '3px 10px',
                    backgroundColor: getStatusColor(condition.status).bg,
                    color: getStatusColor(condition.status).color,
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {condition.status}
                  </span>
                </div>
              </div>
            )}
          />

          {/* Allergies */}
          <MedicalSection
            title="⚠️ Allergies"
            icon="⚠️"
            data={medicalSummary.allergies}
            renderItem={(allergy) => (
              <div key={allergy.id} style={{
                padding: '15px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                borderLeft: '4px solid #f39c12'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>{allergy.name}</h4>
                <div style={{ fontSize: '14px', color: '#856404' }}>
                  <div>Severity: <strong>{allergy.severity}</strong></div>
                  <div>Reaction: {allergy.reaction}</div>
                </div>
              </div>
            )}
          />

          {/* Current Medications */}
          <MedicalSection
            title="💊 Current Medications"
            icon="💊"
            data={medicalSummary.medications}
            renderItem={(med) => (
              <div key={med.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #27ae60'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{med.name}</h4>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <div>Dosage: <strong>{med.dosage}</strong> - {med.frequency}</div>
                  <div>Prescribed: {new Date(med.prescribedDate).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          />

          {/* Surgery History */}
          <MedicalSection
            title="🏥 Surgery History"
            icon="🏥"
            data={medicalSummary.surgeries}
            renderItem={(surgery) => (
              <div key={surgery.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #9b59b6'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{surgery.name}</h4>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  <div>Date: {new Date(surgery.date).toLocaleDateString()}</div>
                  <div>Hospital: {surgery.hospital}</div>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Lab Results Tab */}
      {activeTab === 'labs' && (
        <div>
          {/* Lab Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: '#d5f4e6',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px solid #27ae60'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#27ae60' }}>
                {labResults.filter(r => r.status === 'Normal').length}
              </div>
              <div style={{ fontSize: '12px', color: '#27ae60', fontWeight: '600' }}>Normal</div>
            </div>
            <div style={{
              backgroundColor: '#fadbd8',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px solid #e74c3c'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#e74c3c' }}>
                {labResults.filter(r => r.status === 'High' || r.status === 'Low').length}
              </div>
              <div style={{ fontSize: '12px', color: '#e74c3c', fontWeight: '600' }}>Abnormal</div>
            </div>
            <div style={{
              backgroundColor: '#e8f4f8',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
              border: '1px solid #3498db'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#3498db' }}>
                {labResults.length}
              </div>
              <div style={{ fontSize: '12px', color: '#3498db', fontWeight: '600' }}>Total Tests</div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              🧪 Lab Results
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Test</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Value</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Normal Range</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#2c3e50', fontWeight: '600' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((result) => {
                    const statusStyle = getStatusColor(result.status);
                    return (
                      <tr key={result.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '12px', color: '#2c3e50', fontWeight: '500' }}>{result.test}</td>
                        <td style={{ padding: '12px', color: '#2c3e50' }}>
                          <strong>{result.value}</strong> {result.unit}
                        </td>
                        <td style={{ padding: '12px', color: '#7f8c8d' }}>{result.range} {result.unit}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '4px 12px',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            borderRadius: '12px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            {result.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#7f8c8d', fontSize: '14px' }}>
                          {new Date(result.date).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Vital Signs Summary Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '25px',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '15px', fontWeight: '700' }}>
              💪 Your Health Metrics Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px' }}>BMI Status</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>{bmiInfo.status}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px' }}>Heart Rate</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>{vitals.current.heartRate.value} bpm</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px' }}>Blood Pressure</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>
                  {vitals.current.bloodPressure.systolic}/{vitals.current.bloodPressure.diastolic}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '5px' }}>Oxygen Level</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>{vitals.current.oxygenSaturation.value}%</div>
              </div>
            </div>
          </div>

          {/* Current Vitals */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              ❤️ Current Vitals
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '15px'
            }}>
              <VitalCard
                icon="🫀"
                label="Blood Pressure"
                value={`${vitals.current.bloodPressure.systolic}/${vitals.current.bloodPressure.diastolic}`}
                unit={vitals.current.bloodPressure.unit}
                color="#e74c3c"
              />
              <VitalCard
                icon="💓"
                label="Heart Rate"
                value={vitals.current.heartRate.value}
                unit={vitals.current.heartRate.unit}
                color="#3498db"
              />
              <VitalCard
                icon="🌡️"
                label="Temperature"
                value={vitals.current.temperature.value}
                unit={vitals.current.temperature.unit}
                color="#f39c12"
              />
              <VitalCard
                icon="⚖️"
                label="Weight"
                value={vitals.current.weight.value}
                unit={vitals.current.weight.unit}
                color="#27ae60"
              />
              <VitalCard
                icon="📏"
                label="Height"
                value={vitals.current.height.value}
                unit={vitals.current.height.unit}
                color="#9b59b6"
              />
              <VitalCard
                icon="📊"
                label="BMI"
                value={vitals.current.bmi.value}
                unit={bmiInfo.status}
                color={bmiInfo.color}
              />
              <VitalCard
                icon="🫁"
                label="Oxygen Saturation"
                value={vitals.current.oxygenSaturation.value}
                unit={vitals.current.oxygenSaturation.unit}
                color="#16a085"
              />
            </div>
          </div>

          {/* Vitals Trend Chart */}
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
              📈 Vitals Trends (Last 4 Months)
            </h2>
            <VitalsChart vitalsHistory={vitals.history} />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const InfoItem = ({ label, value, fullWidth = false }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </div>
    <div style={{ fontSize: '15px', color: '#2c3e50', fontWeight: '500' }}>
      {value}
    </div>
  </div>
);

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  }}>
    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase' }}>
      {label}
    </div>
    <div style={{ fontSize: '28px', fontWeight: '700', color: color }}>
      {value}
    </div>
  </div>
);

const MedicalSection = ({ title, data, renderItem }) => (
  <div style={{
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0'
  }}>
    <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#2c3e50' }}>
      {title}
    </h2>
    <div style={{ display: 'grid', gap: '12px' }}>
      {data.length > 0 ? (
        data.map(renderItem)
      ) : (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#7f8c8d'
        }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>✓</div>
          <p style={{ margin: 0, fontStyle: 'italic' }}>No records available</p>
        </div>
      )}
    </div>
  </div>
);

const MiniStatCard = ({ icon, label, value, bgColor }) => (
  <div style={{
    backgroundColor: bgColor,
    padding: '15px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(0,0,0,0.05)'
  }}>
    <div style={{ fontSize: '28px' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50' }}>{value}</div>
      <div style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: '600' }}>{label}</div>
    </div>
  </div>
);

const VitalCard = ({ icon, label, value, unit, color }) => (
  <div style={{
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    borderLeft: `4px solid ${color}`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
  }}>
    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
    <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </div>
    <div style={{ fontSize: '26px', fontWeight: '700', color: color, marginBottom: '4px' }}>
      {value}
    </div>
    <div style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: '500' }}>
      {unit}
    </div>
  </div>
);

const EditableField = ({ label, value, onChange, type = 'text', fullWidth = false }) => (
  <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <label style={{ 
      fontSize: '12px', 
      color: '#7f8c8d', 
      marginBottom: '6px', 
      fontWeight: '600', 
      textTransform: 'uppercase', 
      letterSpacing: '0.5px',
      display: 'block'
    }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px',
        fontSize: '15px',
        color: '#2c3e50',
        fontWeight: '500',
        border: '2px solid #e0e0e0',
        borderRadius: '6px',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box'
      }}
      onFocus={(e) => e.target.style.borderColor = '#3498db'}
      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
    />
  </div>
);

export default Profile;
