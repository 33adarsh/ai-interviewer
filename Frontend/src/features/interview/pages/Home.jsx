import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'
import "../style/home.scss"

const Home = () => {
    const navigate = useNavigate()
    const resumeInputRef = useRef(null)

    const [jobDescription, setJobDescription] = useState('')
    const [selfDescription, setSelfDescription] = useState('')
    const [reports, setReports] = useState([])
    const [selectedFileName, setSelectedFileName] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    const { user, handleLogout, handleLogin, handleRegister, loading } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [authEmail, setAuthEmail] = useState('')
    const [authPassword, setAuthPassword] = useState('')
    const [authUsername, setAuthUsername] = useState('')
    const [authError, setAuthError] = useState('')

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/interview/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const data = await response.json()
                if (response.ok) {
                    setReports(data.interviewReports || [])
                }
            } catch (err) {
                console.error("Error fetching reports:", err)
            }
        }
        fetchReports()
    }, [])

    const handleGenerateReport = async () => {
        if (!user) {
            setShowAuthModal('prompt')
            return
        }

        if (!jobDescription.trim()) {
            alert("Job description is required")
            return
        }

        const resumeFile = resumeInputRef.current?.files?.[0]

        if (!resumeFile && !selfDescription.trim()) {
            alert("Either a resume or self description is required")
            return
        }

        const formData = new FormData()
        formData.append('jobDescription', jobDescription)
        formData.append('selfDescription', selfDescription)
        formData.append('title', jobDescription.slice(0, 50)) // ya koi aur title logic
        if (resumeFile) {
            formData.append('resume', resumeFile)
        }

        try {
            setIsGenerating(true)
            const token = localStorage.getItem('token') // ya jaha bhi token store hota hai
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/interview/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to generate report")
            }

            navigate(`/interview/${data.interviewReport._id}`)
        } catch (error) {
            console.error("Error generating report:", error)
            alert(error.message)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className='home-page'>

            {/* Top Navigation */}
            <nav className='top-nav'>
                <div className='nav-logo'>Interview<span className='highlight'>AI</span></div>
                <div className='nav-actions'>
                    {user ? (
                        <>
                            <span className='nav-greeting'>Hi, {user.username || 'User'}</span>
                            <button onClick={handleLogout} className='btn-outline'>Logout</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setShowAuthModal('login')} className='btn-ghost'>Login</button>
                            <button onClick={() => setShowAuthModal('register')} className='btn-primary'>Sign Up</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className={`dropzone ${selectedFileName ? 'dropzone--active' : ''}`} htmlFor='resume'>
                                {selectedFileName ? (
                                    <>
                                        <span className='dropzone__icon dropzone__icon--success'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        </span>
                                        <p className='dropzone__title'>{selectedFileName}</p>
                                        <p className='dropzone__subtitle'>Click to change file</p>
                                    </>
                                ) : (
                                    <>
                                        <span className='dropzone__icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                        </span>
                                        <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                        <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                    </>
                                )}
                                <input 
                                    ref={resumeInputRef} 
                                    onChange={(e) => setSelectedFileName(e.target.files[0]?.name || '')} 
                                    hidden type='file' id='resume' name='resume' accept='.pdf,.docx' 
                                />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleGenerateReport}
                        disabled={isGenerating}
                        className={`generate-btn ${isGenerating ? 'is-loading' : ''}`}>
                        <div className="btn-content">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            <span>Generate My Interview Strategy</span>
                        </div>
                        <div className="btn-loading-content">
                            <span className="spinner"></span>
                            <span>Generating Interview Strategy...</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>

            {/* Auth Redirector Modal */}
            {showAuthModal && (
                <div className='auth-modal-overlay'>
                    <div className='auth-modal'>
                        <button onClick={() => setShowAuthModal(false)} className='auth-modal__close'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        
                        {showAuthModal === 'prompt' && (
                            <>
                                <div className='auth-modal__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                                </div>
                                <h2>Authentication Required</h2>
                                <p>You need to be logged in to use the AI Strategy Generator and view your personalized insights.</p>
                                <div className='auth-modal__actions'>
                                    <button onClick={() => { setAuthError(''); setShowAuthModal('login') }} className='btn-primary'>Log In</button>
                                    <button onClick={() => { setAuthError(''); setShowAuthModal('register') }} className='btn-outline'>Create Account</button>
                                </div>
                            </>
                        )}

                        {showAuthModal === 'login' && (
                            <div className='auth-modal__form'>
                                <h2>Log In</h2>
                                {authError && <div className='auth-error'>{authError}</div>}
                                <div className='input-group'>
                                    <input type='email' placeholder='Email' value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                                </div>
                                <div className='input-group'>
                                    <input type='password' placeholder='Password' value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
                                </div>
                                <button className='btn-primary' onClick={async () => {
                                    setAuthError('')
                                    const res = await handleLogin({ email: authEmail, password: authPassword })
                                    if(res?.success) { 
                                        setShowAuthModal(false);
                                    } else {
                                        setAuthError(res?.error || 'Login failed')
                                    }
                                }} disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</button>
                                <p className='form-switch'>Don't have an account? <span onClick={() => { setAuthError(''); setShowAuthModal('register') }}>Register</span></p>
                            </div>
                        )}

                        {showAuthModal === 'register' && (
                            <div className='auth-modal__form'>
                                <h2>Create Account</h2>
                                {authError && <div className='auth-error'>{authError}</div>}
                                <div className='input-group'>
                                    <input type='text' placeholder='Username' value={authUsername} onChange={e => setAuthUsername(e.target.value)} />
                                </div>
                                <div className='input-group'>
                                    <input type='email' placeholder='Email' value={authEmail} onChange={e => setAuthEmail(e.target.value)} />
                                </div>
                                <div className='input-group'>
                                    <input type='password' placeholder='Password' value={authPassword} onChange={e => setAuthPassword(e.target.value)} />
                                </div>
                                <button className='btn-primary' onClick={async () => {
                                    setAuthError('')
                                    const res = await handleRegister({ username: authUsername, email: authEmail, password: authPassword })
                                    if(res?.success) { 
                                        setShowAuthModal(false);
                                    } else {
                                        setAuthError(res?.error || 'Registration failed')
                                    }
                                }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                                <p className='form-switch'>Already have an account? <span onClick={() => { setAuthError(''); setShowAuthModal('login') }}>Log In</span></p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home