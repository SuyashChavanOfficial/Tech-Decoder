export const tiers = [
  {
    title: 'Basic Project',
    price: '10,000',
    tag: 'Basic Project',
    desc: 'For students who need a complete project with explanation and source files.',
    features: [
      'Complete project development',
      'Project explanation',
      'Source files',
      '1 revision round'
    ],
    btnText: 'Get Started',
    color: 'text-secondary',
    borderClass: 'border-white/10'
  },
  {
    title: 'Priority Project',
    price: '12,000',
    tag: 'Priority Project',
    desc: 'For students who want their project handled on priority with a defined delivery window.',
    features: [
      'Everything in Basic',
      'Priority development',
      'Priority communication',
      'Up to 2 revision rounds',
      'Delivery within 3 months'
    ],
    btnText: 'Choose Priority',
    color: 'text-primary',
    borderClass: 'border-primary/30'
  },
  {
    title: 'Complete Project Package',
    price: '14,999',
    tag: 'Complete Project',
    desc: 'For students who want the project plus the documentation needed for submission.',
    features: [
      'Everything in Priority',
      'Research paper',
      'Black book',
      'Digital documentation',
      'Up to 3 revision rounds',
      'Delivery within 3 months*'
    ],
    footnote: '* Documentation may take additional time',
    btnText: 'Choose Complete',
    color: 'text-tertiary',
    borderClass: 'border-white/10',
    popular: true
  }
];
