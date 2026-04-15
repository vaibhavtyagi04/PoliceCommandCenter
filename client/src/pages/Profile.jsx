import React, { useState, useEffect, useContext } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiPlus, FiTrash2, FiSave, FiImage } from "react-icons/fi";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    emergencyContacts: []
  });
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/auth/profile");
      setProfile(res.data.user);
    } catch (err) {
      console.error("Profile fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    try {
      const res = await axios.put("/api/auth/profile", profile);
      login(res.data.user, localStorage.getItem("pp:token")); // Update context
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setProfile({
      ...profile,
      emergencyContacts: [...profile.emergencyContacts, newContact]
    });
    setNewContact({ name: "", phone: "", relation: "" });
  };

  const removeContact = (index) => {
    const updated = profile.emergencyContacts.filter((_, i) => i !== index);
    setProfile({ ...profile, emergencyContacts: updated });
  };

  if (loading) return <div className="p-10 text-center font-bold text-navy">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
            <div className="w-32 h-32 bg-navy/5 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-gold relative">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <FiUser className="text-5xl text-navy opacity-30" />
              )}
              <button className="absolute bottom-1 right-1 bg-gold text-white p-2 rounded-full shadow-lg">
                <FiImage />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-navy">{profile.name}</h2>
            <p className="text-gray-500 text-sm capitalize">{profile.role}</p>
            <div className="mt-4 inline-block px-4 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
              ✓ Verified Account
            </div>
          </div>

          <div className="bg-navy text-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-gold">🛡️</span> Safety Status
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Your profile is synced with local police records. Keep your emergency contacts updated for faster SOS response.
            </p>
          </div>
        </div>

        {/* Content Tabs/Sections */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-navy">Personal Details</h3>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center gap-2 bg-navy text-white px-5 py-2 rounded-xl font-semibold hover:bg-slate-800 transition disabled:opacity-50"
              >
                <FiSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {success && <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-xl text-center text-sm font-bold border border-green-200">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Full Name" icon={<FiUser />} value={profile.name} onChange={(v) => setProfile({...profile, name: v})} />
              <ProfileField label="Email Address" icon={<FiMail />} value={profile.email} onChange={(v) => setProfile({...profile, email: v})} />
              <ProfileField label="Phone Number" icon={<FiPhone />} value={profile.phone} disabled />
              <ProfileField label="Residential Address" icon={<FiMapPin />} value={profile.address} onChange={(v) => setProfile({...profile, address: v})} isFull />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-navy mb-6">Emergency Contacts</h3>
            
            <div className="space-y-4 mb-8">
              {profile.emergencyContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-gray-100">
                  <div>
                    <p className="font-bold text-navy">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.relation} • {contact.phone}</p>
                  </div>
                  <button onClick={() => removeContact(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><FiTrash2 /></button>
                </div>
              ))}
              {profile.emergencyContacts.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">No emergency contacts added yet.</p>}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-dotted border-navy/20">
              <h4 className="font-bold text-navy text-sm mb-4">Add New Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input type="text" placeholder="Name" className="p-3 border rounded-xl outline-none focus:border-navy text-sm" value={newContact.name} onChange={e=>setNewContact({...newContact, name: e.target.value})} />
                <input type="text" placeholder="Phone" className="p-3 border rounded-xl outline-none focus:border-navy text-sm" value={newContact.phone} onChange={e=>setNewContact({...newContact, phone: e.target.value})} />
                <input type="text" placeholder="Relation" className="p-3 border rounded-xl outline-none focus:border-navy text-sm" value={newContact.relation} onChange={e=>setNewContact({...newContact, relation: e.target.value})} />
              </div>
              <button onClick={addContact} className="w-full flex items-center justify-center gap-2 py-3 bg-navy text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition">
                <FiPlus /> Add Contact
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const ProfileField = ({ label, icon, value, onChange, disabled, isFull }) => (
  <div className={isFull ? "md:col-span-2" : ""}>
    <label className="text-gray-500 text-xs font-bold mb-1 block ml-1 uppercase tracking-wider">{label}</label>
    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-gray-100 rounded-xl">
      <span className="text-navy opacity-40">{icon}</span>
      <input 
        type="text" 
        className="bg-transparent w-full outline-none text-navy font-semibold disabled:opacity-50" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        disabled={disabled}
      />
    </div>
  </div>
);
