module.exports = {
  apps: [{
    name: 'tapestry-vertical-gardens',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/tapestry-vertical-gardens',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
      // REDIS_PASSWORD and other secrets are loaded from .env.production (see env_file below)
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    env_file: '.env.production'
  }]
};
