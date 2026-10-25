import { NEC } from '../results'

const ORIGINAL_GB = (NEC.originalBytes / 1e9).toFixed(2)
const NEC_GB = (NEC.packageBytes / 1e9).toFixed(2)
const COMPRESSION = (NEC.originalBytes / NEC.packageBytes).toFixed(3)

const AUDIENCES = [
  {
    title: 'AI product companies',
    fit: 'Ship models inside apps, appliances or customer-managed software.',
    value: 'A smaller package may mean less data to download, distribute and store.',
  },
  {
    title: 'Cloud and hosting providers',
    fit: 'Offer private or customer-managed language-model deployments.',
    value: 'A smaller artifact could reduce transfer and storage overhead when staging models; serving needs still depend on the runtime and hardware.',
  },
  {
    title: 'Businesses exploring private or edge AI',
    fit: 'Evaluate models near controlled data or remote users, including in finance, telecoms and industrial operations.',
    value: 'A smaller package makes storage-constrained installations worth evaluating.',
  },
]

export function CommercialOpportunity() {
  return (
    <section className="commercial-fit" id="commercial" aria-labelledby="commercial-title">
      <div className="wrap">
        <div className="commercial-overview">
          <div className="commercial-intro">
            <p className="kicker">Commercial opportunity</p>
            <h2 id="commercial-title">A smaller model package could open more deployment options.</h2>
            <p>
              NEC, the Nox Entanglement Compiler, is an early research result. Its potential fit is
              clearest for companies that distribute, host or run models where storage is limited.
            </p>
          </div>

          <figure className="commercial-proof">
            <p className="commercial-proof-label">Measured on Llama-2-7B</p>
            <p className="commercial-proof-ratio">{COMPRESSION}×</p>
            <figcaption className="commercial-proof-caption">smaller serialized package</figcaption>
            <dl className="commercial-proof-sizes">
              <div>
                <dt>Original</dt>
                <dd>{ORIGINAL_GB} GB</dd>
              </div>
              <div>
                <dt>With NEC</dt>
                <dd>{NEC_GB} GB</dd>
              </div>
            </dl>
          </figure>
        </div>

        <ul className="commercial-audiences">
          {AUDIENCES.map((audience) => (
            <li key={audience.title}>
              <h3>{audience.title}</h3>
              <p>{audience.fit}</p>
              <p className="commercial-value">{audience.value}</p>
            </li>
          ))}
        </ul>

        <div className="commercial-outreach">
          <p>
            Current results show 71.6–88.9% relative accuracy retention across evaluated tasks.
            The storage reduction is measured; inference memory, speed and operating costs need
            testing against each target workload.
          </p>
          <a
            className="btn btn-ink"
            href="mailto:hello@noxquantum.com?subject=NEC%20deployment%20evaluation"
          >
            Discuss an evaluation
          </a>
        </div>
      </div>
    </section>
  )
}
