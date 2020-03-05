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
  },
};
