module.exports = {
  'high': {
    'astc': {
      compression: 'ASTC_4x4',
      quality: 'astcthorough',
    },
    'pvr': {
      compression: 'PVRTC1_4',
      quality: 'pvrtcnormal',
    },
    'basis': {
      quality: '128',
      level: '3',
    },
  },
  'medium': {
    'astc': {
      compression: 'ASTC_6x6',
      quality: 'astcmedium',
    },
    'pvr': {
      compression: 'PVRTC1_4',
      quality: 'pvrtcnormal',
    },
    'basis': {
      quality: '128',
      level: '2',
    },
  },
  'low': {
    'astc': {
      compression: 'ASTC_8x5',
      quality: 'astcfast',
    },
    'pvr': {
      compression: 'PVRTC1_2',
      quality: 'pvrtcbest',
    },
    'basis': {
      quality: '128',
      level: '1',
    },
  },
};
