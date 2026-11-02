/**
 * About page (v0.2: purpose and founders only, founder decision 11-02).
 * DRAFT: the founders replace `whyWeStarted` with their own words before
 * publishing. The concept brief's "replace the cane" vision is not used.
 */
export const about = {
  eyebrow: 'About the project',
  statement:
    'We started L.I.G.H.T because the white cane is brilliant at one thing, finding the ground, and leaves the rest to you.',
  whyWeStarted: {
    title: 'Why we started',
    draft: true,
    paragraphs: [
      'A white cane only tells you about what it touches. It can’t reach a branch at head height, it gives no warning of a bike coming fast, and it can’t tell you whether the thing in front of you is a person, a pole or a step.',
      'Many people who lose their sight later in life never get the chance to learn the cane at all. We wanted to build something that adds what the cane can’t do, without asking anyone to give up the tool they already trust.',
    ],
  },
  stage: 'L.I.G.H.T is a concept. A software prototype exists; no hardware has been built yet.',
  name: 'L.I.G.H.T stands for LIDAR Integrated Guidance & Handheld Tracker.',
  founders: {
    title: 'Who we are',
    // AGENTS.md §6. [CONFIRM] photos, exact titles and year of study before publishing.
    people: [
      {
        name: 'Amitaansh Grover',
        role: 'Co-founder',
        study: 'Electrical Engineering, NUS',
        focus: 'Hardware, embedded systems, sensing and power; robotics software with the NUS Mars Rover Team.',
      },
      {
        name: 'Shrishti Bothra',
        role: 'Co-founder',
        study: 'Business Analytics, NUS',
        focus: 'Data and analytics, product, frontend design, pricing and go-to-market.',
      },
    ],
  },
}
