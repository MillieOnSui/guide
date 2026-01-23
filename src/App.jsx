import React, { useState, useEffect } from 'react';
import { Search, Calendar, Briefcase, Users, Mountain, Compass, Plus, Menu, X, User, LogOut, Trash2 } from 'lucide-react';

// LocalStorage wrapper (replaces window.storage)
const storage = {
  get: (key) => {
    const value = localStorage.getItem(key);
    return value ? { value } : null;
  },
  set: (key, value) => {
    localStorage.setItem(key, value);
  },
  delete: (key) => {
    localStorage.removeItem(key);
  }
};

export default function LinkXApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [listings, setListings] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [isoPosts, setIsoPosts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);

  const [showListingModal, setShowListingModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showIsoModal, setShowIsoModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const [listingForm, setListingForm] = useState({
    type: 'hunting',
    title: '',
    provider: '',
    location: '',
    price: '',
    duration: '',
    description: ''
  });

  const [swapForm, setSwapForm] = useState({ offering: '', seeking: '' });
  const [isoForm, setIsoForm] = useState({ description: '' });
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    description: ''
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const usersData = storage.get('users');
      if (usersData) setUsers(JSON.parse(usersData.value));

      const currentUserId = storage.get('currentUserId');
      if (currentUserId) {
        const userData = storage.get(`user:${currentUserId.value}`);
        if (userData) {
          const user = JSON.parse(userData.value);
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      }

      const listingsData = storage.get('listings');
      if (listingsData) setListings(JSON.parse(listingsData.value));

      const swapsData = storage.get('swaps');
      if (swapsData) setSwaps(JSON.parse(swapsData.value));

      const isoData = storage.get('isoPosts');
      if (isoData) setIsoPosts(JSON.parse(isoData.value));

      const jobsData = storage.get('jobs');
      if (jobsData) setJobs(JSON.parse(jobsData.value));
    } catch (error) {
      console.log('No existing data, starting fresh');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newUser = {
      id: Date.now().toString(),
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      userType: formData.get('userType'),
      bio: '',
      createdAt: new Date().toISOString()
    };

    storage.set(`user:${newUser.id}`, JSON.stringify(newUser));
    storage.set('currentUserId', newUser.id);
    
    const newUsers = [...users, { id: newUser.id, name: newUser.name, email: newUser.email }];
    storage.set('users', JSON.stringify(newUsers));
    setUsers(newUsers);

    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const usersList = storage.get('users');
    if (usersList) {
      const usersArray = JSON.parse(usersList.value);
      const foundUser = usersArray.find(u => u.email === email);
      
      if (foundUser) {
        const userData = storage.get(`user:${foundUser.id}`);
        if (userData) {
          const user = JSON.parse(userData.value);
          if (user.password === password) {
            setCurrentUser(user);
            setIsLoggedIn(true);
            storage.set('currentUserId', user.id);
            setCurrentPage('home');
            return;
          }
        }
      }
    }
    alert('Invalid email or password');
  };

  const handleLogout = async () => {
    storage.delete('currentUserId');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    const newListing = {
      id: Date.now().toString(),
      ...listingForm,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString()
    };

    const updated = [...listings, newListing];
    storage.set('listings', JSON.stringify(updated));
    setListings(updated);
    setShowListingModal(false);
    setListingForm({ type: 'hunting', title: '', provider: '', location: '', price: '', duration: '', description: '' });
  };

  const handleCreateSwap = async (e) => {
    e.preventDefault();
    const newSwap = {
      id: Date.now().toString(),
      ...swapForm,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString()
    };

    const updated = [...swaps, newSwap];
    storage.set('swaps', JSON.stringify(updated));
    setSwaps(updated);
    setShowSwapModal(false);
    setSwapForm({ offering: '', seeking: '' });
  };

  const handleCreateIso = async (e) => {
    e.preventDefault();
    const newIso = {
      id: Date.now().toString(),
      ...isoForm,
      userId: currentUser.id,
      userName: currentUser.name,
      responses: 0,
      createdAt: new Date().toISOString()
    };

    const updated = [...isoPosts, newIso];
    storage.set('isoPosts', JSON.stringify(updated));
    setIsoPosts(updated);
    setShowIsoModal(false);
    setIsoForm({ description: '' });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const newJob = {
      id: Date.now().toString(),
      ...jobForm,
      userId: currentUser.id,
      postedBy: currentUser.name,
      createdAt: new Date().toISOString()
    };

    const updated = [...jobs, newJob];
    storage.set('jobs', JSON.stringify(updated));
    setJobs(updated);
    setShowJobModal(false);
    setJobForm({ title: '', company: '', location: '', type: 'full-time', description: '' });
  };

  const handleDeleteListing = async (id) => {
    const updated = listings.filter(l => l.id !== id);
    storage.set('listings', JSON.stringify(updated));
    setListings(updated);
  };

  const handleDeleteSwap = async (id) => {
    const updated = swaps.filter(s => s.id !== id);
    storage.set('swaps', JSON.stringify(updated));
    setSwaps(updated);
  };

  const handleDeleteIso = async (id) => {
    const updated = isoPosts.filter(i => i.id !== id);
    storage.set('isoPosts', JSON.stringify(updated));
    setIsoPosts(updated);
  };

  const handleDeleteJob = async (id) => {
    const updated = jobs.filter(j => j.id !== id);
    storage.set('jobs', JSON.stringify(updated));
    setJobs(updated);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Compass className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading LinkX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-green-800 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Compass className="w-8 h-8" />
              <span className="text-2xl font-bold">LinkX</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => setCurrentPage('home')} className="hover:text-green-200">Home</button>
              <button onClick={() => setCurrentPage('listings')} className="hover:text-green-200">Listings</button>
              <button onClick={() => setCurrentPage('swaps')} className="hover:text-green-200">Adventure Swaps</button>
              <button onClick={() => setCurrentPage('iso')} className="hover:text-green-200">In Search Of</button>
              <button onClick={() => setCurrentPage('events')} className="hover:text-green-200">Events</button>
              <button onClick={() => setCurrentPage('jobs')} className="hover:text-green-200">Jobs</button>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <button onClick={() => setCurrentPage('profile')} className="flex items-center space-x-2 hover:text-green-200">
                    <User className="w-5 h-5" />
                    <span>{currentUser?.name}</span>
                  </button>
                  <button onClick={handleLogout} className="hover:text-green-200">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button onClick={() => setCurrentPage('login')} className="px-4 py-2 border border-white rounded hover:bg-white hover:text-green-800">
                    Login
                  </button>
                  <button onClick={() => setCurrentPage('signup')} className="px-4 py-2 bg-white text-green-800 rounded hover:bg-green-100">
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden">
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {showMobileMenu && (
            <div className="md:hidden pb-4 space-y-2">
              <button onClick={() => { setCurrentPage('home'); setShowMobileMenu(false); }} className="block w-full text-left py-2">Home</button>
              <button onClick={() => { setCurrentPage('listings'); setShowMobileMenu(false); }} className="block w-full text-left py-2">Listings</button>
              <button onClick={() => { setCurrentPage('swaps'); setShowMobileMenu(false); }} className="block w-full text-left py-2">Swaps</button>
              <button onClick={() => { setCurrentPage('iso'); setShowMobileMenu(false); }} className="block w-full text-left py-2">In Search Of</button>
              <button onClick={() => { setCurrentPage('events'); setShowMobileMenu(false); }} className="block w-full text-left py-2">Events</button>
              <button onClick={() => { setCurrentPage('jobs'); setShowMobileMenu(false); }} className="block w-full text-left py-2">Jobs</button>
              {isLoggedIn && (
                <>
                  <button onClick={() => { setCurrentPage('profile'); setShowMobileMenu(false); }} className="block w-full text-left py-2">Profile</button>
                  <button onClick={handleLogout} className="block w-full text-left py-2">Logout</button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Home Page */}
      {currentPage === 'home' && (
        <div>
          <div className="bg-gradient-to-r from-green-700 to-blue-600 text-white py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-4">Connect. Explore. Adventure.</h1>
              <p className="text-xl mb-8">The premier platform for guides, outfitters, and outdoor enthusiasts</p>
              {!isLoggedIn && (
                <button onClick={() => setCurrentPage('signup')} className="px-8 py-3 bg-white text-green-800 rounded-lg font-semibold hover:bg-green-100">
                  Get Started Today
                </button>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 border rounded-lg hover:shadow-lg">
                <Mountain className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Premium Listings</h3>
                <p className="text-gray-600">Browse hunting, fishing, and recreation opportunities from verified guides</p>
              </div>
              <div className="text-center p-6 border rounded-lg hover:shadow-lg">
                <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Adventure Swaps</h3>
                <p className="text-gray-600">Trade experiences with fellow outdoor enthusiasts</p>
              </div>
              <div className="text-center p-6 border rounded-lg hover:shadow-lg">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Career Opportunities</h3>
                <p className="text-gray-600">Find your dream job in the outdoor industry</p>
              </div>
            </div>
          </div>

          {listings.length > 0 && (
            <div className="bg-gray-100 py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Recent Opportunities</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {listings.slice(-3).reverse().map(listing => (
                    <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl">
                      <div className="text-sm text-green-600 font-semibold mb-2">{listing.type.toUpperCase()}</div>
                      <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
                      <p className="text-gray-600 mb-2">{listing.provider}</p>
                      <p className="text-sm text-gray-500 mb-4">{listing.location} • {listing.duration}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-green-700">{listing.price}</span>
                      </div>
                      <button onClick={() => setCurrentPage('listings')} className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Listings Page */}
      {currentPage === 'listings' && (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Browse Opportunities</h1>
            {isLoggedIn && (
              <button onClick={() => setShowListingModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Listing</span>
              </button>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16">
              <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No listings yet. Be the first to create one!</p>
              {isLoggedIn && (
                <button onClick={() => setShowListingModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Create First Listing
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-green-600 font-semibold">{listing.type.toUpperCase()}</div>
                    {currentUser?.id === listing.userId && (
                      <button onClick={() => handleDeleteListing(listing.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{listing.title}</h3>
                  <p className="text-gray-600 mb-2">{listing.provider}</p>
                  <p className="text-sm text-gray-500 mb-2">{listing.location} • {listing.duration}</p>
                  {listing.description && <p className="text-sm text-gray-700 mb-4">{listing.description}</p>}
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-green-700">{listing.price}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Posted by {listing.userName}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Adventure Swaps Page */}
      {currentPage === 'swaps' && (
        <div className="max-w-5xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Adventure Swaps</h1>
            {isLoggedIn && (
              <button onClick={() => setShowSwapModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Post Swap</span>
              </button>
            )}
          </div>

          {swaps.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No swaps available yet.</p>
              {isLoggedIn && (
                <button onClick={() => setShowSwapModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Create First Swap
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {swaps.map(swap => (
                <div key={swap.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold">{swap.userName}</h3>
                    {currentUser?.id === swap.userId && (
                      <button onClick={() => handleDeleteSwap(swap.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Offering:</p>
                      <p>{swap.offering}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Seeking:</p>
                      <p>{swap.seeking}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{getTimeAgo(swap.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* In Search Of Page */}
      {currentPage === 'iso' && (
        <div className="max-w-5xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">In Search Of</h1>
            {isLoggedIn && (
              <button onClick={() => setShowIsoModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create Post</span>
              </button>
            )}
          </div>

          {isoPosts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No ISO posts yet.</p>
              {isLoggedIn && (
                <button onClick={() => setShowIsoModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {isoPosts.map(iso => (
                <div key={iso.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{iso.userName}</h3>
                      <p className="text-sm text-gray-500">{getTimeAgo(iso.createdAt)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {iso.responses} responses
                      </span>
                      {currentUser?.id === iso.userId && (
                        <button onClick={() => handleDeleteIso(iso.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mb-4">{iso.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Events Page */}
      {currentPage === 'events' && (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">News & Featured Events</h1>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-6 h-6" />
                <span className="font-semibold">March 15-17, 2025</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Rocky Mountain Hunting Expo</h3>
              <p className="text-green-100 mb-4">Denver, CO</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Community Updates</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-500 mb-2">Welcome to LinkX!</p>
              <h3 className="text-xl font-bold mb-2">Start Connecting with Outdoor Professionals</h3>
              <p className="text-gray-700">Create your profile and start posting listings, swaps, and opportunities.</p>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Page */}
      {currentPage === 'jobs' && (
        <div className="max-w-5xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Outdoor Jobs</h1>
            {isLoggedIn && (
              <button onClick={() => setShowJobModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Post Job</span>
              </button>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No job postings yet.</p>
              {isLoggedIn && (
                <button onClick={() => setShowJobModal(true)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Post First Job
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <p className="text-gray-700 font-semibold">{job.company}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {job.type}
                      </span>
                      {currentUser?.id === job.userId && (
                        <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{job.location}</p>
                  {job.description && <p className="text-gray-700 mb-4">{job.description}</p>}
                  <div className="text-xs text-gray-500">Posted by {job.postedBy} • {getTimeAgo(job.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Login Page */}
      {currentPage === 'login' && (
        <div className="max-w-md mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input name="email" type="email" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input name="password" type="password" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                Login
              </button>
            </form>
            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => setCurrentPage('signup')} className="text-green-600 font-semibold hover:underline">Sign up</button>
            </p>
          </div>
        </div>
      )}

      {/* Signup Page */}
      {currentPage === 'signup' && (
        <div className="max-w-md mx-auto py-16 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Join LinkX</h2>
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input name="name" type="text" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input name="email" type="email" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input name="password" type="password" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Account Type</label>
                <select name="userType" className="w-full px-4 py-2 border rounded-lg">
                  <option value="enthusiast">Outdoor Enthusiast</option>
                  <option value="guide">Guide</option>
                  <option value="outfitter">Outfitter</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                Create Account
              </button>
            </form>
            <p className="text-center mt-6 text-gray-600">
              Already have an account?{' '}
              <button onClick={() => setCurrentPage('login')} className="text-green-600 font-semibold hover:underline">Login</button>
            </p>
          </div>
        </div>
      )}

      {/* Profile Page */}
      {currentPage === 'profile' && isLoggedIn && (
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {currentUser?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{currentUser?.name}</h2>
                  <p className="text-gray-600 capitalize">{currentUser?.userType}</p>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Activity</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{listings.filter(l => l.userId === currentUser.id).length}</div>
                    <div className="text-sm text-gray-600">Listings</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{swaps.filter(s => s.userId === currentUser.id).length}</div>
                    <div className="text-sm text-gray-600">Swaps</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{isoPosts.filter(i => i.userId === currentUser.id).length}</div>
                    <div className="text-sm text-gray-600">ISO Posts</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{jobs.filter(j => j.userId === currentUser.id).length}</div>
                    <div className="text-sm text-gray-600">Jobs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Listing</h2>
              <button onClick={() => setShowListingModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Type</label>
                <select 
                  value={listingForm.type}
                  onChange={(e) => setListingForm({...listingForm, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="hunting">Hunting</option>
                  <option value="fishing">Fishing</option>
                  <option value="recreation">Recreation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input 
                  type="text" 
                  value={listingForm.title}
                  onChange={(e) => setListingForm({...listingForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Provider/Company</label>
                <input 
                  type="text" 
                  value={listingForm.provider}
                  onChange={(e) => setListingForm({...listingForm, provider: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input 
                  type="text" 
                  value={listingForm.location}
                  onChange={(e) => setListingForm({...listingForm, location: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Price</label>
                <input 
                  type="text" 
                  value={listingForm.price}
                  onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
                  placeholder="e.g., $3,500 or $450/day"
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Duration</label>
                <input 
                  type="text" 
                  value={listingForm.duration}
                  onChange={(e) => setListingForm({...listingForm, duration: e.target.value})}
                  placeholder="e.g., 5 days or Full day"
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description (optional)</label>
                <textarea 
                  value={listingForm.description}
                  onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  rows="4"
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                  Create Listing
                </button>
                <button type="button" onClick={() => setShowListingModal(false)} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Post Adventure Swap</h2>
              <button onClick={() => setShowSwapModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateSwap} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">What are you offering?</label>
                <textarea 
                  value={swapForm.offering}
                  onChange={(e) => setSwapForm({...swapForm, offering: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">What are you seeking?</label>
                <textarea 
                  value={swapForm.seeking}
                  onChange={(e) => setSwapForm({...swapForm, seeking: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  rows="3"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                  Post Swap
                </button>
                <button type="button" onClick={() => setShowSwapModal(false)} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create ISO Modal */}
      {showIsoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create ISO Post</h2>
              <button onClick={() => setShowIsoModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateIso} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">What are you looking for?</label>
                <textarea 
                  value={isoForm.description}
                  onChange={(e) => setIsoForm({...isoForm, description: e.target.value})}
                  placeholder="e.g., Looking for archery elk hunt guide in New Mexico, Sept 2025"
                  className="w-full px-4 py-2 border rounded-lg" 
                  rows="4"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                  Create Post
                </button>
                <button type="button" onClick={() => setShowIsoModal(false)} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Post Job</h2>
              <button onClick={() => setShowJobModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Job Title</label>
                <input 
                  type="text" 
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Company</label>
                <input 
                  type="text" 
                  value={jobForm.company}
                  onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input 
                  type="text" 
                  value={jobForm.location}
                  onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Job Type</label>
                <select 
                  value={jobForm.type}
                  onChange={(e) => setJobForm({...jobForm, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea 
                  value={jobForm.description}
                  onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg" 
                  rows="4"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
                  Post Job
                </button>
                <button type="button" onClick={() => setShowJobModal(false)} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}