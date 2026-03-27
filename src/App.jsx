import { useState, useEffect } from 'react'
import './App.css'

// ── Experiment Data ──────────────────────────────────────

const EXPERIMENTS = [
  {
    id: 'sf-giants',
    channel: 'Google Ads',
    channelIcon: 'G',
    channelColor: '#4285F4',
    query: 'san francisco giants jersey',
    stage: 'Intent',
    currentPage: '/pages/sf-giants-jersey.html',
    testType: 'Creative Angles',
    testBrief: 'This search query indicates high purchase intent — the user knows exactly what team and product they want. The current Fanatics landing page shows a generic product page. We hypothesise that personalising the page based on different creative angles (player-led, occasion-led, social proof, value) will increase conversion by matching the page to the user\'s underlying motivation.',
    whyTheseAngles: [
      'Player-Led — Most jersey buyers have a specific player in mind. Leading with Matt Chapman #26 (the team\'s star) and letting users switch players reduces friction.',
      'Occasion-Led — Tying the purchase to the next home series (Giants vs. Dodgers, Apr 8-10) creates urgency and emotional connection to a real event.',
      'Social Proof — "12,847 sold" and "97% recommend" converts undecided shoppers who need validation before buying.',
      'Value-Led — Price-sensitive shoppers searching for jerseys compare across sites. Showing "Starting at $84.99" and savings vs. stadium prices converts deal-seekers.',
    ],
    angles: [
      { id: 'player', short: 'Player-Led', color: '#1A52F0', page: '/pages/nb-player.html' },
      { id: 'occasion', short: 'Occasion-Led', color: '#22c55e', page: '/pages/nb-occasion.html' },
      { id: 'social', short: 'Social Proof', color: '#a855f7', page: '/pages/nb-social.html' },
      { id: 'value', short: 'Value-Led', color: '#ef4444', page: '/pages/nb-value.html' },
    ],
  },
  {
    id: 'nfl-jerseys',
    channel: 'Google Ads',
    channelIcon: 'G',
    channelColor: '#4285F4',
    query: 'official NFL jerseys online',
    stage: 'Interest',
    currentPage: '/pages/official_nfl_jersey.html',
    testType: 'Persona Testing',
    testBrief: 'This is a broad category search — the user hasn\'t picked a team or player yet. The current Fanatics page shows 5,944 results with no personalisation. We hypothesise that matching the landing page to the user\'s persona (die-hard fan, gift buyer, casual fan, deal hunter) will reduce bounce rate and increase conversion by showing a page that speaks to their specific needs.',
    whyTheseAngles: [
      'Die-Hard Fan — Knows their team (detected via location: Philadelphia). Wants premium tiers, team-specific content, player selection. The page becomes an Eagles team page, not a generic NFL listing.',
      'Gift Buyer — Buying for someone else. Needs safe picks, size guidance, easy returns, and gift-specific framing. The page becomes a gift guide with budget tiers and "can\'t go wrong" curation.',
      'Casual / New Fan — First-time buyer overwhelmed by 5,944 results. Needs education (Game vs Vapor tiers), simplified choices, and a guided experience.',
      'Deal Hunter — Price-sensitive, searching "official" to avoid fakes. Needs value framing, price-sorted products, bundle deals, and savings comparison vs. stadium prices.',
    ],
    angles: [
      { id: 'die-hard', short: 'Die-Hard Fan', color: '#1A52F0', page: '/pages/nfl-diehard.html' },
      { id: 'gift-buyer', short: 'Gift Buyer', color: '#22c55e', page: '/pages/nfl-gift.html' },
      { id: 'casual-fan', short: 'Casual / New Fan', color: '#f59e0b', page: '/pages/nfl-casual.html' },
      { id: 'deal-hunter', short: 'Deal Hunter', color: '#ef4444', page: '/pages/nfl-deals.html' },
    ],
  },
  {
    id: 'usa-hockey',
    channel: 'Meta Ads',
    channelIcon: 'f',
    channelColor: '#1877F2',
    query: 'USA Hockey Jersey — Restocked',
    stage: 'Retargeting',
    currentPage: '/pages/us-hockey.html',
    adImage: 'https://ik.imagekit.io/n9gkzdkufg/Fanatics/usajerseyad.jpg?updatedAt=1774590730054',
    adBody: 'The 2026 USA Olympic Hockey Jersey has just been restocked! Grab one before they\'re gone.',
    testType: 'Creative Angles',
    testBrief: 'This Meta ad targets users who previously viewed USA Hockey jerseys. The ad copy emphasises scarcity ("restocked", "before they\'re gone") but the landing page is a generic category listing. We hypothesise that matching the landing page to the ad\'s emotional trigger will increase conversion from click to purchase.',
    whyTheseAngles: [
      'Star Player — NHL fans buy player jerseys, not team jerseys. Leading with Matthews, Eichel, Tkachuk, and Hughes converts fans who follow specific athletes.',
      'Gold Medal — USA won gold at the 2026 Olympics. The emotional high of victory drives commemorative purchases — jerseys become memorabilia, not just apparel.',
      'Complete the Look — Someone clicking a jersey ad often buys more. Showing the full collection (hoodie, hat, tee, puck) increases AOV from $174 to $250+.',
      'Urgency/Scarcity — The ad says "restocked" and "before they\'re gone." Making the scarcity real on the page (stock levels, sold counts, live activity) converts impulse buyers.',
    ],
    angles: [
      { id: 'star-player', short: 'Star Player', color: '#1A52F0', page: '/pages/hockey-star-player.html' },
      { id: 'gold-medal', short: 'Gold Medal', color: '#f59e0b', page: '/pages/hockey-gold-medal.html' },
      { id: 'complete-look', short: 'Complete the Look', color: '#22c55e', page: '/pages/hockey-complete-look.html' },
      { id: 'urgency', short: 'Urgency/Scarcity', color: '#ef4444', page: '/pages/hockey-urgency.html' },
    ],
  },
]

// ── App ──────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState('list') // 'list' | 'detail'
  const [activeExperiment, setActiveExperiment] = useState(null)
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // 0 = current, 1+ = variants
  const [selectedVariants, setSelectedVariants] = useState([])
  const [adModalOpen, setAdModalOpen] = useState(false)

  const openExperiment = (exp) => {
    setActiveExperiment(exp)
    setView('detail')
    setGenerated(false)
    setGenerating(false)
    setActiveTab(0)
    setSelectedVariants(exp.angles.map((_, i) => i))
  }

  const goBack = () => {
    setView('list')
    setActiveExperiment(null)
    setGenerated(false)
    setGenerating(false)
  }

  const toggleVariant = (i) => {
    setSelectedVariants(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      setActiveTab(0)
    }, 2500)
  }

  const exp = activeExperiment
  const tabs = exp && generated
    ? [{ label: 'Current', color: '#666' }, ...exp.angles.filter((_, i) => selectedVariants.includes(i)).map(a => ({ label: a.short, color: a.color, page: a.page }))]
    : []

  return (
    <div className="nb-app">
      {/* Header */}
      <header className="nb-app-header">
        <div className="nb-app-header-left" onClick={goBack} style={{ cursor: view === 'detail' ? 'pointer' : 'default' }}>
          <div className="nb-app-logo">neon blue</div>
          <div className="nb-app-divider" />
          <img src="https://ik.imagekit.io/n9gkzdkufg/Fanatics/fanatics.svg" alt="Fanatics" className="nb-app-client-logo" />
        </div>
        {view === 'detail' && (
          <button className="nb-back-btn" onClick={goBack}>← Back to experiments</button>
        )}
      </header>

      {/* List View */}
      {view === 'list' && (
        <div className="nb-list-view">
          <div className="nb-list-header">
            <div>
              <div className="nb-list-title">Experiments</div>
              <div className="nb-list-sub">Landing page personalisation tests for Fanatics</div>
            </div>
          </div>
          <div className="nb-table">
            <div className="nb-table-head">
              <div className="nb-th" style={{ width: 100 }}>Channel</div>
              <div className="nb-th" style={{ flex: 1 }}>Ad / Query</div>
              <div className="nb-th" style={{ width: 120 }}>Test Type</div>
              <div className="nb-th" style={{ width: 100 }}>Stage</div>
              <div className="nb-th" style={{ width: 80, textAlign: 'center' }}>Variants</div>
              <div className="nb-th" style={{ width: 60 }} />
            </div>
            {EXPERIMENTS.map(exp => (
              <div key={exp.id} className="nb-table-row" onClick={() => openExperiment(exp)}>
                <div className="nb-td" style={{ width: 100 }}>
                  <div className="nb-channel-badge" style={{ background: `${exp.channelColor}15`, color: exp.channelColor, border: `1px solid ${exp.channelColor}30` }}>
                    <span className="nb-channel-icon">{exp.channelIcon}</span>
                    {exp.channel.split(' ')[0]}
                  </div>
                </div>
                <div className="nb-td" style={{ flex: 1 }}>
                  <div className="nb-query-text">{exp.channel === 'Meta Ads' ? exp.query : `"${exp.query}"`}</div>
                  {exp.adImage && <img src={exp.adImage} alt="" className="nb-ad-thumb" />}
                </div>
                <div className="nb-td" style={{ width: 120 }}>
                  <div className="nb-type-badge">{exp.testType}</div>
                </div>
                <div className="nb-td" style={{ width: 100 }}>
                  <div className="nb-stage-text">{exp.stage}</div>
                </div>
                <div className="nb-td" style={{ width: 80, textAlign: 'center' }}>
                  <div className="nb-variant-count">{exp.angles.length}</div>
                </div>
                <div className="nb-td" style={{ width: 60, textAlign: 'center' }}>
                  <span className="nb-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail View */}
      {view === 'detail' && exp && !generated && !generating && (
        <div className="nb-detail-view">
          <div className="nb-detail-header">
            <div className="nb-channel-badge" style={{ background: `${exp.channelColor}15`, color: exp.channelColor, border: `1px solid ${exp.channelColor}30` }}>
              <span className="nb-channel-icon">{exp.channelIcon}</span>
              {exp.channel}
            </div>
            <div className="nb-detail-query">{exp.channel === 'Meta Ads' ? exp.query : `"${exp.query}"`}</div>
            <div className="nb-detail-type">{exp.testType}</div>
          </div>

          {exp.adImage && (
            <div className="nb-ad-preview">
              <div className="nb-ad-preview-label">Ad Creative</div>
              <div className="nb-ad-preview-card" onClick={() => setAdModalOpen(true)} style={{ cursor: 'pointer' }}>
                <img src={exp.adImage} alt="" />
                <div className="nb-ad-preview-body">
                  <div>{exp.adBody}</div>
                  <div className="nb-ad-preview-expand">Click to view full ad ↗</div>
                </div>
              </div>
            </div>
          )}

          <div className="nb-brief">
            <div className="nb-brief-label">Test Brief</div>
            <div className="nb-brief-card">
              <div className="nb-brief-meta">
                <div className="nb-brief-meta-item"><span className="nb-brief-meta-key">Channel</span><span className="nb-brief-meta-val">{exp.channel}</span></div>
                <div className="nb-brief-meta-divider" />
                <div className="nb-brief-meta-item"><span className="nb-brief-meta-key">{exp.channel === 'Meta Ads' ? 'Ad' : 'Query'}</span><span className="nb-brief-meta-val">{exp.query}</span></div>
                <div className="nb-brief-meta-divider" />
                <div className="nb-brief-meta-item"><span className="nb-brief-meta-key">Test Type</span><span className="nb-brief-meta-val">{exp.testType}</span></div>
                <div className="nb-brief-meta-divider" />
                <div className="nb-brief-meta-item"><span className="nb-brief-meta-key">Stage</span><span className="nb-brief-meta-val">{exp.stage}</span></div>
              </div>
              <div className="nb-brief-body">
                <div className="nb-brief-icon">🧪</div>
                <div className="nb-brief-title">Hypothesis</div>
                <div className="nb-brief-text">{exp.testBrief}</div>
              </div>
            </div>
          </div>

          <div className="nb-angles-section">
            <div className="nb-angles-label">Why These {exp.testType === 'Persona Testing' ? 'Personas' : 'Angles'}?</div>
            <div className="nb-angles-list">
              {exp.whyTheseAngles.map((text, i) => {
                const angle = exp.angles[i]
                const name = text.split(' — ')[0]
                const desc = text.split(' — ')[1] || text
                return (
                  <div key={i} className="nb-angle-item">
                    <div className="nb-angle-bar" style={{ background: angle?.color || '#666' }} />
                    <div className="nb-angle-header">
                      <div className="nb-angle-dot" style={{ background: angle?.color || '#666' }} />
                      <div className="nb-angle-name">{name}</div>
                      <div className="nb-angle-num">{String(i + 1).padStart(2, '0')}</div>
                    </div>
                    <div className="nb-angle-text">{desc}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="nb-generate-section">
            <div className="nb-generate-label">Select Variants to Generate</div>
            <div className="nb-variant-selector">
              {exp.angles.map((angle, i) => (
                <button
                  key={angle.id}
                  className={`nb-variant-chip ${selectedVariants.includes(i) ? 'selected' : ''}`}
                  style={selectedVariants.includes(i) ? { borderColor: angle.color, color: angle.color, background: `${angle.color}10` } : {}}
                  onClick={() => toggleVariant(i)}
                >
                  <div className="nb-variant-chip-dot" style={{ background: selectedVariants.includes(i) ? angle.color : 'rgba(255,255,255,0.15)' }} />
                  {angle.short}
                </button>
              ))}
            </div>
            <button
              className="nb-generate-btn"
              onClick={handleGenerate}
              disabled={selectedVariants.length === 0}
            >
              Generate {selectedVariants.length} Variant{selectedVariants.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}

      {/* Generating State */}
      {view === 'detail' && generating && (
        <div className="nb-generating">
          <div className="nb-generating-spinner" />
          <div className="nb-generating-title">Generating variants...</div>
          <div className="nb-generating-sub">Creating {selectedVariants.length} personalised landing page{selectedVariants.length !== 1 ? 's' : ''} for "{exp.query}"</div>
        </div>
      )}

      {/* Generated — Tabs + Preview */}
      {view === 'detail' && generated && (
        <div className="nb-preview-view">
          <div className="nb-preview-tabs">
            {tabs.map((tab, i) => (
              <button
                key={i}
                className={`nb-preview-tab ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
                style={activeTab === i ? { borderBottomColor: tab.color, color: '#fff' } : {}}
              >
                <div className="nb-preview-tab-dot" style={{ background: tab.color }} />
                {tab.label}
              </button>
            ))}
            <button className="nb-preview-tab nb-back-to-brief" onClick={() => { setGenerated(false); setGenerating(false) }}>
              ← Brief
            </button>
          </div>
          <div className="nb-preview-iframe-wrap">
            <iframe
              src={activeTab === 0 ? exp.currentPage : tabs[activeTab]?.page}
              title="Preview"
              className="nb-preview-iframe"
            />
          </div>
        </div>
      )}
      {/* Ad Modal */}
      {adModalOpen && exp?.adImage && (
        <div className="nb-ad-modal-overlay" onClick={() => setAdModalOpen(false)}>
          <div className="nb-ad-modal" onClick={e => e.stopPropagation()}>
            <button className="nb-ad-modal-close" onClick={() => setAdModalOpen(false)}>✕</button>
            <div className="nb-ad-modal-card">
              <div className="nb-ad-modal-header">
                <div className="nb-ad-modal-avatar">F</div>
                <div className="nb-ad-modal-meta">
                  <div className="nb-ad-modal-page">Fanatics</div>
                  <div className="nb-ad-modal-sponsored">Sponsored · 🌐</div>
                </div>
                <div style={{ marginLeft: 'auto', color: '#999', fontSize: 18, letterSpacing: 2 }}>···</div>
              </div>
              <div className="nb-ad-modal-body">{exp.adBody}</div>
              <div className="nb-ad-modal-image">
                <img src={exp.adImage} alt="" />
              </div>
              <div className="nb-ad-modal-link-bar">
                <div>
                  <div className="nb-ad-modal-domain">WWW.FANATICS.COM</div>
                  <div className="nb-ad-modal-link-title">{exp.query}</div>
                </div>
                <button className="nb-ad-modal-cta">Shop Now</button>
              </div>
              <div className="nb-ad-modal-actions">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗️ Share</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
