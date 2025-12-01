
import React, { useState } from 'react';
import Icon from '../components/Icon';

interface HostRegistrationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const Input: React.FC<{ 
    label: string; 
    placeholder?: string; 
    type?: string; 
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, placeholder, type = 'text', value, onChange }) => (
  <div>
      <label className="block text-xs font-bold text-stone-600 uppercase mb-2">{label}</label>
      <input 
          type={type} 
          className="w-full p-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
      />
  </div>
);

const HostRegistrationScreen: React.FC<HostRegistrationProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [contactMethod, setContactMethod] = useState<'Call' | 'Email' | 'Text'>('Email');
  
  // Form State
  const [formData, setFormData] = useState({
      email: '',
      nickname: '',
      firstName: '',
      familyName: '',
      dob: '',
      gender: 'Prefer not to say',
      address: '',
      isLicensed: 'No',
      interestedInLicense: 'No',
      hostingType: '',
      description: '',
      cost: '',
      phone: '',
      socialLink: ''
  });

  const handleChange = (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // Success Screen
  if (step === 6) {
    return (
      <div className="h-full bg-stone-50 p-6 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <Icon className="w-10 h-10"><polyline points="20 6 9 17 4 12" /></Icon>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Registration Submitted!</h2>
        <p className="text-stone-600 mb-6 text-sm leading-relaxed">
          Thank you for completing your registration and showing interest to become a host. Please wait for the Gora team to review your application and contact you.
        </p>
        
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-stone-100 mb-6 text-left">
           <label className="block text-xs font-bold text-stone-500 uppercase mb-3">How should we contact you?</label>
           <div className="flex space-x-2">
              {['Call', 'Email', 'Text'].map((method) => (
                  <button 
                    key={method}
                    onClick={() => setContactMethod(method as any)}
                    className={`flex-1 py-2 text-sm rounded-lg border ${
                        contactMethod === method 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                      {method}
                  </button>
              ))}
           </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left mb-8">
            <div className="flex items-start">
                <Icon className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
                <p className="text-xs text-amber-800">
                    <strong>Action Required:</strong> Please go to your Local Government Unit (LGU) Tourism Office to get your recommendation for certification training, orientation, licensing, and permitting.
                </p>
            </div>
        </div>

        <button 
            onClick={() => onComplete(formData)}
            className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl shadow-lg"
        >
            Go to Hosting Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-stone-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
             <button onClick={onBack} className="mr-3 text-stone-500 p-1 hover:bg-stone-100 rounded-full transition-colors">
                <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
             </button>
             <h1 className="font-bold text-stone-800">Host Registration</h1>
        </div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Step {step} of 5</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {step === 1 && (
            <div className="space-y-6 animate-fade-in">
                <div className="mb-2">
                    <h2 className="text-xl font-bold text-stone-800">Identity Information</h2>
                    <p className="text-sm text-stone-500">Let's get to know you better.</p>
                </div>

                <div className="space-y-4">
                    <Input label="Email Address *" type="email" placeholder="host@example.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                    <Input label="Nickname *" placeholder="e.g. Kuya Jo" value={formData.nickname} onChange={e => handleChange('nickname', e.target.value)} />
                    <Input label="First Name *" placeholder="Juan" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                    <Input label="Family Name *" placeholder="Dela Cruz" value={formData.familyName} onChange={e => handleChange('familyName', e.target.value)} />
                    <Input label="Date of Birth *" type="date" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} />
                    
                    <div>
                        <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Gender</label>
                        <div className="flex space-x-4">
                            {['Male', 'Female', 'Prefer not to say'].map(g => (
                                <label key={g} className="flex items-center">
                                    <input 
                                        type="radio" 
                                        name="gender" 
                                        className="mr-2"
                                        checked={formData.gender === g}
                                        onChange={() => handleChange('gender', g)}
                                    /> 
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    <Input label="Mailing Address *" placeholder="Complete address" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
                </div>
            </div>
        )}

        {step === 2 && (
             <div className="space-y-6 animate-fade-in">
                <div className="mb-2">
                    <h2 className="text-xl font-bold text-stone-800">Professional Info</h2>
                    <p className="text-sm text-stone-500">Are you a licensed guide?</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3">Are you a licensed tour guide? *</label>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 border rounded-xl bg-white">
                                <input type="radio" name="license" className="mr-3 h-5 w-5 text-emerald-600" checked={formData.isLicensed === 'Yes'} onChange={() => handleChange('isLicensed', 'Yes')} /> Yes
                            </label>
                            <label className="flex items-center p-3 border rounded-xl bg-white">
                                <input type="radio" name="license" className="mr-3 h-5 w-5 text-emerald-600" checked={formData.isLicensed === 'No'} onChange={() => handleChange('isLicensed', 'No')} /> No
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Upload Certificate / ID (Optional)</label>
                        <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center bg-stone-50">
                            <Icon className="w-8 h-8 mx-auto text-stone-400 mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Icon>
                            <span className="text-sm text-stone-500">Tap to upload file</span>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3">If no, are you interested to get a license?</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center"><input type="radio" name="interest" className="mr-2" checked={formData.interestedInLicense === 'Yes'} onChange={() => handleChange('interestedInLicense', 'Yes')} /> Yes</label>
                            <label className="flex items-center"><input type="radio" name="interest" className="mr-2" checked={formData.interestedInLicense === 'No'} onChange={() => handleChange('interestedInLicense', 'No')} /> No</label>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {step === 3 && (
             <div className="space-y-6 animate-fade-in">
                <div className="mb-2">
                    <h2 className="text-xl font-bold text-stone-800">The Experience</h2>
                    <p className="text-sm text-stone-500">What type of hosting do you offer?</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-3">Hosting Type *</label>
                    <div className="space-y-3">
                        {[
                            'Rural Adventure (Hiking, Trekking, Rafting)',
                            'Rural Experience (Cultural Immersion, Farming)',
                            'Rural Stay (Homestay, Eco-lodge, Camping)',
                            'Rural Events (Festivals, Rituals)',
                            'Gastronomy (Cooking classes, Farm to table)',
                            'Unseen Spots (Photography, Hidden gems)',
                            'Rural Rides (Motorcycle, Boat rental)'
                        ].map((type, i) => (
                            <label key={i} className="flex items-start p-3 border border-stone-200 rounded-xl bg-white active:bg-stone-50">
                                <input 
                                    type="radio" 
                                    name="hostingType" 
                                    className="mt-1 mr-3 h-4 w-4 text-emerald-600" 
                                    checked={formData.hostingType === type}
                                    onChange={() => handleChange('hostingType', type)}
                                />
                                <span className="text-sm text-stone-700">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <Input label="Short Description of Offering" placeholder="e.g. Guided trek to Mt. Kitanglad" value={formData.description} onChange={e => handleChange('description', e.target.value)} />
                <Input label="Estimated Cost per Person (PHP)" type="number" placeholder="e.g. 1500" value={formData.cost} onChange={e => handleChange('cost', e.target.value)} />
             </div>
        )}

        {step === 4 && (
             <div className="space-y-6 animate-fade-in">
                <div className="mb-2">
                    <h2 className="text-xl font-bold text-stone-800">Contacts</h2>
                    <p className="text-sm text-stone-500">How can we reach you?</p>
                </div>

                <div className="space-y-4">
                    <Input label="Mobile Number *" type="tel" placeholder="0912 345 6789" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                    <Input label="Facebook / Social Link" placeholder="facebook.com/yourpage" value={formData.socialLink} onChange={e => handleChange('socialLink', e.target.value)} />
                    
                    <div className="bg-stone-100 p-4 rounded-xl text-xs text-stone-600">
                        <p className="font-bold mb-1">Privacy Note:</p>
                        Your contact details will be shared with the Gora team for verification purposes only. Once verified, you can choose what to display on your public profile.
                    </div>
                </div>
             </div>
        )}

        {step === 5 && (
             <div className="space-y-6 animate-fade-in">
                <div className="mb-2">
                    <h2 className="text-xl font-bold text-stone-800">Review</h2>
                    <p className="text-sm text-stone-500">Please confirm your details.</p>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-stone-500">Name</span> <span className="font-bold">{formData.firstName} {formData.familyName}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Email</span> <span className="font-bold">{formData.email}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Phone</span> <span className="font-bold">{formData.phone}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Type</span> <span className="font-bold text-emerald-600 text-right w-1/2">{formData.hostingType}</span></div>
                    <div className="flex justify-between"><span className="text-stone-500">Licensed?</span> <span className="font-bold">{formData.isLicensed}</span></div>
                </div>

                <div className="flex items-start p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <input type="checkbox" className="mt-1 mr-3 h-5 w-5 text-emerald-600" />
                    <p className="text-xs text-stone-700">I certify that the information provided is true and correct. I agree to the <span className="font-bold text-emerald-700">Host Terms & Conditions</span>.</p>
                </div>
             </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-white border-t border-stone-200 flex space-x-3">
        {step > 1 && (
            <button onClick={prevStep} className="flex-1 py-3 border border-stone-300 text-stone-600 font-bold rounded-xl">
                Back
            </button>
        )}
        {step < 5 ? (
            <button onClick={nextStep} className="flex-[2] py-3 bg-stone-900 text-white font-bold rounded-xl">
                Next
            </button>
        ) : (
            <button onClick={nextStep} className="flex-[2] py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">
                Submit Application
            </button>
        )}
      </div>
    </div>
  );
};

export default HostRegistrationScreen;
