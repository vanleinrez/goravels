import React, { useState } from 'react';
import Icon from '../components/Icon';

interface HostRegistrationProps {
  onComplete: () => void;
}

const HostRegistrationScreen: React.FC<HostRegistrationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [contactMethod, setContactMethod] = useState<'Call' | 'Email' | 'Text'>('Email');

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
            onClick={onComplete}
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
      <div className="bg-white px-6 py-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
        <h1 className="font-bold text-stone-800">Host Registration</h1>
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
                    <Input label="Email Address *" type="email" placeholder="host@example.com" />
                    <Input label="Nickname *" placeholder="e.g. Kuya Jo" />
                    <Input label="First Name *" placeholder="Juan" />
                    <Input label="Family Name *" placeholder="Dela Cruz" />
                    <Input label="Date of Birth *" type="date" />
                    
                    <div>
                        <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Gender</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center"><input type="radio" name="gender" className="mr-2" /> Male</label>
                            <label className="flex items-center"><input type="radio" name="gender" className="mr-2" /> Female</label>
                            <label className="flex items-center"><input type="radio" name="gender" className="mr-2" /> Prefer not to say</label>
                        </div>
                    </div>

                    <Input label="Mailing Address *" placeholder="Complete address (e.g. Utility Bill)" />
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
                            <label className="flex items-center p-3 border rounded-xl bg-white"><input type="radio" name="license" className="mr-3 h-5 w-5 text-emerald-600" /> Yes</label>
                            <label className="flex items-center p-3 border rounded-xl bg-white"><input type="radio" name="license" className="mr-3 h-5 w-5 text-emerald-600" /> No</label>
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
                            <label className="flex items-center"><input type="radio" name="interest" className="mr-2" /> Yes</label>
                            <label className="flex items-center"><input type="radio" name="interest" className="mr-2" /> No</label>
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
                                <input type="radio" name="hostingType" className="mt-1 mr-3 h-4 w-4 text-emerald-600" />
                                <span className="text-sm text-stone-700">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                     <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Photos/Videos (Min 10) *</label>
                     <div className="grid grid-cols-3 gap-2">
                         <div className="aspect-square bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-200 text-emerald-600">
                             <Icon className="w-6 h-6"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
                         </div>
                         {[1,2,3].map(i => (
                             <div key={i} className="aspect-square bg-stone-200 rounded-lg"></div>
                         ))}
                     </div>
                </div>
             </div>
        )}

        {step === 4 && (
             <div className="space-y-6 animate-fade-in">
                 <div className="mb-2">
                    <h2 className="text-xl font-bold text-stone-800">Details & Location</h2>
                    <p className="text-sm text-stone-500">Where and what is it?</p>
                </div>

                <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Google Map Location *</label>
                    <div className="h-40 bg-stone-200 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                        <img src="https://picsum.photos/seed/map/400/200" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                        <button className="relative bg-white px-4 py-2 rounded-lg shadow-md text-sm font-bold text-emerald-700 flex items-center">
                            <Icon className="w-4 h-4 mr-2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                            Set Pin Location
                        </button>
                    </div>
                </div>

                <div>
                     <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Description *</label>
                     <textarea rows={5} className="w-full p-4 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Tell us about your offer, amenities, nearby attractions..." />
                </div>

                <div>
                     <label className="block text-xs font-bold text-stone-600 uppercase mb-2">Languages Spoken</label>
                     <div className="flex flex-wrap gap-2">
                         {['English', 'Filipino', 'Cebuano', 'Ilocano'].map(lang => (
                             <label key={lang} className="inline-flex items-center px-3 py-1 rounded-full border bg-white">
                                 <input type="checkbox" className="mr-2" /> <span className="text-sm">{lang}</span>
                             </label>
                         ))}
                     </div>
                </div>
             </div>
        )}

        {step === 5 && (
             <div className="space-y-6 animate-fade-in">
                 <div className="mb-2">
                    <h2 className="text-xl font-bold text-stone-800">Finalize</h2>
                    <p className="text-sm text-stone-500">Almost there!</p>
                </div>

                <Input label="Cost of Hosting Offer (PHP) *" type="number" placeholder="1000" />
                
                <div className="bg-stone-100 p-4 rounded-xl space-y-4">
                     <h3 className="font-bold text-stone-700">Contact Information</h3>
                     <Input label="Phone Number *" placeholder="+63 900 000 0000" />
                     <Input label="Social Media Link" placeholder="facebook.com/..." />
                </div>

                <div className="flex items-start p-4 bg-emerald-50 rounded-xl">
                    <input type="checkbox" className="mt-1 mr-3 h-5 w-5 text-emerald-600" />
                    <p className="text-sm text-stone-700">
                        I read and agree to TaraGo's <span className="text-emerald-600 underline font-bold">Terms and Privacy Policy</span>. I certify that the information provided is true and correct.
                    </p>
                </div>
             </div>
        )}

      </div>

      {/* Footer Nav */}
      <div className="p-4 bg-white border-t border-stone-200 flex justify-between">
        {step > 1 ? (
             <button onClick={prevStep} className="px-6 py-3 text-stone-500 font-bold">Back</button>
        ) : (
            <div></div>
        )}
        
        {step < 5 ? (
            <button onClick={nextStep} className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md">Next</button>
        ) : (
            <button onClick={nextStep} className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold shadow-md">Submit Application</button>
        )}
      </div>
    </div>
  );
};

const Input: React.FC<{ label: string; placeholder?: string; type?: string }> = ({ label, placeholder, type = 'text' }) => (
    <div>
        <label className="block text-xs font-bold text-stone-600 uppercase mb-2">{label}</label>
        <input 
            type={type} 
            className="w-full p-3 rounded-xl border border-stone-200 bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
            placeholder={placeholder} 
        />
    </div>
);

export default HostRegistrationScreen;