import SplitFlapText from './reactbits/SplitFlapText'

const columns = [
  { name: 'Quality', note: 'Capabilities we choose before compressing anything.' },
  { name: 'Memory', note: 'Weights and runtime memory, against the GPUs people have.' },
  { name: 'Speed', note: 'Real inference time on limited GPUs.' },
]

const rows = [
  { name: 'Pruning', note: 'Existing method' },
  { name: 'Quantization', note: 'Existing method' },
  { name: 'Distillation', note: 'Existing method' },
  { name: 'Nox', note: 'Our methods', ours: true },
]

/** An empty scorecard. Nothing is measured yet, and the section says so. */
export function Scoreboard() {
  return (
    <section className="section section-tint" id="scoreboard" aria-labelledby="compare-title">
      <div className="wrap rail-grid">
        <div className="rail-head" data-reveal>
          <h2 className="section-title" id="compare-title">
            How we compare methods
          </h2>
          <p className="rail-sub">
            We’ll run every method on the same model and the same hardware, and judge them all the
            same way. We have no results yet, so nothing here is filled in.
          </p>
        </div>

        <div data-reveal>
          <table className="compare">
            <caption className="sr-only">
              Planned comparison of methods on quality, memory and speed. No results yet.
            </caption>
            <thead>
              <tr>
                <th scope="col">Method</th>
                {columns.map((c) => (
                  <th key={c.name} scope="col">
                    {c.name}
                    <small>{c.note}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className={r.ours ? 'is-ours' : undefined}>
                  <th scope="row">
                    <span className="compare-name">{r.name}</span>
                    <small>{r.note}</small>
                    {r.ours && (
                      <span className="compare-flap" aria-hidden="true">
                        <SplitFlapText
                          words={['PENDING']}
                          padTo={7}
                          fontSize={13}
                          gap={2}
                          tileRadius={3}
                          tileColor="#0c0e0d"
                          textColor="#ffffff"
                        />
                      </span>
                    )}
                  </th>
                  {columns.map((c) => (
                    <td key={c.name} data-label={c.name}>
                      <span className="track" aria-hidden="true" />
                      <span className="sr-only">Not measured yet</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
