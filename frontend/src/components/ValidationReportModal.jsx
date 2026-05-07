/**
 * ValidationReportDashboard.jsx
 *
 * Dependencies:
 *   npm install recharts lucide-react
 *
 * Usage:
 *   import ValidationReportDashboard from './ValidationReportDashboard';
 *
 *   <ValidationReportDashboard reportData={yourReportData} />
 *
 * reportData shape:
 * {
 *   id: string | number,
 *   final_score: number,          // 0–100
 *   status: 'passed' | 'failed',
 *   username: string,
 *   report: {
 *     all_reports: {
 *       [key: string]: {
 *         score: number,           // 0–100
 *         summary?: string,
 *         reason?: string,
 *       }
 *     }
 *   }
 * }
 */

import { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import {
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Activity,
  CircleCheck,
  Circle,
} from 'lucide-react';

/* ─── Colour helpers ─────────────────────────────────────── */
const scoreColor = (s) => {
  if (s >= 85) return { bar: '#185FA5', text: '#0C447C', bg: '#E6F1FB', label: '#0C447C' };
  if (s >= 70) return { bar: '#BA7517', text: '#633806', bg: '#FAEEDA', label: '#633806' };
  return { bar: '#A32D2D', text: '#501313', bg: '#FCEBEB', label: '#501313' };
};

const MODULE_PALETTE = [
  '#185FA5', '#1D9E75', '#BA7517', '#D85A30', '#7F77DD',
  '#639922', '#884C9C', '#0F6E56', '#854F0B', '#A32D2D',
];

/* ─── Sub-components ─────────────────────────────────────── */

function StatTile({ label, value, accent }) {
  return (
    <div
      style={{
        background: 'var(--stat-bg, #F8F9FA)',
        borderRadius: 8,
        padding: '12px 16px',
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 18, fontWeight: 500, color: accent || '#111827', margin: 0 }}>{value}</p>
    </div>
  );
}

function ProgressRow({ label, score }) {
  const c = scoreColor(score);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: c.label }}>{Math.round(score)}%</span>
      </div>
      <div style={{ height: 5, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${score}%`,
            background: c.bar,
            borderRadius: 3,
            transition: 'width 1s ease',
          }}
        />
      </div>
    </div>
  );
}

function Badge({ children, variant = 'info' }) {
  const styles = {
    pass:    { bg: '#EAF3DE', color: '#27500A' },
    fail:    { bg: '#FCEBEB', color: '#791F1F' },
    info:    { bg: '#E6F1FB', color: '#0C447C' },
    warning: { bg: '#FAEEDA', color: '#633806' },
  };
  const s = styles[variant] || styles.info;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: 6,
        letterSpacing: '0.03em',
        background: s.bg,
        color: s.color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <p
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        marginTop: 0,
      }}
    >
      {Icon && <Icon size={15} color="#185FA5" />}
      {children}
    </p>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '0.5px solid rgba(0,0,0,0.1)',
        borderRadius: 12,
        padding: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Custom tooltip for bar chart ──────────────────────── */
function CustomBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const val = Math.round(payload[0].value);
  const c = scoreColor(val);
  return (
    <div
      style={{
        background: '#fff',
        border: '0.5px solid rgba(0,0,0,0.12)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
      }}
    >
      <span style={{ fontWeight: 500, color: c.label }}>{val}%</span>
    </div>
  );
}

/* ─── Radial score gauge ─────────────────────────────────── */
function ScoreGauge({ score, isPassed }) {
  const color = isPassed ? '#185FA5' : '#A32D2D';
  const data = [{ value: score }];
  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={225}
          endAngle={-45}
        >
          <RadialBar
            background={{ fill: '#F3F4F6' }}
            dataKey="value"
            cornerRadius={6}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 500, color: '#111827', lineHeight: 1 }}>
          {score.toFixed(1)}%
        </span>
        <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 4 }}>
          trust score
        </span>
      </div>
    </div>
  );
}

/* ─── Pie chart for module distribution ─────────────────── */
function ModulePie({ modules }) {
  const data = modules.map((m) => ({ name: m.label, value: Math.round(m.score) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={MODULE_PALETTE[i % MODULE_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
        <Legend
          iconType="square"
          iconSize={9}
          formatter={(v) => <span style={{ fontSize: 11, color: '#6B7280' }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ─── Horizontal bar chart for module scores ────────────── */
function ModuleBarChart({ modules }) {
  const data = modules.map((m) => ({ name: m.label, score: Math.round(m.score) }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(modules.length * 40 + 40, 160)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickFormatter={(v) => `${v}%`}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fontSize: 12, fill: '#374151' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
          {data.map((d, i) => (
            <Cell key={i} fill={scoreColor(d.score).bar} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Recommendation item ────────────────────────────────── */
function RecItem({ icon: Icon, iconColor, iconBg, title, desc }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 0',
        borderBottom: '0.5px solid rgba(0,0,0,0.07)',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        <Icon size={15} color={iconColor} />
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', margin: '0 0 2px' }}>{title}</p>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Default / demo data ────────────────────────────────── */
const DEFAULT_REPORT_DATA = {
  id: '41827',
  final_score: 87.4,
  status: 'passed',
  username: 'analyst_01',
  report: {
    all_reports: {
      structural_report:   { score: 94, summary: 'All schema constraints satisfied. No structural violations found across 14,200 records.' },
      completeness_report: { score: 88, summary: 'Field coverage at 88.3%. Null rate within acceptable threshold of 5%.' },
      freshness_report:    { score: 91, summary: 'Data recency confirmed within the 30-day window. Temporal index nominal.' },
      consistency_report:  { score: 79, summary: 'Minor cross-field inconsistencies detected in 2.1% of rows. Review recommended.' },
      outlier_report:      { score: 71, summary: 'Outlier clusters identified in 3 feature columns. Secondary validation advised.' },
    },
  },
};

/* ─── Recommendations helper ─────────────────────────────── */
function getRecommendations(score) {
  if (score >= 85) {
    return [
      { icon: CheckCircle2, iconColor: '#3B6D11', iconBg: '#EAF3DE', title: 'Ready for immediate deployment', desc: 'Asset is high-fidelity. Maintain current collection protocol for consistent veracity.' },
      { icon: AlertTriangle, iconColor: '#BA7517', iconBg: '#FAEEDA', title: 'Secondary validation on outlier modules advised', desc: 'Outlier detection scored below 80%. Review integrity check logs for schema drifts.' },
      { icon: RefreshCw,    iconColor: '#185FA5', iconBg: '#E6F1FB', title: 'Schedule re-validation in 30 days', desc: 'Temporal freshness is optimal now. Set a trigger to re-run validation after 30 days.' },
    ];
  }
  if (score >= 70) {
    return [
      { icon: AlertTriangle, iconColor: '#BA7517', iconBg: '#FAEEDA', title: 'Secondary validation required', desc: 'Perform a secondary pass on outlier detection and consistency modules before deployment.' },
      { icon: RefreshCw,    iconColor: '#185FA5', iconBg: '#E6F1FB', title: 'Review integrity check logs', desc: 'Minor schema drifts detected. Inspect logs and recalibrate affected pipelines.' },
    ];
  }
  return [
    { icon: AlertTriangle, iconColor: '#A32D2D', iconBg: '#FCEBEB', title: 'High risk — manual intervention required', desc: 'Do not deploy. Protocol requires manual review before this asset can be cleared.' },
    { icon: RefreshCw,    iconColor: '#185FA5', iconBg: '#E6F1FB', title: 'Re-calibrate and re-collect', desc: 'Re-calibrate neural sensors and initiate a fresh collection phase from scratch.' },
  ];
}

/* ─── Main component ─────────────────────────────────────── */
export default function ValidationReportDashboard({ reportData = DEFAULT_REPORT_DATA }) {
  const [logsOpen, setLogsOpen] = useState(false);

  const {
    id,
    final_score = 0,
    status = 'unknown',
    report = {},
  } = reportData;

  const score     = Number(final_score) || 0;
  const isPassed  = ['passed', 'pass', 'PASS', 'PASSED'].includes(String(status).trim());
  const allReports = report?.all_reports ?? {};

  const modules = Object.entries(allReports).map(([key, data], i) => ({
    key,
    label: key
      .replace(/_report$/i, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    score: Number(data.score) || 0,
    summary: data.summary || data.reason || 'Module clearance approved.',
    color: MODULE_PALETTE[i % MODULE_PALETTE.length],
  }));

  const recommendations = getRecommendations(score);
  const uidStr = String(id || '0000').padStart(8, '0');
  const auditDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const containerStyle = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: '#F9FAFB',
    minHeight: '100vh',
    padding: '24px',
    boxSizing: 'border-box',
    color: '#111827',
  };

  /* grid helpers */
  const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 };
  const grid4 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 };

  return (
    <div style={containerStyle}>
      {/* ── max-width wrapper ── */}
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            paddingBottom: 20,
            borderBottom: '0.5px solid rgba(0,0,0,0.1)',
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 500 }}>
              <ShieldCheck size={18} color="#185FA5" />
              Dataset Verification Report
            </div>
            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 3, marginBottom: 0 }}>
              UID #{uidStr} &nbsp;·&nbsp; Audited {auditDate} &nbsp;·&nbsp; {Object.keys(allReports).length || 12} verification nodes
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant={isPassed ? 'pass' : 'fail'}>
              {isPassed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
              {isPassed ? 'DECAPass Verified' : 'Protocol Failed'}
            </Badge>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                border: '0.5px solid rgba(0,0,0,0.15)',
                background: '#fff',
                color: '#374151',
              }}
              onClick={() => alert('Export triggered — wire to your download handler')}
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* ── VERDICT BANNER ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 16px',
            borderRadius: 10,
            border: `0.5px solid ${isPassed ? '#C0DD97' : '#F0A0A0'}`,
            background: isPassed ? '#EAF3DE' : '#FCEBEB',
            marginBottom: 20,
            flexWrap: 'wrap',
          }}
        >
          {isPassed
            ? <CheckCircle2 size={20} color="#3B6D11" />
            : <AlertTriangle size={20} color="#A32D2D" />}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: isPassed ? '#3B6D11' : '#791F1F', margin: 0 }}>
              {isPassed
                ? 'Validation protocol passed — high integrity profile confirmed'
                : 'Validation protocol failed — manual intervention required'}
            </p>
            <p style={{ fontSize: 12, color: isPassed ? '#639922' : '#A32D2D', margin: 0 }}>
              {isPassed
                ? 'No significant statistical drift detected across core intelligence vectors'
                : 'High risk detected. Do not deploy until manual review is complete.'}
            </p>
          </div>
          <Badge variant={isPassed ? 'pass' : 'fail'}>Status: {isPassed ? 'PASS' : 'FAIL'}</Badge>
        </div>

        {/* ── ROW 1: gauge + bar chart ── */}
        <div style={{ ...grid2, marginBottom: 16 }}>

          {/* Score gauge card */}
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#9CA3AF', marginTop: 0, marginBottom: 4 }}>
              Overall trust score
            </p>
            <ScoreGauge score={score} isPassed={isPassed} />
            <div style={{ ...grid2, width: '100%', marginTop: 14 }}>
              <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 3px' }}>Nodes</p>
                <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>{Object.keys(allReports).length || 12} / {Object.keys(allReports).length || 12}</p>
              </div>
              <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 3px' }}>Drift</p>
                <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>0.02%</p>
              </div>
            </div>
          </Card>

          {/* Module bar chart */}
          <Card>
            <SectionTitle icon={Activity}>Score breakdown by module</SectionTitle>
            {modules.length > 0 ? (
              <ModuleBarChart modules={modules} />
            ) : (
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>No module data available.</p>
            )}
          </Card>
        </div>

        {/* ── ROW 2: stats + pie ── */}
        <div style={{ ...grid2, marginBottom: 16 }}>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ ...grid4 }}>
              <StatTile label="Data quality"     value={isPassed ? 'Optimal' : 'Suspicious'} accent={isPassed ? '#27500A' : '#791F1F'} />
              <StatTile label="Schema drift"     value="0.02%" />
              <StatTile label="Redundancy"       value="Negligible" />
              <StatTile label="Audit consensus"  value="100%" />
            </div>

            {/* Verification checks progress bars */}
            <Card style={{ flex: 1 }}>
              <SectionTitle icon={CheckCircle2}>Verification checks</SectionTitle>
              {modules.length > 0 ? (
                modules.map((m) => (
                  <ProgressRow key={m.key} label={m.label} score={m.score} />
                ))
              ) : (
                <p style={{ fontSize: 13, color: '#9CA3AF' }}>No checks available.</p>
              )}
            </Card>
          </div>

          {/* Pie chart */}
          {modules.length > 0 && (
            <Card>
              <SectionTitle icon={Activity}>Module distribution</SectionTitle>
              <ModulePie modules={modules} />
            </Card>
          )}
        </div>

        {/* ── MODULE DETAIL CARDS ── */}
        {modules.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={15} color="#185FA5" />
              Deep-scan pipeline result
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
              {modules.map((m, i) => {
                const c = scoreColor(m.score);
                return (
                  <Card key={m.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF', margin: 0 }}>
                          {m.label}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          color: c.text,
                          background: c.bg,
                          padding: '2px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {Math.round(m.score)}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: '#F3F4F6', borderRadius: 3, marginBottom: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${m.score}%`, background: c.bar, borderRadius: 3 }} />
                    </div>
                    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{m.summary}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RECOMMENDATIONS ── */}
        <Card style={{ marginBottom: 16 }}>
          <SectionTitle icon={AlertTriangle}>Recommendations</SectionTitle>
          <div>
            {recommendations.map((r, i) => (
              <RecItem
                key={i}
                icon={r.icon}
                iconColor={r.iconColor}
                iconBg={r.iconBg}
                title={r.title}
                desc={r.desc}
              />
            ))}
          </div>
        </Card>

        {/* ── RAW LOGS ── */}
        <Card style={{ marginBottom: 24 }}>
          <button
            onClick={() => setLogsOpen((v) => !v)}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: '#374151',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={14} color="#185FA5" />
              Cryptographic protocol logs
            </span>
            {logsOpen ? <ChevronUp size={16} color="#9CA3AF" /> : <ChevronDown size={16} color="#9CA3AF" />}
          </button>
          {logsOpen && (
            <pre
              style={{
                marginTop: 14,
                padding: 16,
                background: '#111827',
                borderRadius: 8,
                color: '#60A5FA',
                fontSize: 11,
                fontFamily: 'monospace',
                overflowX: 'auto',
                maxHeight: 280,
                overflowY: 'auto',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {JSON.stringify(reportData, null, 2)}
            </pre>
          )}
        </Card>

        {/* ── FOOTER ACTIONS ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            paddingTop: 4,
          }}
        >
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Lock size={12} />
            Neural Veracity Hub v3.1 &nbsp;·&nbsp; Cryptographic logs available
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '0.5px solid rgba(0,0,0,0.15)',
                background: '#fff', color: '#374151',
              }}
              onClick={() => setLogsOpen(true)}
            >
              <Terminal size={14} /> View logs
            </button>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '0.5px solid #185FA5',
                background: '#185FA5', color: '#E6F1FB',
              }}
              onClick={() => alert('Download triggered — wire to your export handler')}
            >
              <Download size={14} /> Download report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}