# Screenshot assets — drop-in manifest

The site ships with styled placeholder frames; each frame lights up
automatically when its file lands here (no HTML changes needed).

Export **straight-on (untilted) crops** at the sizes below — the site
applies its own tilt/framing. sRGB, PNG (or WebP with the same
basename + updated `src`), target ≤ 400 KB each (run through
Squoosh/ImageOptim).

| Filename | Shows | Aspect | Export px (2x) | Used in |
|---|---|---|---|---|
| `hero-chat.png` | Full chat workspace: sidebar + brand channel + rail | 16:10 | 2880×1800 | Hero (desktop) |
| `hero-phone.png` | The same brand channel on mobile | 9:19.5 | 1170×2535 | Hero (phone) |
| `chat-workspace.png` | Full workspace: sidebar + channel + rail | 16:10 | 2880×1800 | Structured Chat (desktop) |
| `chat-phone.png` | A brand channel on mobile | 9:19.5 | 1170×2535 | Structured Chat (phone) |
| `analytics-brands-table.png` | Per-brand metrics table | 16:10 | 2880×1800 | Analytics · SLA (desktop) |
| `sla-phone.png` | SLA gauge on mobile | 9:19.5 | 1170×2535 | Analytics · SLA (phone) |
| `orders-table.png` | Orders table (backdrop) | 16:10 | 2880×1800 | Pax (desktop) |
| `pax-phone.png` | Pax assistant on mobile | 9:19.5 | 1170×2535 | Pax (phone) |
| `tasks-list.png` | Tasks with owners + SLAs | 16:10 | 2880×1800 | Tasks & Holds (desktop) |
| `tasks-phone.png` | Tasks list on mobile | 9:19.5 | 1170×2535 | Tasks & Holds (phone) |
| `feedback-survey.png` | Survey composer | 4:3 | 1600×1200 | Feedback (desktop) |
| `feedback-phone.png` | Taking a survey on mobile | 9:19.5 | 1170×2535 | Feedback (phone) |

**Phone shots:** export straight-on mobile screenshots at full device
resolution (e.g. 1170×2532 iPhone capture is fine — the frame crops from
the top). The site draws its own dark bezel; no device frame needed.
| `og-home.png` | Social-share composite | 1.91:1 | 1200×630 | og:image (swap the meta URL when it lands) |

**Cache note:** Vercel serves `/assets` with 1-year immutable caching.
To replace an image after it has shipped, use a new filename
(e.g. `tasks-list-v2.png`) and update the `src` in the HTML.
