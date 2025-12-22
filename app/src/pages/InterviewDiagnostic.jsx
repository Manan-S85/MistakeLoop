import { useState } from "react";

export default function InterviewDiagnostic({ user, onLogout }) {
  const [reflection, setReflection] = useState("");
  const [email, setEmail] = useState(user.email);
  const [pastMistakes, setPastMistakes] = useState([]);
  const [newMistake, setNewMistake] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddMistake = () => {
    if (newMistake.trim()) {
      setPastMistakes([...pastMistakes, newMistake.trim()]);
      setNewMistake("");
    }
  };

  const handleRemoveMistake = (index) => {
    setPastMistakes(pastMistakes.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!reflection.trim()) {
      alert("Please enter your interview reflection");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reflection: reflection.trim(),
          email: email.trim() || undefined,
          pastMistakes: pastMistakes.length > 0 ? pastMistakes : undefined
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setAnalysis(data);
    } catch (error) {
      console.error("Analysis error:", error);
      alert("Analysis failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setReflection("");
    setEmail("");
    setPastMistakes([]);
    setNewMistake("");
    setAnalysis(null);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      margin: 0,
      padding: 0,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '800px',
        height: '800px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }}></div>

      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-15%',
        width: '600px',
        height: '600px',
        background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 83, 0.1) 100%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 25s ease-in-out infinite reverse',
        zIndex: 1
      }}></div>

      {/* Flowing curve elements */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none'
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curve1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(102, 126, 234, 0.3)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(118, 75, 162, 0.1)', stopOpacity: 1}} />
          </linearGradient>
          <linearGradient id="curve2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgba(255, 107, 107, 0.2)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgba(255, 142, 83, 0.1)', stopOpacity: 1}} />
          </linearGradient>
        </defs>
        <path
          d="M1200,0 C1400,200 1600,400 1920,300 L1920,0 Z"
          fill="url(#curve1)"
          style={{ animation: 'morphing 15s ease-in-out infinite' }}
        />
        <path
          d="M800,1080 C1000,800 1200,600 1920,700 L1920,1080 Z"
          fill="url(#curve2)"
          style={{ animation: 'morphing 20s ease-in-out infinite reverse' }}
        />
      </svg>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '24px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '0 0 20px 20px',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              color: '#ffffff',
              margin: 0,
              marginBottom: '4px',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome back, {user?.name || 'User'}
            </h1>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '16px',
              margin: 0
            }}>
              Ready to analyze your interview performance?
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '12px 28px',
              borderRadius: '50px',
              border: 'none',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
            }}
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main style={{ paddingTop: '40px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 400px', 
            gap: '40px',
            '@media (max-width: 1200px)': {
              gridTemplateColumns: '1fr',
              gap: '24px'
            }
          }}>
            {/* Left Column - Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Interview Reflection Card */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px', 
                padding: '32px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: 0
                }}>
                  Interview Reflection
                </h2>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Describe what happened in your interview... What went wrong? What could you have done better? Be specific about mistakes, missed opportunities, or areas where you struggled."
                  style={{
                    width: '100%',
                    height: '160px',
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    marginTop: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                  }}
                />
              </div>

              {/* Email Card */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px', 
                padding: '32px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: 0
                }}>
                  Email (Auto-filled)
                </h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    marginTop: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                  }}
                />
                <p style={{ color: '#666666', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
                  This helps track your progress over time
                </p>
              </div>

              {/* Past Mistakes Card */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px', 
                padding: '32px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: 0
                }}>
                  Known Past Mistakes
                </h2>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <input
                    type="text"
                    value={newMistake}
                    onChange={(e) => setNewMistake(e.target.value)}
                    placeholder="e.g., Poor communication, Lack of preparation"
                    style={{
                      flex: 1,
                      padding: '16px 20px',
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      backdropFilter: 'blur(10px)'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddMistake()}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                    }}
                  />
                  <button
                    onClick={handleAddMistake}
                    style={{
                      padding: '16px 28px',
                      background: 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 14px 0 rgba(65, 105, 225, 0.39)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px 0 rgba(65, 105, 225, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = '0 4px 14px 0 rgba(65, 105, 225, 0.39)';
                    }}
                  >
                    Add
                  </button>
                </div>
                
                {pastMistakes.length > 0 && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pastMistakes.map((mistake, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        background: 'rgba(0, 0, 0, 0.2)', 
                        padding: '16px 20px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <span style={{ color: '#ffffff', fontSize: '14px' }}>{mistake}</span>
                        <button
                          onClick={() => handleRemoveMistake(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#666666',
                            cursor: 'pointer',
                            fontSize: '16px',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#ffffff'}
                          onMouseOut={(e) => e.target.style.color = '#666666'}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !reflection.trim()}
                  style={{
                    flex: 1,
                    padding: '20px 32px',
                    background: loading || !reflection.trim() ? 'rgba(100, 100, 100, 0.3)' : 'linear-gradient(135deg, #4169E1 0%, #87CEEB 100%)',
                    color: loading || !reflection.trim() ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: loading || !reflection.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '18px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: loading || !reflection.trim() ? 'none' : '0 8px 32px 0 rgba(65, 105, 225, 0.4)'
                  }}
                  onMouseOver={(e) => {
                    if (!loading && reflection.trim()) {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 12px 48px 0 rgba(65, 105, 225, 0.6)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading && reflection.trim()) {
                      e.target.style.transform = 'translateY(0px)';
                      e.target.style.boxShadow = '0 8px 32px 0 rgba(65, 105, 225, 0.4)';
                    }
                  }}
                >
                  {loading ? "Analyzing..." : "Analyze Interview"}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '20px 32px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontFamily: 'inherit',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0px)';
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right Column - Results & Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {analysis ? (
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px', 
                  padding: '32px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                  <h2 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#ffffff',
                    marginBottom: '20px',
                    margin: 0
                  }}>
                    Analysis Results
                  </h2>
                  
                  {analysis.category && (
                    <div style={{ 
                      marginBottom: '20px', 
                      padding: '16px', 
                      background: '#0a0a0a', 
                      borderRadius: '8px',
                      border: '1px solid #1f1f1f'
                    }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff',
                        fontSize: '14px',
                        margin: '0 0 8px 0'
                      }}>Issue Category:</h3>
                      <p style={{ color: '#cccccc', margin: 0, fontSize: '14px' }}>{analysis.category}</p>
                    </div>
                  )}

                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff', 
                        marginBottom: '12px',
                        fontSize: '14px',
                        margin: '0 0 12px 0'
                      }}>Improvement Suggestions:</h3>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} style={{ 
                            color: '#cccccc', 
                            paddingLeft: '16px', 
                            borderLeft: '2px solid #333333',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.actionItems && analysis.actionItems.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff', 
                        marginBottom: '12px',
                        fontSize: '14px',
                        margin: '0 0 12px 0'
                      }}>Action Items:</h3>
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {analysis.actionItems.map((item, index) => (
                          <li key={index} style={{ 
                            color: '#cccccc', 
                            paddingLeft: '16px', 
                            borderLeft: '2px solid #333333',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.confidence && (
                    <div style={{ 
                      padding: '16px', 
                      background: '#0a0a0a', 
                      borderRadius: '8px',
                      border: '1px solid #1f1f1f'
                    }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        color: '#ffffff',
                        fontSize: '14px',
                        margin: '0 0 12px 0'
                      }}>Confidence Level:</h3>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          flex: 1, 
                          background: '#333333', 
                          borderRadius: '4px', 
                          height: '8px',
                          marginRight: '12px'
                        }}>
                          <div style={{ 
                            background: '#ffffff', 
                            height: '8px', 
                            borderRadius: '4px',
                            width: `${analysis.confidence}%`,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                        <span style={{ fontSize: '14px', color: '#cccccc' }}>{analysis.confidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px', 
                  padding: '48px 32px',
                  textAlign: 'center',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                  <h2 style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#ffffff',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    Ready for Analysis
                  </h2>
                  <p style={{ 
                    color: '#666666',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    Enter your interview reflection and click "Analyze Interview" to get AI-powered feedback and improvement suggestions.
                  </p>
                </div>
              )}

              {/* Quick Tips */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)', 
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px', 
                padding: '32px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#ffffff',
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  Quick Tips
                </h2>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  color: '#cccccc',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <li>• Be specific about what went wrong</li>
                  <li>• Mention the type of interview (technical, behavioral, etc.)</li>
                  <li>• Include your preparation level</li>
                  <li>• Note any recurring patterns from past interviews</li>
                  <li>• Track your email to build a progress history</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          transition: all 0.2s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        }
        
        /* Firefox Scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #667eea rgba(0, 0, 0, 0.2);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        @keyframes morphing {
          0%, 100% { d: path("M1200,0 C1400,200 1600,400 1920,300 L1920,0 Z"); }
          50% { d: path("M1000,0 C1300,150 1500,350 1920,250 L1920,0 Z"); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}