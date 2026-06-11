const path = require('path');

module.exports = {
  webpack: function override(config, env) {
    // Menambahkan alias untuk import file
    config.resolve.alias = {
      ...config.resolve.alias,
      'orbit-rocket': path.resolve(__dirname, 'src/OrbitRocketAdventure.jsx'),
    };
    
    return config;
  },
};