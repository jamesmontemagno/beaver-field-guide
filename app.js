const stages = [
  {
    title: 'First, find the right flow.',
    description: 'A beaver looks for a small stream with a gentle gradient, a steady supply of water, and woody plants nearby. A dam can turn shallow running water into a deeper, safer place to live.',
    note: 'Why deeper water? It helps beavers reach food and enter their shelter underwater, away from many land predators.',
    label: 'THE STREAM / BEFORE THE BUILD',
    scene: 'A narrow stream flows between forested banks. No dam has been built yet.',
  },
  {
    title: 'A very local supply chain.',
    description: 'Using sharp incisors, beavers cut branches and small trees, then carry or float the wood to the building site. They also collect stones, mud, and vegetation. Their front paws do the handling.',
    note: 'Wood has two jobs: branches help build the dam, while bark, twigs, and leaves can provide food. Beavers are herbivores.',
    label: 'THE MATERIALS / GATHER & CARRY',
    scene: 'Freshly gathered branches are piled beside the stream. A beaver carries material toward the building site.',
  },
  {
    title: 'Big sticks. Clever structure.',
    description: 'Branches and logs are anchored across the current, then interlocked with more wood and other material. The growing framework starts to slow the stream without making a watertight wall.',
    note: 'There is no single blueprint. A dam takes shape around the streambed, available materials, and the force of the water.',
    label: 'THE FRAME / ONE BRANCH AT A TIME',
    scene: 'An interlocking frame of branches spans the narrow stream, beginning to obstruct the current.',
  },
  {
    title: 'Slow the flow. Raise the pond.',
    description: 'Beavers pack gaps with mud and vegetation. Water backs up on the upstream side, spreading into a pond. Some water still flows through or over the dam; this is a living, leaky structure.',
    note: 'Maintenance never really ends. Beavers add material and patch damage as water levels and stream conditions change.',
    label: 'THE POND / A CHANGING LANDSCAPE',
    scene: 'Mud seals the branch dam. A wider pond forms upstream, while small trickles continue downstream.',
  },
  {
    title: 'The neighborhood moves in.',
    description: 'With deeper water in place, beavers can use a lodge or bank den with an underwater entrance. Wetland plants establish, and the pond can provide habitat for insects, amphibians, fish, and birds.',
    note: 'A dam holds back water; a lodge is a home. These changes unfold over time, not in a single afternoon. Every stream is different.',
    label: 'THE WETLAND / BUILT FOR MORE THAN BEAVERS',
    scene: 'A completed dam holds a broad pond with a lodge, wetland plants, fish, birds, and a beaver family.',
  },
];

const panel = document.querySelector('#journey-panel');
const stepButtons = [...document.querySelectorAll('[data-step]')];
const previous = document.querySelector('#previous-step');
const next = document.querySelector('#next-step');
const play = document.querySelector('#play-journey');
const playLabel = document.querySelector('#play-label');
const playIcon = document.querySelector('#play-icon');
let current = 0;
let timer = null;

function stopPlayback() {
  clearInterval(timer);
  timer = null;
  playLabel.textContent = current === stages.length - 1 ? 'Replay the journey' : 'Play the journey';
  playIcon.textContent = '\u25b6';
}

function showStage(index) {
  current = index;
  const stage = stages[index];
  panel.dataset.stage = String(index);
  document.querySelector('#step-count').textContent = `STEP ${String(index + 1).padStart(2, '0')} / 05`;
  document.querySelector('#step-title').textContent = stage.title;
  document.querySelector('#step-description').textContent = stage.description;
  document.querySelector('#step-note').textContent = stage.note;
  document.querySelector('#scene-label').textContent = stage.label;
  document.querySelector('#landscape-desc').textContent = stage.scene;
  stepButtons.forEach((button, position) => {
    button.classList.toggle('is-active', position === index);
    button.setAttribute('aria-pressed', String(position === index));
  });
  previous.disabled = index === 0;
  next.disabled = index === stages.length - 1;
  if (index === stages.length - 1) stopPlayback();
  else if (timer === null) playLabel.textContent = 'Play the journey';
}

stepButtons.forEach((button) => {
  button.addEventListener('click', () => {
    stopPlayback();
    showStage(Number(button.dataset.step));
  });
});

previous.addEventListener('click', () => {
  stopPlayback();
  if (current > 0) showStage(current - 1);
});
next.addEventListener('click', () => {
  stopPlayback();
  if (current < stages.length - 1) showStage(current + 1);
});
play.addEventListener('click', () => {
  if (timer !== null) {
    stopPlayback();
    return;
  }
  if (current === stages.length - 1) showStage(0);
  playLabel.textContent = 'Pause the journey';
  playIcon.textContent = '\u2161';
  timer = setInterval(() => showStage(current + 1), 6500);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopPlayback();
});
document.querySelectorAll('.journey-controls, .playback').forEach((element) => { element.hidden = false; });
