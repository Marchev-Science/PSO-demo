# Swarm Lab

An interactive, dependency-free particle swarm optimisation explorer built with HTML, CSS and JavaScript.

## Run

Open `index.html` in a modern browser. No build, server, packages, or external requests are required.

## Explore

- White theme with a university-level lesson covering the algorithm, parameters, interpretation and guided experiments.
- Square, equal-axis surface rendering with a 600px maximum plot size to prevent distortion on wide screens.
- Six response surfaces: Sphere, Rastrigin, Ackley, Rosenbrock, warped irregular ripples, and discontinuous terraces.
- Contour map and projected 3D relief, particle trails, objective values on map hover, convergence chart and CSV export.
- Adjustable swarm size, inertia, personal/social attraction, velocity limit, gradient learning rate, simulation speed and random seed.
- Run, pause, single-step and reset. Runs stop at 3,000 iterations to bound memory.
- Seeded initial positions shared by PSO and a multi-start gradient-descent comparison.

## Interpretation

All objectives are minimised. PSO uses synchronous global-best guidance, independent random coefficients per dimension, a velocity cap expressed as a fraction of domain width, and damped reflection at boundaries. Gradient descent uses central finite differences and up to 18 backtracking attempts per step, with projected domain boundaries. Its comparison is enabled by default; toggling it restarts both methods. Turning it off removes its computation.

The algorithms do different work per iteration. Evaluation counts include finite-difference probes and backtracking trials; chart iterations are **not equal evaluation budgets**. PSO is stochastic and may converge prematurely. Repeat experiments with different seeds; this is an educational comparison rather than a benchmark proving universal superiority.

Known minima: Sphere, Rastrigin, Ackley, warped ripples: `(0, 0)` with value `0` (floating-point error applies). Rosenbrock: `(1, 1)` with value `0`. Terraces: `x ∈ [1.1, 1.6)`, `y ∈ [-0.7, -0.2)` with value `0`.

Surface colours use logarithmic normalisation for visibility; the 3D view uses the same transformed height. The convergence chart also uses a log1p transform, with zero retained. Hover and metrics show original objective values. Surface or seed changes reset the experiment. All random sampling uses a deterministic 32-bit generator.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys the four static application files on pushes to `main`. It requests automatic Pages enablement. If the repository or organisation disallows automatic setup, an administrator must choose **Settings → Pages → Source → GitHub Actions**, then rerun the workflow.

Expected URL after a successful deployment: https://marchev-science.github.io/PSO-demo/

## Validation

JavaScript syntax checks and numerical smoke checks covered all six surfaces, finite positions, domain bounds, non-increasing global-best values, and reproducible seeds. This environment did not provide the supported browser QA helper, so visual/browser verification remains outstanding.

MIT licence; see LICENSE.
