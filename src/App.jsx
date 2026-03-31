import { useState, useEffect } from 'react'
import './App.css'

// ── Template Assignments ───────────────────────────────────

const TEMPLATES = {
  'sf-giants': { name: 'Template A', label: 'Hero Heavy', spaces: 6 },
  'nfl-jerseys': { name: 'Template A', label: 'Hero Heavy', spaces: 6 },
  'usa-hockey': { name: 'Template A', label: 'Hero Heavy', spaces: 6 },
}

// ── Report Data ────────────────────────────────────────────

const REPORT_DATA = {
  'sf-giants': {
    kpis: [
      { value: '+62%', label: 'Primary KPI', desc: 'Conversion rate · Player-Led vs. control', color: '#22c55e' },
      { value: '$5.94', label: 'Rev / Session', desc: 'Player-Led variant · +62% uplift', color: '#22c55e' },
      { value: 'Healthy', label: 'Guardrails', desc: 'No flags on bounce or exit rate', color: '#22c55e' },
    ],
    hypothesis: { supported: true, title: 'Player-Led personalisation lifts conversion', desc: 'Leading with Matt Chapman #26 and enabling player switching reduced friction and drove +62% CVR uplift vs. the generic product page.' },
    chartViews: {
      variant: {
        label: 'Conversion Rate',
        bars: [
          { label: 'Current', v: 2.1, lift: null },
          { label: 'Player-Led', v: 3.4, lift: '+62%' },
          { label: 'Occasion', v: 2.8, lift: '+33%' },
          { label: 'Social Proof', v: 3.1, lift: '+48%' },
          { label: 'Rival-Led', v: 3.2, lift: '+52%' },
          { label: 'Value-Led', v: 2.6, lift: '+24%' },
        ],
        max: 4,
        insight: 'Player-Led outperforms all angles. Rival-Led is a surprising second — tribal identity drives action.',
      },
      revenue: {
        label: 'Revenue per Session',
        bars: [
          { label: 'Current', v: 3.67, lift: null },
          { label: 'Player-Led', v: 5.94, lift: '+62%' },
          { label: 'Occasion', v: 4.89, lift: '+33%' },
          { label: 'Social Proof', v: 5.42, lift: '+48%' },
          { label: 'Rival-Led', v: 5.60, lift: '+53%' },
          { label: 'Value-Led', v: 4.55, lift: '+24%' },
        ],
        max: 7,
        insight: 'Rival-Led drives higher AOV than Social Proof — fans buying for rivalry games spend more per order.',
      },
      engagement: {
        label: 'Add to Cart Rate',
        bars: [
          { label: 'Current', v: 5.8, lift: null },
          { label: 'Player-Led', v: 9.2, lift: '+59%' },
          { label: 'Occasion', v: 7.6, lift: '+31%' },
          { label: 'Social Proof', v: 8.4, lift: '+45%' },
          { label: 'Rival-Led', v: 8.8, lift: '+52%' },
          { label: 'Value-Led', v: 7.1, lift: '+22%' },
        ],
        max: 10,
        insight: 'Rival-Led nearly matches Player-Led on add-to-cart. "Don\'t be a Dodger" messaging creates urgency.',
      },
    },
    actions: [
      { action: 'Deploy Player-Led variant as the default landing page for "SF Giants jersey" queries', priority: 'High', color: '#22c55e' },
      { action: 'Run Rival-Led during Dodgers series weeks — strong emotional trigger with +52% CVR', priority: 'High', color: '#22c55e' },
      { action: 'Run Social Proof as secondary — consistent performer with +48% CVR', priority: 'Medium', color: '#f59e0b' },
      { action: 'Retire Value-Led angle — lowest performer, likely wrong audience for price messaging', priority: 'Medium', color: '#f59e0b' },
    ],
    nextTests: [
      { title: 'Player variant test', desc: 'Test Chapman vs. Lee vs. Webb as the default featured player.', priority: '1' },
      { title: 'Rival-Led seasonal rotation', desc: 'Test Rival-Led only during Dodgers series vs. always-on rivalry messaging.', priority: '2' },
      { title: 'Rival + Player hybrid', desc: 'Combine Player-Led PDP with Rival-Led hero banner — best of both angles.', priority: '3' },
    ],
  },
  'nfl-jerseys': {
    kpis: [
      { value: '+107%', label: 'Primary KPI', desc: 'Conversion rate · Die-Hard Fan vs. control', color: '#22c55e' },
      { value: '-36%', label: 'Bounce Rate', desc: 'Die-Hard Fan · down from 64% to 41%', color: '#22c55e' },
      { value: 'Healthy', label: 'Guardrails', desc: 'No flags on return rate or complaints', color: '#22c55e' },
    ],
    hypothesis: { supported: true, title: 'Persona matching dramatically reduces bounce on broad searches', desc: 'The generic NFL page showed 5,944 results with no personalisation. Matching the landing page to the Die-Hard Fan persona (Eagles, location-detected) cut bounce by 36% and more than doubled conversion.' },
    chartViews: {
      variant: {
        label: 'Conversion Rate',
        bars: [
          { label: 'Current', v: 1.4, lift: null },
          { label: 'Die-Hard', v: 2.9, lift: '+107%' },
          { label: 'Gift Buyer', v: 2.3, lift: '+64%' },
          { label: 'Casual Fan', v: 2.1, lift: '+50%' },
        ],
        max: 3.5,
        insight: 'Die-Hard Fan leads all personas. Every persona outperforms the generic page — personalisation works across the board.',
      },
      revenue: {
        label: 'Revenue per Session',
        bars: [
          { label: 'Current', v: 2.45, lift: null },
          { label: 'Die-Hard', v: 5.08, lift: '+107%' },
          { label: 'Gift Buyer', v: 4.03, lift: '+64%' },
          { label: 'Casual Fan', v: 3.68, lift: '+50%' },
        ],
        max: 6,
        insight: 'Die-Hard fans spend more per session — premium tiers resonate. Gift Buyer also strong due to higher-priced gift picks.',
      },
      engagement: {
        label: 'Time on Page',
        bars: [
          { label: 'Current', v: 0.97, lift: null },
          { label: 'Die-Hard', v: 2.72, lift: '+179%' },
          { label: 'Gift Buyer', v: 2.20, lift: '+128%' },
          { label: 'Casual Fan', v: 1.90, lift: '+97%' },
        ],
        max: 3,
        insight: 'All personas spend dramatically more time on page vs. the 5,944-result generic listing. Focused content keeps users engaged.',
      },
    },
    actions: [
      { action: 'Deploy persona detection + routing — serve Die-Hard Fan page to users with detectable team affinity', priority: 'High', color: '#22c55e' },
      { action: 'Use Gift Buyer as default for Dec-Jan traffic — seasonal gift buying intent', priority: 'High', color: '#22c55e' },
      { action: 'Casual Fan needs work — lowest performer but still +50% vs. control. Test educational content depth', priority: 'Medium', color: '#f59e0b' },
      { action: 'Add gift wrapping upsell to all personas — Gift Buyer proved the demand', priority: 'Medium', color: '#f59e0b' },
    ],
    nextTests: [
      { title: 'Team detection accuracy test', desc: 'Validate location-based team assignment across top 10 markets.', priority: '1' },
      { title: 'Gift Buyer seasonal test', desc: 'Run Gift Buyer as default during holiday season and measure AOV lift.', priority: '2' },
      { title: 'Casual Fan education test', desc: 'Test guided jersey tier explainer vs. simplified 3-product view.', priority: '3' },
    ],
  },
  'usa-hockey': {
    kpis: [
      { value: '+72%', label: 'Primary KPI', desc: 'Conversion rate · Urgency vs. control', color: '#22c55e' },
      { value: '$5.43', label: 'Rev / Session', desc: 'Urgency variant · +72% uplift', color: '#22c55e' },
      { value: 'Healthy', label: 'Guardrails', desc: 'No flags on return rate or complaints', color: '#22c55e' },
    ],
    hypothesis: { supported: true, title: 'Matching landing page scarcity to ad scarcity converts impulse buyers', desc: 'The Meta ad promised "restocked" and "before they\'re gone" but the landing page was a generic category listing. Making scarcity real on-page (stock levels, sold counts, live activity) converted impulse buyers at +72% vs. control.' },
    chartViews: {
      variant: {
        label: 'Conversion Rate',
        bars: [
          { label: 'Current', v: 1.8, lift: null },
          { label: 'Star Player', v: 2.8, lift: '+56%' },
          { label: 'Gold Medal', v: 2.5, lift: '+39%' },
          { label: 'Urgency', v: 3.1, lift: '+72%' },
        ],
        max: 3.5,
        insight: 'Urgency/Scarcity wins — ad-to-page message match is critical for retargeting. Star Player is a strong second.',
      },
      revenue: {
        label: 'Revenue per Session',
        bars: [
          { label: 'Current', v: 3.15, lift: null },
          { label: 'Star Player', v: 4.90, lift: '+56%' },
          { label: 'Gold Medal', v: 4.38, lift: '+39%' },
          { label: 'Urgency', v: 5.43, lift: '+72%' },
        ],
        max: 6,
        insight: 'Urgency drives the highest revenue per session. Scarcity messaging converts higher-intent buyers.',
      },
      engagement: {
        label: 'Add to Cart Rate',
        bars: [
          { label: 'Current', v: 4.4, lift: null },
          { label: 'Star Player', v: 7.2, lift: '+64%' },
          { label: 'Gold Medal', v: 6.5, lift: '+48%' },
          { label: 'Urgency', v: 8.3, lift: '+89%' },
        ],
        max: 9,
        insight: 'Urgency drives the most add-to-cart actions. Stock level warnings and live activity create FOMO.',
      },
    },
    actions: [
      { action: 'Deploy Urgency variant for all Meta retargeting traffic — ad-to-page scarcity match converts', priority: 'High', color: '#22c55e' },
      { action: 'Test Star Player for organic/direct traffic — player-led works when there\'s no ad context', priority: 'High', color: '#22c55e' },
      { action: 'Merge Gold Medal Olympic messaging into Urgency variant — combine emotional + scarcity triggers', priority: 'Medium', color: '#f59e0b' },
      { action: 'Add restock alerts for sold-out sizes — capture demand that would otherwise bounce', priority: 'Medium', color: '#f59e0b' },
    ],
    nextTests: [
      { title: 'Urgency calibration test', desc: 'Test stock count thresholds (3 left vs. 8 left vs. 15 left) on conversion.', priority: '1' },
      { title: 'Ad-page message match test', desc: 'Test matching exact ad copy on landing page vs. expanded scarcity messaging.', priority: '2' },
      { title: 'Star Player + Urgency hybrid', desc: 'Combine player-led PDP with urgency countdown and stock levels.', priority: '3' },
    ],
  },
}

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
      'Rival-Led — Giants vs. Dodgers is the biggest rivalry in baseball. Leaning into tribal identity ("Don\'t be a Dodger") taps into emotional, identity-driven purchasing.',
      'Value-Led — Price-sensitive shoppers searching for jerseys compare across sites. Showing "Starting at $84.99" and savings vs. stadium prices converts deal-seekers.',
    ],
    angles: [
      { id: 'player', short: 'Player-Led', color: '#1A52F0', page: '/pages/nb-player.html' },
      { id: 'occasion', short: 'Occasion-Led', color: '#22c55e', page: '/pages/nb-occasion.html' },
      { id: 'social', short: 'Social Proof', color: '#a855f7', page: '/pages/nb-social.html' },
      { id: 'rival', short: 'Rival-Led', color: '#fd5a1e', page: '/pages/nb-rival.html' },
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
    ],
    angles: [
      { id: 'die-hard', short: 'Die-Hard Fan', color: '#1A52F0', page: '/pages/nfl-diehard.html' },
      { id: 'gift-buyer', short: 'Gift Buyer', color: '#22c55e', page: '/pages/nfl-gift.html' },
      { id: 'casual-fan', short: 'Casual / New Fan', color: '#f59e0b', page: '/pages/nfl-casual.html' },
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
      'Urgency/Scarcity — The ad says "restocked" and "before they\'re gone." Making the scarcity real on the page (stock levels, sold counts, live activity) converts impulse buyers.',
    ],
    angles: [
      { id: 'star-player', short: 'Star Player', color: '#1A52F0', page: '/pages/hockey-star-player.html' },
      { id: 'gold-medal', short: 'Gold Medal', color: '#f59e0b', page: '/pages/hockey-gold-medal.html' },
      { id: 'urgency', short: 'Urgency/Scarcity', color: '#ef4444', page: '/pages/hockey-urgency.html' },
    ],
  },
]

// ── Step Labels ─────────────────────────────────────────

const STEP_LABELS = ['Brief', 'Variants', 'Results', 'Report']

// ── App ──────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState('list') // 'list' | 'detail'
  const [activeExperiment, setActiveExperiment] = useState(null)
  const [step, setStep] = useState(1) // 1=Brief, 2=Variants, 3=Results, 4=Report
  const [briefLoading, setBriefLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState([])
  const [adModalOpen, setAdModalOpen] = useState(false)
  const [reportView, setReportView] = useState('variant')

  const openExperiment = (exp) => {
    setActiveExperiment(exp)
    setView('detail')
    setStep(1)
    setBriefLoading(true)
    setGenerating(false)
    setActiveTab(0)
    setSelectedVariants(exp.angles.map((_, i) => i))
    setTimeout(() => {
      setBriefLoading(false)
    }, 2000)
  }

  const goBack = () => {
    setView('list')
    setActiveExperiment(null)
    setStep(1)
    setBriefLoading(false)
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
      setStep(3)
      setActiveTab(0)
    }, 2500)
  }

  const exp = activeExperiment
  const template = exp ? TEMPLATES[exp.id] : null
  const report = exp ? REPORT_DATA[exp.id] : null

  const tabs = exp && step === 3
    ? exp.angles
        .filter((_, i) => selectedVariants.includes(i))
        .map(a => ({ label: a.short, color: a.color, page: a.page }))
    : []

  // Colors for report chart bars per variant row
  const variantColors = exp
    ? ['#666', ...exp.angles.map(a => a.color)]
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
      {view === 'detail' && exp && (
        <>
          {/* Stepper */}
          <div className="nb-stepper">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1
              const isActive = step === stepNum
              const isDone = step > stepNum
              return (
                <div key={label} className="nb-stepper-item">
                  {i > 0 && (
                    <div className={`nb-stepper-line ${isDone ? 'done' : ''}`} />
                  )}
                  <div className={`nb-stepper-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                    {isDone ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : stepNum}
                  </div>
                  <div className={`nb-stepper-label ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>{label}</div>
                </div>
              )
            })}
          </div>

          {/* Step 1: Brief */}
          {step === 1 && briefLoading && (
            <div className="nb-generating">
              <div className="nb-generating-spinner" />
              <div className="nb-generating-title">Generating brief...</div>
              <div className="nb-generating-sub">Analysing "{exp.query}" and building test hypothesis</div>
            </div>
          )}

          {step === 1 && !briefLoading && (
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
                <div className="nb-brief-card">
                  {/* Top glow */}
                  <div className="nb-brief-glow" />

                  {/* Header */}
                  <div className="nb-brief-header">
                    <div className="nb-brief-header-left">
                      <div className="nb-brief-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A52F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                          <rect x="9" y="3" width="6" height="4" rx="1" />
                          <path d="M9 14l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="nb-brief-header-label">Test Brief</div>
                        <div className="nb-brief-header-title">{exp.channel === 'Meta Ads' ? exp.query : `"${exp.query}"`}</div>
                      </div>
                    </div>
                    <div className="nb-brief-header-right">
                      <div className="nb-brief-stage-badge">{exp.stage}</div>
                    </div>
                  </div>

                  {/* Meta pills */}
                  <div className="nb-brief-pills">
                    {[
                      { label: 'Channel', value: exp.channel },
                      { label: exp.channel === 'Meta Ads' ? 'Ad' : 'Query', value: exp.query },
                      { label: 'Test Type', value: exp.testType },
                      { label: 'Stage', value: exp.stage },
                    ].map(s => (
                      <div key={s.label} className="nb-brief-pill">
                        <span className="nb-brief-pill-label">{s.label}</span>
                        <span className="nb-brief-pill-value">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hypothesis */}
                  <div className="nb-brief-hypothesis">
                    <div className="nb-brief-hypothesis-bar" />
                    <div className="nb-brief-hypothesis-content">
                      <div className="nb-brief-hypothesis-label">Hypothesis</div>
                      <div className="nb-brief-hypothesis-text">{exp.testBrief}</div>
                    </div>
                  </div>

                  {/* Angles — inside the card */}
                  <div className="nb-brief-angles">
                    <div className="nb-brief-angles-label">Why These {exp.testType === 'Persona Testing' ? 'Personas' : 'Angles'}?</div>
                    <div className="nb-brief-angles-grid">
                      {exp.whyTheseAngles.map((text, i) => {
                        const angle = exp.angles[i]
                        const name = text.split(' — ')[0]
                        const desc = text.split(' — ')[1] || text
                        return (
                          <div key={i} className="nb-brief-angle">
                            <div className="nb-brief-angle-bar" style={{ background: angle?.color || '#666' }} />
                            <div className="nb-brief-angle-header">
                              <div className="nb-brief-angle-dot" style={{ background: angle?.color || '#666' }} />
                              <div className="nb-brief-angle-name">{name}</div>
                              <div className="nb-brief-angle-num">{String(i + 1).padStart(2, '0')}</div>
                            </div>
                            <div className="nb-brief-angle-desc">{desc}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="nb-step-actions">
                <button className="nb-generate-btn" onClick={() => setStep(2)}>
                  Continue to Variants
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Generate Variants */}
          {step === 2 && !generating && (
            <div className="nb-detail-view">
              <div className="nb-detail-header">
                <div className="nb-channel-badge" style={{ background: `${exp.channelColor}15`, color: exp.channelColor, border: `1px solid ${exp.channelColor}30` }}>
                  <span className="nb-channel-icon">{exp.channelIcon}</span>
                  {exp.channel}
                </div>
                <div className="nb-detail-query">{exp.channel === 'Meta Ads' ? exp.query : `"${exp.query}"`}</div>
              </div>

              {/* Template badge */}
              {template && (
                <div className="nb-template-badge">
                  <div className="nb-template-badge-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="nb-template-badge-text">
                    <span className="nb-template-badge-name">{template.name} — {template.label}</span>
                    <span className="nb-template-badge-spaces">{template.spaces} personalisation spaces</span>
                  </div>
                </div>
              )}

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
                <div className="nb-step-actions-row">
                  <button className="nb-step-back-btn" onClick={() => { setStep(1); setBriefLoading(false); }}>← Back to Brief</button>
                  <button
                    className="nb-generate-btn"
                    onClick={handleGenerate}
                    disabled={selectedVariants.length === 0}
                    style={{ flex: 1 }}
                  >
                    Generate {selectedVariants.length} Variant{selectedVariants.length !== 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && generating && (
            <div className="nb-generating">
              <div className="nb-generating-spinner" />
              <div className="nb-generating-title">Generating variants...</div>
              <div className="nb-generating-sub">Creating {selectedVariants.length} personalised landing page{selectedVariants.length !== 1 ? 's' : ''} for "{exp.query}"</div>
            </div>
          )}

          {/* Step 3: View Results */}
          {step === 3 && (
            <div className="nb-preview-view">
              <div className="nb-vtabs">
                <button className="nb-vtabs-back" onClick={() => setStep(2)}>←</button>
                <div className="nb-vtabs-list">
                  {tabs.map((tab, i) => (
                    <button
                      key={i}
                      className={`nb-vtab ${activeTab === i ? 'active' : ''}`}
                      onClick={() => setActiveTab(i)}
                      style={activeTab === i ? { borderColor: tab.color, background: `${tab.color}15` } : {}}
                    >
                      <div className="nb-vtab-dot" style={{ background: tab.color }} />
                      <span className="nb-vtab-label">{tab.label}</span>
                      {activeTab === i && <span className="nb-vtab-active-label">Viewing</span>}
                    </button>
                  ))}
                </div>
                <button className="nb-vtabs-report" onClick={() => setStep(4)}>
                  View Report →
                </button>
              </div>
              <div className="nb-preview-iframe-wrap">
                <iframe
                  src={tabs[activeTab]?.page}
                  title="Preview"
                  className="nb-preview-iframe"
                />
              </div>
            </div>
          )}

          {/* Step 4: Report */}
          {step === 4 && report && (() => {
            const chartData = report.chartViews[reportView]
            return (
            <div className="nb-report-view">
              {/* Report card */}
              <div className="nb-rpt-card">
                {/* Top glow line */}
                <div className="nb-rpt-glow" />

                {/* Report header */}
                <div className="nb-rpt-header">
                  <div className="nb-rpt-header-left">
                    <div className="nb-rpt-icon">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1A52F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <div>
                      <div className="nb-rpt-header-label">Test Result Report</div>
                      <div className="nb-rpt-header-title">{exp.channel === 'Meta Ads' ? exp.query : `"${exp.query}"`}</div>
                    </div>
                  </div>
                  <div className="nb-rpt-header-right">
                    <div className="nb-rpt-status">
                      <span className="nb-rpt-status-dot" />
                      Completed
                    </div>
                    <button className="nb-step-back-btn" onClick={() => setStep(3)}>← Results</button>
                  </div>
                </div>

                {/* Meta pills */}
                <div className="nb-rpt-pills">
                  {[
                    { label: 'Channel', value: exp.channel },
                    { label: 'Variants', value: String(exp.angles.length) },
                    { label: 'Test Type', value: exp.testType },
                    { label: 'Template', value: template ? `${template.name} — ${template.label}` : '' },
                  ].map(s => (
                    <div key={s.label} className="nb-rpt-pill">
                      <span className="nb-rpt-pill-label">{s.label}</span>
                      <span className="nb-rpt-pill-value">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* KPI stats */}
                <div className="nb-rpt-kpis">
                  {report.kpis.map((kpi, i) => (
                    <div key={i} className="nb-rpt-kpi">
                      <div className="nb-rpt-kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                      <div className="nb-rpt-kpi-label">{kpi.label}</div>
                      <div className="nb-rpt-kpi-desc">{kpi.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Hypothesis result */}
                <div className="nb-rpt-hypothesis" style={{ borderColor: report.hypothesis.supported ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', background: report.hypothesis.supported ? 'rgba(34,197,94,0.04)' : 'rgba(245,158,11,0.04)' }}>
                  <div className="nb-rpt-hypothesis-bar" style={{ background: report.hypothesis.supported ? '#22c55e' : '#f59e0b' }} />
                  <div className="nb-rpt-hypothesis-badge" style={{ background: report.hypothesis.supported ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', color: report.hypothesis.supported ? '#22c55e' : '#f59e0b', borderColor: report.hypothesis.supported ? 'rgba(34,197,94,0.2)' : 'rgba(245,158,11,0.2)' }}>
                    {report.hypothesis.supported ? 'Supported' : 'Not Supported'}
                  </div>
                  <div className="nb-rpt-hypothesis-content">
                    <div className="nb-rpt-hypothesis-title">{report.hypothesis.title}</div>
                    <div className="nb-rpt-hypothesis-desc">{report.hypothesis.desc}</div>
                  </div>
                </div>

                {/* Chart with view tabs */}
                <div className="nb-rpt-chart-section">
                  <div className="nb-rpt-chart-header">
                    <div className="nb-rpt-chart-section-label">Performance — {chartData.label}</div>
                    <div className="nb-rpt-chart-tabs">
                      {[['variant', 'By Variant'], ['revenue', 'By Revenue'], ['engagement', 'By Engagement']].map(([key, label]) => (
                        <button key={key} className={`nb-rpt-chart-tab ${reportView === key ? 'active' : ''}`} onClick={() => setReportView(key)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="nb-rpt-chart-area">
                    {/* Grid lines */}
                    <div className="nb-rpt-chart-grid">
                      {[0,1,2,3].map(i => <div key={i} className="nb-rpt-chart-gridline" />)}
                    </div>

                    <div className="nb-rpt-chart-bars">
                      {chartData.bars.map((bar, bi) => {
                        const isControl = bar.label === 'Current'
                        const isBest = !isControl && bar.v === Math.max(...chartData.bars.filter(b => b.label !== 'Current').map(b => b.v))
                        const pct = (bar.v / chartData.max) * 100
                        const color = isControl ? 'rgba(255,255,255,0.08)' : isBest ? '#1A52F0' : 'rgba(26,82,240,0.3)'
                        return (
                          <div key={bi} className="nb-rpt-chart-col">
                            {bar.lift && (
                              <div className={`nb-rpt-chart-lift ${bar.lift.startsWith('-') ? 'neg' : 'pos'}`}>{bar.lift}</div>
                            )}
                            <div className="nb-rpt-chart-val" style={{ color: isBest ? '#1A52F0' : 'rgba(255,255,255,0.5)' }}>{bar.v}</div>
                            <div className="nb-rpt-chart-bar" style={{ height: `${pct}%`, background: isControl ? 'linear-gradient(to top, rgba(255,255,255,0.04), rgba(255,255,255,0.1))' : isBest ? 'linear-gradient(to top, rgba(26,82,240,0.2), rgba(26,82,240,0.5))' : 'linear-gradient(to top, rgba(26,82,240,0.1), rgba(26,82,240,0.3))', boxShadow: isBest ? '0 -4px 16px rgba(26,82,240,0.15)' : 'none' }} />
                            <div className="nb-rpt-chart-label" style={{ color: isBest ? '#1A52F0' : 'rgba(255,255,255,0.4)' }}>{bar.label}</div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="nb-rpt-chart-insight">{chartData.insight}</div>
                  </div>
                </div>

                {/* Action points + Next tests */}
                <div className="nb-rpt-actions-grid">
                  {/* Action points */}
                  <div className="nb-rpt-actions-col">
                    <div className="nb-rpt-actions-label">Action Points</div>
                    <div className="nb-rpt-actions-list">
                      {report.actions.map((item, i) => (
                        <div key={i} className="nb-rpt-action-item">
                          <div className="nb-rpt-action-check">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1A52F0" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                          <div className="nb-rpt-action-text">{item.action}</div>
                          <div className="nb-rpt-action-priority" style={{ background: `${item.color}11`, color: item.color, borderColor: `${item.color}33` }}>{item.priority}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next tests */}
                  <div className="nb-rpt-nexttests-col">
                    <div className="nb-rpt-actions-label" style={{ color: '#1A52F0' }}>Recommended Next Tests</div>
                    <div className="nb-rpt-actions-list">
                      {report.nextTests.map((item, i) => (
                        <div key={i} className="nb-rpt-nexttest-item">
                          <div className="nb-rpt-nexttest-bar" style={{ opacity: 1 - i * 0.25 }} />
                          <div className="nb-rpt-nexttest-num">{item.priority}</div>
                          <div className="nb-rpt-nexttest-content">
                            <div className="nb-rpt-nexttest-title">{item.title}</div>
                            <div className="nb-rpt-nexttest-desc">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
          })()}
        </>
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
